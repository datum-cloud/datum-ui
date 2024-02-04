'use client'

import React, { useState } from 'react'
import clsx from 'clsx';
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@repo/ui/button'
import { TextInput } from '@repo/ui/text-input'
import { MessageBox } from '@repo/ui/message-box'
import { SimpleForm } from '@repo/ui/simple-form'
import { LoginUser } from '../../../lib/user'
import logoReversed from '../../../../public/logos/logo_orange_icon.svg'

const AuthLogin: React.FC = () => {

	const router = useRouter()
	const [signInError, setSignInError] = useState(false);
	const [signInLoading, setSignInLoading] = useState(false);
	const showLoginError = !signInLoading && signInError;
	/**
	 * Submit client-side signin function
	 */
	const submit = async (payload: LoginUser) => {
		setSignInLoading(true);
		setSignInError(false);
		try {
			let res: any = await signIn('credentials', {
				redirect: false,
				...payload,
			})
			if (res.ok && !res.error) {
				router.push("/dashboard");
			} else {
				setSignInLoading(false);
				setSignInError(true);

			}
		} catch (error) {
			setSignInLoading(false);
			setSignInError(true);
		}
	}

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
						onSubmit={(e: any) => {
							submit(e)
						}}
					>
						<TextInput name="username" placeholder="email@domain.net" />
						<TextInput name="password" placeholder="password" type="password" />
						<Button className="mr-auto mt-2 w-full" loading={signInLoading ? true : undefined} type="submit">
							Login
						</Button>
					</SimpleForm>
					<MessageBox className={clsx("p-4 ui-ml-1", showLoginError ? '' : 'invisible')} message={'Could not login. Please try again.'} />
					<div className="flex items-center mt-4">
						<Link
							className="text-base text-sunglow-900 underline underline-offset-2"
							href="/signup"
						>
							Need to create an account?
						</Link>
					</div>
				</div>
			</div>
		</main>
	)
}

export default AuthLogin
