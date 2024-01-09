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

export const useRegister = (
  payload: {
    first_name: string
    last_name: string
    email: string
    password: string
    confirmedPassword: string
  } | null,
) => {
  const { data, isLoading, error } = useSWR(
    payload ? `${restUrl}/register` : null,
    (url) =>
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }),
  )

  return {
    register: data,
    isLoading,
    error,
  }
}
