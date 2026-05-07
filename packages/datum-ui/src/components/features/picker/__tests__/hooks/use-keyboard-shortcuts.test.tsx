import type { PickerPreset } from '../../types'
import { fireEvent, render } from '@testing-library/react'
import { useRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useKeyboardShortcuts } from '../../hooks/use-keyboard-shortcuts'

function Harness({ presets, onSelect, enabled }: {
  presets: PickerPreset[]
  onSelect: (p: PickerPreset) => void
  enabled: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  useKeyboardShortcuts({ rootRef: ref, presets, onSelect, enabled })
  return (
    <div ref={ref} data-testid="root" tabIndex={-1}>
      <input data-testid="input" />
    </div>
  )
}

describe('useKeyboardShortcuts', () => {
  it('fires onSelect when the matching shortcut is pressed inside the root', () => {
    const onSelect = vi.fn()
    const presets: PickerPreset[] = [{
      key: 'today',
      label: 'Today',
      shortcut: 'D',
      getRange: () => ({ from: new Date(), to: new Date() }),
    }]
    const { getByTestId } = render(
      <Harness presets={presets} onSelect={onSelect} enabled={true} />,
    )
    fireEvent.keyDown(getByTestId('root'), { key: 'd' })
    expect(onSelect).toHaveBeenCalledWith(presets[0])
  })

  it('matches shortcuts case-insensitively', () => {
    const onSelect = vi.fn()
    const presets: PickerPreset[] = [{
      key: 'today',
      label: 'Today',
      shortcut: 'D',
      getRange: () => ({ from: new Date(), to: new Date() }),
    }]
    const { getByTestId } = render(
      <Harness presets={presets} onSelect={onSelect} enabled={true} />,
    )
    fireEvent.keyDown(getByTestId('root'), { key: 'D' })
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('does not fire when disabled', () => {
    const onSelect = vi.fn()
    const presets: PickerPreset[] = [{
      key: 'today',
      label: 'Today',
      shortcut: 'D',
      getRange: () => ({ from: new Date(), to: new Date() }),
    }]
    const { getByTestId } = render(
      <Harness presets={presets} onSelect={onSelect} enabled={false} />,
    )
    fireEvent.keyDown(getByTestId('root'), { key: 'd' })
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('does not fire for keys with modifiers', () => {
    const onSelect = vi.fn()
    const presets: PickerPreset[] = [{
      key: 'today',
      label: 'Today',
      shortcut: 'D',
      getRange: () => ({ from: new Date(), to: new Date() }),
    }]
    const { getByTestId } = render(
      <Harness presets={presets} onSelect={onSelect} enabled={true} />,
    )
    fireEvent.keyDown(getByTestId('root'), { key: 'd', ctrlKey: true })
    fireEvent.keyDown(getByTestId('root'), { key: 'd', metaKey: true })
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('does not bind on document — keypresses outside the root are ignored', () => {
    const onSelect = vi.fn()
    const presets: PickerPreset[] = [{
      key: 'today',
      label: 'Today',
      shortcut: 'D',
      getRange: () => ({ from: new Date(), to: new Date() }),
    }]
    render(<Harness presets={presets} onSelect={onSelect} enabled={true} />)
    // Fire on document body (outside the root)
    fireEvent.keyDown(document.body, { key: 'd' })
    expect(onSelect).not.toHaveBeenCalled()
  })
})
