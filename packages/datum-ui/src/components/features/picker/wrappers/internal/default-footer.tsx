import { PickerApply, PickerCancel, PickerFooter, PickerReset } from '../../components/footer'

/**
 * The standard Cancel / Reset / Apply footer used by every wrapper.
 * `Picker.Content` decides whether to render it - desktop popover renders
 * it only when `commit === 'apply'`; mobile sheet always renders it.
 */
export function DefaultFooter() {
  return (
    <PickerFooter>
      <PickerCancel />
      <PickerReset />
      <PickerApply />
    </PickerFooter>
  )
}
