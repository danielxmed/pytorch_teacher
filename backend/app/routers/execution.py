"""Code execution endpoints."""
from fastapi import APIRouter

from ..models import CodeExecutionRequest, CodeExecutionResponse
from ..services.execution import get_execution_service

router = APIRouter(prefix="/api", tags=["execution"])


@router.post("/execute", response_model=CodeExecutionResponse)
async def execute_code(request: CodeExecutionRequest) -> CodeExecutionResponse:
    """
    Execute Python code server-side with PyTorch support.

    Runs the provided code in a subprocess with access to torch,
    numpy, and other common libraries.
    """
    service = get_execution_service()
    return service.execute(request)
