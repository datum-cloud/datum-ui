'use client'

import { Logo } from '@repo/ui/logo'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs'
import Image from 'next/image'
import { useState } from 'react'
import { pageStyles } from './page.styles'
import { LoginPage } from '@/components/pages/auth/login/login'
import { SignupPage } from '@/components/pages/auth/signup/signup'

const AuthLogin: React.FC = () => {
  const defaultTab = 'login'
  const { bg, bgImage, content, logo } = pageStyles()
  const [activeTab, setActiveTab] = useState(defaultTab)
  return (
    <>
      <div className={content()}>
        <div className={logo()}>
          <Logo theme="light" width={143} />
        </div>
        <Tabs
          variant="underline"
          defaultValue={defaultTab}
          onValueChange={(value) => {
            setActiveTab(value)
          }}
        >
          <TabsList>
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginPage />
          </TabsContent>
          <TabsContent value="signup">
            <SignupPage />
          </TabsContent>
        </Tabs>
      </div>
      <div className={bg({ activeBg: activeTab === 'login' })}>
        <Image
          src="/backgrounds/auth/login-bg.png"
          priority
          fill
          className={bgImage()}
          alt=""
        />
      </div>
      <div className={bg({ activeBg: activeTab === 'signup' })}>
        <Image
          src="/backgrounds/auth/signup-bg.png"
          priority
          fill
          className={bgImage()}
          alt=""
        />
      </div>
    </>
  )
}

export default AuthLogin
