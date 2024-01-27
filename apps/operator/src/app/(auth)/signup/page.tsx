'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { SimpleForm } from '@repo/ui/simple-form'
import { TextInput } from '@repo/ui/text-input'
import { Button } from '@repo/ui/button'
import { registerUser } from '../../../lib/user'
import type { RegisterUser } from '../../../lib/user'
import logoReversed from '../../../../public/logos/logo_orange_icon.svg'

const AuthSignup: React.FC = () => {
	const router = useRouter()
	// const [passwordMatch, setPasswordMatch] = useState(true);
	const [afterSubmit, setAfterSubmit] = useState(false);
	const [firstName, setFirstName] = useState('0');
	const [lastName, setLastName] = useState('0');
	const [email, setEmail] = useState('0');
	const [password, setPassword] = useState('0');
	const [apiResponse, setApiResponse] = useState({ message: '' });

	return (
		<main className="flex flex-col min-h-screen w-full items-center space-between dark:bg-dk-surface-0 bg-surface-0">
			<div className="flex flex-col justify-center mx-auto my-auto w-full p-6 sm:w-1/3 h-full relative ease-in-out">
				<Image
					alt="datum imagery background"
					className="mx-auto max-h-20"
					priority
					src={logoReversed as string}
					width={385}
				/>
				<div className="flex flex-col mt-8 justify-start">
					<SimpleForm
						classNames="space-y-2"
						onSubmit={async (payload: RegisterUser) => {

							setAfterSubmit(true)

							if (!(payload.first_name && payload.last_name)) {
								return false
							}
							try {
								setFirstName(payload.first_name);
								setLastName(payload.last_name);
								setEmail(payload.email);
								setPassword(payload.password);

								console.log(!password && afterSubmit)

								// if (payload.password === payload.confirmedPassword) {
								// delete payload.confirmedPassword

								const res: any = await registerUser(payload)

								if (res?.ok) {

									router.push('/verify')
								}

								if (res?.message) {
									console.log('toast message => ', res.message)
									setApiResponse({ message: res.message ? res.message : res.message.message })

								}
								// }
								// else {
								// 	// setPasswordMatch(false)
								// 	console.log('passwords dont match')
								// }
							} catch (error) {
								console.log(error)
								setApiResponse({ message: 'Unknown error. Please try again.' })
								console.dir(apiResponse)
							}
						}}
						onChange={(formData: any) => {
							setFirstName(formData.first_name);
							setLastName(formData.last_name);
							setEmail(formData.email);
							setPassword(formData.password);
						}}
					>
						<div className="flex flex-col sm:flex-row gap-2">
							<TextInput name="first_name" invalid={(!firstName && afterSubmit) ? 'true' : undefined} placeholder="First Name" />
							<TextInput name="last_name" invalid={(!lastName && afterSubmit) ? 'true' : undefined} placeholder="Last Name" />
						</div>
						<TextInput name="email" invalid={(!email && afterSubmit) ? 'true' : undefined} placeholder="email@domain.net" />
						<TextInput name="password" invalid={(!password && afterSubmit) ? 'true' : undefined} placeholder="password" type="password" />
						{/* <TextInput
							invalid={!passwordMatch ? true : undefined}
							name="confirmedPassword"
							placeholder="confirm password"
							type="password"
						/> */}
						<div>{apiResponse.message}</div>
						<Button className="mr-auto mt-2 w-full" type="submit">
							Register
						</Button>
					</SimpleForm>
					<div className="flex items-center mt-4">
						<Link
							className="text-base text-sunglow-900 underline underline-offset-2"
							href="/login"
						>
							Already have an account?
						</Link>
					</div>
				</div>
			</div>
		</main>
	)
}

export default AuthSignup
