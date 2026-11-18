'use client'

import type { ReactNode } from 'react'
import type { ErrorDescription } from './describe-api-error'
import { createContext, use, useCallback } from 'react'
import { describeApiError } from './describe-api-error'

type Describe = (error: unknown) => ErrorDescription

const ErrorDescriptionContext = createContext<Describe>(error => describeApiError(error))

export interface ErrorDescriptionProviderProps {
  children: ReactNode
  /** Product-area names by Kubernetes API group, passed to `describeApiError`. */
  apiGroupLabels?: Record<string, string>
  /**
   * Replace or adjust a description app-wide. `base` is what `describeApiError`
   * produced (with `apiGroupLabels`); return it, a changed copy, or your own.
   */
  describe?: (error: unknown, base: ErrorDescription) => ErrorDescription
}

/** Sets how every datum-ui error display in the tree describes errors. */
export function ErrorDescriptionProvider({ children, apiGroupLabels, describe }: ErrorDescriptionProviderProps) {
  const value = useCallback<Describe>((error) => {
    const base = describeApiError(error, { apiGroupLabels })
    return describe ? describe(error, base) : base
  }, [apiGroupLabels, describe])
  return <ErrorDescriptionContext value={value}>{children}</ErrorDescriptionContext>
}

/** The tree's error describer: the provider's, or `describeApiError` with none. */
export function useDescribeError(): Describe {
  return use(ErrorDescriptionContext)
}
