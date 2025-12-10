import type { CodeExecutionResult } from '../types'

// Pyodide instance type (simplified)
interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>
  loadPackage: (packages: string | string[]) => Promise<void>
  globals: {
    get: (name: string) => unknown
  }
}

declare global {
  interface Window {
    loadPyodide: (config?: { indexURL?: string }) => Promise<PyodideInterface>
  }
}

let pyodideInstance: PyodideInterface | null = null
let pyodideLoading: Promise<PyodideInterface> | null = null

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'

export async function loadPyodideInstance(): Promise<PyodideInterface> {
  if (pyodideInstance) {
    return pyodideInstance
  }

  if (pyodideLoading) {
    return pyodideLoading
  }

  pyodideLoading = (async () => {
    // Load Pyodide script if not already loaded
    if (!window.loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')
        script.src = `${PYODIDE_CDN}pyodide.js`
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load Pyodide'))
        document.head.appendChild(script)
      })
    }

    // Initialize Pyodide
    const pyodide = await window.loadPyodide({
      indexURL: PYODIDE_CDN,
    })

    // Pre-load numpy (required for torch-like operations)
    await pyodide.loadPackage(['numpy', 'micropip'])

    // Setup output capture
    await pyodide.runPythonAsync(`
import sys
from io import StringIO

class OutputCapture:
    def __init__(self):
        self.stdout = StringIO()
        self.stderr = StringIO()
        self._old_stdout = None
        self._old_stderr = None

    def __enter__(self):
        self._old_stdout = sys.stdout
        self._old_stderr = sys.stderr
        sys.stdout = self.stdout
        sys.stderr = self.stderr
        return self

    def __exit__(self, *args):
        sys.stdout = self._old_stdout
        sys.stderr = self._old_stderr

    def get_output(self):
        return self.stdout.getvalue(), self.stderr.getvalue()

_output_capture = OutputCapture()
`)

    pyodideInstance = pyodide
    return pyodide
  })()

  return pyodideLoading
}

export async function executePython(code: string): Promise<CodeExecutionResult> {
  const startTime = performance.now()

  try {
    const pyodide = await loadPyodideInstance()

    // Execute code with output capture
    const wrappedCode = `
with _output_capture:
    _result = None
    try:
        exec('''${code.replace(/'/g, "\\'")}''')
    except Exception as e:
        import traceback
        print(traceback.format_exc(), file=sys.stderr)
        raise

_stdout, _stderr = _output_capture.get_output()
_output_capture.stdout = __import__('io').StringIO()
_output_capture.stderr = __import__('io').StringIO()
(_stdout, _stderr)
`

    const result = await pyodide.runPythonAsync(wrappedCode) as [string, string]
    const [stdout, stderr] = result

    const executionTime = performance.now() - startTime

    return {
      success: true,
      stdout,
      stderr,
      executionTime,
    }
  } catch (error) {
    const executionTime = performance.now() - startTime

    return {
      success: false,
      stdout: '',
      stderr: '',
      error: error instanceof Error ? error.message : String(error),
      executionTime,
    }
  }
}

export async function isPyodideReady(): Promise<boolean> {
  return pyodideInstance !== null
}
