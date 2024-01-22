'use client'

import * as React from 'react'
import { twMerge } from 'tailwind-merge'

export const TextInput = React.forwardRef<HTMLInputElement, any>(
	(props, ref) => {



		return (
			<input
				className={'border-blue-500'
				}
				ref={ref}
				type="text"
				{...props}
			/>
		)
	},
)

TextInput.displayName = 'TextInput'

export default TextInput
