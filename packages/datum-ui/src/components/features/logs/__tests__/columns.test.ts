import { describe, expect, it } from 'vitest'
import { columnSize, resolveLogColumns } from '../components/columns'

describe('resolveLogColumns', () => {
  it('expands built-in ids and keeps custom columns', () => {
    const columns = resolveLogColumns([
      'time',
      {
        id: 'host',
        header: 'Host',
        cell: ({ entry }) => entry.labels.host ?? '—',
      },
      'path',
    ])

    expect(columns.map(column => column.id)).toEqual(['time', 'host', 'path'])
    expect(columnSize(columns[0]!)).toBe('hug')
    expect(columnSize(columns[1]!)).toBe('fixed')
    expect(columnSize(columns[2]!)).toBe('fill')
  })

  it('resolves the built-in host column', () => {
    const [column] = resolveLogColumns(['host'])
    expect(column?.id).toBe('host')
    expect(column?.header).toBe('Host')
    expect(columnSize(column!)).toBe('fixed')
  })
})
