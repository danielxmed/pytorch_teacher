"""Documentation proxy service."""
import re
from datetime import datetime, timedelta

import httpx
from cachetools import TTLCache

from ..config import get_settings


class DocsService:
    """Service for fetching and caching PyTorch documentation."""

    def __init__(self):
        settings = get_settings()
        self.base_url = settings.pytorch_docs_base_url
        self.cache_ttl = settings.docs_cache_ttl
        # Cache for documentation snippets (max 1000 entries, 24h TTL)
        self._cache: TTLCache = TTLCache(maxsize=1000, ttl=self.cache_ttl)

    def _normalize_symbol(self, symbol: str) -> str:
        """Normalize a PyTorch symbol to URL path."""
        # Handle common patterns
        # torch.nn.Linear -> generated/torch.nn.Linear.html
        # torch.tensor -> generated/torch.tensor.html
        return f"generated/{symbol}.html"

    def _extract_signature(self, html: str, symbol: str) -> str | None:
        """Extract function/class signature from HTML."""
        # Look for the signature in dt.sig elements
        patterns = [
            rf'<dt[^>]*class="[^"]*sig[^"]*"[^>]*>.*?<span class="sig-name[^"]*">([^<]*{symbol.split(".")[-1]}[^<]*)</span>.*?</dt>',
            rf'class="sig-prename[^"]*">[^<]*</span>\s*<span class="sig-name[^"]*">({symbol.split(".")[-1]})</span>\s*<span class="sig-paren">\(</span>([^)]*)<span class="sig-paren">\)</span>',
        ]

        for pattern in patterns:
            match = re.search(pattern, html, re.DOTALL | re.IGNORECASE)
            if match:
                # Clean up HTML tags
                sig = re.sub(r"<[^>]+>", "", match.group(0))
                sig = re.sub(r"\s+", " ", sig).strip()
                return sig

        return None

    def _extract_description(self, html: str) -> str | None:
        """Extract first paragraph of description from HTML."""
        # Look for description in dd elements after the signature
        pattern = r'<dd[^>]*>.*?<p>([^<]+(?:<[^>]+>[^<]*)*)</p>'
        match = re.search(pattern, html, re.DOTALL)

        if match:
            desc = match.group(1)
            # Clean up HTML tags
            desc = re.sub(r"<[^>]+>", "", desc)
            desc = re.sub(r"\s+", " ", desc).strip()
            # Limit length
            if len(desc) > 300:
                desc = desc[:297] + "..."
            return desc

        return None

    async def get_doc_info(self, symbol: str) -> dict | None:
        """
        Get documentation info for a PyTorch symbol.

        Returns dict with:
        - symbol: The symbol name
        - signature: Function/class signature
        - description: First paragraph of description
        - url: Link to full documentation
        """
        # Check cache first
        if symbol in self._cache:
            return self._cache[symbol]

        url_path = self._normalize_symbol(symbol)
        full_url = f"{self.base_url}/{url_path}"

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(full_url)

                if response.status_code != 200:
                    return None

                html = response.text

                signature = self._extract_signature(html, symbol)
                description = self._extract_description(html)

                result = {
                    "symbol": symbol,
                    "signature": signature,
                    "description": description,
                    "url": full_url,
                }

                # Cache the result
                self._cache[symbol] = result

                return result

        except Exception as e:
            print(f"Error fetching docs for {symbol}: {e}")
            return None

    def get_cached_symbols(self) -> list[str]:
        """Get list of currently cached symbols."""
        return list(self._cache.keys())


# Singleton instance
_docs_service: DocsService | None = None


def get_docs_service() -> DocsService:
    """Get docs service instance."""
    global _docs_service
    if _docs_service is None:
        _docs_service = DocsService()
    return _docs_service
