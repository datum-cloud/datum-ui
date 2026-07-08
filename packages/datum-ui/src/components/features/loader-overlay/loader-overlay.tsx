/**
 * LoaderOverlay now lives in the base layer (`base/loader-overlay`) so lower
 * tiers such as `base/option-picker` can depend on it without inverting the
 * base -> feature layering. This module re-exports it for backward compatibility.
 */
export { LoaderOverlay } from '../../base/loader-overlay'
