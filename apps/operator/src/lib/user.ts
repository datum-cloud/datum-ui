import useSWR from 'swr'

const restUrl = process.env.NEXT_PUBLIC_API_REST_URL
// const gqlUrl = process.env.API_GQL_URL

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
  console.log(restUrl)
  const fData = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  })
  return fData.json()
}

export const useVerifyUser = (arg: string) => {
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
