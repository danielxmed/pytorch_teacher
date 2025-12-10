"""Models for exercises and validation."""
from enum import Enum
from pydantic import BaseModel


class ValidationType(str, Enum):
    """Type of validation for an exercise."""

    ASSERT = "assert"
    OUTPUT = "output"
    CUSTOM = "custom"


class ExerciseValidation(BaseModel):
    """Validation configuration for an exercise."""

    type: ValidationType
    tests: list[str] = []
    expected_output: str | None = None


class Exercise(BaseModel):
    """Exercise definition."""

    id: str
    starter_code: str
    hints: list[str] = []
    validation: ExerciseValidation
    solution: str
    difficulty: str = "medium"


class ValidationRequest(BaseModel):
    """Request to validate user code."""

    exercise_id: str
    module_id: str
    code: str


class ValidationResult(str, Enum):
    """Result of validation."""

    PASSED = "passed"
    FAILED = "failed"
    ERROR = "error"
    TIMEOUT = "timeout"


class ValidationResponse(BaseModel):
    """Response from validation endpoint."""

    result: ValidationResult
    passed_tests: int = 0
    total_tests: int = 0
    feedback: str = ""
    error_message: str | None = None
    stdout: str = ""
    stderr: str = ""
