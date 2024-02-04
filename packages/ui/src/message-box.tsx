import React from 'react'
import { clsx } from 'clsx'

export const MessageBox: React.FC<any> = ({
	message,
	className
}) => {

	return (
		<div className={clsx(
			"ui-my-2.5 ui-p-4 ui-bg-red-100 ui-border ui-border-red-400 ui-text-red-700 ui-px-4 ui-py-3 ui-rounded ui-relative",
			className)}
			role="alert">
			<span className={"ui-block sm:ui-inline"}>{message}</span>
		</div>
	)
}

export default MessageBox