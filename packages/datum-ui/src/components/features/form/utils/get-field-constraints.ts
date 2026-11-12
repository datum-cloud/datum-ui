import type { z } from 'zod'
import { getObjectShape, unwrapSchema } from './zod-helpers'

export interface FieldConstraint {
  required: boolean
}

export interface FieldConstraints {
  // Existing constraints
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  multiple?: boolean

  // Date/time constraints
  minDate?: Date
  maxDate?: Date

  // Array constraints
  minItems?: number
  maxItems?: number
}

/**
 * Extract field-level constraints from a Zod schema.
 * Works with ZodObject, ZodIntersection (from .and()), and ZodPipe (from .transform()).
 * Used by both Conform and RHF adapters to determine required fields.
 */
export function getFieldConstraints(
  schema: z.core.$ZodType,
): Record<string, FieldConstraint> {
  const shape = getObjectShape(schema)
  if (!shape)
    return {}

  const constraints: Record<string, FieldConstraint> = {}

  for (const [key, fieldSchema] of Object.entries(shape)) {
    constraints[key] = {
      required: !unwrapSchema(fieldSchema).isOptional,
    }
  }

  return constraints
}

/**
 * Extract field-level constraints from a single Zod field schema: whether it
 * is required, min/max dates, array lengths and string lengths.
 *
 * Wrappers are peeled first (see `unwrapSchema`), so the constraints of
 * `z.date().min(x).transform(...)` or `z.string().max(5).optional()` are found.
 *
 * NOTE: Reads Zod 4 check defs (`check._zod.def`). `.min()` / `.max()` are
 * stored as `greater_than` / `less_than` on dates and as `min_length` /
 * `max_length` on arrays and strings.
 */
export function getFieldConstraintsSingle(schema: z.core.$ZodType): FieldConstraints {
  const unwrapped = unwrapSchema(schema)
  const { def } = unwrapped.schema._zod
  const constraints: FieldConstraints = { required: !unwrapped.isOptional }

  for (const check of def.checks ?? []) {
    const checkDef = (check as z.core.$ZodChecks)._zod.def

    if (def.type === 'date') {
      if (checkDef.check === 'greater_than')
        constraints.minDate = new Date(checkDef.value as Date)
      if (checkDef.check === 'less_than')
        constraints.maxDate = new Date(checkDef.value as Date)
    }

    if (def.type === 'array') {
      if (checkDef.check === 'min_length')
        constraints.minItems = checkDef.minimum
      if (checkDef.check === 'max_length')
        constraints.maxItems = checkDef.maximum
    }

    if (def.type === 'string') {
      if (checkDef.check === 'min_length')
        constraints.minLength = checkDef.minimum
      if (checkDef.check === 'max_length')
        constraints.maxLength = checkDef.maximum
    }
  }

  return constraints
}
