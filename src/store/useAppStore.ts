import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  apps: App[]
}

interface App {
  id: string
  name: string
  description: string
  template: string
  settings: AppSettings
  analytics: AppAnalytics
  createdAt: Date
  updatedAt: Date
}

interface AppSettings {
  theme: 'light' | 'dark' | 'auto'
  primaryColor: string
  secondaryColor: string
  logo?: string
  features: string[]
  customDomain?: string
}

interface AppAnalytics {
  visitors: number
  pageViews: number
  averageTime: number
  conversionRate: number
}

interface AppState {
  // User
  user: User | null
  isAuthenticated: boolean
  
  // Current App
  currentApp: App | null
  isEditing: boolean
  
  // UI State
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'auto'
  
  // Actions
  setUser: (user: User | null) => void
  logout: () => void
  setCurrentApp: (app: App | null) => void
  updateApp: (appId: string, updates: Partial<App>) => void
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark' | 'auto') => void
  
  // App Generator
  generatorStep: number
  generatorData: any
  setGeneratorStep: (step: number) => void
  updateGeneratorData: (data: any) => void
  resetGenerator: () => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      immer((set) => ({
        // Initial State
        user: null,
        isAuthenticated: false,
        currentApp: null,
        isEditing: false,
        sidebarOpen: true,
        theme: 'dark',
        generatorStep: 1,
        generatorData: {},
        
        // Actions
        setUser: (user) =>
          set((state) => {
            state.user = user
            state.isAuthenticated = !!user
          }),
          
        logout: () =>
          set((state) => {
            state.user = null
            state.isAuthenticated = false
            state.currentApp = null
          }),
          
        setCurrentApp: (app) =>
          set((state) => {
            state.currentApp = app
          }),
          
        updateApp: (appId, updates) =>
          set((state) => {
            if (state.user) {
              const appIndex = state.user.apps.findIndex((app) => app.id === appId)
              if (appIndex !== -1) {
                Object.assign(state.user.apps[appIndex], updates)
                if (state.currentApp?.id === appId) {
                  Object.assign(state.currentApp, updates)
                }
              }
            }
          }),
          
        toggleSidebar: () =>
          set((state) => {
            state.sidebarOpen = !state.sidebarOpen
          }),
          
        setTheme: (theme) =>
          set((state) => {
            state.theme = theme
          }),
          
        setGeneratorStep: (step) =>
          set((state) => {
            state.generatorStep = step
          }),
          
        updateGeneratorData: (data) =>
          set((state) => {
            state.generatorData = { ...state.generatorData, ...data }
          }),
          
        resetGenerator: () =>
          set((state) => {
            state.generatorStep = 1
            state.generatorData = {}
          }),
      })),
      {
        name: 'sid-app-store',
        partialize: (state) => ({
          user: state.user,
          theme: state.theme,
        }),
      }
    )
  )
)