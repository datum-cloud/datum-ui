/**
 * Re-export of the shared controllable-state hook.
 *
 * The implementation now lives in `base/hooks` so every value-bearing
 * component can consume the same `(value?, defaultValue, onValueChange)`
 * contract. This module is kept for backward compatibility.
 */
export type { Updater } from '../../../base/hooks'
export { useControllableState } from '../../../base/hooks'
