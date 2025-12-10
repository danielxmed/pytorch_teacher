"""Validation endpoints."""
from fastapi import APIRouter

from ..models import ValidationRequest, ValidationResponse
from ..services.validation import get_validation_service

router = APIRouter(prefix="/api", tags=["validation"])


@router.post("/validate", response_model=ValidationResponse)
async def validate_exercise(request: ValidationRequest):
    """
    Validate user code against exercise tests.

    Executes the user's code in a sandboxed environment and runs
    the predefined tests for the specified exercise.
    """
    service = get_validation_service()
    return service.validate(request)
