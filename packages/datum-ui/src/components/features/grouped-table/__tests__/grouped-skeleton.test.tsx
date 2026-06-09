import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GroupedSkeleton } from '../components/grouped-skeleton'

describe('groupedSkeleton', () => {
  it('renders the requested number of group bands and rows', () => {
    const { container } = render(<GroupedSkeleton columns={3} groups={2} rowsPerGroup={2} />)
    expect(container.querySelectorAll('[data-slot="gt-skeleton-band"]')).toHaveLength(2)
    expect(container.querySelectorAll('[data-slot="gt-skeleton-row"]')).toHaveLength(4)
  })
})
