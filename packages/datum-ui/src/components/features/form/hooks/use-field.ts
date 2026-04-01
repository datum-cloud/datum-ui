import type { UseFieldReturn } from '../types'
import { useAdapter } from '../adapter-context'

/**
 * Hook to access and control a specific field.
 * Delegates to the active adapter's useField implementation.
 *
 * @example
 * ```tsx
 * function MyCustomInput({ name }: { name: string }) {
 *   const { field, control, meta, errors } = useField(name)
 *   return (
 *     <input
 *       name={meta.name}
 *       id={meta.id}
 *       value={control.value ?? ''}
 *       onChange={(e) => control.change(e.target.value)}
 *       onBlur={control.blur}
 *       aria-invalid={!!errors?.length}
 *     />
 *   )
 * }
 * ```
 */
export function useField(name: string): UseFieldReturn {
  const adapter = useAdapter()
  const fieldState = adapter.useField(name)

  return {
    field: fieldState,
    control: {
      value: fieldState.value,
      change: fieldState.change,
      blur: fieldState.blur,
      focus: fieldState.focus,
    },
    meta: {
      name: fieldState.name,
      id: fieldState.id,
      errors: fieldState.errors,
      required: fieldState.required,
      disabled: false,
    },
    errors: fieldState.errors,
  }
}
