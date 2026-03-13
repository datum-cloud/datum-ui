/// <reference types="@testing-library/jest-dom/vitest" />
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DataTableLoading } from '../components/loading'

describe('dataTableLoading', () => {
  it('renders skeleton rows using semantic table elements', () => {
    const { container } = render(<DataTableLoading rows={3} columns={2} />)

    const table = container.querySelector('table')
    expect(table).toBeInTheDocument()

    const thead = container.querySelector('thead')
    expect(thead).toBeInTheDocument()

    const tbody = container.querySelector('tbody')
    expect(tbody).toBeInTheDocument()

    // 1 header row + 3 body rows
    const allRows = container.querySelectorAll('tr')
    expect(allRows).toHaveLength(4)

    // Header has 2 th cells
    const headerCells = thead!.querySelectorAll('th')
    expect(headerCells).toHaveLength(2)

    // Each body row has 2 td cells
    const bodyCells = tbody!.querySelectorAll('td')
    expect(bodyCells).toHaveLength(6) // 3 rows × 2 columns
  })

  it('uses default values', () => {
    const { container } = render(<DataTableLoading />)

    // Default: 5 rows + 1 header = 6 tr elements
    const allRows = container.querySelectorAll('tr')
    expect(allRows).toHaveLength(6)

    // Default: 4 columns
    const headerCells = container.querySelectorAll('th')
    expect(headerCells).toHaveLength(4)
  })

  it('renders skeleton elements inside cells', () => {
    const { container } = render(<DataTableLoading rows={2} columns={3} />)

    // Skeletons in header (3) + body (2×3 = 6) = 9 total
    const skeletons = container.querySelectorAll('[data-slot="skeleton"],.animate-pulse')
    expect(skeletons.length).toBeGreaterThanOrEqual(9)
  })

  it('has data-slot attribute on root', () => {
    const { container } = render(<DataTableLoading />)
    expect(container.querySelector('[data-slot="dt-loading"]')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<DataTableLoading className="custom-class" />)
    const root = container.querySelector('[data-slot="dt-loading"]')
    expect(root?.className).toContain('custom-class')
  })
})
