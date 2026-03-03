import type { FormFieldContextValue } from '../types'
import * as React from 'react'

const FieldContext = React.createContext<FormFieldContextValue | null>(null)

export interface FieldProviderProps {
  children: React.ReactNode
  value: FormFieldContextValue
}

export function FieldProvider({ children, value }: FieldProviderProps) {
  return <FieldContext value={value}>{children}</FieldContext>
}

export function useFieldContext(): FormFieldContextValue {
  const context = React.use(FieldContext)

  if (!context) {
    throw new Error(
      'useFieldContext must be used within a Form.Field component. '
      + 'Make sure your input component is wrapped with Form.Field.',
    )
  }

  return context
}

/**
 * Optional field context - returns null if not within a Form.Field
 * Useful for components that can work both inside and outside Form.Field
 */
export function useOptionalFieldContext(): FormFieldContextValue | null {
  return React.use(FieldContext)
}

export { FieldContext }
