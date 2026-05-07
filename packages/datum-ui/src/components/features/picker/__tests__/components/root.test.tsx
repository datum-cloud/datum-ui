import type { ReactNode } from 'react'
import { render } from '@testing-library/react'
import { useContext } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { PickerContext, usePickerContext } from '../../components/context'
import { Picker } from '../../components/root'

function PeekContext({ onContext }: { onContext: (ctx: unknown) => void }): ReactNode {
  const ctx = useContext(PickerContext)
  onContext(ctx)
  return null
}

describe('picker.Root', () => {
  it('renders children and provides context', () => {
    const onContext = vi.fn()
    render(
      <Picker.Root mode="date" value={null} onChange={vi.fn()}>
        <PeekContext onContext={onContext} />
      </Picker.Root>,
    )
    const ctx = onContext.mock.calls[0]?.[0] as { mode: string, state: { open: boolean } } | null
    expect(ctx).not.toBeNull()
    expect(ctx!.mode).toBe('date')
    expect(ctx!.state.open).toBe(false)
  })

  it('honors a custom `commit` prop', () => {
    const onContext = vi.fn()
    render(
      <Picker.Root mode="date" value={null} onChange={vi.fn()} commit="apply">
        <PeekContext onContext={onContext} />
      </Picker.Root>,
    )
    const ctx = onContext.mock.calls[0]?.[0] as { effectiveCommit: string } | null
    expect(ctx!.effectiveCommit).toBe('apply')
  })

  it('defaults `commit` to "apply" for range modes and "immediate" for single', () => {
    const single = vi.fn()
    render(
      <Picker.Root mode="date" value={null} onChange={vi.fn()}>
        <PeekContext onContext={single} />
      </Picker.Root>,
    )
    expect((single.mock.calls[0]?.[0] as { effectiveCommit: string }).effectiveCommit).toBe('immediate')

    const range = vi.fn()
    render(
      <Picker.Root mode="date-range" value={null} onChange={vi.fn()}>
        <PeekContext onContext={range} />
      </Picker.Root>,
    )
    expect((range.mock.calls[0]?.[0] as { effectiveCommit: string }).effectiveCommit).toBe('apply')
  })

  it('throws when a primitive is rendered outside Root', () => {
    function Consumer() {
      usePickerContext()
      return null
    }
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Consumer />)).toThrow(/<Picker.Root>/)
    spy.mockRestore()
  })
})
