import type { HTMLAttributes, ReactNode } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  children: ReactNode
}

export function Badge({ variant = 'default', children, className = '', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-dark-border text-dark-text',
    success: 'bg-green-900/50 text-green-400 border-green-800',
    warning: 'bg-yellow-900/50 text-yellow-400 border-yellow-800',
    error: 'bg-red-900/50 text-red-400 border-red-800',
    info: 'bg-blue-900/50 text-blue-400 border-blue-800',
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
