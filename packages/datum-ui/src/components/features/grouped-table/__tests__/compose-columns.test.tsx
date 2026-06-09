import type { ColumnDef } from '@tanstack/react-table'
import { describe, expect, it } from 'vitest'
import { composeColumns } from '../lib/compose-columns'

interface Row { name: string }
const base: ColumnDef<Row, unknown>[] = [{ accessorKey: 'name', header: 'Name', cell: i => i.getValue() as string }]

describe('composeColumns', () => {
  it('returns base columns unchanged when no options are set', () => {
    expect(composeColumns(base, {})).toHaveLength(1)
  })
  it('prepends a selection column', () => {
    const out = composeColumns(base, { enableRowSelection: true })
    expect(out[0]?.id).toBe('select')
    expect(out).toHaveLength(2)
  })
  it('appends an actions column when rowActions is set', () => {
    const out = composeColumns(base, { rowActions: () => [] })
    expect(out[out.length - 1]?.id).toBe('actions')
  })
  it('places selection first and actions last together', () => {
    const out = composeColumns(base, { enableRowSelection: true, rowActions: () => [] })
    expect(out[0]?.id).toBe('select')
    expect(out[out.length - 1]?.id).toBe('actions')
  })

  it('wraps string headers as sortable when enableSorting is set', () => {
    const out = composeColumns(base, { enableSorting: true })
    expect(typeof out[0]?.header).toBe('function')
    expect(out[0]?.enableSorting).toBe(true)
  })

  it('leaves columns with custom header renderers untouched', () => {
    const custom: ColumnDef<Row, unknown>[] = [{ id: 'x', header: () => null, cell: () => null }]
    const out = composeColumns(custom, { enableSorting: true })
    expect(out[0]).toBe(custom[0]) // same reference — not modified
  })
})
