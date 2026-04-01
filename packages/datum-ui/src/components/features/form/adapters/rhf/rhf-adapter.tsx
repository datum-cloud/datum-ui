import type {
  CreateFormProps,
  FormAdapter,
  NormalizedFieldArray,
  NormalizedFieldMeta,
  NormalizedFieldState,
  NormalizedFormInstance,
  NormalizedFormState,
} from '../../adapter-types'
import { zodResolver } from '@hookform/resolvers/zod'
import * as React from 'react'
import {
  FormProvider as RHFFormProvider,
  useController,
  useForm,
  useFieldArray as useRHFFieldArray,
  useFormContext as useRHFFormContext,
  useWatch as useRHFWatch,
} from 'react-hook-form'
import { useDisplayTouched } from '../../hooks/use-display-touched'
import { getFieldConstraints } from '../../utils/get-field-constraints'
import { getSchemaDefaults } from '../../utils/get-schema-defaults'

const RHFFormIdContext = React.createContext<string>('form')

// ============================================================================
// Hook Implementations
// ============================================================================

/** Create a React Hook Form instance and normalize it to the adapter interface. */
function useRHFCreateForm(props: CreateFormProps): NormalizedFormInstance {
  const { schema, defaultValues, mode, id, onSubmit, formRef } = props

  // Always provide defaultValues to RHF so isDirty tracking works correctly.
  // Without explicit defaults, RHF uses `{}` as the baseline, making isDirty
  // true as soon as useController registers fields (e.g. username: '').
  // We derive schema-based defaults that match useController registration values,
  // then merge with any consumer-provided defaults.
  const schemaDefaults = React.useMemo(() => getSchemaDefaults(schema), [schema])
  const mergedDefaults = React.useMemo(
    () => ({ ...schemaDefaults, ...defaultValues }),
    [schemaDefaults, defaultValues],
  )

  const form = useForm({
    resolver: zodResolver(schema as any),
    defaultValues: mergedDefaults as Record<string, any>,
    mode, // Honour the caller's validation mode (onBlur, onChange, onSubmit)
    reValidateMode: 'onChange', // After first validation, re-validate on change for quick error clearing
  })

  // Destructure formState properties to subscribe to RHF's Proxy
  const {
    errors,
    isDirty,
    isValid,
    dirtyFields,
    touchedFields,
  } = form.formState

  const constraints = React.useMemo(
    () => getFieldConstraints(schema),
    [schema],
  )

  // Store the onSubmit handler for use in formProps
  const onSubmitRef = React.useRef(onSubmit)
  onSubmitRef.current = onSubmit

  const normalizedFields = React.useMemo(() => {
    const result: Record<string, NormalizedFieldMeta> = {}
    for (const [key, constraint] of Object.entries(constraints)) {
      const fieldError = errors[key]
      result[key] = {
        id: `${id ?? 'form'}-${key}`,
        errors: fieldError?.message ? [String(fieldError.message)] : [],
        required: constraint.required,
        isDirty: Boolean((dirtyFields as Record<string, unknown>)[key]),
        isTouched: Boolean((touchedFields as Record<string, unknown>)[key]),
      }
    }
    return result
  }, [constraints, errors, id, dirtyFields, touchedFields])

  const formState: NormalizedFormState = React.useMemo(() => ({
    isDirty,
    isValid,
    isSubmitted: false,
    submitCount: 0,
    dirtyFields: Object.fromEntries(
      Object.entries(dirtyFields).map(([k, v]) => [k, Boolean(v)]),
    ),
    touchedFields: Object.fromEntries(
      Object.entries(touchedFields).map(([k, v]) => [k, Boolean(v)]),
    ),
  }), [isDirty, isValid, dirtyFields, touchedFields])

  const handleSubmit = React.useMemo(
    () => form.handleSubmit((data) => {
      onSubmitRef.current?.(data as Record<string, unknown>)
    }),
    [form],
  )

  const formProps = React.useMemo(
    () => ({
      id,
      onSubmit: handleSubmit,
      noValidate: true,
    }),
    [id, handleSubmit],
  )

  // Display-level touched tracking (shared across adapters)
  const { displayTouchedFields, markFieldTouched, markAllFieldsTouched } = useDisplayTouched(schema)

  return React.useMemo(() => ({
    id: id ?? 'form',
    fields: normalizedFields,
    formProps,
    formState,
    submit: () => formRef?.current?.requestSubmit(),
    reset: () => form.reset(),
    getValues: () => form.getValues(),
    touchedFields: displayTouchedFields,
    markFieldTouched,
    markAllFieldsTouched,
    raw: form,
  }), [id, normalizedFields, formProps, formState, form, formRef, displayTouchedFields, markFieldTouched, markAllFieldsTouched])
}

/** Resolve a field by name and return its normalized state. */
function useRHFField(name: string): NormalizedFieldState {
  const form = useRHFFormContext()
  const formId = React.use(RHFFormIdContext)
  const { field, fieldState } = useController({ name, control: form.control })

  return React.useMemo(() => ({
    name: field.name,
    id: `${formId}-${name}`,
    errors: fieldState.error?.message ? [String(fieldState.error.message)] : [],
    required: false, // Will be overridden by Form.Field from NormalizedFormInstance.fields
    isDirty: fieldState.isDirty,
    isTouched: fieldState.isTouched,
    value: field.value,
    change: (value: unknown) => field.onChange(value),
    blur: () => field.onBlur(),
    focus: () => form.setFocus(name),
  }), [field, fieldState, name, formId, form])
}

/** Watch a single field's value reactively. */
function useRHFWatchHook(name: string): unknown {
  const form = useRHFFormContext()
  return useRHFWatch({ name, control: form.control })
}

/** Watch multiple fields' values reactively. */
function useRHFWatchAllHook(names: string[]): Record<string, unknown> {
  const form = useRHFFormContext()
  const values = useRHFWatch({ name: names, control: form.control })
  const namesKey = names.join(',')

  return React.useMemo(() => {
    const result: Record<string, unknown> = {}
    names.forEach((n, index) => {
      result[n] = (values as any[])[index]
    })
    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namesKey, values])
}

/** Get field array helpers for a given array field name. */
function useRHFFieldArrayHook(name: string): NormalizedFieldArray {
  const form = useRHFFormContext()
  const { fields, append, remove, move } = useRHFFieldArray({
    name,
    control: form.control,
  })

  const items = React.useMemo(
    () => fields.map((field, index) => ({
      id: field.id,
      key: field.id,
      name: `${name}.${index}`,
    })),
    [fields, name],
  )

  const normalizedAppend = React.useCallback(
    (defaultValue?: Record<string, unknown>) => {
      append(defaultValue ?? {})
    },
    [append],
  )

  return { items, append: normalizedAppend, remove, move }
}

// ============================================================================
// RHF FormProvider Wrapper
// ============================================================================

/**
 * Wraps children in React Hook Form's FormProvider so that useFormContext()
 * and useController() work inside field components.
 */
function RHFFormProviderWrapper({
  instance,
  children,
}: {
  instance: NormalizedFormInstance
  children: React.ReactNode
}) {
  const form = instance.raw as ReturnType<typeof useForm>
  return (
    <RHFFormIdContext value={instance.id}>
      <RHFFormProvider {...form}>
        {children}
      </RHFFormProvider>
    </RHFFormIdContext>
  )
}

// ============================================================================
// Export
// ============================================================================

/**
 * React Hook Form adapter implementing the `FormAdapter` interface.
 *
 * Maps react-hook-form's `useForm` / `useController` / `useWatch` APIs
 * to the normalized form adapter contract. Uses `@hookform/resolvers/zod`
 * for Zod schema validation.
 */
export const rhfAdapter: FormAdapter = {
  name: 'React Hook Form',
  useCreateForm: useRHFCreateForm,
  useField: useRHFField,
  useWatch: useRHFWatchHook,
  useWatchAll: useRHFWatchAllHook,
  useFieldArray: useRHFFieldArrayHook,
  FormProvider: RHFFormProviderWrapper,
}
