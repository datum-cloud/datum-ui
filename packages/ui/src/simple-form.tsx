import React, { FormEvent, useState } from 'react'

export const Form: React.FC<any> = ({
  children,
  action,
  onSubmit,
  onChange,
  classNames,
  id,
}) => {
  const [values, setValues] = useState({})

  const grabData = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const data: any = {}

    for (const [ky, vl] of formData.entries() as Iterable<
      [string, FormDataEntryValue]
    >) {
      data[ky] = vl
    }

    return data
  }

  return (
    <form
      id={id}
      action={action || 'submit'}
      onChange={(e) =>
        onChange ? onChange(grabData(e)) : setValues(grabData(e))
      }
      onSubmit={(e) =>
        onSubmit ? onSubmit(grabData(e)) : setValues(grabData(e))
      }
      className={`${classNames} w-full`}
    >
      {typeof children === 'function' ? children(values) : children}
    </form>
  )
}

export default Form
