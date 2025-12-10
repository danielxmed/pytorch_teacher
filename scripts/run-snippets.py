#!/usr/bin/env python3
"""
Script para executar todos os code snippets do curso e verificar se funcionam.

Usado pelo CI para detectar código desatualizado.
"""

import re
import subprocess
import sys
import tempfile
from pathlib import Path


def extract_code_cells(mdx_content: str) -> list[tuple[str, str]]:
    """Extrai código de CodeCells do MDX."""
    pattern = r'<CodeCell\s+id="([^"]+)">([\s\S]*?)</CodeCell>'
    matches = re.findall(pattern, mdx_content)
    return [(cell_id, code.strip()) for cell_id, code in matches]


def run_code(code: str, timeout: int = 30) -> tuple[bool, str]:
    """Executa código Python e retorna (sucesso, output/erro)."""
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
        # Adicionar imports comuns
        full_code = """
import warnings
warnings.filterwarnings('ignore')
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader, TensorDataset
import numpy as np

""" + code
        f.write(full_code)
        script_path = f.name

    try:
        result = subprocess.run(
            ["python", script_path],
            capture_output=True,
            text=True,
            timeout=timeout,
        )
        Path(script_path).unlink()

        if result.returncode != 0:
            return False, result.stderr
        return True, result.stdout
    except subprocess.TimeoutExpired:
        Path(script_path).unlink()
        return False, f"Timeout após {timeout}s"
    except Exception as e:
        Path(script_path).unlink()
        return False, str(e)


def main():
    content_dir = Path("content")
    if not content_dir.exists():
        print("Erro: Diretório 'content' não encontrado")
        return 1

    modules = sorted([d for d in content_dir.iterdir() if d.is_dir()])
    total_cells = 0
    failed_cells = []

    for module_dir in modules:
        lesson_file = module_dir / "lesson.mdx"
        if not lesson_file.exists():
            continue

        content = lesson_file.read_text(encoding="utf-8")
        cells = extract_code_cells(content)

        for cell_id, code in cells:
            total_cells += 1
            print(f"Executando {module_dir.name}/{cell_id}...", end=" ")

            success, output = run_code(code)
            if success:
                print("✓")
            else:
                print("✗")
                failed_cells.append((f"{module_dir.name}/{cell_id}", output))

    print(f"\n{'=' * 50}")
    print(f"Total: {total_cells} code cells")
    print(f"Sucesso: {total_cells - len(failed_cells)}")
    print(f"Falhas: {len(failed_cells)}")

    if failed_cells:
        print("\nFALHAS:")
        for cell_id, error in failed_cells:
            print(f"\n--- {cell_id} ---")
            print(error[:500])

    return 1 if failed_cells else 0


if __name__ == "__main__":
    sys.exit(main())
