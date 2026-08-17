// Promoted to the neutral shared module so sibling deprecation-shim features
// consume it without reaching into picker internals. Re-exported here to keep
// any remaining picker-internal references working.
export { useDeprecationWarning } from '../../_shared/use-deprecation-warning'
