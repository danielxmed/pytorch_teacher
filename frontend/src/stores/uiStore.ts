import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Theme } from '../types'

interface UIState {
  theme: Theme
  sidebarOpen: boolean
  outputPanelOpen: boolean

  // Actions
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  toggleSidebar: () => void
  toggleOutputPanel: () => void
  setSidebarOpen: (open: boolean) => void
  setOutputPanelOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      sidebarOpen: true,
      outputPanelOpen: true,

      setTheme: (theme: Theme) => {
        set({ theme })
        // Update document class for Tailwind dark mode
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },

      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark'
        get().setTheme(newTheme)
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }))
      },

      toggleOutputPanel: () => {
        set((state) => ({ outputPanelOpen: !state.outputPanelOpen }))
      },

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open })
      },

      setOutputPanelOpen: (open: boolean) => {
        set({ outputPanelOpen: open })
      },
    }),
    {
      name: 'pytorch-academy-ui',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)
