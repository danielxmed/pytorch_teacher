"""Models for curriculum and modules."""
from pydantic import BaseModel


class ModuleMetadata(BaseModel):
    """Module metadata from MDX frontmatter."""

    id: str
    title: str
    order: int
    prerequisites: list[str] = []
    estimated_minutes: int = 30
    pytorch_version: str = "2.2"
    section: str = ""
    section_order: int = 1


class Module(BaseModel):
    """Full module with content and exercises."""

    metadata: ModuleMetadata
    content: str  # MDX content
    exercises: dict  # Exercise definitions from exercises.json


class Section(BaseModel):
    """A section grouping multiple modules."""

    id: str
    title: str
    order: int
    modules: list[ModuleMetadata]


class Curriculum(BaseModel):
    """Complete curriculum structure."""

    sections: list[Section]
    total_modules: int
    total_estimated_minutes: int
