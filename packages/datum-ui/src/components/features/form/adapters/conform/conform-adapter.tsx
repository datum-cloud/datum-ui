import type {
  CreateFormProps,
  FormAdapter,
  NormalizedFieldArray,
  NormalizedFieldMeta,
  NormalizedFieldState,
  NormalizedFormInstance,
  NormalizedFormState,
} from '../../adapter-types'
import {
  FormProvider as ConformFormProvider,
  getFormProps,
  getInputProps,
  useForm,
  useFormMetadata,
  useInputControl,
} from '@conform-to/react'
import { isDirty, useFormData } from '@conform-to/react/future'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import * as React from 'react'
import { useDisplayTouched } from '../../hooks/use-display-touched'
import { getFieldConstraints } from '../../utils/get-field-constraints'

/**
 * Shared context for the touched fields set.
 * Created in useConformCreateForm and consumed by useConformField.
 */
const TouchedFieldsContext = React.createContext<React.RefObject<Set<string>>>(
  { current: new Set() },
)

// ============================================================================
// Field Path Resolution
//
// Consolidated from duplicated logic in:
//   - form-field.tsx:117-159
//   - use-field.ts:37-79
//   - use-watch.ts:30-61
// ============================================================================

/**
 * Resolve a Conform field metadata object by dot-notation path.
 *
 * Handles:
 * - Top-level fields: `"email"` -> `fields.email`
 * - Nested objects: `"address.city"` -> `fields.address.getFieldset().city`
 * - Array items: `"items.0.name"` -> `fields.items.getFieldList()[0].getFieldset().name`
 */
function resolveConformField(fields: any, name: string): any {
  const parts = name.split('.')
  let current: any = fields

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]!
    if (!current)
      break

    // Handle array index like "items.0.name"
    if (/^\d+$/.test(part)) {
      const fieldList = current.getFieldList?.()
      if (fieldList) {
        const item = fieldList[Number.parseInt(part, 10)]
        // If there are more parts, get the fieldset
        if (i < parts.length - 1 && item?.getFieldset) {
          current = item.getFieldset()
        }
        else {
          current = item
        }
      }
      else {
        current = current[part as keyof typeof current]
      }
    }
    else {
      // First check if it's a direct property (top-level field)
      if (current[part as keyof typeof current] !== undefined) {
        current = current[part as keyof typeof current]
      }
      else if (typeof current.getFieldset === 'function') {
        // Try getFieldset for nested objects
        current = current.getFieldset()[part as keyof ReturnType<typeof current.getFieldset>]
      }
      else {
        current = undefined
      }
    }
  }

  return current
}

// ============================================================================
// String <-> Native Value Conversion
//
// Conform stores values as strings in FormData. These helpers convert between
// the string representation and native JS types (boolean, etc.).
// ============================================================================

function convertFromString(value: string | string[] | undefined): unknown {
  if (value === undefined)
    return undefined
  // Multi-value FormData entries (checkbox groups / multi-selects sharing one
  // name) arrive as string[]. Preserve the whole array instead of dropping all
  // but the first selection.
  if (Array.isArray(value))
    return value
  // Only convert the Conform-specific boolean sentinel 'on' to true.
  // All other strings (including '' and 'false') stay as strings.
  // Checkbox/Switch components handle boolean conversion via Boolean(value).
  if (value === 'on')
    return true
  // Deserialize arrays serialized by convertToString (Transfer, multi-select).
  // Only parse when the string is the *canonical* JSON serialization of an
  // array (i.e. re-serializing yields the identical string). This lets any
  // primitive array — including number arrays like [1,2] — round-trip, while
  // hand-typed text such as `["foo", "bar"]` (note the spacing) or `[hello]`
  // is left untouched as a string.
  const parsed = tryParseSerializedArray(value)
  if (parsed !== undefined)
    return parsed
  return value
}

/**
 * Parse a string only if it is the canonical JSON serialization of an array,
 * matching exactly what `convertToString` produces. Returns the parsed array,
 * or `undefined` when the string is not a serialized array.
 */
function tryParseSerializedArray(value: string): unknown[] | undefined {
  if (value.length < 2 || value[0] !== '[' || !value.endsWith(']'))
    return undefined
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed) && JSON.stringify(parsed) === value)
      return parsed
  }
  catch {
    // Not valid JSON — treat as a plain string.
  }
  return undefined
}

function convertToString(value: unknown): string {
  if (typeof value === 'boolean')
    return value ? 'on' : ''
  if (value === null || value === undefined)
    return ''
  // Serialize arrays as JSON for Transfer, multi-select, etc.
  if (Array.isArray(value))
    return JSON.stringify(value)
  return String(value)
}

/**
 * Whether a value is a plain object (an object literal or `Object.create(null)`),
 * as opposed to a class/exotic instance such as `Date`, `Map`, `Set`, or a Zod
 * coerced/class value. Only plain objects should be walked as nested field
 * groups; non-plain instances have no meaningful `Object.entries()` and must be
 * kept as leaf values so their default survives.
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object')
    return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

/**
 * Flatten nested object defaults into dot-notation keys (e.g.
 * `{ address: { city: 'x' } }` -> `{ 'address.city': 'x' }`) so they match the
 * flat field names Conform writes into FormData. Arrays are treated as leaf
 * values because convertToString serializes them into a single hidden input.
 *
 * Only *plain* objects are recursed into. Non-plain object instances (Date, Map,
 * Set, class instances, Zod-coerced values) are kept as leaf values — recursing
 * into them yields no `Object.entries()`, which would drop the field's default
 * and cause the dirty-tracking to flag the field as dirty on mount with no user
 * edit.
 */
export function flattenDefaults(
  obj: Record<string, unknown>,
  prefix = '',
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (isPlainObject(value)) {
      Object.assign(result, flattenDefaults(value, path))
    }
    else {
      result[path] = value
    }
  }
  return result
}

// ============================================================================
// Hook Implementations
// ============================================================================

/** Create a Conform form instance and normalize it to the adapter interface. */
function useConformCreateForm(props: CreateFormProps): NormalizedFormInstance {
  const { schema, defaultValues, mode, id, onSubmit, formRef } = props

  const shouldValidateMap = {
    onBlur: 'onBlur' as const,
    onChange: 'onInput' as const,
    onSubmit: 'onSubmit' as const,
  }

  const [form, fields] = useForm({
    id,
    defaultValue: defaultValues as any,
    constraint: getZodConstraint(schema),
    shouldValidate: shouldValidateMap[mode],
    shouldRevalidate: mode !== 'onSubmit' ? 'onInput' : undefined,
    onValidate: ({ formData }) => parseWithZod(formData, { schema }) as any,
    onSubmit: onSubmit
      ? (event: React.FormEvent<HTMLFormElement>, context: any) => {
          event.preventDefault()
          const submission = context.submission
          if (submission?.status === 'success') {
            onSubmit(submission.value)
          }
        }
      : undefined,
  })

  const constraints = React.useMemo(
    () => getFieldConstraints(schema),
    [schema],
  )

  // ---------------------------------------------------------------------------
  // Form-level dirty state via Conform future API
  // ---------------------------------------------------------------------------
  const formIsDirty = useFormData(
    formRef as any,
    (formData: URLSearchParams) =>
      isDirty(formData, { defaultValue: defaultValues }) ?? false,
  ) ?? false

  // ---------------------------------------------------------------------------
  // Per-field dirty tracking via Conform future API
  // ---------------------------------------------------------------------------
  const dirtyFields = useFormData(
    formRef as any,
    (formData: URLSearchParams) => {
      const result: Record<string, boolean> = {}
      // Flatten nested object defaults to dot-notation keys so they line up
      // with the flat field names Conform writes into FormData.
      const defaults = flattenDefaults((defaultValues ?? {}) as Record<string, unknown>)

      // Check fields with known defaults. Serialize the default with the same
      // convertToString used to write the hidden inputs so arrays/booleans
      // compare correctly (e.g. ['a','b'] -> '["a","b"]', not 'a,b').
      for (const key of Object.keys(defaults)) {
        const current = formData.get(key)
        const defaultStr = convertToString(defaults[key])
        result[key] = current !== defaultStr
      }

      // Check fields in formData without defaults -- compare against empty string
      // Skip Conform internal fields (prefixed with $)
      for (const key of formData.keys()) {
        if (!(key in result) && !key.startsWith('$')) {
          const current = formData.get(key)
          result[key] = current !== '' && current !== null
        }
      }

      // Only include dirty fields (match RHF behavior: {} when pristine)
      const dirty: Record<string, boolean> = {}
      for (const [key, value] of Object.entries(result)) {
        if (value)
          dirty[key] = true
      }
      return dirty
    },
  ) ?? {}

  // ---------------------------------------------------------------------------
  // Form-level validity via schema validation on current form data
  // Uses parseWithZod which handles FormData-to-typed conversion (e.g. "on" -> true for booleans)
  // ---------------------------------------------------------------------------
  const isValid = useFormData(
    formRef as any,
    (formData: URLSearchParams) => {
      const submission = parseWithZod(formData, { schema }) as any
      return submission?.status === 'success'
    },
  ) ?? false

  // ---------------------------------------------------------------------------
  // Touched fields tracking via focusout events on the form element
  // ---------------------------------------------------------------------------
  const touchedFieldsRef = React.useRef(new Set<string>())
  const [touchedFields, setTouchedFields] = React.useState<Record<string, boolean>>({})

  React.useEffect(() => {
    const formEl = formRef?.current
    if (!formEl)
      return

    const handleFocusOut = (event: FocusEvent) => {
      const target = event.target
      if (
        target instanceof HTMLInputElement
        || target instanceof HTMLSelectElement
        || target instanceof HTMLTextAreaElement
      ) {
        const name = target.name
        if (name && !touchedFieldsRef.current.has(name)) {
          touchedFieldsRef.current.add(name)
          setTouchedFields(prev => ({ ...prev, [name]: true }))
        }
      }
    }

    formEl.addEventListener('focusout', handleFocusOut)
    return () => formEl.removeEventListener('focusout', handleFocusOut)
  }, [formRef])

  // ---------------------------------------------------------------------------
  // Submit tracking via the form element's submit event.
  // Conform has no native submitCount, so we count real submit attempts.
  // Its hidden intent buttons (name="__intent__", used for field-level
  // validation) are excluded so validation churn does not mark the form
  // submitted.
  // ---------------------------------------------------------------------------
  const [submitCount, setSubmitCount] = React.useState(0)

  React.useEffect(() => {
    const formEl = formRef?.current
    if (!formEl)
      return

    const handleSubmit = (event: SubmitEvent) => {
      const submitter = event.submitter as HTMLElement | null
      if (submitter instanceof HTMLButtonElement && submitter.hidden)
        return
      setSubmitCount(count => count + 1)
    }

    formEl.addEventListener('submit', handleSubmit)
    return () => formEl.removeEventListener('submit', handleSubmit)
  }, [formRef])

  // ---------------------------------------------------------------------------
  // Normalized form state
  // ---------------------------------------------------------------------------
  const formState: NormalizedFormState = React.useMemo(() => ({
    isDirty: formIsDirty,
    isValid,
    isSubmitted: submitCount > 0,
    submitCount,
    dirtyFields,
    touchedFields,
  }), [formIsDirty, isValid, submitCount, dirtyFields, touchedFields])

  const normalizedFields = React.useMemo(() => {
    const result: Record<string, NormalizedFieldMeta> = {}
    for (const [key, fieldMeta] of Object.entries(fields as Record<string, any>)) {
      result[key] = {
        id: fieldMeta.id ?? `${id ?? form.id}-${key}`,
        errors: fieldMeta.errors ?? [],
        required: constraints[key]?.required ?? false,
        isDirty: dirtyFields[key] ?? false,
        isTouched: touchedFields[key] ?? false,
      }
    }
    return result
  }, [fields, id, form.id, constraints, dirtyFields, touchedFields])

  const conformFormProps = React.useMemo(
    () => getFormProps(form),
    [form],
  )

  // Display-level touched tracking (shared across adapters)
  const { displayTouchedFields, markFieldTouched, markAllFieldsTouched } = useDisplayTouched(schema)

  return React.useMemo(() => ({
    id: form.id,
    fields: normalizedFields,
    formProps: conformFormProps,
    formState,
    submit: () => formRef?.current?.requestSubmit(),
    reset: () => form.reset(),
    getValues: () => {
      if (!formRef?.current)
        return {}
      const formData = new FormData(formRef.current)
      const values: Record<string, unknown> = {}
      // Collapse each field name once. Multi-value entries (checkbox groups /
      // multi-selects sharing a name) are preserved as arrays instead of being
      // clobbered by last-value-wins, and every value is decoded to its native
      // JS type ('on' -> true, '["a","b"]' -> ['a','b']) so re-mounted step
      // defaults are not corrupted with raw serialized strings.
      for (const key of new Set(formData.keys())) {
        // Skip Conform internal fields (prefixed with $).
        if (key.startsWith('$'))
          continue
        const all = formData.getAll(key).map(entry => String(entry))
        const raw = all.length > 1 ? all : all[0]
        values[key] = convertFromString(raw)
      }
      return values
    },
    touchedFields: displayTouchedFields,
    markFieldTouched,
    markAllFieldsTouched,
    raw: { form, fields, touchedFieldsRef },
  }), [form, fields, normalizedFields, conformFormProps, formState, formRef, displayTouchedFields, markFieldTouched, markAllFieldsTouched])
}

/** Resolve a field by dot-notation path and return its normalized state. */
function useConformField(name: string): NormalizedFieldState {
  const formMeta = useFormMetadata()
  const allFields = formMeta.getFieldset()
  const fieldMeta = resolveConformField(allFields, name)
  const touchedFieldsRef = React.use(TouchedFieldsContext)

  // Hooks must be called unconditionally — pass a dummy when field is missing.
  // The throw below prevents the dummy from ever being used at runtime.
  const control = useInputControl(fieldMeta ?? { name, key: undefined, id: name })

  if (!fieldMeta) {
    throw new Error(
      `[Conform Adapter] Field "${name}" not found. Make sure the field name matches your schema.`,
    )
  }

  const currentValue = convertFromString(control.value)
  const defaultValue = convertFromString(fieldMeta.initialValue)
  // Normalize comparison: undefined initialValue means empty string for text fields
  const normalizedDefault = defaultValue === undefined ? '' : defaultValue
  // Compare serialized forms rather than references. convertFromString returns
  // a fresh array/object for serialized values each render, so `!==` would flag
  // array/object fields as always dirty. Serializing both sides makes the
  // comparison value-based.
  const fieldIsDirty = convertToString(currentValue) !== convertToString(normalizedDefault)
  const fieldIsTouched = touchedFieldsRef.current.has(name)

  return React.useMemo(() => ({
    name: fieldMeta.name,
    id: fieldMeta.id,
    errors: fieldMeta.errors ?? [],
    required: fieldMeta.required ?? false,
    isDirty: fieldIsDirty,
    isTouched: fieldIsTouched,
    value: currentValue,
    change: (value: unknown) => control.change(convertToString(value)),
    blur: () => control.blur(),
    focus: () => control.focus(),
    inputProps: getInputProps(fieldMeta, { type: 'text' }),
  }), [fieldMeta, control, currentValue, fieldIsDirty, fieldIsTouched])
}

/** Watch a single field's value reactively. */
function useConformWatch(name: string): unknown {
  const formMeta = useFormMetadata()
  const allFields = formMeta.getFieldset()
  const fieldMeta = resolveConformField(allFields, name)

  if (!fieldMeta)
    return undefined

  // Read value directly from Conform's reactive field metadata.
  // Do NOT use useInputControl here — it creates a hidden input element
  // per subscription, and having multiple useInputControl instances for the
  // same field (one in useConformField, one here) causes them to desync.
  return convertFromString(fieldMeta.value)
}

/** Watch multiple fields' values reactively. */
function useConformWatchAll(names: string[]): Record<string, unknown> {
  const formMeta = useFormMetadata()
  const allFields = formMeta.getFieldset()
  const namesKey = names.join(',')

  return React.useMemo(() => {
    const result: Record<string, unknown> = {}
    for (const name of names) {
      const fieldMeta = resolveConformField(allFields, name)
      if (fieldMeta) {
        result[name] = convertFromString(fieldMeta.value)
      }
    }
    return result
    // eslint-disable-next-line react/exhaustive-deps
  }, [allFields, namesKey])
}

/** Get field array helpers for a given array field name. */
function useConformFieldArray(name: string): NormalizedFieldArray {
  const formMeta = useFormMetadata()
  const allFields = formMeta.getFieldset()
  const arrayField = resolveConformField(allFields, name)

  const items = React.useMemo(() => {
    if (!arrayField?.getFieldList)
      return []
    return arrayField.getFieldList().map((item: any, index: number) => ({
      id: item.id ?? `${name}-${index}`,
      key: item.key ?? `${name}-${index}`,
      name: `${name}[${index}]`,
    }))
  }, [arrayField, name])

  const arrayFieldName = arrayField?.name

  const append = React.useCallback(
    (defaultValue?: Record<string, unknown>) => {
      if (!arrayFieldName)
        return
      formMeta.insert({ name: arrayFieldName, defaultValue } as any)
    },
    [formMeta, arrayFieldName],
  )

  const remove = React.useCallback(
    (index: number) => {
      if (!arrayFieldName)
        return
      formMeta.remove({ name: arrayFieldName, index })
    },
    [formMeta, arrayFieldName],
  )

  const move = React.useCallback(
    (from: number, to: number) => {
      if (!arrayFieldName)
        return
      formMeta.reorder({ name: arrayFieldName, from, to })
    },
    [formMeta, arrayFieldName],
  )

  return { items, append, remove, move }
}

// ============================================================================
// Conform FormProvider Wrapper
// ============================================================================

/**
 * Wraps children in Conform's FormProvider so that useFormMetadata() and
 * useInputControl() work inside field components.
 * Also provides the touched fields ref via context for useConformField.
 */
function ConformFormProviderWrapper({
  instance,
  children,
}: {
  instance: NormalizedFormInstance
  children: React.ReactNode
}) {
  const { form, touchedFieldsRef } = instance.raw as {
    form: any
    fields: any
    touchedFieldsRef: React.RefObject<Set<string>>
  }
  return (
    <ConformFormProvider context={form.context}>
      <TouchedFieldsContext value={touchedFieldsRef}>
        {children}
      </TouchedFieldsContext>
    </ConformFormProvider>
  )
}

// ============================================================================
// Export
// ============================================================================

/**
 * Conform.js adapter implementing the `FormAdapter` interface.
 *
 * Maps Conform's `useForm` / `useInputControl` / `useFormMetadata` APIs
 * to the normalized form adapter contract.
 */
export const conformAdapter: FormAdapter = {
  name: 'Conform',
  useCreateForm: useConformCreateForm,
  useField: useConformField,
  useWatch: useConformWatch,
  useWatchAll: useConformWatchAll,
  useFieldArray: useConformFieldArray,
  FormProvider: ConformFormProviderWrapper,
}
