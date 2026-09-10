import type { LogEntry } from '../types'
import { describe, expect, it } from 'vitest'
import {
  formatBucketSummary,
  formatTimelineTick,
  histogramBucketIndex,
  histogramFromEntries,
  histogramSpanMs,
} from '../utils/histogram'

function entry(id: string, iso: string): LogEntry {
  return { id, timestamp: new Date(iso), timestampNs: '0', line: 'x', labels: {} }
}

const range = { from: '2026-08-13T11:00:00.000Z', to: '2026-08-13T12:00:00.000Z' }

describe('histogramFromEntries', () => {
  it('splits the range into equal buckets and counts entries', () => {
    const histogram = histogramFromEntries([
      entry('a', '2026-08-13T11:00:00.000Z'),
      entry('b', '2026-08-13T11:00:30.000Z'),
      entry('c', '2026-08-13T11:31:00.000Z'),
      entry('d', '2026-08-13T12:00:00.000Z'),
      entry('out', '2026-08-13T12:00:01.000Z'),
    ], range, 60)

    expect(histogram).toHaveLength(60)
    expect(histogram[0]).toEqual({
      start: '2026-08-13T11:00:00.000Z',
      end: '2026-08-13T11:01:00.000Z',
      count: 2,
    })
    expect(histogram[31]!.count).toBe(1)
    expect(histogram[59]!.count).toBe(1)
    expect(histogram[59]!.end).toBe(range.to)
    expect(histogram.reduce((sum, bucket) => sum + bucket.count, 0)).toBe(4)
  })

  it('returns an empty histogram for invalid or inverted ranges', () => {
    expect(histogramFromEntries([], { from: 'nope', to: range.to })).toEqual([])
    expect(histogramFromEntries([], { from: range.to, to: range.from })).toEqual([])
    expect(histogramFromEntries([], range, 0)).toEqual([])
  })
})

describe('histogram helpers', () => {
  const histogram = histogramFromEntries([], range, 4)

  it('finds the bucket containing a date, including the closing edge', () => {
    expect(histogramBucketIndex(histogram, new Date('2026-08-13T11:00:00.000Z'))).toBe(0)
    expect(histogramBucketIndex(histogram, new Date('2026-08-13T11:15:00.000Z'))).toBe(1)
    expect(histogramBucketIndex(histogram, new Date('2026-08-13T12:00:00.000Z'))).toBe(3)
    expect(histogramBucketIndex(histogram, new Date('2026-08-13T12:00:01.000Z'))).toBe(-1)
    expect(histogramBucketIndex([], new Date())).toBe(-1)
  })

  it('reports the total span', () => {
    expect(histogramSpanMs(histogram)).toBe(60 * 60 * 1000)
    expect(histogramSpanMs([])).toBe(0)
  })

  it('formats ticks with precision that follows the span', () => {
    const date = new Date('2026-08-13T11:05:09.000Z')
    expect(formatTimelineTick(date, 60 * 1000)).toMatch(/^\d{2}:\d{2}:\d{2}$/)
    expect(formatTimelineTick(date, 60 * 60 * 1000)).toMatch(/^\d{2}:\d{2}$/)
    expect(formatTimelineTick(date, 3 * 24 * 60 * 60 * 1000)).toMatch(/^Aug 13 \d{2}:\d{2}$/)
  })

  it('summarises a bucket with its count and window', () => {
    expect(formatBucketSummary(histogram[0]!, histogramSpanMs(histogram)))
      .toMatch(/^0 logs · \d{2}:\d{2} – \d{2}:\d{2}$/)
    const narrow = histogramFromEntries([entry('a', range.from)], range, 120)
    expect(formatBucketSummary(narrow[0]!, histogramSpanMs(narrow)))
      .toMatch(/^1 log · \d{2}:\d{2}:\d{2} – \d{2}:\d{2}:\d{2}$/)
  })
})
