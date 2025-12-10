#!/usr/bin/env python3
"""
Script para atualizar links de documentação PyTorch nos arquivos MDX.

Uso:
    python scripts/update-docs.py --version 2.2
"""

import argparse
import re
from pathlib import Path


def update_mdx_file(file_path: Path, old_version: str, new_version: str) -> bool:
    """Atualiza versão do PyTorch em um arquivo MDX."""
    content = file_path.read_text(encoding="utf-8")
    original = content

    # Atualizar frontmatter pytorchVersion
    content = re.sub(
        r'pytorchVersion:\s*"[\d.]+"',
        f'pytorchVersion: "{new_version}"',
        content
    )

    # Atualizar links de documentação
    content = re.sub(
        r"pytorch\.org/docs/[\d.]+/",
        f"pytorch.org/docs/{new_version}/",
        content
    )

    if content != original:
        file_path.write_text(content, encoding="utf-8")
        return True
    return False


def main():
    parser = argparse.ArgumentParser(
        description="Atualiza versão do PyTorch nos arquivos de conteúdo"
    )
    parser.add_argument(
        "--version",
        required=True,
        help="Nova versão do PyTorch (ex: 2.2)"
    )
    parser.add_argument(
        "--content-dir",
        default="content",
        help="Diretório de conteúdo"
    )
    args = parser.parse_args()

    content_dir = Path(args.content_dir)
    if not content_dir.exists():
        print(f"Erro: Diretório {content_dir} não encontrado")
        return 1

    updated_files = []
    for mdx_file in content_dir.glob("**/lesson.mdx"):
        if update_mdx_file(mdx_file, "", args.version):
            updated_files.append(mdx_file)
            print(f"✓ Atualizado: {mdx_file}")

    print(f"\nTotal: {len(updated_files)} arquivos atualizados")
    return 0


if __name__ == "__main__":
    exit(main())
