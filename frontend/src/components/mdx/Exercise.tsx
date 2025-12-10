import { useState, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { Play, Lightbulb, Eye, EyeOff, Check, X, RotateCcw } from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Card, CardHeader, CardContent } from '../ui/Card'
import { usePyodide } from '../../hooks/usePyodide'
import { useProgressStore } from '../../stores/progressStore'
import { api } from '../../services/api'
import type { Exercise as ExerciseType, ValidationResponse } from '../../types'

interface ExerciseProps {
  id: string
  moduleId: string
  exercise: ExerciseType
  children: React.ReactNode // Exercise description
}

export function Exercise({ id, moduleId, exercise, children }: ExerciseProps) {
  const [code, setCode] = useState(exercise.starterCode || '')
  const [showHints, setShowHints] = useState(false)
  const [currentHint, setCurrentHint] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [result, setResult] = useState<ValidationResponse | null>(null)

  const { ready, loading: pyodideLoading } = usePyodide()
  const { completeExercise, isExerciseCompleted } = useProgressStore()

  const isCompleted = isExerciseCompleted(moduleId, id)

  const handleValidate = useCallback(async () => {
    if (isValidating) return

    setIsValidating(true)
    setResult(null)

    try {
      const response = await api.validateExercise({
        module_id: moduleId,
        exercise_id: id,
        code,
      })
      setResult(response)

      if (response.result === 'passed') {
        completeExercise(moduleId, id)
      }
    } catch (error) {
      setResult({
        result: 'error',
        passed_tests: 0,
        total_tests: 0,
        feedback: '',
        error_message: error instanceof Error ? error.message : 'Validation failed',
        stdout: '',
        stderr: '',
      })
    } finally {
      setIsValidating(false)
    }
  }, [code, moduleId, id, isValidating, completeExercise])

  const handleNextHint = useCallback(() => {
    if (!showHints) {
      setShowHints(true)
    } else if (currentHint < exercise.hints.length - 1) {
      setCurrentHint((prev) => prev + 1)
    }
  }, [showHints, currentHint, exercise.hints.length])

  const handleReset = useCallback(() => {
    setCode(exercise.starterCode || '')
    setResult(null)
    setShowHints(false)
    setCurrentHint(0)
    setShowSolution(false)
  }, [exercise.starterCode])

  const handleShowSolution = useCallback(() => {
    setShowSolution((prev) => !prev)
  }, [])

  const difficultyColors = {
    easy: 'success',
    medium: 'warning',
    hard: 'error',
  } as const

  const lineCount = code.split('\n').length
  const editorHeight = Math.min(Math.max(lineCount * 20 + 20, 120), 400)

  return (
    <Card className="my-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-dark-text">Exercício</span>
          <Badge variant={difficultyColors[exercise.difficulty || 'medium']}>
            {exercise.difficulty || 'medium'}
          </Badge>
          {isCompleted && (
            <Badge variant="success">
              <Check className="w-3 h-3 mr-1" /> Completo
            </Badge>
          )}
        </div>
        <span className="text-xs text-dark-muted font-mono">{id}</span>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <div className="text-dark-muted">{children}</div>

        {/* Editor */}
        <div className="rounded-lg overflow-hidden border border-dark-border">
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
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            onClick={handleValidate}
            loading={isValidating}
            disabled={!ready || isValidating}
          >
            <Play className="w-4 h-4 mr-1" />
            Validar
          </Button>

          {exercise.hints.length > 0 && (
            <Button
              variant="secondary"
              onClick={handleNextHint}
              disabled={showHints && currentHint >= exercise.hints.length - 1}
            >
              <Lightbulb className="w-4 h-4 mr-1" />
              {showHints ? `Dica ${currentHint + 1}/${exercise.hints.length}` : 'Pedir dica'}
            </Button>
          )}

          <Button variant="ghost" onClick={handleShowSolution}>
            {showSolution ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
            {showSolution ? 'Esconder' : 'Ver solução'}
          </Button>

          <Button variant="ghost" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Resetar
          </Button>

          {pyodideLoading && (
            <span className="text-xs text-yellow-500">Loading Python...</span>
          )}
        </div>

        {/* Hints */}
        {showHints && exercise.hints.length > 0 && (
          <div className="p-3 bg-blue-950/30 border border-blue-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Dica {currentHint + 1}</span>
            </div>
            <p className="text-sm text-dark-muted">{exercise.hints[currentHint]}</p>
          </div>
        )}

        {/* Solution */}
        {showSolution && (
          <div className="p-3 bg-green-950/30 border border-green-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">Solução</span>
            </div>
            <pre className="text-sm font-mono text-dark-text whitespace-pre-wrap">
              {exercise.solution}
            </pre>
          </div>
        )}

        {/* Validation result */}
        {result && (
          <div
            className={`p-3 rounded-lg border ${
              result.result === 'passed'
                ? 'bg-green-950/30 border-green-800'
                : 'bg-red-950/30 border-red-800'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {result.result === 'passed' ? (
                <>
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="font-medium text-green-400">Todos os testes passaram!</span>
                </>
              ) : (
                <>
                  <X className="w-5 h-5 text-red-400" />
                  <span className="font-medium text-red-400">
                    {result.result === 'error' ? 'Erro de execução' : 'Alguns testes falharam'}
                  </span>
                </>
              )}
            </div>

            {result.total_tests > 0 && (
              <p className="text-sm text-dark-muted mb-2">
                Testes: {result.passed_tests}/{result.total_tests}
              </p>
            )}

            {result.feedback && (
              <pre className="text-sm font-mono text-dark-muted whitespace-pre-wrap">
                {result.feedback}
              </pre>
            )}

            {result.error_message && (
              <pre className="text-sm font-mono text-red-400 whitespace-pre-wrap">
                {result.error_message}
              </pre>
            )}

            {result.stdout && (
              <div className="mt-2">
                <span className="text-xs text-dark-muted">Output:</span>
                <pre className="text-sm font-mono text-dark-text whitespace-pre-wrap">
                  {result.stdout}
                </pre>
              </div>
            )}

            {result.stderr && (
              <pre className="text-sm font-mono text-red-400 whitespace-pre-wrap mt-2">
                {result.stderr}
              </pre>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
