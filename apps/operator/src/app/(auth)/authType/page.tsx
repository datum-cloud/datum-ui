'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Button } from '@repo/ui/button'
import { TextInput } from '@repo/ui/text-input'
import { SimpleForm } from '@repo/ui/simple-form'
import { LoginUser } from '../../../lib/user'
import logoReversed from '../../../../public/logos/logo_orange_icon.svg'

const AuthType: React.FC = () => {

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
					<div className="flex items-center mt-4">
						<Link
							className="text-base text-sunglow-900 underline underline-offset-2"
							href="/signup"
						>
							Email Based Account
						</Link>
					</div>
					<div className="flex items-center mt-4">
						<Link
							className="text-base text-sunglow-900 underline underline-offset-2"
							href="/signup"
						>
							Github
						</Link>
					</div>
					<div className="flex items-center mt-4">
						<Link
							className="text-base text-sunglow-900 underline underline-offset-2"
							href="/signup"
						>
							Google
						</Link>
					</div>
				</div>
			</div>
		</main>
	)
}

export default AuthType
