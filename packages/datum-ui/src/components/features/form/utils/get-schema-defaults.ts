import type { z } from 'zod'
import { getObjectShape } from './zod-helpers'

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
 * - optional/nullable wrappers -> unwrap and derive inner default
 * - `.default()` -> use the provided default value
 */
export function getSchemaDefaults(
  schema: z.ZodType,
): Record<string, unknown> {
  const shape = getObjectShape(schema)
  if (!shape)
    return {}

  const defaults: Record<string, unknown> = {}

  for (const [key, fieldSchema] of Object.entries(shape)) {
    defaults[key] = getFieldDefault(fieldSchema as z.ZodType)
  }

  return defaults
}

/**
 * Get the default value for a Zod field type that matches what RHF's
 * `useController` will produce when registering the field.
 *
 * Unwraps optional/nullable/default wrappers to find the inner type,
 * then returns the natural "empty" value for that type.
 */
function getFieldDefault(schema: z.ZodType): unknown {
  const { type } = schema.def

  // `.default(value)` — use the provided default
  if (type === 'default') {
    const defaultDef = schema.def as unknown as { defaultValue: unknown }
    return defaultDef.defaultValue
  }

  // Wrappers: unwrap to find inner type
  if (type === 'optional' || type === 'nullable') {
    const innerDef = schema.def as unknown as { innerType: z.ZodType }
    return getFieldDefault(innerDef.innerType)
  }

  // `.pipe()` (from `.transform()` in Zod v4)
  if (type === 'pipe') {
    const pipeDef = schema.def as unknown as { in: z.ZodType }
    return getFieldDefault(pipeDef.in)
  }

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
    return getSchemaDefaults(schema)

  // Everything else (enum, literal, union, etc.) — undefined
  return undefined
}
