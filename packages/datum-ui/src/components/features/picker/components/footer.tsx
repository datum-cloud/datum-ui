import type { ReactNode } from 'react'
import { cn } from '../../../../utils/cn'
import { Button } from '../../../base/button'
import { usePickerContext } from './context'

interface PickerFooterProps {
  children: ReactNode
  className?: string
}

export function PickerFooter({ children, className }: PickerFooterProps) {
  return (
    <div className={cn('flex items-center justify-end gap-2', className)}>
      {children}
    </div>
  )
}
PickerFooter.displayName = 'Picker.Footer'

export function PickerApply({ children = 'Apply' }: { children?: ReactNode }) {
  const { state, actions } = usePickerContext()
  // Block apply when nothing's been picked. Range modes only set pendingValue
  // once both ends are chosen, so this naturally enforces complete input.
  const disabled = state.pendingValue === null || state.pendingValue === undefined
  return (
    <Button type="primary" theme="solid" size="xs" disabled={disabled} onClick={actions.apply}>
      {children}
    </Button>
  )
}
PickerApply.displayName = 'Picker.Apply'

export function PickerReset({ children = 'Reset' }: { children?: ReactNode }) {
  const { actions } = usePickerContext()
  return (
    <Button type="quaternary" theme="outline" size="xs" onClick={actions.reset}>
      {children}
    </Button>
  )
}
PickerReset.displayName = 'Picker.Reset'

export function PickerCancel({
  children = 'Cancel',
}: {
  children?: ReactNode
}) {
  const { actions } = usePickerContext()
  return (
    <Button
      type="quaternary"
      theme="borderless"
      size="xs"
      onClick={actions.cancel}
    >
      {children}
    </Button>
  )
}
PickerCancel.displayName = 'Picker.Cancel'

export function PickerClear({ children = 'Clear' }: { children?: ReactNode }) {
  const { actions } = usePickerContext()
  return (
    <Button type="primary" theme="borderless" size="xs" onClick={actions.clear}>
      {children}
    </Button>
  )
}
PickerClear.displayName = 'Picker.Clear'
