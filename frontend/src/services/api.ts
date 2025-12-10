import type { Curriculum, Module, ValidationRequest, ValidationResponse, DocInfo } from '../types'

const API_BASE = '/api'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new ApiError(response.status, error.detail || `HTTP ${response.status}`)
  }

  return response.json()
}

export const api = {
  // Curriculum endpoints
  getCurriculum: (): Promise<Curriculum> =>
    fetchJson(`${API_BASE}/curriculum`),

  getModule: (moduleId: string): Promise<Module> =>
    fetchJson(`${API_BASE}/modules/${moduleId}`),

  listModules: (): Promise<string[]> =>
    fetchJson(`${API_BASE}/modules`),

  // Validation endpoint
  validateExercise: (request: ValidationRequest): Promise<ValidationResponse> =>
    fetchJson(`${API_BASE}/validate`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  // Documentation endpoints
  getDocInfo: (symbol: string): Promise<DocInfo> =>
    fetchJson(`${API_BASE}/docs/pytorch/${encodeURIComponent(symbol)}`),
}
