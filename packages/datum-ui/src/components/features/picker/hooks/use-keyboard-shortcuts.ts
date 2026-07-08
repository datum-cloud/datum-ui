import type { RefObject } from 'react'
import type { PickerPreset } from '../types'
import { useEffect } from 'react'

interface UseKeyboardShortcutsArgs {
  /**
   * Picker root element. Retained for API compatibility; the listener is bound
   * on `document` (see below) so it also catches keys inside the portaled
   * popover content, which is not a DOM descendant of this element.
   */
  rootRef?: RefObject<HTMLElement | null>
  /** Available presets. Ones with `shortcut` defined are bound. */
  presets: readonly PickerPreset[]
  /** Called when a shortcut matches. */
  onSelect: (preset: PickerPreset) => void
  /** Disable the binding (e.g. when popover is closed). */
  enabled: boolean
}

/** True when the event target is a text-editable control we must not hijack. */
function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement))
    return false
  const tag = target.tagName
  return (
    tag === 'INPUT'
    || tag === 'TEXTAREA'
    || tag === 'SELECT'
    || target.isContentEditable
  )
}

/**
 * Bind preset keyboard shortcuts while the picker is open.
 *
 * The listener is attached to `document` rather than the picker root, because
 * the popover content is portaled to `document.body` and is therefore outside
 * the root's DOM subtree — a root-scoped listener never sees those keydowns
 * once focus moves into the popover (BUG-078).
 *
 * To keep the legacy footgun fixed (presets firing while the user types in an
 * input), keydowns originating from editable controls are ignored. Modifier
 * keys (Ctrl, Meta, Alt) are also ignored to avoid colliding with browser/OS
 * shortcuts.
 */
export function useKeyboardShortcuts({
  presets,
  onSelect,
  enabled,
}: UseKeyboardShortcutsArgs): void {
  useEffect(() => {
    if (!enabled)
      return

    function handler(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey)
        return
      if (isEditableTarget(e.target))
        return
      const matched = presets.find(p =>
        p.shortcut && p.shortcut.toLowerCase() === e.key.toLowerCase(),
      )
      if (matched) {
        e.preventDefault()
        onSelect(matched)
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [presets, onSelect, enabled])
}
