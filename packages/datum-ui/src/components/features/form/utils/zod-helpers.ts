import type { z } from 'zod'

/**
 * Extract the shape from a ZodObject, ZodIntersection, or ZodPipe.
 * Uses Zod v4's `def.type` discriminant.
 *
 * In Zod v4:
 * - `.refine()` / `.superRefine()` on ZodObject return the same ZodObject (def.type = 'object')
 * - `.transform()` wraps in ZodPipe (def.type = 'pipe', with def.in / def.out)
 * - `.and()` creates ZodIntersection (def.type = 'intersection', with def.left / def.right)
 */
export function getObjectShape(
  schema: z.ZodType,
): Record<string, z.ZodType> | null {
  const { def } = schema

  if (def.type === 'object') {
    return (schema as z.ZodObject<any>).shape
  }

  if (def.type === 'intersection') {
    const intersectionDef = def as unknown as { left: z.ZodType, right: z.ZodType }
    const leftShape = getObjectShape(intersectionDef.left)
    const rightShape = getObjectShape(intersectionDef.right)
    return { ...(leftShape ?? {}), ...(rightShape ?? {}) }
  }

  // ZodPipe (from .transform()) — unwrap to the input schema
  if (def.type === 'pipe') {
    const pipeDef = def as unknown as { in: z.ZodType }
    return getObjectShape(pipeDef.in)
  }

  return null
}
