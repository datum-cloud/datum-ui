---
"@datum-cloud/datum-ui": minor
---

Adds `@datum-cloud/datum-ui/error-content`: `ErrorContent`, `describeApiError` and `ErrorDescriptionProvider` for plain-language errors that keep the raw text under Error details. A failed `DataTable.Server` load now shows an error with Retry instead of "No results."; the store has `refetch()` and `DataTable.Content` takes `errorContent`. TaskQueue formats thrown errors (override with `formatError`) and shows the raw text in its summary. Dropzone explains each rejected file and adds `onReject`.
