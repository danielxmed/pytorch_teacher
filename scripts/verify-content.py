#!/usr/bin/env python3
"""
Script para verificar a integridade do conteúdo do curso.

Verifica:
- Todos os módulos têm lesson.mdx e exercises.json
- Frontmatter está correto
- Exercícios referenciados existem
- Links de pré-requisitos são válidos
"""

import json
import re
import sys
from pathlib import Path

import frontmatter


def verify_module(module_dir: Path, all_modules: set) -> list[str]:
    """Verifica um módulo e retorna lista de erros."""
    errors = []
    module_id = module_dir.name

    # Verificar arquivos necessários
    lesson_file = module_dir / "lesson.mdx"
    exercises_file = module_dir / "exercises.json"

    if not lesson_file.exists():
        errors.append(f"[{module_id}] Faltando lesson.mdx")
        return errors

    # Verificar frontmatter
    try:
        post = frontmatter.load(lesson_file)
        required_fields = ["title", "order", "prerequisites", "estimatedMinutes", "pytorchVersion"]
        for field in required_fields:
            if field not in post.metadata:
                errors.append(f"[{module_id}] Faltando campo no frontmatter: {field}")
    except Exception as e:
        errors.append(f"[{module_id}] Erro ao parsear frontmatter: {e}")
        return errors

    # Verificar pré-requisitos
    for prereq in post.get("prerequisites", []):
        if prereq not in all_modules:
            errors.append(f"[{module_id}] Pré-requisito inválido: {prereq}")

    # Verificar exercícios
    content = lesson_file.read_text(encoding="utf-8")
    exercise_refs = re.findall(r'<Exercise\s+id="([^"]+)"', content)

    if exercises_file.exists():
        try:
            exercises = json.loads(exercises_file.read_text(encoding="utf-8"))
            for ref in exercise_refs:
                if ref not in exercises:
                    errors.append(f"[{module_id}] Exercício referenciado mas não definido: {ref}")
            for ex_id in exercises:
                if ex_id not in exercise_refs:
                    errors.append(f"[{module_id}] Exercício definido mas não usado: {ex_id}")
        except json.JSONDecodeError as e:
            errors.append(f"[{module_id}] Erro no exercises.json: {e}")
    elif exercise_refs:
        errors.append(f"[{module_id}] Exercícios referenciados mas exercises.json não existe")

    return errors


def main():
    content_dir = Path("content")
    if not content_dir.exists():
        print("Erro: Diretório 'content' não encontrado")
        return 1

    # Listar todos os módulos
    modules = [d for d in sorted(content_dir.iterdir()) if d.is_dir() and not d.name.startswith(".")]
    all_module_ids = {m.name for m in modules}

    print(f"Verificando {len(modules)} módulos...\n")

    all_errors = []
    for module_dir in modules:
        errors = verify_module(module_dir, all_module_ids)
        all_errors.extend(errors)

    if all_errors:
        print("ERROS ENCONTRADOS:")
        for error in all_errors:
            print(f"  ✗ {error}")
        print(f"\nTotal: {len(all_errors)} erros")
        return 1
    else:
        print("✓ Todos os módulos verificados com sucesso!")
        return 0


if __name__ == "__main__":
    sys.exit(main())
