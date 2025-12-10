import type { CodeExecutionResult } from '../types'
import { api } from './api'

let backendReady = false
let backendChecking: Promise<boolean> | null = null

export async function loadPyodideInstance(): Promise<void> {
  // Check if backend is available
  if (backendReady) return

  if (backendChecking) {
    await backendChecking
    return
  }

  backendChecking = (async () => {
    try {
      // Test backend connectivity with a simple request
      const response = await fetch('/health')
      if (response.ok) {
        backendReady = true
        return true
      }
      throw new Error('Backend not available')
    } catch {
      throw new Error('Failed to connect to Python backend. Make sure the server is running.')
    }
  })()

  await backendChecking
}

export async function executePython(code: string): Promise<CodeExecutionResult> {
  const startTime = performance.now()

  try {
    if (!backendReady) {
      await loadPyodideInstance()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await api.executeCode({ code, timeout: 30 })

    // Backend returns execution_time in seconds, convert to ms
    const execTime = result.execution_time || result.executionTime

    return {
      success: result.success,
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      error: result.error,
      executionTime: execTime ? execTime * 1000 : performance.now() - startTime,
    }
  } catch (error) {
    return {
      success: false,
      stdout: '',
      stderr: '',
      error: error instanceof Error ? error.message : String(error),
      executionTime: performance.now() - startTime,
    }
  }
}

export async function isPyodideReady(): Promise<boolean> {
  return backendReady
}
