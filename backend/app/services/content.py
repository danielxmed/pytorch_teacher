"""Content service for loading curriculum and modules."""
import json
from pathlib import Path
from functools import lru_cache

import frontmatter

from ..config import get_settings
from ..models import Module, ModuleMetadata, Curriculum, Section


# Section definitions
SECTIONS = {
    "fundamentals": {"title": "Fundamentos", "order": 1, "modules": range(1, 5)},
    "autograd": {"title": "Autograd", "order": 2, "modules": range(5, 8)},
    "neural-networks": {"title": "Redes Neurais", "order": 3, "modules": range(8, 13)},
    "data-training": {
        "title": "Dados e Treinamento",
        "order": 4,
        "modules": range(13, 16),
    },
    "advanced": {
        "title": "Arquiteturas Avançadas",
        "order": 5,
        "modules": range(16, 21),
    },
}


class ContentService:
    """Service for loading and managing curriculum content."""

    def __init__(self):
        self.content_dir = get_settings().content_dir

    def _get_section_for_module(self, module_order: int) -> tuple[str, str, int]:
        """Get section id, title, and order for a module based on its order."""
        for section_id, info in SECTIONS.items():
            if module_order in info["modules"]:
                return section_id, info["title"], info["order"]
        return "other", "Outros", 99

    def _parse_module_dir(self, module_dir: Path) -> ModuleMetadata | None:
        """Parse a module directory and return metadata."""
        lesson_file = module_dir / "lesson.mdx"
        if not lesson_file.exists():
            return None

        try:
            post = frontmatter.load(lesson_file)
            module_id = module_dir.name

            # Get order from directory name (e.g., "01-tensors" -> 1)
            try:
                order = int(module_id.split("-")[0])
            except (ValueError, IndexError):
                order = 99

            section_id, section_title, section_order = self._get_section_for_module(
                order
            )

            return ModuleMetadata(
                id=module_id,
                title=post.get("title", module_id),
                order=order,
                prerequisites=post.get("prerequisites", []),
                estimated_minutes=post.get("estimatedMinutes", 30),
                pytorch_version=post.get("pytorchVersion", "2.2"),
                section=section_id,
                section_order=section_order,
            )
        except Exception as e:
            print(f"Error parsing module {module_dir}: {e}")
            return None

    def get_curriculum(self) -> Curriculum:
        """Get the full curriculum structure."""
        if not self.content_dir.exists():
            return Curriculum(sections=[], total_modules=0, total_estimated_minutes=0)

        modules: list[ModuleMetadata] = []

        # Scan content directory for modules
        for item in sorted(self.content_dir.iterdir()):
            if item.is_dir() and not item.name.startswith("."):
                metadata = self._parse_module_dir(item)
                if metadata:
                    modules.append(metadata)

        # Sort by order
        modules.sort(key=lambda m: m.order)

        # Group into sections
        sections_dict: dict[str, list[ModuleMetadata]] = {}
        for module in modules:
            if module.section not in sections_dict:
                sections_dict[module.section] = []
            sections_dict[module.section].append(module)

        # Build section objects
        sections = []
        for section_id, section_info in SECTIONS.items():
            if section_id in sections_dict:
                sections.append(
                    Section(
                        id=section_id,
                        title=section_info["title"],
                        order=section_info["order"],
                        modules=sections_dict[section_id],
                    )
                )

        sections.sort(key=lambda s: s.order)

        total_minutes = sum(m.estimated_minutes for m in modules)

        return Curriculum(
            sections=sections,
            total_modules=len(modules),
            total_estimated_minutes=total_minutes,
        )

    def get_module(self, module_id: str) -> Module | None:
        """Get a specific module by ID."""
        module_dir = self.content_dir / module_id
        if not module_dir.exists():
            return None

        lesson_file = module_dir / "lesson.mdx"
        exercises_file = module_dir / "exercises.json"

        if not lesson_file.exists():
            return None

        # Parse metadata
        metadata = self._parse_module_dir(module_dir)
        if not metadata:
            return None

        # Load content
        with open(lesson_file, "r", encoding="utf-8") as f:
            post = frontmatter.load(f)
            content = post.content

        # Load exercises if they exist
        exercises = {}
        if exercises_file.exists():
            with open(exercises_file, "r", encoding="utf-8") as f:
                exercises = json.load(f)

        return Module(metadata=metadata, content=content, exercises=exercises)

    def get_module_ids(self) -> list[str]:
        """Get list of all module IDs."""
        if not self.content_dir.exists():
            return []

        ids = []
        for item in sorted(self.content_dir.iterdir()):
            if item.is_dir() and not item.name.startswith("."):
                if (item / "lesson.mdx").exists():
                    ids.append(item.name)
        return ids


@lru_cache
def get_content_service() -> ContentService:
    """Get cached content service instance."""
    return ContentService()
