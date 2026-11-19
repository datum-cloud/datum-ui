/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PlaceAutocomplete } from '../index'

function feature(name: string, osmId: number) {
  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [13.4, 52.5] },
    properties: { osm_id: osmId, osm_type: 'N', osm_key: 'place', osm_value: 'city', type: 'city', name, country: 'Germany' },
  }
}

function respond(features: ReturnType<typeof feature>[]) {
  return new Response(JSON.stringify({ type: 'FeatureCollection', features }), { status: 200 })
}

afterEach(() => vi.unstubAllGlobals())

describe('placeAutocomplete', () => {
  it('searches after typing and lists the results', async () => {
    const fetchFn = vi.fn((_url: string) => Promise.resolve(respond([feature('Berlin', 1), feature('Bern', 2)])))
    vi.stubGlobal('fetch', fetchFn)
    const onResultsChange = vi.fn()
    render(<PlaceAutocomplete debounceMs={0} onResultsChange={onResultsChange} />)
    await userEvent.type(screen.getByPlaceholderText('Search'), 'Berlin')
    expect(await screen.findByRole('option', { name: /Berlin/ })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /Bern/ })).toBeInTheDocument()
    // The list can show an earlier keystroke's results first; wait for the full query.
    await waitFor(() => expect(String(fetchFn.mock.calls.at(-1)?.[0])).toContain('Berlin'))
    await waitFor(() => expect(onResultsChange).toHaveBeenLastCalledWith(expect.arrayContaining([expect.objectContaining({ properties: expect.objectContaining({ name: 'Berlin' }) })])))
  })

  it('selects a result with the arrow keys and Enter, then closes the list', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(respond([feature('Berlin', 1), feature('Bern', 2)]))))
    const onPlaceSelect = vi.fn()
    render(<PlaceAutocomplete debounceMs={0} onPlaceSelect={onPlaceSelect} />)
    const input = screen.getByPlaceholderText('Search')
    await userEvent.type(input, 'Ber')
    await screen.findByRole('option', { name: /Berlin/ })
    await userEvent.keyboard('{ArrowDown}{Enter}')
    expect(onPlaceSelect).toHaveBeenCalledTimes(1)
    expect(onPlaceSelect.mock.calls[0]![0].properties.name).toMatch(/Bern/)
    await waitFor(() => expect(screen.queryByRole('option')).toBeNull())
  })

  it('closes the list on Escape without selecting', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(respond([feature('Berlin', 1)]))))
    const onPlaceSelect = vi.fn()
    render(<PlaceAutocomplete debounceMs={0} onPlaceSelect={onPlaceSelect} />)
    await userEvent.type(screen.getByPlaceholderText('Search'), 'Berlin')
    await screen.findByRole('option', { name: /Berlin/ })
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('option')).toBeNull())
    expect(onPlaceSelect).not.toHaveBeenCalled()
  })

  it('sends no request for a blank query', async () => {
    const fetchFn = vi.fn()
    vi.stubGlobal('fetch', fetchFn)
    render(<PlaceAutocomplete debounceMs={0} />)
    await userEvent.type(screen.getByPlaceholderText('Search'), '   ')
    await new Promise(resolve => setTimeout(resolve, 20))
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('shows the empty state when nothing matches', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(respond([]))))
    render(<PlaceAutocomplete debounceMs={0} />)
    await userEvent.type(screen.getByPlaceholderText('Search'), 'Nowhere')
    await waitFor(() => expect(screen.getByText(/can't find/i)).toBeInTheDocument())
  })

  it('shows the error state when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    render(<PlaceAutocomplete debounceMs={0} />)
    await userEvent.type(screen.getByPlaceholderText('Search'), 'Berlin')
    // Each letter starts a search, so query afresh rather than hold an element an
    // earlier search rendered.
    await waitFor(() => expect(screen.getByText(/network down/)).toBeInTheDocument())
  })

  it('cancels an earlier search so its late response never replaces the latest results', async () => {
    let resolveFirst: (value: Response) => void = () => {}
    let firstSignal: AbortSignal | undefined
    // Like a real fetch, the first request rejects once its signal aborts.
    const fetchFn = vi.fn()
      .mockImplementationOnce((_url: string, init: RequestInit) => new Promise<Response>((resolve, reject) => {
        resolveFirst = resolve
        firstSignal = init.signal ?? undefined
        firstSignal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
      }))
      .mockImplementation(() => Promise.resolve(respond([feature('Berlin', 1)])))
    vi.stubGlobal('fetch', fetchFn)
    render(<PlaceAutocomplete debounceMs={50} />)
    const input = screen.getByPlaceholderText('Search')
    await userEvent.type(input, 'Ber')
    await waitFor(() => expect(fetchFn).toHaveBeenCalledTimes(1))
    await userEvent.type(input, 'lin')
    expect(await screen.findByRole('option', { name: /Berlin/ })).toBeInTheDocument()
    expect(firstSignal?.aborted).toBe(true)
    resolveFirst(respond([feature('Bermuda', 9)]))
    await new Promise(resolve => setTimeout(resolve, 20))
    expect(screen.queryByRole('option', { name: /Bermuda/ })).toBeNull()
  })
})
