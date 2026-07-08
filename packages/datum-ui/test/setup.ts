import { installMatchMedia } from './viewport'
import '@testing-library/jest-dom/vitest'

// jsdom does not implement window.matchMedia — install the shared mock that
// evaluates media queries against a mutable viewport width. Tests drive it via
// setViewport()/resetViewport() from test/viewport.ts. The default is a desktop
// width so responsive components render in desktop mode (not mobile) for tests
// that never touch the viewport; see test/viewport.ts for the rationale.
installMatchMedia()

// jsdom does not implement ResizeObserver — provide a mock
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// jsdom does not implement pointer capture methods — provide mocks
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {}
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => {}
}

// jsdom does not implement scrollIntoView — provide a mock
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}

// jsdom does not implement elementFromPoint — provide a mock
// (tiptap 3.24+ placeholder viewport tracking calls posAtCoords -> elementFromPoint)
if (!Document.prototype.elementFromPoint) {
  Document.prototype.elementFromPoint = () => null
}
