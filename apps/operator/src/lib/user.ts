import useSWR from 'swr'

export interface LoginUser {
	username: string
	password: string
}

export interface RegisterUser {
	first_name: string
	last_name: string
	email: string
	password: string
	confirmedPassword?: string
}

interface HttpResponse<T> extends Response {
	message?: T;
}

export async function registerUser<T>(arg: RegisterUser) {
	const fData: HttpResponse<T> = await fetch('/api/auth/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(arg),
	})
	try {
		let fDataMessage = await fData.json();
		fData.message = fDataMessage.message;
		return fData;
	}
	catch (error) {
		console.log(error)
		return { message: 'error' }
	}
}

export const useVerifyUser = (arg: string | null) => {
	const { data, isLoading, error } = useSWR(
		arg ? `/api/auth/verify?token=${arg}` : null,
		async (url) => {
			return (await fetch(url)).json()
		},
		{
			revalidateOnFocus: false,
			revalidateOnMount: true,
			refreshInterval: 0,
			revalidateIfStale: false,
		},
	)

	return {
		verified: data,
		isLoading,
		error,
	}
}
