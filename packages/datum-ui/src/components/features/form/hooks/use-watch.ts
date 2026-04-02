import { useAdapter } from '../adapter-context'

/**
 * Hook to watch a field's value reactively.
 * Delegates to the active adapter's useWatch implementation.
 *
 * @example
 * ```tsx
 * function ConditionalField() {
 *   const contactMethod = useWatch('contactMethod')
 *   if (contactMethod === 'email') {
 *     return <Form.Field name="email"><Form.Input type="email" /></Form.Field>
 *   }
 *   return null
 * }
 * ```
 */
export function useWatch<T = unknown>(name: string): T | undefined {
  const adapter = useAdapter()
  return adapter.useWatch(name) as T | undefined
}

/**
 * Hook to watch multiple fields at once.
 * Delegates to the active adapter's useWatchAll implementation.
 *
 * @example
 * ```tsx
 * function Summary() {
 *   const values = useWatchAll(['firstName', 'lastName', 'email'])
 *   return <div>Name: {values.firstName} {values.lastName}</div>
 * }
 * ```
 */
export function useWatchAll<T extends Record<string, unknown>>(names: string[]): Partial<T> {
  const adapter = useAdapter()
  return adapter.useWatchAll(names) as Partial<T>
}
