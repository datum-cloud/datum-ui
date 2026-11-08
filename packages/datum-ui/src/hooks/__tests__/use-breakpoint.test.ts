import type { BreakpointTier } from '../use-breakpoint'
import { resetViewport, setViewport } from '@test/viewport'
import { act, renderHook } from '@testing-library/react'
import { createElement } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useBreakpoint } from '../use-breakpoint'

function Probe({ initial }: { initial?: BreakpointTier }) {
  return createElement('span', { 'data-testid': 'breakpoint' }, useBreakpoint(initial))
}

describe('useBreakpoint', () => {
  afterEach(() => {
    resetViewport()
  })

  it('returns "mobile" below 768px', () => {
    setViewport(500)
    const { result } = renderHook(() => useBreakpoint())
    expect(result.current).toBe('mobile')
  })

  it('returns "tablet" between 768px and 1023px', () => {
    setViewport(900)
    const { result } = renderHook(() => useBreakpoint())
    expect(result.current).toBe('tablet')
  })

  it('returns "desktop" at 1024px and above', () => {
    setViewport(1440)
    const { result } = renderHook(() => useBreakpoint())
    expect(result.current).toBe('desktop')
  })

  it('starts from the given initial breakpoint, then measures on mount', () => {
    setViewport(500)

    const renders: BreakpointTier[] = []
    const { result } = renderHook(() => {
      const breakpoint = useBreakpoint('tablet')
      renders.push(breakpoint)
      return breakpoint
    })

    expect(renders[0]).toBe('tablet')
    expect(result.current).toBe('mobile')
  })

  it('hydrates a desktop snapshot at mobile width without a mismatch', async () => {
    setViewport(1440)

    const serverHtml = renderToString(createElement(Probe))
    expect(serverHtml).toContain('desktop')

    const container = document.createElement('div')
    container.innerHTML = serverHtml
    document.body.appendChild(container)

    const recoverableErrors: unknown[] = []
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    setViewport(500)

    let root: ReturnType<typeof hydrateRoot> | undefined
    try {
      await act(async () => {
        root = hydrateRoot(container, createElement(Probe), {
          onRecoverableError: error => recoverableErrors.push(error),
        })
      })

      const hydrationErrors = consoleError.mock.calls.filter(args =>
        args.some(arg => typeof arg === 'string' && /hydrat/i.test(arg)),
      )

      expect(recoverableErrors).toEqual([])
      expect(hydrationErrors).toEqual([])
      expect(container.textContent).toBe('mobile')
    }
    finally {
      await act(async () => root?.unmount())
      consoleError.mockRestore()
      container.remove()
    }
  })
})
