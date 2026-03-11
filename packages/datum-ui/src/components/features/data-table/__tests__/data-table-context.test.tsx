/// <reference types="@testing-library/jest-dom/vitest" />
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useDataTableContext, useDataTableStore, useTableInstance } from '../core/data-table-context'

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
    }).toThrow('useTableInstance must be used within a <DataTable.Client> or <DataTable.Server> provider')
  })
})

describe('useDataTableContext (legacy)', () => {
  it('throws when used outside provider', () => {
    expect(() => {
      renderHook(() => useDataTableContext())
    }).toThrow('useDataTableContext must be used within a DataTable provider')
  })
})
