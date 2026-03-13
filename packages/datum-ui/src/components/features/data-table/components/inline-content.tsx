'use client'

import type { InlineContentProps } from '../types'
import { useEffect, useId, useRef } from 'react'
import { useDataTableInlineContents } from '../hooks/use-selectors'

export function DataTableInlineContent<TData>({
  position,
  rowId,
  open,
  onClose,
  className,
  children,
}: InlineContentProps<TData>) {
  const id = useId()
  const { registerInlineContent, unregisterInlineContent } = useDataTableInlineContents<TData>()
  const initialRender = useRef(true)

  // Mount/unmount: register on mount, unregister on unmount
  useEffect(() => {
    registerInlineContent({
      id,
      position,
      rowId,
      open,
      onClose,
      className,
      render: children,
    })

    return () => {
      unregisterInlineContent(id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- mount/unmount only
  }, [id, registerInlineContent, unregisterInlineContent])

  // Prop sync: update registration when props change (skip initial render)
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false
      return
    }
    registerInlineContent({
      id,
      position,
      rowId,
      open,
      onClose,
      className,
      render: children,
    })
  }, [id, position, rowId, open, onClose, className, children, registerInlineContent])

  return null
}
