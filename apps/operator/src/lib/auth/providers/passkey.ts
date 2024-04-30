import { User } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

// Passkey credentials provider
export const passKeyProvider = Credentials({
  id: 'passkey',
  name: 'passkey',
  credentials: {
    accessToken: {
      label: 'Access Token',
      type: 'text',
      placeholder: 'Enter your access token',
    },
    refreshToken: {
      label: 'Refresh Token',
      type: 'text',
      placeholder: 'Enter your refresh token',
    },
    email: { label: 'Email', type: 'email', placeholder: 'Enter your email' },
    name: { label: 'Name', type: 'text', placeholder: 'Enter your name' },
    session: {
      label: 'Session',
      type: 'text',
      placeholder: 'Enter your session identifier',
    },
  },
  async authorize({
    accessToken,
    refreshToken,
    email,
    name,
    session,
  }): Promise<User | null> {
    return {
      id: email as string,
      name: name as string,
      email: email as string,
      accessToken: accessToken as string,
      refreshToken: refreshToken as string,
      session: session as string,
    }
  },
})
