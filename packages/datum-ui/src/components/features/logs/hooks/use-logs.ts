import type { LogsContextValue } from '../types'
import { createContext, use } from 'react'

export const LogsContext = createContext<LogsContextValue | null>(null)

export function useLogs(): LogsContextValue {
  const context = use(LogsContext)
  if (!context) {
    throw new Error('Logs components must be used within <Logs.Root>')
  }
  return context
}
