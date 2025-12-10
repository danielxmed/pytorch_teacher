"""API routers."""
from .curriculum import router as curriculum_router
from .validation import router as validation_router
from .docs import router as docs_router
from .execution import router as execution_router

__all__ = ["curriculum_router", "validation_router", "docs_router", "execution_router"]
