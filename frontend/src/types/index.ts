// API Types

export interface ModuleMetadata {
  id: string
  title: string
  order: number
  prerequisites: string[]
  estimated_minutes: number
  pytorch_version: string
  section: string
  section_order: number
}

export interface Module {
  metadata: ModuleMetadata
  content: string
  exercises: Record<string, Exercise>
}

export interface Section {
  id: string
  title: string
  order: number
  modules: ModuleMetadata[]
}

export interface Curriculum {
  sections: Section[]
  total_modules: number
  total_estimated_minutes: number
}

export interface Exercise {
  id?: string
  starterCode: string
  hints: string[]
  validation: {
    type: 'assert' | 'output' | 'custom'
    tests?: string[]
    expected_output?: string
  }
  solution: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

export interface ValidationRequest {
  exercise_id: string
  module_id: string
  code: string
}

export interface ValidationResponse {
  result: 'passed' | 'failed' | 'error' | 'timeout'
  passed_tests: number
  total_tests: number
  feedback: string
  error_message?: string
  stdout: string
  stderr: string
}

export interface DocInfo {
  symbol: string
  signature?: string
  description?: string
  url: string
}

// App State Types

export interface UserProgress {
  completedModules: string[]
  completedExercises: Record<string, string[]> // moduleId -> exerciseIds[]
  currentModule?: string
}

export interface CodeExecutionResult {
  success: boolean
  stdout: string
  stderr: string
  error?: string
  executionTime?: number
}

// UI State Types

export type Theme = 'dark' | 'light'

export interface UIState {
  theme: Theme
  sidebarOpen: boolean
  outputPanelOpen: boolean
}
