import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { getSchemaDefaults } from '../utils/get-schema-defaults'

describe('getSchemaDefaults', () => {
  it('returns empty string for required string fields', () => {
    const schema = z.object({ name: z.string() })
    expect(getSchemaDefaults(schema)).toEqual({ name: '' })
  })

  it('returns empty string for optional string fields (unwraps optional)', () => {
    const schema = z.object({ bio: z.string().optional() })
    expect(getSchemaDefaults(schema)).toEqual({ bio: '' })
  })

  it('returns false for boolean fields', () => {
    const schema = z.object({ agree: z.boolean() })
    expect(getSchemaDefaults(schema)).toEqual({ agree: false })
  })

  it('returns false for optional boolean fields', () => {
    const schema = z.object({ newsletter: z.boolean().optional() })
    expect(getSchemaDefaults(schema)).toEqual({ newsletter: false })
  })

  it('returns empty array for array fields', () => {
    const schema = z.object({ tags: z.array(z.string()) })
    expect(getSchemaDefaults(schema)).toEqual({ tags: [] })
  })

  it('returns undefined for number fields', () => {
    const schema = z.object({ age: z.number() })
    expect(getSchemaDefaults(schema)).toEqual({ age: undefined })
  })

  it('handles mixed field types', () => {
    const schema = z.object({
      name: z.string(),
      email: z.string().email(),
      age: z.number().optional(),
      agree: z.boolean(),
      tags: z.array(z.string()),
    })
    expect(getSchemaDefaults(schema)).toEqual({
      name: '',
      email: '',
      age: undefined,
      agree: false,
      tags: [],
    })
  })

  it('uses .default() value when provided', () => {
    const schema = z.object({
      role: z.string().default('user'),
      active: z.boolean().default(true),
    })
    expect(getSchemaDefaults(schema)).toEqual({
      role: 'user',
      active: true,
    })
  })

  it('handles nullable fields (unwraps to inner type)', () => {
    const schema = z.object({ name: z.string().nullable() })
    expect(getSchemaDefaults(schema)).toEqual({ name: '' })
  })

  it('handles nested object fields', () => {
    const schema = z.object({
      address: z.object({
        street: z.string(),
        city: z.string(),
      }),
    })
    expect(getSchemaDefaults(schema)).toEqual({
      address: { street: '', city: '' },
    })
  })

  it('returns empty object for non-object schemas', () => {
    const schema = z.string()
    expect(getSchemaDefaults(schema)).toEqual({})
  })

  it('handles intersection schemas', () => {
    const schemaA = z.object({ name: z.string() })
    const schemaB = z.object({ age: z.number() })
    const merged = schemaA.and(schemaB)
    expect(getSchemaDefaults(merged)).toEqual({ name: '', age: undefined })
  })
})
