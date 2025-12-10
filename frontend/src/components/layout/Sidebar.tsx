import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronRight, Check, Circle } from 'lucide-react'
import { useState } from 'react'
import { useCurriculum } from '../../hooks/useCurriculum'
import { useUIStore } from '../../stores/uiStore'
import { useProgressStore } from '../../stores/progressStore'
import { Spinner } from '../ui/Spinner'
import type { Section } from '../../types'

function SectionItem({ section }: { section: Section }) {
  const [expanded, setExpanded] = useState(true)
  const location = useLocation()
  const { isModuleCompleted } = useProgressStore()

  return (
    <div className="mb-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-dark-muted hover:text-dark-text hover:bg-dark-border/50 rounded-lg transition-colors"
      >
        <span>{section.title}</span>
        {expanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {expanded && (
        <div className="ml-2 mt-1 space-y-0.5">
          {section.modules.map((module) => {
            const isActive = location.pathname === `/module/${module.id}`
            const isCompleted = isModuleCompleted(module.id)

            return (
              <Link
                key={module.id}
                to={`/module/${module.id}`}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                  isActive
                    ? 'bg-pytorch-500/20 text-pytorch-400 border-l-2 border-pytorch-500'
                    : 'text-dark-muted hover:text-dark-text hover:bg-dark-border/50'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-dark-border flex-shrink-0" />
                )}
                <span className="truncate">{module.title}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const { curriculum, loading, error } = useCurriculum()
  const { sidebarOpen } = useUIStore()

  if (!sidebarOpen) return null

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-64 bg-dark-surface border-r border-dark-border overflow-y-auto z-40">
      <div className="p-4">
        <Link
          to="/curriculum"
          className="block text-sm font-medium text-dark-muted hover:text-dark-text mb-4"
        >
          Ver Currículo Completo
        </Link>

        {loading && (
          <div className="flex justify-center py-8">
            <Spinner size="md" />
          </div>
        )}

        {error && (
          <div className="text-sm text-red-400 p-3 bg-red-950/30 rounded-lg">
            {error}
          </div>
        )}

        {curriculum && (
          <nav className="space-y-1">
            {curriculum.sections.map((section) => (
              <SectionItem key={section.id} section={section} />
            ))}
          </nav>
        )}

        {curriculum && (
          <div className="mt-6 pt-4 border-t border-dark-border">
            <div className="text-xs text-dark-muted">
              <p>{curriculum.total_modules} módulos</p>
              <p>~{Math.round(curriculum.total_estimated_minutes / 60)}h de conteúdo</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
