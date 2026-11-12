import type { z } from 'zod'
import { getObjectShape, unwrapSchema } from './zod-helpers'

/**
 * Derive default values from a Zod schema that match what React Hook Form's
 * `useController` will produce when fields register.
 *
 * This is critical for RHF's `isDirty` tracking: RHF compares current values
 * against `_defaultValues`. Without explicit defaults, RHF uses `{}` as the
 * baseline, so when `useController` registers fields (e.g. `username: ''`),
 * the form is immediately considered dirty.
 *
 * By passing these schema-derived defaults to `useForm({ defaultValues })`,
 * the baseline matches the registered values and `isDirty` starts as `false`.
 *
 * Maps Zod field types to their `useController` registration values:
 * - string -> `''`
 * - number -> `undefined`
 * - boolean -> `false`
 * - array -> `[]`
 * - object -> `{}` (recursive)
 * - optional/nullable/transform wrappers -> unwrap and derive inner default
 * - `.default()` -> use the provided default value
 */
export function getSchemaDefaults(
  schema: z.core.$ZodType,
): Record<string, unknown> {
  const shape = getObjectShape(schema)
  if (!shape)
    return {}

  const defaults: Record<string, unknown> = {}

  for (const [key, fieldSchema] of Object.entries(shape)) {
    defaults[key] = getFieldDefault(fieldSchema)
  }

  return defaults
}

/**
 * Get the default value for a Zod field type that matches what RHF's
 * `useController` will produce when registering the field.
 *
 * Unwraps wrappers (see `unwrapSchema`) to find the inner type, then returns
 * the natural "empty" value for that type.
 */
function getFieldDefault(schema: z.core.$ZodType): unknown {
  // Peel optional/nullable/default/pipe wrappers. `.default(value)` wins.
  const unwrapped = unwrapSchema(schema)
  if (unwrapped.hasDefault)
    return unwrapped.defaultValue

  const { type } = unwrapped.schema._zod.def

  // Leaf types — match what useController produces on registration
  if (type === 'string')
    return ''
  if (type === 'number' || type === 'bigint' || type === 'nan')
    return undefined
  if (type === 'boolean')
    return false
  if (type === 'array')
    return []
  if (type === 'object')
    return getSchemaDefaults(unwrapped.schema)

  // Everything else (enum, literal, union, etc.) — undefined
  return undefined
}
