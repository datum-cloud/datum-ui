import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCopyToClipboard } from '../use-copy-to-clipboard'

// The hook lazily imports this module only when `withToast` is set. Mock it so
// we can make the toast side effect fail without touching the clipboard write.
const toastSuccess = vi.fn()
vi.mock('../../components/features/toast', () => ({
  get toast() {
    return { success: toastSuccess }
  },
}))

describe('useCopyToClipboard', () => {
  const writeText = vi.fn()

  beforeEach(() => {
    writeText.mockReset().mockResolvedValue(undefined)
    toastSuccess.mockReset()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('reports success after writeText resolves (no toast)', async () => {
    const { result } = renderHook(() => useCopyToClipboard())
    let returned: boolean | undefined
    await act(async () => {
      returned = await result.current[1]('hello')
    })
    expect(returned).toBe(true)
    expect(result.current[0]).toBe(true)
    expect(writeText).toHaveBeenCalledWith('hello')
  })

  it('still reports success when the toast succeeds', async () => {
    const { result } = renderHook(() => useCopyToClipboard())
    let returned: boolean | undefined
    await act(async () => {
      returned = await result.current[1]('hello', { withToast: true })
    })
    expect(returned).toBe(true)
    expect(toastSuccess).toHaveBeenCalledOnce()
  })

  it('does NOT report failure when toast.success throws after a successful copy', async () => {
    toastSuccess.mockImplementation(() => {
      throw new Error('sonner not installed')
    })
    const { result } = renderHook(() => useCopyToClipboard())
    let returned: boolean | undefined
    await act(async () => {
      returned = await result.current[1]('hello', { withToast: true })
    })
    // The copy already succeeded; a failing toast must not turn it into false.
    expect(returned).toBe(true)
    expect(result.current[0]).toBe(true)
    expect(writeText).toHaveBeenCalledWith('hello')
  })

  it('reports failure when the clipboard write itself rejects', async () => {
    writeText.mockRejectedValue(new Error('denied'))
    const { result } = renderHook(() => useCopyToClipboard())
    let returned: boolean | undefined
    await act(async () => {
      returned = await result.current[1]('hello')
    })
    expect(returned).toBe(false)
    expect(result.current[0]).toBe(false)
  })
})
