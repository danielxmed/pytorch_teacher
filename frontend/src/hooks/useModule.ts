import { useState, useEffect } from 'react'
import { api } from '../services/api'
import type { Module } from '../types'

interface UseModuleResult {
  module: Module | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useModule(moduleId: string | undefined): UseModuleResult {
  const [module, setModule] = useState<Module | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchModule = async () => {
    if (!moduleId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await api.getModule(moduleId)
      setModule(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load module')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchModule()
  }, [moduleId])

  return { module, loading, error, refetch: fetchModule }
}
