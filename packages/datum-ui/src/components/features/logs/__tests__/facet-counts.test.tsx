/// <reference types="@testing-library/jest-dom/vitest" />
import type { LogEntry, LogFacet } from '../types'
import type { LokiVectorResponse } from '../utils/facet-counts'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { Logs } from '../logs'
import { buildLogFacetCountQuery, facetFromLokiCounts } from '../utils/facet-counts'

const window30m = { from: '2026-11-09T09:43:00.000Z', to: '2026-11-09T10:13:00.000Z' }

describe('buildLogFacetCountQuery', () => {
  it('counts one label across the scope and window', () => {
    expect(buildLogFacetCountQuery({
      label: 'response_code',
      matchers: { route_name: ['my-alb'] },
      timeRange: window30m,
    })).toBe('sum by (response_code) (count_over_time({route_name="my-alb"}[1800s]))')
  })

  it('falls back to the default selector without matchers', () => {
    expect(buildLogFacetCountQuery({ label: 'severity', timeRange: window30m }))
      .toBe('sum by (severity) (count_over_time({service_name=~".+"}[1800s]))')
  })

  it('refuses a label LogQL cannot express', () => {
    expect(buildLogFacetCountQuery({ label: 'http.status', timeRange: window30m })).toBeNull()
    expect(buildLogFacetCountQuery({ label: 'x) or vector(1', timeRange: window30m })).toBeNull()
  })

  it('never produces an empty range', () => {
    expect(buildLogFacetCountQuery({ label: 'method', timeRange: { from: 'bad', to: 'bad' } }))
      .toContain('[1s]')
  })
})

describe('facetFromLokiCounts', () => {
  const response: LokiVectorResponse = {
    status: 'success',
    data: {
      resultType: 'vector',
      result: [
        { metric: { response_code: '401' }, value: [1794222780, '1'] },
        { metric: { response_code: '200' }, value: [1794222780, '498'] },
        { metric: { response_code: '0' }, value: [1794222780, '1'] },
        { metric: {}, value: [1794222780, '7'] },
        { metric: { response_code: '503' }, value: [1794222780, '0'] },
      ],
    },
  }

  it('builds sorted options with counts', () => {
    expect(facetFromLokiCounts('response_code', response, { label: 'Status code' })).toEqual({
      name: 'response_code',
      label: 'Status code',
      options: [
        { value: '0', count: 1 },
        { value: '200', count: 498 },
        { value: '401', count: 1 },
      ],
    })
  })

  it('orders severity by level and labels it', () => {
    const facet = facetFromLokiCounts('severity', {
      status: 'success',
      data: { resultType: 'vector', result: [
        { metric: { severity: 'INFO' }, value: [0, '3'] },
        { metric: { severity: 'ERROR' }, value: [0, '1'] },
      ] },
    })
    expect(facet.label).toBe('Severity')
    expect(facet.options.map(option => option.value)).toEqual(['ERROR', 'INFO'])
  })

  it('returns an empty facet for an error or missing response', () => {
    expect(facetFromLokiCounts('method', { status: 'error', error: 'boom' }).options).toEqual([])
    expect(facetFromLokiCounts('method', undefined).options).toEqual([])
  })
})

const entries: LogEntry[] = [
  {
    id: 'a',
    timestamp: new Date('2026-11-09T10:10:00.000Z'),
    timestampNs: '1794222600000000000',
    line: 'GET /a 200',
    labels: { response_code: '200' },
  },
]

describe('logs.Filters with ticked values', () => {
  it('keeps a ticked value listed after the facet stops including it', async () => {
    // Mimics a host that derives facets from rows already narrowed by the
    // filter: once 401 is ticked, the facet no longer lists 401.
    function Narrowing() {
      const [filters, setFilters] = useState<Record<string, string[]>>({})
      const ticked = filters.response_code ?? []
      const facet: LogFacet = {
        name: 'response_code',
        label: 'Status code',
        options: ticked.length ? [{ value: '200', count: 1 }] : [{ value: '200', count: 1 }, { value: '401', count: 1 }],
      }
      return (
        <Logs.Root entries={entries} facets={[facet]} filters={filters} onFiltersChange={setFilters}>
          <Logs.Filters />
        </Logs.Root>
      )
    }

    const user = userEvent.setup()
    render(<Narrowing />)
    await user.click(screen.getByRole('checkbox', { name: '401' }))
    const ticked = screen.getByRole('checkbox', { name: '401' })
    expect(ticked).toBeChecked()

    await user.click(ticked)
    expect(screen.getByRole('checkbox', { name: '401' })).not.toBeChecked()
  })
})
