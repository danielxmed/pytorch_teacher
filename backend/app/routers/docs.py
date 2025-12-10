"""PyTorch documentation proxy endpoints."""
from fastapi import APIRouter, HTTPException

from ..services.docs import get_docs_service

router = APIRouter(prefix="/api/docs", tags=["documentation"])


@router.get("/pytorch/{symbol:path}")
async def get_pytorch_docs(symbol: str):
    """
    Get documentation for a PyTorch symbol.

    Proxies to the official PyTorch documentation and extracts
    the signature and first paragraph of description.
    Results are cached for 24 hours.

    Examples:
    - GET /api/docs/pytorch/torch.tensor
    - GET /api/docs/pytorch/torch.nn.Linear
    - GET /api/docs/pytorch/torch.nn.functional.relu
    """
    service = get_docs_service()
    result = await service.get_doc_info(symbol)

    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"Documentation for '{symbol}' not found",
        )

    return result


@router.get("/pytorch-cached")
async def get_cached_symbols():
    """
    Get list of currently cached PyTorch documentation symbols.
    """
    service = get_docs_service()
    return {"cached_symbols": service.get_cached_symbols()}
