import { describe, expect, it } from 'vitest'
import * as DT from '../index'

describe('data-table barrel reuse exports', () => {
  it('exposes primitives reused by grouped-table', () => {
    expect(typeof DT.createSelectionColumn).toBe('function')
    expect(typeof DT.DataTableColumnHeader).toBe('function')
    expect(typeof DT.DataTableRowActions).toBe('function')
    expect(typeof DT.rowMatchesSearch).toBe('function')
    expect(typeof DT.resolvePath).toBe('function')
  })
})
