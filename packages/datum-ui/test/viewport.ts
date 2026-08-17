/**
 * Shared viewport / matchMedia test seam.
 *
 * jsdom does not implement window.matchMedia. Rather than have every test file
 * hand-roll its own matchMedia mock, this module installs a single mock that
 * evaluates `min-width` / `max-width` media queries against a mutable current
 * viewport width. Call `setViewport(width)` to drive responsive code under test,
 * and `resetViewport()` (e.g. in afterEach) to restore the default.
 */

// Default to a desktop width. A width of 0 made `max-width` queries (e.g. the
// grid's `(max-width: 575px)` mobile breakpoint) evaluate to `matches: true`,
// so responsive components silently rendered in MOBILE mode in any test that
// did not call `setViewport()`. A sane desktop default makes them render in
// desktop mode by default: `max-width` mobile queries evaluate `false` and
// `min-width` desktop queries evaluate `true`. Tests that need a specific
// viewport must call `setViewport(width)` explicitly (all current responsive
// tests already do).
const DEFAULT_VIEWPORT_WIDTH = 1440

let currentWidth = DEFAULT_VIEWPORT_WIDTH

function evaluateQuery(query: string): boolean {
  const min = query.match(/min-width:\s*(\d+)px/)
  const max = query.match(/max-width:\s*(\d+)px/)
  const minOk = min ? currentWidth >= Number(min[1]) : true
  const maxOk = max ? currentWidth <= Number(max[1]) : true
  return minOk && maxOk
}

function createMediaQueryList(query: string): MediaQueryList {
  return {
    matches: evaluateQuery(query),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  } as unknown as MediaQueryList
}

/** Install the shared matchMedia mock on `window`. Called once from test setup. */
export function installMatchMedia(): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => createMediaQueryList(query),
  })
  // Keep `window.innerWidth` (read directly by width-based hooks like
  // useBreakpoint) consistent with the matchMedia width from the start.
  setViewport(DEFAULT_VIEWPORT_WIDTH)
}

/** Set the current viewport width and update `window.innerWidth`. */
export function setViewport(width: number): void {
  currentWidth = width
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  })
}

/** Restore the default viewport width. Call from afterEach when a test set it. */
export function resetViewport(): void {
  setViewport(DEFAULT_VIEWPORT_WIDTH)
}
