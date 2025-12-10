import { useState, useEffect, useCallback } from 'react'
import { loadPyodideInstance, executePython, isPyodideReady } from '../services/pyodide'
import type { CodeExecutionResult } from '../types'

interface UsePyodideResult {
  ready: boolean
  loading: boolean
  error: string | null
  execute: (code: string) => Promise<CodeExecutionResult>
}

export function usePyodide(): UsePyodideResult {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const initPyodide = async () => {
      try {
        await loadPyodideInstance()
        if (mounted) {
          setReady(true)
          setLoading(false)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load Python runtime')
          setLoading(false)
        }
      }
    }

    // Check if already ready
    isPyodideReady().then((isReady) => {
      if (isReady && mounted) {
        setReady(true)
        setLoading(false)
      } else {
        initPyodide()
      }
    })

    return () => {
      mounted = false
    }
  }, [])

  const execute = useCallback(async (code: string): Promise<CodeExecutionResult> => {
    if (!ready) {
      return {
        success: false,
        stdout: '',
        stderr: '',
        error: 'Python runtime not ready',
      }
    }

    return executePython(code)
  }, [ready])

  return { ready, loading, error, execute }
}
