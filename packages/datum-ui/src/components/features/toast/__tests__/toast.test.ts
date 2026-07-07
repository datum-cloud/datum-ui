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

  it('forwards action to the rendered headless toast and dismisses after it runs', () => {
    const onClick = vi.fn()
    toast.error('Failed', { action: { label: 'Retry', onClick } })

    const custom = vi.mocked(sonnerToast.custom)
    const render = custom.mock.calls[0]![0]
    const element = render('toast-id') as { props: { action: { label: unknown, onClick: () => void } } }

    expect(element.props.action.label).toBe('Retry')
    element.props.action.onClick()
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(sonnerToast.dismiss).toHaveBeenCalledWith('toast-id')
  })

  it('does not forward action/cancel as raw sonner options', () => {
    toast.success('Saved', { action: { label: 'Undo', onClick: vi.fn() } })
    const custom = vi.mocked(sonnerToast.custom)
    const options = custom.mock.calls[0]![1]
    expect(options).not.toHaveProperty('action')
    expect(options).not.toHaveProperty('cancel')
  })
})
