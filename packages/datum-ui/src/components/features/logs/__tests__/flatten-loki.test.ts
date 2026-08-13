import { describe, expect, it } from 'vitest'
import { queryRangeFixture } from '../fixtures'
import { flattenLokiStreams, nsToDate } from '../utils/flatten-loki'

describe('flattenLokiStreams', () => {
  it('merges streams from the sample payload and sorts newest first', () => {
    const streams = queryRangeFixture.data?.result ?? []
    expect(streams).toHaveLength(15)

    const entries = flattenLokiStreams(queryRangeFixture)
    const expectedCount = streams.reduce((total, stream) => total + stream.values.length, 0)
    expect(entries).toHaveLength(expectedCount)

    for (let i = 1; i < entries.length; i++) {
      expect(entries[i - 1]!.timestampNs >= entries[i]!.timestampNs).toBe(true)
    }

    const newest = entries[0]!
    expect(newest.labels.resource_name).toBe('payments-api')
    expect(newest.labels.service_name).toBe('compute-workload')
    expect(newest.labels.severity).toBe('INFO')
    expect(newest.line).toContain('payment authorised')
  })

  it('preserves stream labels on every row', () => {
    const entries = flattenLokiStreams(queryRangeFixture)
    const waf = entries.find(entry => entry.line.includes('blocked request'))
    expect(waf?.labels.service_name).toBe('waf')
    expect(waf?.labels.resource_name).toMatch(/^gateway-/)
  })

  it('returns an empty list for error responses', () => {
    expect(flattenLokiStreams({ status: 'error', error: 'bad_data' })).toEqual([])
  })

  it('returns an invalid date for a non-numeric timestamp', () => {
    expect(Number.isNaN(nsToDate('nope').getTime())).toBe(true)
  })
})
