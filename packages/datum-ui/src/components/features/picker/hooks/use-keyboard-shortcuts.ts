import type { RefObject } from 'react'
import type { PickerPreset } from '../types'
import { useEffect } from 'react'

interface UseKeyboardShortcutsArgs {
  /** Element on which the keydown listener is attached. */
  rootRef: RefObject<HTMLElement | null>
  /** Available presets. Ones with `shortcut` defined are bound. */
  presets: readonly PickerPreset[]
  /** Called when a shortcut matches. */
  onSelect: (preset: PickerPreset) => void
  /** Disable the binding (e.g. when popover is closed). */
  enabled: boolean
}

/**
 * Bind preset keyboard shortcuts to a scoped root element (NOT document).
 *
 * Why root-scoped: binding on `document` causes presets to fire when the
 * user is typing in any input on the page — a well-known bug in the legacy
 * TimeRangePicker. Scoping to the picker's root element fixes it.
 *
 * Modifier keys (Ctrl, Meta, Alt) are ignored to avoid colliding with
 * browser/OS shortcuts.
 */
export function useKeyboardShortcuts({
  rootRef,
  presets,
  onSelect,
  enabled,
}: UseKeyboardShortcutsArgs): void {
  useEffect(() => {
    if (!enabled)
      return
    const root = rootRef.current
    if (!root)
      return

    function handler(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey)
        return
      const matched = presets.find(p =>
        p.shortcut && p.shortcut.toLowerCase() === e.key.toLowerCase(),
      )
      if (matched) {
        e.preventDefault()
        onSelect(matched)
      }
    }

    root.addEventListener('keydown', handler)
    return () => root.removeEventListener('keydown', handler)
  }, [rootRef, presets, onSelect, enabled])
}
