---
"@datum-cloud/datum-ui": minor
---

New `useLogsUrlState()` hook in `@datum-cloud/datum-ui/logs` keeps the log explorer's time range, filters, search, live toggle and open row in the query string, so a refresh or a shared link reopens the same view. Spread its result onto `Logs.Root`. It uses the History API by default, or takes React Router's `useSearchParams()` pair. `parseLogsUrlState` and `writeLogsUrlState` do the same conversion without React.
