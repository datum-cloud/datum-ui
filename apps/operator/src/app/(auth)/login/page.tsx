'use client'

import { LoginPage } from '@/components/pages/auth/login/login'
import { SignupPage } from '@/components/pages/auth/signup/signup'

const AuthLogin: React.FC = () => {
  return (
    <>
      <LoginPage />
      <SignupPage />
    </>
  )
}

export default AuthLogin
