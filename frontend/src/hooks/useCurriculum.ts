import { useState, useEffect } from 'react'
import { api } from '../services/api'
import type { Curriculum } from '../types'

interface UseCurriculumResult {
  curriculum: Curriculum | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useCurriculum(): UseCurriculumResult {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCurriculum = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getCurriculum()
      setCurriculum(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load curriculum')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCurriculum()
  }, [])

  return { curriculum, loading, error, refetch: fetchCurriculum }
}
