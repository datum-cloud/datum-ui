import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { getFieldConstraints, getFieldConstraintsSingle } from '../utils/get-field-constraints'

describe('getFieldConstraints', () => {
  it('marks required string fields', () => {
    const schema = z.object({ name: z.string() })
    const constraints = getFieldConstraints(schema)
    expect(constraints.name?.required).toBe(true)
  })

  it('marks optional string fields', () => {
    const schema = z.object({ name: z.string().optional() })
    const constraints = getFieldConstraints(schema)
    expect(constraints.name?.required).toBe(false)
  })

  it('marks nullable fields as not required', () => {
    const schema = z.object({ name: z.string().nullable() })
    const constraints = getFieldConstraints(schema)
    expect(constraints.name?.required).toBe(false)
  })

  it('marks fields with default values as not required', () => {
    const schema = z.object({ role: z.string().default('user') })
    const constraints = getFieldConstraints(schema)
    expect(constraints.role?.required).toBe(false)
  })

  it('handles mixed required and optional fields', () => {
    const schema = z.object({
      email: z.string().email(),
      nickname: z.string().optional(),
      age: z.number(),
    })
    const constraints = getFieldConstraints(schema)
    expect(constraints.email?.required).toBe(true)
    expect(constraints.nickname?.required).toBe(false)
    expect(constraints.age?.required).toBe(true)
  })

  it('returns empty object for non-object schemas', () => {
    const schema = z.string()
    const constraints = getFieldConstraints(schema)
    expect(constraints).toEqual({})
  })

  it('handles intersection schemas (from .and())', () => {
    const a = z.object({ name: z.string() })
    const b = z.object({ email: z.string().optional() })
    const schema = z.intersection(a, b)
    const constraints = getFieldConstraints(schema)
    expect(constraints.name?.required).toBe(true)
    expect(constraints.email?.required).toBe(false)
  })

  it('handles schemas with refinements (.refine/.superRefine)', () => {
    const schema = z.object({
      password: z.string().min(8),
      confirm: z.string(),
    }).refine(data => data.password === data.confirm, {
      message: 'Passwords must match',
    })
    const constraints = getFieldConstraints(schema)
    expect(constraints.password?.required).toBe(true)
    expect(constraints.confirm?.required).toBe(true)
  })

  it('handles schemas with .transform()', () => {
    const schema = z.object({
      age: z.string(),
    }).transform(data => ({ ...data, age: Number(data.age) }))
    const constraints = getFieldConstraints(schema)
    expect(constraints.age?.required).toBe(true)
  })
})

describe('getFieldConstraintsSingle - date constraints', () => {
  it('extracts minDate from z.date().min()', () => {
    const minDate = new Date('2024-01-01')
    const schema = z.date().min(minDate, 'Date must be after Jan 1, 2024')

    const constraints = getFieldConstraintsSingle(schema)

    expect(constraints.minDate).toEqual(minDate)
  })

  it('extracts maxDate from z.date().max()', () => {
    const maxDate = new Date('2024-12-31')
    const schema = z.date().max(maxDate, 'Date must be before Dec 31, 2024')

    const constraints = getFieldConstraintsSingle(schema)

    expect(constraints.maxDate).toEqual(maxDate)
  })

  it('extracts both min and max dates', () => {
    const minDate = new Date('2024-01-01')
    const maxDate = new Date('2024-12-31')
    const schema = z.date().min(minDate).max(maxDate)

    const constraints = getFieldConstraintsSingle(schema)

    expect(constraints.minDate).toEqual(minDate)
    expect(constraints.maxDate).toEqual(maxDate)
  })
})

describe('getFieldConstraintsSingle - array constraints', () => {
  it('extracts minItems from z.array().min()', () => {
    const schema = z.array(z.string()).min(2, 'Select at least 2 items')

    const constraints = getFieldConstraintsSingle(schema)

    expect(constraints.minItems).toBe(2)
  })

  it('extracts maxItems from z.array().max()', () => {
    const schema = z.array(z.string()).max(10, 'Select at most 10 items')

    const constraints = getFieldConstraintsSingle(schema)

    expect(constraints.maxItems).toBe(10)
  })

  it('extracts both min and max items', () => {
    const schema = z.array(z.string()).min(1).max(5)

    const constraints = getFieldConstraintsSingle(schema)

    expect(constraints.minItems).toBe(1)
    expect(constraints.maxItems).toBe(5)
  })
})
