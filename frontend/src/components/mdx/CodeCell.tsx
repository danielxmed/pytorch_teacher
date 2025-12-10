import { useState, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { Play, Copy, Check, RotateCcw } from 'lucide-react'
import { Button } from '../ui/Button'
import { usePyodide } from '../../hooks/usePyodide'
import type { CodeExecutionResult } from '../../types'

interface CodeCellProps {
  id: string
  children: string
  onExecute?: (result: CodeExecutionResult) => void
}

export function CodeCell({ id, children, onExecute }: CodeCellProps) {
  const initialCode = typeof children === 'string' ? children.trim() : ''
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState<CodeExecutionResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)

  const { ready, loading: pyodideLoading, execute } = usePyodide()

  const handleRun = useCallback(async () => {
    if (!ready || isRunning) return

    setIsRunning(true)
    setOutput(null)

    try {
      const result = await execute(code)
      setOutput(result)
      onExecute?.(result)
    } finally {
      setIsRunning(false)
    }
  }, [code, ready, isRunning, execute, onExecute])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  const handleReset = useCallback(() => {
    setCode(initialCode)
    setOutput(null)
  }, [initialCode])

  const lineCount = code.split('\n').length
  const editorHeight = Math.min(Math.max(lineCount * 20 + 20, 80), 400)

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-dark-border">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-dark-surface border-b border-dark-border">
        <div className="flex items-center gap-2">
          <span className="text-xs text-dark-muted font-mono">{id}</span>
          {pyodideLoading && (
            <span className="text-xs text-yellow-500">Loading Python...</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            title="Reset code"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            title="Copy code"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleRun}
            loading={isRunning}
            disabled={!ready || isRunning}
          >
            <Play className="w-4 h-4 mr-1" />
            Run
          </Button>
        </div>
      </div>

      {/* Editor */}
      <Editor
        height={editorHeight}
        language="python"
        value={code}
        onChange={(value) => setCode(value || '')}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          insertSpaces: true,
          wordWrap: 'on',
          padding: { top: 8, bottom: 8 },
        }}
      />

      {/* Output */}
      {output && (
        <div className="border-t border-dark-border">
          <div className="px-3 py-1 bg-dark-surface text-xs text-dark-muted">
            Output {output.executionTime && `(${output.executionTime.toFixed(0)}ms)`}
          </div>
          <pre className={`p-3 text-sm font-mono overflow-x-auto ${output.success ? 'bg-dark-bg' : 'bg-red-950/30'}`}>
            {output.stdout && <span className="text-dark-text">{output.stdout}</span>}
            {output.stderr && <span className="text-red-400">{output.stderr}</span>}
            {output.error && <span className="text-red-400">{output.error}</span>}
            {!output.stdout && !output.stderr && !output.error && (
              <span className="text-dark-muted italic">No output</span>
            )}
          </pre>
        </div>
      )}
    </div>
  )
}
