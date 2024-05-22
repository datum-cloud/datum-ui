'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { verificationStyles } from './HomePage.styles'
import { LoaderCircle, SparklesIcon } from 'lucide-react'

export const HomePageVerification = () => {
  const { errorMessage, successMessage, successIcon, success, loading } =
    verificationStyles()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await fetch(`/api/verify?token=${token}`)
          const data = await response.json()

          if (!response.ok) {
            setError(data.error || 'Verification failed. Please try again.')
          } else {
            setMessage('Verification successful')
          }
        } catch (err) {
          setError('An unexpected error occurred. Please try again.')
        }
      }
    }

    verifyToken()
  }, [token])

  if (!token) {
    return (
      <div className={errorMessage()}>
        No token provided, please check your email for a verification link.
      </div>
    )
  }

  if (error) {
    return <div className={errorMessage()}>{error}</div>
  }

  if (message) {
    return (
      <div className={success()}>
        <SparklesIcon size={24} className={successIcon()} />
        <span className={successMessage()}>
          Thank you for subscribing. Your email is now verified
        </span>
      </div>
    )
  }

  return (
    <div className={loading()}>
      <LoaderCircle className="animate-spin" size={20} />
      <span className={successMessage()}>Verifying</span>
    </div>
  )
}
