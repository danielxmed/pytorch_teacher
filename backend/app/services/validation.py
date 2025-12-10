"""Validation service for exercises."""
import subprocess
import tempfile
import time
from pathlib import Path

from ..models import (
    ValidationRequest,
    ValidationResponse,
    ValidationResult,
    ValidationType,
)
from .content import get_content_service


class ValidationService:
    """Service for validating exercise solutions."""

    def __init__(self, timeout: int = 10):
        self.timeout = timeout
        self.content_service = get_content_service()

    def validate(self, request: ValidationRequest) -> ValidationResponse:
        """Validate user code against exercise tests."""
        # Get exercise definition
        module = self.content_service.get_module(request.module_id)
        if not module:
            return ValidationResponse(
                result=ValidationResult.ERROR,
                error_message=f"Module '{request.module_id}' not found",
            )

        exercise = module.exercises.get(request.exercise_id)
        if not exercise:
            return ValidationResponse(
                result=ValidationResult.ERROR,
                error_message=f"Exercise '{request.exercise_id}' not found in module",
            )

        validation = exercise.get("validation", {})
        validation_type = validation.get("type", "assert")
        tests = validation.get("tests", [])

        if validation_type == "assert":
            return self._validate_with_asserts(request.code, tests)
        elif validation_type == "output":
            expected = validation.get("expected_output", "")
            return self._validate_output(request.code, expected)
        else:
            return ValidationResponse(
                result=ValidationResult.ERROR,
                error_message=f"Unknown validation type: {validation_type}",
            )

    def _validate_with_asserts(
        self, code: str, tests: list[str]
    ) -> ValidationResponse:
        """Run code and then run assertion tests."""
        # Build test script
        test_code = f"""
import torch
import torch.nn as nn
import torch.nn.functional as F

# User code
{code}

# Tests
_passed = 0
_failed = []
_total = {len(tests)}

"""
        for i, test in enumerate(tests):
            test_code += f"""
try:
    {test}
    _passed += 1
except AssertionError as e:
    _failed.append(("Test {i+1}", str(e) if str(e) else "{test}"))
except Exception as e:
    _failed.append(("Test {i+1}", f"Error: {{type(e).__name__}}: {{e}}"))
"""

        test_code += """
print(f"PASSED:{_passed}/{_total}")
if _failed:
    print("FAILURES:")
    for name, msg in _failed:
        print(f"  {name}: {msg}")
"""

        return self._execute_code(test_code, len(tests))

    def _validate_output(self, code: str, expected: str) -> ValidationResponse:
        """Validate that code output matches expected output."""
        result = self._execute_code(code, 1, check_output=True)

        if result.result == ValidationResult.ERROR:
            return result

        # Compare output (strip whitespace)
        actual = result.stdout.strip()
        expected = expected.strip()

        if actual == expected:
            return ValidationResponse(
                result=ValidationResult.PASSED,
                passed_tests=1,
                total_tests=1,
                feedback="Output matches expected result!",
                stdout=result.stdout,
            )
        else:
            return ValidationResponse(
                result=ValidationResult.FAILED,
                passed_tests=0,
                total_tests=1,
                feedback=f"Output doesn't match.\nExpected:\n{expected}\n\nGot:\n{actual}",
                stdout=result.stdout,
            )

    def _execute_code(
        self, code: str, total_tests: int, check_output: bool = False
    ) -> ValidationResponse:
        """Execute code in a subprocess with timeout."""
        start_time = time.time()

        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".py", delete=False
        ) as f:
            f.write(code)
            script_path = f.name

        try:
            result = subprocess.run(
                ["python", script_path],
                capture_output=True,
                text=True,
                timeout=self.timeout,
                cwd=tempfile.gettempdir(),
            )

            execution_time = time.time() - start_time
            stdout = result.stdout
            stderr = result.stderr

            if result.returncode != 0:
                return ValidationResponse(
                    result=ValidationResult.ERROR,
                    total_tests=total_tests,
                    error_message=stderr or "Execution failed",
                    stdout=stdout,
                    stderr=stderr,
                )

            if check_output:
                return ValidationResponse(
                    result=ValidationResult.PASSED,
                    passed_tests=1,
                    total_tests=1,
                    stdout=stdout,
                    stderr=stderr,
                )

            # Parse test results from output
            passed = 0
            feedback = ""

            for line in stdout.split("\n"):
                if line.startswith("PASSED:"):
                    parts = line.replace("PASSED:", "").split("/")
                    if len(parts) == 2:
                        passed = int(parts[0])
                elif line.startswith("FAILURES:") or line.startswith("  "):
                    feedback += line + "\n"

            if passed == total_tests:
                return ValidationResponse(
                    result=ValidationResult.PASSED,
                    passed_tests=passed,
                    total_tests=total_tests,
                    feedback="All tests passed!",
                    stdout=stdout,
                    stderr=stderr,
                )
            else:
                return ValidationResponse(
                    result=ValidationResult.FAILED,
                    passed_tests=passed,
                    total_tests=total_tests,
                    feedback=feedback.strip() or "Some tests failed",
                    stdout=stdout,
                    stderr=stderr,
                )

        except subprocess.TimeoutExpired:
            return ValidationResponse(
                result=ValidationResult.TIMEOUT,
                total_tests=total_tests,
                error_message=f"Code execution timed out after {self.timeout} seconds",
            )
        except Exception as e:
            return ValidationResponse(
                result=ValidationResult.ERROR,
                total_tests=total_tests,
                error_message=f"Execution error: {str(e)}",
            )
        finally:
            # Clean up temp file
            Path(script_path).unlink(missing_ok=True)


def get_validation_service() -> ValidationService:
    """Get validation service instance."""
    return ValidationService()
