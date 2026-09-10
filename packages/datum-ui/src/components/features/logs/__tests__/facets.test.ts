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

  it('ignores non-canonical labels unless they are requested', () => {
    const facets = facetsFromEntries([
      {
        id: '1',
        timestamp: new Date(),
        timestampNs: '1',
        line: 'hello',
        labels: { severity: 'INFO', trace_id: 'abc', job: 'api' },
      },
    ])
    expect(facets.map(facet => facet.name)).toEqual(['severity'])

    const all = facetsFromEntries([
      {
        id: '1',
        timestamp: new Date(),
        timestampNs: '1',
        line: 'hello',
        labels: { severity: 'INFO', trace_id: 'abc' },
      },
    ], ['severity', 'trace_id'])
    expect(all.map(facet => facet.name)).toEqual(['severity', 'trace_id'])
    expect(all.map(facet => facet.label)).toEqual(['Severity', 'Trace id'])
  })

  it('capitalizes the first letter of unmapped facet names', () => {
    const facets = facetsFromEntries([
      {
        id: '1',
        timestamp: new Date(),
        timestampNs: '1',
        line: '',
        labels: { method: 'GET', response_code: '200' },
      },
    ], ['method', 'response_code'])
    expect(facets.map(facet => facet.label)).toEqual(['Method', 'Response code'])
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

  it('matches a search against stream labels when the line is empty', () => {
    const otel = filterEntries([
      {
        id: '1',
        timestamp: new Date(),
        timestampNs: '1',
        line: '',
        labels: { path: '/projects/demo-app', method: 'GET' },
      },
    ], {}, 'demo-app')
    expect(otel).toHaveLength(1)
  })

  it('only searches fields that are shown on screen', () => {
    const entry = {
      id: '1',
      timestamp: new Date(),
      timestampNs: '1',
      line: '',
      labels: {
        method: 'GET',
        path: '/health',
        response_code: '304',
        requested_server_name: 'app.example.com',
        request_id: 'c2e2f200-7e45-4d1a-9f4e-9a51d0b5c200',
        user_agent: 'Mozilla/5.0',
      },
    }
    expect(filterEntries([entry], {}, '304')).toHaveLength(1)
    expect(filterEntries([entry], {}, 'app.example')).toHaveLength(1)
    // `200` appears in request_id but nowhere visible, so it must not match.
    expect(filterEntries([entry], {}, '200')).toHaveLength(0)
    expect(filterEntries([entry], {}, 'mozilla')).toHaveLength(0)
  })
})
