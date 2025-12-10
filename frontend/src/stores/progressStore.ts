import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProgress } from '../types'

interface ProgressState extends UserProgress {
  // Actions
  completeModule: (moduleId: string) => void
  completeExercise: (moduleId: string, exerciseId: string) => void
  setCurrentModule: (moduleId: string) => void
  isModuleCompleted: (moduleId: string) => boolean
  isExerciseCompleted: (moduleId: string, exerciseId: string) => boolean
  getModuleProgress: (moduleId: string, totalExercises: number) => number
  resetProgress: () => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedModules: [],
      completedExercises: {},
      currentModule: undefined,

      completeModule: (moduleId: string) => {
        set((state) => ({
          completedModules: state.completedModules.includes(moduleId)
            ? state.completedModules
            : [...state.completedModules, moduleId],
        }))
      },

      completeExercise: (moduleId: string, exerciseId: string) => {
        set((state) => {
          const moduleExercises = state.completedExercises[moduleId] || []
          if (moduleExercises.includes(exerciseId)) {
            return state
          }
          return {
            completedExercises: {
              ...state.completedExercises,
              [moduleId]: [...moduleExercises, exerciseId],
            },
          }
        })
      },

      setCurrentModule: (moduleId: string) => {
        set({ currentModule: moduleId })
      },

      isModuleCompleted: (moduleId: string) => {
        return get().completedModules.includes(moduleId)
      },

      isExerciseCompleted: (moduleId: string, exerciseId: string) => {
        const moduleExercises = get().completedExercises[moduleId] || []
        return moduleExercises.includes(exerciseId)
      },

      getModuleProgress: (moduleId: string, totalExercises: number) => {
        if (totalExercises === 0) return 0
        const completed = (get().completedExercises[moduleId] || []).length
        return Math.round((completed / totalExercises) * 100)
      },

      resetProgress: () => {
        set({
          completedModules: [],
          completedExercises: {},
          currentModule: undefined,
        })
      },
    }),
    {
      name: 'pytorch-academy-progress',
    }
  )
)
