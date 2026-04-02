---
'@datum-cloud/datum-ui': minor
---

Add pluggable form adapter system supporting Conform.js and React Hook Form

The form system now uses a pluggable adapter architecture, allowing consumers to choose between Conform.js and React Hook Form as their form library backend.

**New exports:**
- `@datum-cloud/datum-ui/form/adapters/conform` - Conform.js adapter (existing behavior)
- `@datum-cloud/datum-ui/form/adapters/rhf` - React Hook Form adapter (new)

**Migration:** Wrap your app root with the adapter provider:

```tsx
import { ConformAdapter } from '@datum-cloud/datum-ui/form/adapters/conform'

function App() {
  return (
    <ConformAdapter>
      {/* existing Form.Root usage unchanged */}
    </ConformAdapter>
  )
}
```

All existing `Form.*` component APIs remain unchanged. The adapter is selected once at the app level.
