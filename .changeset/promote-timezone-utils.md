---
"@datum-cloud/datum-ui": minor
---

Promote timezone-to-UTC timestamp helpers into the public `/utils` subpath.

**Added**

- `toUTCTimestampStartOfDay(date, timezone)` — returns Unix timestamp (seconds) for the start of a day in the given IANA timezone.
- `toUTCTimestampEndOfDay(date, timezone)` — returns Unix timestamp (seconds) for the end of a day in the given IANA timezone.

Both functions are ported verbatim from cloud-portal's vendored `app/modules/datum-ui/utils/timezone.ts`. Consumers can now import them from `@datum-cloud/datum-ui/utils`:

```ts
import {
  toUTCTimestampEndOfDay,
  toUTCTimestampStartOfDay,
} from '@datum-cloud/datum-ui/utils'
```

No breaking changes.
