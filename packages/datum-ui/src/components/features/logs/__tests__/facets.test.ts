import { describe, expect, it } from 'vitest'
import { queryRangeFixture } from '../fixtures'
import { facetsFromEntries, filterEntries } from '../utils/facets'
import { flattenLokiStreams } from '../utils/flatten-loki'

describe('facetsFromEntries', () => {
  it('derives canonical facets with counts from the sample', () => {
    const facets = facetsFromEntries(flattenLokiStreams(queryRangeFixture))
    expect(facets.map(facet => facet.name)).toEqual([
      'severity',
      'service_name',
      'resource_name',
    ])

    const severity = facets[0]!
    expect(severity.options[0]?.value).toBe('ERROR')
    expect(severity.options.some(option => option.value === 'INFO' && (option.count ?? 0) > 0)).toBe(true)
  })
})

describe('filterEntries', () => {
  const entries = flattenLokiStreams(queryRangeFixture)

  it('filters by label and line search', () => {
    const errors = filterEntries(entries, { severity: ['ERROR'] })
    expect(errors.length).toBeGreaterThan(0)
    expect(errors.every(entry => entry.labels.severity === 'ERROR')).toBe(true)

    const searched = filterEntries(entries, {}, 'blocked request')
    expect(searched.length).toBeGreaterThan(0)
    expect(searched.every(entry => entry.line.includes('blocked request'))).toBe(true)
  })
})
