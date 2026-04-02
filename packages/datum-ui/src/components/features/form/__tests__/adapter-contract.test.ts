import type {
  NormalizedFieldArray,
  NormalizedFieldMeta,
  NormalizedFieldState,
  NormalizedFormInstance,
} from '../adapter-types'
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useAdapter } from '../adapter-context'

describe('adapter contract types', () => {
  it('normalizedFieldMeta has required shape', () => {
    const meta: NormalizedFieldMeta = {
      id: 'field-1',
      errors: [],
      required: false,
      isDirty: false,
      isTouched: false,
    }
    expect(meta.id).toBe('field-1')
    expect(meta.errors).toEqual([])
    expect(meta.required).toBe(false)
  })

  it('normalizedFieldState extends NormalizedFieldMeta', () => {
    const state: NormalizedFieldState = {
      id: 'field-1',
      name: 'email',
      errors: [],
      required: true,
      isDirty: false,
      isTouched: false,
      value: 'test@example.com',
      change: () => {},
      blur: () => {},
      focus: () => {},
    }
    expect(state.name).toBe('email')
    expect(state.value).toBe('test@example.com')
    // inputProps is optional
    expect(state.inputProps).toBeUndefined()
  })

  it('normalizedFieldState supports inputProps for uncontrolled mode', () => {
    const state: NormalizedFieldState = {
      id: 'field-1',
      name: 'email',
      errors: [],
      required: true,
      isDirty: false,
      isTouched: false,
      value: 'test@example.com',
      change: () => {},
      blur: () => {},
      focus: () => {},
      inputProps: { name: 'email', id: 'field-1', type: 'email', defaultValue: 'test@example.com' },
    }
    expect(state.inputProps).toBeDefined()
    expect(state.inputProps!.type).toBe('email')
  })

  it('normalizedFieldArray has required shape', () => {
    const arr: NormalizedFieldArray = {
      items: [{ id: '1', key: 'k1', name: 'members[0]' }],
      append: () => {},
      remove: () => {},
      move: () => {},
    }
    expect(arr.items).toHaveLength(1)
  })

  it('normalizedFormInstance has required shape', () => {
    const instance: NormalizedFormInstance = {
      id: 'form-1',
      fields: { email: { id: 'email-id', errors: [], required: true, isDirty: false, isTouched: false } },
      formProps: { id: 'form-1', onSubmit: () => {}, noValidate: true },
      formState: {
        isDirty: false,
        isValid: true,
        isSubmitted: false,
        submitCount: 0,
        dirtyFields: {},
        touchedFields: {},
      },
      submit: () => {},
      reset: () => {},
      getValues: () => ({}),
      touchedFields: [],
      markFieldTouched: () => {},
      markAllFieldsTouched: () => {},
      raw: null,
    }
    expect(instance.id).toBe('form-1')
    expect(instance.fields.email?.required).toBe(true)
  })

  it('conformAdapter satisfies FormAdapter interface', async () => {
    const { conformAdapter } = await import('../adapters/conform/conform-adapter')
    expect(typeof conformAdapter.name).toBe('string')
    expect(typeof conformAdapter.useCreateForm).toBe('function')
    expect(typeof conformAdapter.useField).toBe('function')
    expect(typeof conformAdapter.useWatch).toBe('function')
    expect(typeof conformAdapter.useWatchAll).toBe('function')
    expect(typeof conformAdapter.useFieldArray).toBe('function')
    expect(typeof conformAdapter.FormProvider).toBe('function')
  })

  it('rhfAdapter satisfies FormAdapter interface', async () => {
    const { rhfAdapter } = await import('../adapters/rhf/rhf-adapter')
    expect(typeof rhfAdapter.name).toBe('string')
    expect(typeof rhfAdapter.useCreateForm).toBe('function')
    expect(typeof rhfAdapter.useField).toBe('function')
    expect(typeof rhfAdapter.useWatch).toBe('function')
    expect(typeof rhfAdapter.useWatchAll).toBe('function')
    expect(typeof rhfAdapter.useFieldArray).toBe('function')
    expect(typeof rhfAdapter.FormProvider).toBe('function')
  })
})

describe('useAdapter', () => {
  it('throws descriptive error when no adapter is provided', () => {
    expect(() => {
      renderHook(() => useAdapter())
    }).toThrow('No form adapter found')
  })

  it('error message includes import instructions', () => {
    try {
      renderHook(() => useAdapter())
    }
    catch (error: any) {
      expect(error.message).toContain('ConformAdapter')
      expect(error.message).toContain('RHFAdapter')
      expect(error.message).toContain('@datum-cloud/datum-ui/form/adapters/conform')
    }
  })
})
