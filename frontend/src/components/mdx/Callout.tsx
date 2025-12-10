import type { ReactNode } from 'react'
import { Info, AlertTriangle, AlertCircle, Lightbulb, Flame } from 'lucide-react'

type CalloutType = 'info' | 'warning' | 'error' | 'tip' | 'important'

interface CalloutProps {
  type?: CalloutType
  title?: string
  children: ReactNode
}

const calloutConfig = {
  info: {
    icon: Info,
    bg: 'bg-blue-950/30',
    border: 'border-blue-800',
    iconColor: 'text-blue-400',
    titleColor: 'text-blue-400',
    defaultTitle: 'Nota',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-yellow-950/30',
    border: 'border-yellow-800',
    iconColor: 'text-yellow-400',
    titleColor: 'text-yellow-400',
    defaultTitle: 'Atenção',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-red-950/30',
    border: 'border-red-800',
    iconColor: 'text-red-400',
    titleColor: 'text-red-400',
    defaultTitle: 'Erro',
  },
  tip: {
    icon: Lightbulb,
    bg: 'bg-green-950/30',
    border: 'border-green-800',
    iconColor: 'text-green-400',
    titleColor: 'text-green-400',
    defaultTitle: 'Dica',
  },
  important: {
    icon: Flame,
    bg: 'bg-pytorch-950/30',
    border: 'border-pytorch-800',
    iconColor: 'text-pytorch-400',
    titleColor: 'text-pytorch-400',
    defaultTitle: 'Importante',
  },
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const config = calloutConfig[type]
  const Icon = config.icon
  const displayTitle = title || config.defaultTitle

  return (
    <div className={`my-4 p-4 rounded-lg border ${config.bg} ${config.border}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
        <div className="flex-1">
          <div className={`font-medium mb-1 ${config.titleColor}`}>{displayTitle}</div>
          <div className="text-dark-muted text-sm">{children}</div>
        </div>
      </div>
    </div>
  )
}
