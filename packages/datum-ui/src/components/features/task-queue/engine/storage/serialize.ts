import type { TaskView } from '../../types'

/**
 * Strip a task down to its JSON-serializable fields before persisting.
 *
 * Drops the non-serializable members: the in-memory `_processor` reference and
 * the two fields that can hold React elements or functions — `icon`
 * (`ReactNode`) and `completionActions` (a `ButtonProps[]` or callback). Left in
 * place, a `ReactNode` icon sends `JSON.stringify` into circular-reference
 * territory and throws, aborting the whole persist. `_originalItems` is kept so
 * retry can resume against the full input set.
 */
export function toSerializableTask(task: TaskView): Omit<TaskView, 'icon' | 'completionActions' | '_processor'> {
  const { _processor, icon, completionActions, ...rest } = task
  void _processor
  void icon
  void completionActions
  return rest
}
