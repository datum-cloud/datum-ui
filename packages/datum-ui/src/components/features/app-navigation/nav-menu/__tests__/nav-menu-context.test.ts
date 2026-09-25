import { describe, expect, it } from 'vitest'
import { childLevel } from '../nav-menu-context'

describe('childLevel', () => {
  it('renders group children at the group level', () => {
    expect(childLevel({ type: 'group' }, 0)).toBe(0)
    expect(childLevel({ type: 'group' }, 2)).toBe(2)
  })

  it('nests children of other items one level deeper', () => {
    expect(childLevel({ type: 'collapsible' }, 0)).toBe(1)
    expect(childLevel({ type: 'link' }, 1)).toBe(2)
  })
})
