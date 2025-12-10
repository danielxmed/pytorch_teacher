import { useState, useEffect } from 'react'
import { ExternalLink, Book } from 'lucide-react'
import { api } from '../../services/api'
import type { DocInfo } from '../../types'

interface DocRefProps {
  symbol: string
}

export function DocRef({ symbol }: DocRefProps) {
  const [docInfo, setDocInfo] = useState<DocInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetchDoc() {
      try {
        const info = await api.getDocInfo(symbol)
        if (mounted) {
          setDocInfo(info)
          setLoading(false)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load documentation')
          setLoading(false)
        }
      }
    }

    fetchDoc()

    return () => {
      mounted = false
    }
  }, [symbol])

  if (loading) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 bg-dark-surface rounded border border-dark-border text-sm text-dark-muted">
        <Book className="w-4 h-4 animate-pulse" />
        <code className="text-pytorch-400">{symbol}</code>
      </div>
    )
  }

  if (error || !docInfo) {
    return (
      <a
        href={`https://pytorch.org/docs/stable/search.html?q=${encodeURIComponent(symbol)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-2 py-1 bg-dark-surface rounded border border-dark-border text-sm hover:border-pytorch-500 transition-colors"
      >
        <Book className="w-4 h-4 text-dark-muted" />
        <code className="text-pytorch-400">{symbol}</code>
        <ExternalLink className="w-3 h-3 text-dark-muted" />
      </a>
    )
  }

  return (
    <a
      href={docInfo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block my-3 p-3 bg-dark-surface rounded-lg border border-dark-border hover:border-pytorch-500 transition-colors group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Book className="w-4 h-4 text-pytorch-500" />
            <code className="text-pytorch-400 font-medium">{symbol}</code>
            <ExternalLink className="w-3 h-3 text-dark-muted group-hover:text-pytorch-500 transition-colors" />
          </div>

          {docInfo.signature && (
            <div className="text-xs font-mono text-dark-muted mb-2 truncate">
              {docInfo.signature}
            </div>
          )}

          {docInfo.description && (
            <p className="text-sm text-dark-muted line-clamp-2">
              {docInfo.description}
            </p>
          )}
        </div>
      </div>
    </a>
  )
}
