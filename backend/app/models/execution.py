"""Models for code execution."""
from pydantic import BaseModel


class CodeExecutionRequest(BaseModel):
    """Request to execute code server-side."""

    code: str
    timeout: int = 10  # seconds


class CodeExecutionResponse(BaseModel):
    """Response from code execution."""

    success: bool
    stdout: str = ""
    stderr: str = ""
    result: str | None = None  # Result of last expression
    execution_time: float = 0.0
    error: str | None = None
