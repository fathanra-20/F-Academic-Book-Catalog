import { useContext } from 'react'
import { AppContext } from './appContext.ts'
import type { AppContextValue } from './appContext.ts'

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext harus dipakai di dalam <AppProvider>.')
  }

  return context
}
