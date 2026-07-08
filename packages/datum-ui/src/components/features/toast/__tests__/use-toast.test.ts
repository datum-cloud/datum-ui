import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../toast', () => ({
  toast: {
    message: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}))

// Import after mock so the mock is active
// eslint-disable-next-line import/first
import { toast } from '../toast'
// eslint-disable-next-line import/first
import { useToast } from '../use-toast'

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('dispatches to the matching toast method for a known type', () => {
    renderHook(() =>
      useToast({ id: '1', type: 'success', title: 'Done', description: 'Saved' }),
    )

    vi.runAllTimers()
    expect(vi.mocked(toast.success)).toHaveBeenCalledWith('Done', { id: '1', description: 'Saved' })
  })

  it('does not throw and logs an error for an unknown type from server data', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() =>
      renderHook(() =>
        // Simulate untrusted deserialized payload with an out-of-union type.
        useToast({ id: '2', type: 'notice' as never, description: 'Hi' }),
      ),
    ).not.toThrow()

    vi.runAllTimers()
    expect(vi.mocked(toast.success)).not.toHaveBeenCalled()
    expect(vi.mocked(toast.error)).not.toHaveBeenCalled()
    expect(consoleError).toHaveBeenCalled()
    consoleError.mockRestore()
  })
})
