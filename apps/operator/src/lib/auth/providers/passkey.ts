import Credentials from 'next-auth/providers/credentials'

// Passkey credentials provider
export const passKeyProvider = Credentials({
  id: 'passkey',
  name: 'passkey',
  credentials: {
    username: { label: 'Username' },
    name: { label: 'Name' },
  },
  async authorize({ username, name }) {
    console.log('🔑 passkey authorization')
    //TODO: Handle response from registration verification
    return null
  },
})
