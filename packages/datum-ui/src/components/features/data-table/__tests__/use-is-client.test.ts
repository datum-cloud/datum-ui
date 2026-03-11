/// <reference types="@testing-library/jest-dom/vitest" />
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useIsClient } from '../hooks/use-is-client'

describe('useIsClient', () => {
  it('returns true after hydration in JSDOM', () => {
    const { result } = renderHook(() => useIsClient())
    expect(result.current).toBe(true)
  })
})
