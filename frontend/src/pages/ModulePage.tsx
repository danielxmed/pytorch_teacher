import { useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Clock, AlertTriangle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useModule } from '../hooks/useModule'
import { useCurriculum } from '../hooks/useCurriculum'
import { useProgressStore } from '../stores/progressStore'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Spinner } from '../components/ui/Spinner'
import { CodeCell } from '../components/mdx/CodeCell'
import { Exercise } from '../components/mdx/Exercise'
import { Callout } from '../components/mdx/Callout'
import { DocRef } from '../components/mdx/DocRef'

// Custom MDX component renderer
function MDXContent({ content, moduleId, exercises }: {
  content: string
  moduleId: string
  exercises: Record<string, any>
}) {
  // Parse custom components from content
  const parts = useMemo(() => {
    const result: Array<{ type: string; content: string; props?: any }> = []
    let remaining = content

    // Regex patterns for custom components
    const patterns = [
      { name: 'CodeCell', regex: /<CodeCell\s+id="([^"]+)">([\s\S]*?)<\/CodeCell>/g },
      { name: 'Exercise', regex: /<Exercise\s+id="([^"]+)"(?:\s+difficulty="([^"]+)")?>([\s\S]*?)<\/Exercise>/g },
      { name: 'Callout', regex: /<Callout(?:\s+type="([^"]+)")?(?:\s+title="([^"]+)")?>([\s\S]*?)<\/Callout>/g },
      { name: 'DocRef', regex: /<DocRef\s+symbol="([^"]+)"\s*\/?>/g },
    ]

    let lastIndex = 0
    const matches: Array<{ index: number; length: number; component: any }> = []

    // Find all matches
    patterns.forEach(({ name, regex }) => {
      let match
      const r = new RegExp(regex.source, 'g')
      while ((match = r.exec(content)) !== null) {
        matches.push({
          index: match.index,
          length: match[0].length,
          component: { name, match },
        })
      }
    })

    // Sort by index
    matches.sort((a, b) => a.index - b.index)

    // Build parts
    matches.forEach(({ index, length, component }) => {
      // Add markdown before this component
      if (index > lastIndex) {
        result.push({
          type: 'markdown',
          content: content.slice(lastIndex, index),
        })
      }

      // Add component
      const { name, match } = component
      if (name === 'CodeCell') {
        result.push({
          type: 'CodeCell',
          content: match[2].trim(),
          props: { id: match[1] },
        })
      } else if (name === 'Exercise') {
        result.push({
          type: 'Exercise',
          content: match[3].trim(),
          props: { id: match[1], difficulty: match[2] || 'medium' },
        })
      } else if (name === 'Callout') {
        result.push({
          type: 'Callout',
          content: match[3].trim(),
          props: { type: match[1] || 'info', title: match[2] },
        })
      } else if (name === 'DocRef') {
        result.push({
          type: 'DocRef',
          content: '',
          props: { symbol: match[1] },
        })
      }

      lastIndex = index + length
    })

    // Add remaining markdown
    if (lastIndex < content.length) {
      result.push({
        type: 'markdown',
        content: content.slice(lastIndex),
      })
    }

    return result
  }, [content])

  return (
    <div className="mdx-content">
      {parts.map((part, index) => {
        if (part.type === 'markdown') {
          return (
            <ReactMarkdown key={index} remarkPlugins={[remarkGfm]}>
              {part.content}
            </ReactMarkdown>
          )
        }

        if (part.type === 'CodeCell') {
          return <CodeCell key={index} id={part.props.id}>{part.content}</CodeCell>
        }

        if (part.type === 'Exercise') {
          const exercise = exercises[part.props.id]
          if (!exercise) {
            return (
              <Callout key={index} type="error">
                Exercício "{part.props.id}" não encontrado.
              </Callout>
            )
          }
          return (
            <Exercise
              key={index}
              id={part.props.id}
              moduleId={moduleId}
              exercise={{
                ...exercise,
                difficulty: part.props.difficulty,
              }}
            >
              {part.content}
            </Exercise>
          )
        }

        if (part.type === 'Callout') {
          return (
            <Callout key={index} type={part.props.type} title={part.props.title}>
              {part.content}
            </Callout>
          )
        }

        if (part.type === 'DocRef') {
          return <DocRef key={index} symbol={part.props.symbol} />
        }

        return null
      })}
    </div>
  )
}

export function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const { module, loading, error } = useModule(moduleId)
  const { curriculum } = useCurriculum()
  const { setCurrentModule, completeModule } = useProgressStore()

  useEffect(() => {
    if (moduleId) {
      setCurrentModule(moduleId)
    }
  }, [moduleId, setCurrentModule])

  // Find prev/next modules
  const { prevModule, nextModule } = useMemo(() => {
    if (!curriculum || !moduleId) return { prevModule: null, nextModule: null }

    const allModules = curriculum.sections.flatMap((s) => s.modules)
    const currentIndex = allModules.findIndex((m) => m.id === moduleId)

    return {
      prevModule: currentIndex > 0 ? allModules[currentIndex - 1] : null,
      nextModule: currentIndex < allModules.length - 1 ? allModules[currentIndex + 1] : null,
    }
  }, [curriculum, moduleId])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-400">{error}</p>
        <Link to="/curriculum" className="mt-4 inline-block">
          <Button variant="secondary">Voltar ao Currículo</Button>
        </Link>
      </div>
    )
  }

  if (!module) {
    return (
      <div className="text-center py-12">
        <p className="text-dark-muted">Módulo não encontrado.</p>
        <Link to="/curriculum" className="mt-4 inline-block">
          <Button variant="secondary">Voltar ao Currículo</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="info">Módulo {module.metadata.order}</Badge>
          <span className="flex items-center gap-1 text-sm text-dark-muted">
            <Clock className="w-4 h-4" />
            {module.metadata.estimated_minutes} min
          </span>
          <Badge variant="default">PyTorch {module.metadata.pytorch_version}</Badge>
        </div>
        <h1 className="text-3xl font-bold text-dark-text">{module.metadata.title}</h1>
      </div>

      {/* Content */}
      <MDXContent
        content={module.content}
        moduleId={moduleId!}
        exercises={module.exercises}
      />

      {/* Mark as complete button */}
      <div className="flex justify-center pt-8">
        <Button
          variant="secondary"
          onClick={() => completeModule(moduleId!)}
        >
          Marcar módulo como completo
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8 border-t border-dark-border">
        {prevModule ? (
          <Link to={`/module/${prevModule.id}`}>
            <Button variant="ghost">
              <ChevronLeft className="w-4 h-4 mr-1" />
              {prevModule.title}
            </Button>
          </Link>
        ) : (
          <div />
        )}

        {nextModule && (
          <Link to={`/module/${nextModule.id}`}>
            <Button variant="primary">
              {nextModule.title}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
