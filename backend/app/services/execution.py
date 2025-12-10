"""Code execution service for running Python code with PyTorch."""
import subprocess
import tempfile
import time
import base64
from pathlib import Path

from ..models import CodeExecutionRequest, CodeExecutionResponse


class ExecutionService:
    """Service for executing Python code server-side."""

    def __init__(self, max_timeout: int = 30):
        self.max_timeout = max_timeout

    def execute(self, request: CodeExecutionRequest) -> CodeExecutionResponse:
        """Execute Python code and return results."""
        timeout = min(request.timeout, self.max_timeout)
        start_time = time.time()

        # Encode user code as base64 to avoid escaping issues
        code_b64 = base64.b64encode(request.code.encode()).decode()

        wrapper_code = f'''
import sys
import io
import base64
from contextlib import redirect_stdout, redirect_stderr

# Pre-import common libraries
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np

_stdout_buffer = io.StringIO()
_stderr_buffer = io.StringIO()

# Decode user code
_user_code = base64.b64decode("{code_b64}").decode()

try:
    with redirect_stdout(_stdout_buffer), redirect_stderr(_stderr_buffer):
        exec(_user_code)
except Exception as e:
    import traceback
    _stderr_buffer.write(traceback.format_exc())

_stdout = _stdout_buffer.getvalue()
_stderr = _stderr_buffer.getvalue()

print("__STDOUT_START__", end="")
print(_stdout, end="")
print("__STDOUT_END__", end="")
print("__STDERR_START__", end="")
print(_stderr, end="")
print("__STDERR_END__", end="")
'''

        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".py", delete=False, encoding="utf-8"
        ) as f:
            f.write(wrapper_code)
            script_path = f.name

        try:
            result = subprocess.run(
                ["python", script_path],
                capture_output=True,
                text=True,
                timeout=timeout,
                cwd=tempfile.gettempdir(),
            )

            execution_time = time.time() - start_time
            output = result.stdout

            # Parse stdout and stderr from output
            stdout = ""
            stderr = ""

            if "__STDOUT_START__" in output and "__STDOUT_END__" in output:
                start = output.index("__STDOUT_START__") + len("__STDOUT_START__")
                end = output.index("__STDOUT_END__")
                stdout = output[start:end]

            if "__STDERR_START__" in output and "__STDERR_END__" in output:
                start = output.index("__STDERR_START__") + len("__STDERR_START__")
                end = output.index("__STDERR_END__")
                stderr = output[start:end]

            # Add any subprocess stderr
            if result.stderr:
                stderr = result.stderr + stderr

            # Check for errors
            if result.returncode != 0 or stderr.strip():
                return CodeExecutionResponse(
                    success=result.returncode == 0 and not stderr.strip(),
                    stdout=stdout,
                    stderr=stderr,
                    execution_time=execution_time,
                    error=stderr if stderr.strip() else None,
                )

            return CodeExecutionResponse(
                success=True,
                stdout=stdout,
                stderr=stderr,
                execution_time=execution_time,
            )

        except subprocess.TimeoutExpired:
            return CodeExecutionResponse(
                success=False,
                error=f"Code execution timed out after {timeout} seconds",
                execution_time=timeout,
            )
        except Exception as e:
            return CodeExecutionResponse(
                success=False,
                error=f"Execution error: {str(e)}",
                execution_time=time.time() - start_time,
            )
        finally:
            Path(script_path).unlink(missing_ok=True)


_execution_service: ExecutionService | None = None


def get_execution_service() -> ExecutionService:
    """Get execution service singleton."""
    global _execution_service
    if _execution_service is None:
        _execution_service = ExecutionService()
    return _execution_service
