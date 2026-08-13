import type { LogEntry } from '../types'
import { describe, expect, it } from 'vitest'
import { histogramFromEntries } from '../utils/histogram'

function entry(id: string, iso: string): LogEntry {
  const timestamp = new Date(iso)
  return {
    id,
    timestamp,
    timestampNs: `${timestamp.getTime()}000000`,
    line: id,
    labels: {},
  }
}

describe('histogramFromEntries', () => {
  it('buckets entries across the provided time range', () => {
    const buckets = histogramFromEntries(
      [
        entry('a', '2026-08-13T11:00:00.000Z'),
        entry('b', '2026-08-13T11:00:00.000Z'),
        entry('c', '2026-08-13T11:30:00.000Z'),
      ],
      { from: '2026-08-13T11:00:00.000Z', to: '2026-08-13T12:00:00.000Z' },
      2,
    )

    expect(buckets).toHaveLength(2)
    expect(buckets[0]?.count).toBe(2)
    expect(buckets[1]?.count).toBe(1)
  })

  it('returns an empty list when there is no range or data', () => {
    expect(histogramFromEntries([])).toEqual([])
  })
})
