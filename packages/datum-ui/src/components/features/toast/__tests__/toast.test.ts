/// <reference types="@testing-library/jest-dom/vitest" />
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('sonner', () => ({
  toast: { custom: vi.fn(() => 'toast-id'), dismiss: vi.fn() },
}))

// Import after mock so the mock is active
// eslint-disable-next-line import/first
import { toast as sonnerToast } from 'sonner'
// eslint-disable-next-line import/first
import { toast } from '../toast'

describe('toast', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('exposes all 5 methods', () => {
    expect(typeof toast.message).toBe('function')
    expect(typeof toast.success).toBe('function')
    expect(typeof toast.error).toBe('function')
    expect(typeof toast.info).toBe('function')
    expect(typeof toast.warning).toBe('function')
  })

  it('calls sonner toast.custom when toast.success is called', () => {
    toast.success('Operation completed')
    expect(sonnerToast.custom).toHaveBeenCalledTimes(1)
  })

  it('calls sonner toast.custom when toast.error is called', () => {
    toast.error('Something went wrong')
    expect(sonnerToast.custom).toHaveBeenCalledTimes(1)
  })
})
