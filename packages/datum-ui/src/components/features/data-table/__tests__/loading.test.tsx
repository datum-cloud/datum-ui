/// <reference types="@testing-library/jest-dom/vitest" />
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DataTableLoading } from '../components/loading'

describe('dataTableLoading', () => {
  it('renders skeleton rows', () => {
    const { container } = render(<DataTableLoading rows={3} columns={2} />)

    // 1 header row + 3 data rows = 4 flex containers with gap-4
    const flexRows = container.querySelectorAll('.flex.gap-4')
    expect(flexRows.length).toBe(4) // header + 3 rows
  })

  it('uses default values', () => {
    const { container } = render(<DataTableLoading />)

    // Default: 5 rows + 1 header = 6
    const flexRows = container.querySelectorAll('.flex.gap-4')
    expect(flexRows.length).toBe(6)
  })
})
