import { Link } from 'react-router-dom'
import { Clock, ChevronRight, Check, Circle } from 'lucide-react'
import { useCurriculum } from '../hooks/useCurriculum'
import { useProgressStore } from '../stores/progressStore'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Spinner } from '../components/ui/Spinner'

export function CurriculumPage() {
  const { curriculum, loading, error } = useCurriculum()
  const { isModuleCompleted, completedExercises } = useProgressStore()

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
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  if (!curriculum) {
    return (
      <div className="text-center py-12">
        <p className="text-dark-muted">Currículo não disponível.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-dark-text mb-2">Currículo Completo</h1>
        <p className="text-dark-muted">
          {curriculum.total_modules} módulos • ~
          {Math.round(curriculum.total_estimated_minutes / 60)} horas de conteúdo
        </p>
      </div>

      {curriculum.sections.map((section) => (
        <div key={section.id}>
          <h2 className="text-xl font-semibold text-pytorch-400 mb-4">
            Seção {section.order}: {section.title}
          </h2>

          <div className="space-y-3">
            {section.modules.map((module) => {
              const completed = isModuleCompleted(module.id)
              const exerciseCount = Object.keys(completedExercises[module.id] || {}).length

              return (
                <Link key={module.id} to={`/module/${module.id}`}>
                  <Card className="hover:border-pytorch-500/50 transition-colors">
                    <CardContent className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {completed ? (
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                              <Check className="w-5 h-5 text-green-500" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-dark-border flex items-center justify-center">
                              <span className="text-sm font-medium text-dark-muted">
                                {module.order}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-dark-text truncate">
                            {module.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-xs text-dark-muted">
                              <Clock className="w-3 h-3" />
                              {module.estimated_minutes} min
                            </span>
                            {exerciseCount > 0 && (
                              <Badge variant="info">{exerciseCount} exercícios feitos</Badge>
                            )}
                            {module.prerequisites.length > 0 && (
                              <Badge variant="warning">
                                Pré-req: {module.prerequisites.join(', ')}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <ChevronRight className="w-5 h-5 text-dark-muted flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
