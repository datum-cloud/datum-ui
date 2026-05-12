---
"@datum-cloud/datum-ui": patch
---

Fix `<DataTable.Server>` infinite update loop when paired with `useNuqsAdapter()` or `useNuqsAdapter({})` (no filters configured). The placeholder parsers map used internally when no filter parsers are supplied was rebuilt on every render — including a fresh `parseAsString.withDefault('')` parser instance — which caused `useQueryStates` to re-subscribe and return a new setter ref each render. That ref churn cascaded into an unstable `StateAdapter` and re-fired the URL-write effect in `useServerTable`, producing a "Maximum update depth exceeded" crash on first render of any page that wanted URL-persisted search/pagination without filters.

Two changes land together:

- `useNuqsAdapter`: the empty-filters sentinel is now a module-scoped constant, so the parsers reference passed to `useQueryStates` is stable across renders and the returned `StateAdapter` is referentially stable.
- `useServerTable`: the `stateAdapter` is captured in a ref and dropped from the URL-write `useEffect` deps, as defense-in-depth so a future adapter-stability regression cannot cascade into the same loop.

Resolves #98.
