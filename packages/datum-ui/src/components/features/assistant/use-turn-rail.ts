import type { UIMessage } from 'ai'
import type { RefObject } from 'react'
import type { Turn } from './types'
import { isTextUIPart } from 'ai'
import { useCallback, useMemo, useRef, useState } from 'react'

/**
 * Tracks conversation "turns" (submitted prompts) for the right-edge rail:
 * derives the turn list, follows which turn is in view as you scroll, and
 * scrolls a chosen turn to the top. Owns a node ref to the scroll container,
 * composed with the caller's own container ref callback.
 */
export function useTurnRail(
  messages: UIMessage[],
  containerRef: (node: HTMLDivElement | null) => void,
  userScrolledUpRef: RefObject<boolean>,
) {
  const [activeTurn, setActiveTurn] = useState<string | null>(null)
  const scrollElRef = useRef<HTMLDivElement | null>(null)
  // While a click-to-jump is animating, ignore scroll-position tracking so the
  // auto-scroll observer can't yank the view back to the bottom mid-jump.
  const programmaticUntilRef = useRef(0)

  const turns = useMemo<Turn[]>(
    () =>
      messages
        .filter(m => m.role === 'user')
        .map(m => ({ id: m.id, text: m.parts.find(isTextUIPart)?.text ?? '' })),
    [messages],
  )

  // Default to the newest turn; a scroll refines it to whatever's in view.
  const activeTurnId = activeTurn ?? turns.at(-1)?.id ?? null

  const setScrollEl = useCallback(
    (node: HTMLDivElement | null) => {
      scrollElRef.current = node
      containerRef(node)
    },
    [containerRef],
  )

  const refineActiveTurn = (el: HTMLDivElement) => {
    // A turn near the end can't scroll to the top (nothing below it), so when
    // we're at the bottom just mark the last turn active.
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 8) {
      const last = turns.at(-1)?.id
      if (last)
        setActiveTurn(last)
      return
    }
    const cTop = el.getBoundingClientRect().top
    let active: string | null = null
    el.querySelectorAll<HTMLElement>('[data-turn-id]').forEach((t) => {
      if (t.getBoundingClientRect().top - cTop <= 120)
        active = t.dataset.turnId ?? null
    })
    if (active)
      setActiveTurn(active)
  }

  /** Handle a scroll event. Returns whether the user is scrolled up (for the button). */
  const handleScroll = (el: HTMLDivElement): boolean => {
    const scrolledUp = el.scrollHeight - el.scrollTop - el.clientHeight > 50
    if (Date.now() < programmaticUntilRef.current) {
      // Mid-jump: keep auto-scroll suppressed and don't override the active turn
      // set by scrollToTurn.
      userScrolledUpRef.current = true
      return scrolledUp
    }
    userScrolledUpRef.current = scrolledUp
    refineActiveTurn(el)
    return scrolledUp
  }

  const scrollToTurn = (id: string) => {
    const container = scrollElRef.current
    const target = container?.querySelector<HTMLElement>(`[data-turn-id="${id}"]`)
    if (!container || !target)
      return
    const top
      = target.getBoundingClientRect().top
        - container.getBoundingClientRect().top
        + container.scrollTop
    programmaticUntilRef.current = Date.now() + 700
    userScrolledUpRef.current = true
    setActiveTurn(id)
    container.scrollTo({ top: Math.max(0, top - 16), behavior: 'smooth' })
  }

  return { turns, activeTurnId, setScrollEl, handleScroll, scrollToTurn }
}
