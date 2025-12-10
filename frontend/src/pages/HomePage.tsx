import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Code, Zap, Trophy } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { useCurriculum } from '../hooks/useCurriculum'
import { useProgressStore } from '../stores/progressStore'

export function HomePage() {
  const { curriculum } = useCurriculum()
  const { completedModules } = useProgressStore()

  const firstModuleId = curriculum?.sections[0]?.modules[0]?.id

  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-dark-text mb-4">
          Aprenda <span className="text-pytorch-500">PyTorch</span>
        </h1>
        <p className="text-xl text-dark-muted mb-8 max-w-2xl mx-auto">
          Domine deep learning de forma interativa. Do básico aos Transformers,
          com código executável e exercícios práticos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {firstModuleId && (
            <Link to={`/module/${firstModuleId}`}>
              <Button size="lg">
                Começar Agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          )}
          <Link to="/curriculum">
            <Button variant="secondary" size="lg">
              Ver Currículo
            </Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-pytorch-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Code className="w-6 h-6 text-pytorch-500" />
            </div>
            <h3 className="font-semibold text-dark-text mb-2">Código Executável</h3>
            <p className="text-sm text-dark-muted">
              Execute código Python diretamente no navegador com Pyodide
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-semibold text-dark-text mb-2">Conteúdo Rico</h3>
            <p className="text-sm text-dark-muted">
              20 módulos cobrindo de tensores básicos a Transformers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="font-semibold text-dark-text mb-2">Exercícios Práticos</h3>
            <p className="text-sm text-dark-muted">
              Valide seu aprendizado com exercícios e feedback instantâneo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="font-semibold text-dark-text mb-2">Progresso Salvo</h3>
            <p className="text-sm text-dark-muted">
              Seu progresso é salvo automaticamente no navegador
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      {completedModules.length > 0 && curriculum && (
        <Card>
          <CardContent className="py-6">
            <h2 className="text-lg font-semibold text-dark-text mb-4">Seu Progresso</h2>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-2 bg-dark-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-pytorch-500 transition-all"
                  style={{
                    width: `${(completedModules.length / curriculum.total_modules) * 100}%`,
                  }}
                />
              </div>
              <span className="text-sm text-dark-muted">
                {completedModules.length}/{curriculum.total_modules} módulos
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Curriculum Preview */}
      {curriculum && (
        <div>
          <h2 className="text-2xl font-bold text-dark-text mb-6">Currículo</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {curriculum.sections.map((section) => (
              <Card key={section.id}>
                <CardContent className="py-4">
                  <h3 className="font-semibold text-pytorch-400 mb-2">
                    {section.title}
                  </h3>
                  <ul className="space-y-1">
                    {section.modules.slice(0, 3).map((module) => (
                      <li key={module.id} className="text-sm text-dark-muted truncate">
                        {module.order}. {module.title}
                      </li>
                    ))}
                    {section.modules.length > 3 && (
                      <li className="text-sm text-dark-muted">
                        +{section.modules.length - 3} mais...
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
