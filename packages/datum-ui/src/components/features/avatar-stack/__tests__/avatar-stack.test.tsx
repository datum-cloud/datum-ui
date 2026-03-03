/// <reference types="@testing-library/jest-dom/vitest" />
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../../../../test/utils'
import { AvatarStack } from '../avatar-stack'

const avatars = [
  { name: 'Alice Brown', image: '/alice.png' },
  { name: 'Bob Smith', image: '/bob.png' },
  { name: 'Charlie Davis', image: '/charlie.png' },
  { name: 'Diana Evans', image: '/diana.png' },
  { name: 'Eve Foster', image: '/eve.png' },
]

describe('avatarStack', () => {
  it('renders avatars up to maxAvatarsAmount and shows overflow indicator', () => {
    renderWithProviders(<AvatarStack avatars={avatars} maxAvatarsAmount={3} />)
    expect(screen.getByText(/\+2/)).toBeInTheDocument()
  })

  it('does not show overflow when within limit', () => {
    renderWithProviders(<AvatarStack avatars={avatars.slice(0, 2)} maxAvatarsAmount={3} />)
    expect(screen.queryByText(/\+/)).not.toBeInTheDocument()
  })

  it('renders fallback initials when images are not available', () => {
    renderWithProviders(
      <AvatarStack
        avatars={[{ name: 'Alice Brown', image: '' }]}
        maxAvatarsAmount={3}
      />,
    )
    expect(screen.getByText('AB')).toBeInTheDocument()
  })
})
