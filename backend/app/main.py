"""PyTorch Academy Backend - FastAPI Application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .routers import curriculum_router, validation_router, docs_router

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="Backend API for PyTorch Academy - Interactive PyTorch Learning Platform",
    version="1.0.0",
    docs_url="/api/docs" if settings.debug else None,
    redoc_url="/api/redoc" if settings.debug else None,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(curriculum_router)
app.include_router(validation_router)
app.include_router(docs_router)


@app.get("/")
async def root():
    """Root endpoint with API info."""
    return {
        "name": settings.app_name,
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "curriculum": "/api/curriculum",
            "modules": "/api/modules/{module_id}",
            "validate": "/api/validate",
            "docs": "/api/docs/pytorch/{symbol}",
        },
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
