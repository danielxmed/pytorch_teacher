"""Curriculum and module endpoints."""
from fastapi import APIRouter, HTTPException

from ..models import Curriculum, Module
from ..services.content import get_content_service

router = APIRouter(prefix="/api", tags=["curriculum"])


@router.get("/curriculum", response_model=Curriculum)
async def get_curriculum():
    """
    Get the complete curriculum structure.

    Returns a list of sections, each containing module metadata.
    """
    service = get_content_service()
    return service.get_curriculum()


@router.get("/modules/{module_id}", response_model=Module)
async def get_module(module_id: str):
    """
    Get a specific module by ID.

    Returns the full module content including MDX and exercises.
    """
    service = get_content_service()
    module = service.get_module(module_id)

    if not module:
        raise HTTPException(
            status_code=404, detail=f"Module '{module_id}' not found"
        )

    return module


@router.get("/modules", response_model=list[str])
async def list_modules():
    """
    Get a list of all module IDs.
    """
    service = get_content_service()
    return service.get_module_ids()
