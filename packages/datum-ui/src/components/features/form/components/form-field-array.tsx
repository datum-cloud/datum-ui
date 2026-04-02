import type { FormFieldArrayProps, FormFieldArrayRenderProps } from '../types'
import * as React from 'react'
import { useAdapter } from '../adapter-context'

/**
 * Form.FieldArray - Dynamic array of fields with append/remove/move helpers.
 *
 * @example
 * ```tsx
 * <Form.FieldArray name="members">
 *   {({ fields, append, remove }) => (
 *     <>
 *       {fields.map((field, index) => (
 *         <div key={field.key}>
 *           <Form.Field name={`members.${index}.email`} label="Email">
 *             <Form.Input type="email" />
 *           </Form.Field>
 *           <button onClick={() => remove(index)}>Remove</button>
 *         </div>
 *       ))}
 *       <button onClick={() => append({})}>Add Member</button>
 *     </>
 *   )}
 * </Form.FieldArray>
 * ```
 */
export function FormFieldArray({ name, children }: FormFieldArrayProps) {
  const adapter = useAdapter()
  const fieldArray = adapter.useFieldArray(name)

  const renderProps: FormFieldArrayRenderProps = {
    fields: fieldArray.items,
    append: fieldArray.append,
    remove: fieldArray.remove,
    move: fieldArray.move,
  }

  return <>{children(renderProps)}</>
}

FormFieldArray.displayName = 'Form.FieldArray'
