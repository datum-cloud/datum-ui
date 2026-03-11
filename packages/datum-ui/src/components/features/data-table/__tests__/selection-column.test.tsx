/// <reference types="@testing-library/jest-dom/vitest" />
import type { ColumnDef } from '@tanstack/react-table'
import { describe, expect, it } from 'vitest'
import { createSelectionColumn, hasSelectionColumn, withSelectionColumn } from '../columns/selection-column'

describe('selectionColumn', () => {
  it('creates a column with id "select"', () => {
    const col = createSelectionColumn()
    expect(col.id).toBe('select')
    expect(col.enableSorting).toBe(false)
    expect(col.enableHiding).toBe(false)
    expect(col.size).toBe(40)
  })

  it('hasSelectionColumn returns true when select column exists', () => {
    const cols: ColumnDef<unknown, any>[] = [
      { id: 'select', header: 'Select' },
      { id: 'name', header: 'Name' },
    ]
    expect(hasSelectionColumn(cols)).toBe(true)
  })

  it('hasSelectionColumn returns false when no select column', () => {
    const cols: ColumnDef<unknown, any>[] = [
      { id: 'name', header: 'Name' },
    ]
    expect(hasSelectionColumn(cols)).toBe(false)
  })

  it('withSelectionColumn prepends selection column', () => {
    const cols: ColumnDef<unknown, any>[] = [
      { id: 'name', header: 'Name' },
    ]
    const result = withSelectionColumn(cols)
    expect(result).toHaveLength(2)
    expect(result.at(0)?.id).toBe('select')
  })

  it('withSelectionColumn skips if select column already exists', () => {
    const cols: ColumnDef<unknown, any>[] = [
      { id: 'select', header: 'Custom Select' },
      { id: 'name', header: 'Name' },
    ]
    const result = withSelectionColumn(cols)
    expect(result).toHaveLength(2)
    expect(result.at(0)).toBe(cols[0])
  })

  it('withSelectionColumn passes options to createSelectionColumn', () => {
    const cols: ColumnDef<unknown, any>[] = [
      { id: 'name', header: 'Name' },
    ]
    const result = withSelectionColumn(cols, { className: 'custom-class' })
    expect(result).toHaveLength(2)
    expect(result.at(0)?.id).toBe('select')
  })
})
