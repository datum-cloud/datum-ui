import type { z } from 'zod'

/**
 * Zod schema introspection for the form utilities.
 *
 * Everything here reads `schema._zod.def`, the introspection surface Zod 4
 * documents for library authors, and switches on `def.type`. Nothing uses
 * `instanceof`, so it keeps working when the consumer's zod (a peer
 * dependency, `>=4.6.6 <5`) resolves to a different copy than this package's.
 */

type AnySchema = z.core.$ZodType

/**
 * Narrow a schema to Zod's discriminated union of schema types, so switching
 * on `def.type` gives a typed def. This is the one cast the walkers need.
 */
function toKnownSchema(schema: AnySchema): z.core.$ZodTypes {
  return schema as z.core.$ZodTypes
}

export interface UnwrappedSchema {
  /** The innermost schema, with every wrapper peeled off. */
  readonly schema: z.core.$ZodTypes
  /** True when a wrapper lets the field be left empty (optional, nullable, default, catch). */
  readonly isOptional: boolean
  /** True when a `.default()` or `.prefault()` wrapper supplies a value. */
  readonly hasDefault: boolean
  /** The outermost default value. Only meaningful when `hasDefault` is true. */
  readonly defaultValue: unknown
}

/**
 * Peel the wrappers off a Zod schema and report what they said on the way in.
 *
 * Walks optional, nullable, default, prefault, catch, nonoptional, readonly
 * and pipe wrappers. A pipe comes from `.transform()` / `.pipe()` (the input
 * side holds the field's schema) or from `z.preprocess()` (the input side is a
 * bare transform, so the output side holds it).
 *
 * The outermost wrapper decides optionality, matching how Zod parses:
 * `z.string().optional().nonoptional()` is required again.
 */
export function unwrapSchema(schema: AnySchema): UnwrappedSchema {
  let current = toKnownSchema(schema)
  let isOptional: boolean | undefined
  let hasDefault = false
  let defaultValue: unknown

  while (true) {
    const { def } = current._zod

    switch (def.type) {
      case 'optional':
      case 'nullable':
      case 'catch':
        isOptional ??= true
        current = toKnownSchema(def.innerType)
        break
      case 'default':
      case 'prefault':
        isOptional ??= true
        if (!hasDefault) {
          hasDefault = true
          defaultValue = def.defaultValue
        }
        current = toKnownSchema(def.innerType)
        break
      case 'nonoptional':
        isOptional ??= false
        current = toKnownSchema(def.innerType)
        break
      case 'readonly':
        current = toKnownSchema(def.innerType)
        break
      case 'pipe':
        current = toKnownSchema(def.in._zod.def.type === 'transform' ? def.out : def.in)
        break
      default:
        return { schema: current, isOptional: isOptional ?? false, hasDefault, defaultValue }
    }
  }
}

/**
 * Extract the field shape from an object schema, looking through wrappers and
 * intersections.
 *
 * In Zod v4:
 * - `.refine()` / `.superRefine()` on ZodObject return the same ZodObject (def.type = 'object')
 * - `.transform()` wraps in ZodPipe (def.type = 'pipe', with def.in / def.out)
 * - `.and()` creates ZodIntersection (def.type = 'intersection', with def.left / def.right)
 */
export function getObjectShape(
  schema: AnySchema,
): Record<string, AnySchema> | null {
  const { def } = unwrapSchema(schema).schema._zod

  if (def.type === 'object') {
    return def.shape
  }

  if (def.type === 'intersection') {
    const leftShape = getObjectShape(def.left)
    const rightShape = getObjectShape(def.right)
    return { ...(leftShape ?? {}), ...(rightShape ?? {}) }
  }

  return null
}
