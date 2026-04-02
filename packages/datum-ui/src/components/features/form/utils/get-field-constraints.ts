import { z } from 'zod'
import { getObjectShape } from './zod-helpers'

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
  schema: z.ZodType,
): Record<string, FieldConstraint> {
  const shape = getObjectShape(schema)
  if (!shape)
    return {}

  const constraints: Record<string, FieldConstraint> = {}

  for (const [key, fieldSchema] of Object.entries(shape)) {
    constraints[key] = {
      required: isRequired(fieldSchema as z.ZodType),
    }
  }

  return constraints
}

/**
 * Determine if a Zod field type is required.
 * Optional, nullable, and default-wrapped types are not required.
 */
function isRequired(schema: z.ZodType): boolean {
  const { type } = schema.def

  if (type === 'optional' || type === 'nullable' || type === 'default') {
    return false
  }

  return true
}

/**
 * Extract field-level constraints from a single Zod field schema.
 * Used to extract constraints like min/max dates, array lengths, string patterns, etc.
 * for individual form fields.
 *
 * NOTE: Uses Zod v4.3.6 internal API (_zod.def) for constraint extraction.
 * This API may change in future Zod versions.
 */
export function getFieldConstraintsSingle(schema: z.ZodTypeAny): FieldConstraints {
  const constraints: FieldConstraints = {}

  // Unwrap optional/nullable/default schemas
  let unwrapped: z.ZodTypeAny = schema
  while (
    unwrapped instanceof z.ZodOptional
    || unwrapped instanceof z.ZodNullable
    || unwrapped instanceof z.ZodDefault
  ) {
    unwrapped = (unwrapped._def as any).innerType
  }

  // Date constraints
  // NOTE: Zod v4.3.6 stores check data in check._zod.def structure
  // Checks use 'greater_than' for min() and 'less_than' for max()
  if (unwrapped instanceof z.ZodDate) {
    const checks = unwrapped._def.checks || []
    for (const check of checks) {
      const checkDef = (check as any)._zod?.def
      if (checkDef) {
        if (checkDef.check === 'greater_than') {
          constraints.minDate = new Date(checkDef.value)
        }
        if (checkDef.check === 'less_than') {
          constraints.maxDate = new Date(checkDef.value)
        }
      }
    }
  }

  // Array constraints
  // NOTE: Zod v4.3.6 stores array length constraints in check._zod.def structure
  // Checks use 'min_length' and 'max_length' with 'minimum' and 'maximum' properties
  if (unwrapped instanceof z.ZodArray) {
    const checks = unwrapped._def.checks || []
    for (const check of checks) {
      const checkDef = (check as any)._zod?.def
      if (checkDef) {
        if (checkDef.check === 'min_length') {
          constraints.minItems = checkDef.minimum
        }
        if (checkDef.check === 'max_length') {
          constraints.maxItems = checkDef.maximum
        }
      }
    }
  }

  return constraints
}
