import React, { useState } from 'react'
import type { FormEvent } from 'react'

export const SimpleForm: React.FC<any> = ({
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
		console.log('grabdata')
		const formData = new FormData(event.currentTarget)
		const data: any = {}

		for (const [ky, vl] of formData.entries() as Iterable<
			[string, FormDataEntryValue]
		>) {
			data[ky] = vl
		}
		return data
	}

	const onChangeData = (event: FormEvent<HTMLFormElement>) => {
		const formData = new FormData(event.currentTarget)

		const data: any = {}

		for (const [ky, vl] of formData.entries() as Iterable<
			[string, FormDataEntryValue]
		>) {
			data[ky] = vl
		}
		console.log(data)
		setValues(data)
		return data
	}

	return (
		<form
			action={action || 'submit'}
			className={`${classNames}`}
			id={id}
			onChange={(e) =>
				onChange(onChangeData(e))
			}
			onSubmit={(e) =>
				onSubmit ? onSubmit(grabData(e)) : setValues(grabData(e))
			}
		>
			{typeof children === 'function' ? children(values) : children}
		</form>
	)
}

export default SimpleForm
