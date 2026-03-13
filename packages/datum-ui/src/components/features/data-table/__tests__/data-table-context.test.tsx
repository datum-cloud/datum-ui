/// <reference types="@testing-library/jest-dom/vitest" />
import type { ReactNode } from 'react'
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TableInstanceContext, useDataTableContext, useDataTableStore, useTableInstance, useTableInstanceOrNull } from '../core/data-table-context'

describe('useDataTableStore', () => {
  it('throws when used outside provider', () => {
    expect(() => {
      renderHook(() => useDataTableStore())
    }).toThrow('useDataTableStore must be used within a <DataTable.Client> or <DataTable.Server> provider')
  })
})

describe('useTableInstance', () => {
  it('throws when used outside provider', () => {
    expect(() => {
      renderHook(() => useTableInstance())
    }).toThrow('useTableInstance: table instance not yet available')
  })
})

describe('useTableInstanceOrNull', () => {
  it('returns null when TableInstanceContext has no value', () => {
    const wrapper = ({ children }: { readonly children: ReactNode }) => (
      <TableInstanceContext value={null}>
        {children}
      </TableInstanceContext>
    )
    const { result } = renderHook(() => useTableInstanceOrNull(), { wrapper })
    expect(result.current).toBeNull()
  })

  it('returns the table when TableInstanceContext has a value', () => {
    const mockTable = { fake: true } as any
    const wrapper = ({ children }: { readonly children: ReactNode }) => (
      <TableInstanceContext value={mockTable}>
        {children}
      </TableInstanceContext>
    )
    const { result } = renderHook(() => useTableInstanceOrNull(), { wrapper })
    expect(result.current).toBe(mockTable)
  })
})

describe('useDataTableContext (legacy)', () => {
  it('throws when used outside provider', () => {
    expect(() => {
      renderHook(() => useDataTableContext())
    }).toThrow('useDataTableContext must be used within a DataTable provider')
  })
})
