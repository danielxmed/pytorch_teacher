"""Application configuration."""
from functools import lru_cache
from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""

    app_name: str = "PyTorch Academy API"
    debug: bool = False

    # Content directory (relative to project root)
    content_dir: Path = Path(__file__).parent.parent.parent / "content"

    # Docker settings for code execution
    docker_image: str = "python:3.11-slim"
    code_execution_timeout: int = 10  # seconds

    # Documentation cache settings
    docs_cache_ttl: int = 86400  # 24 hours in seconds
    pytorch_docs_base_url: str = "https://pytorch.org/docs/stable"

    # CORS settings
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
