import useSWR from 'swr'
import { restUrl } from '../index.ts'

export interface LoginUser {
  username: string
  password: string
}

export interface RegisterUser {
  first_name: string
  last_name: string
  username: string
  password: string
  confirmedPassword?: string
}

export async function registerUser(arg: RegisterUser) {
  const fData = await fetch(`${restUrl}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  })

  if (fData.ok) {
    return await fData.json()
  }

  if (!fData.ok) {
    return {
      message: await fData.text(),
    }
  }
}

export async function verifyUser(token: string) {
  const fData = await fetch(`${restUrl}/verify?${token}`)

  if (fData.ok) {
    return await fData.json()
  }

  if (!fData.ok) {
    return {
      message: await fData.text(),
    }
  }
}

export const useVerifyUser = (arg: string) => {
  const { data, isLoading, error } = useSWR(
    arg ? `/api/auth/register?token=${arg}` : null,
    async (url) => await (await fetch(url)).json(),
  )

  return {
    verified: data,
    isLoading,
    error,
  }
}
