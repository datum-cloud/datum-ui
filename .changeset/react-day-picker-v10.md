---
"@datum-cloud/datum-ui": minor
---

Support `react-day-picker` v10. Migrated picker calendar from the removed `fromDate`/`toDate` props to `startMonth`/`endMonth`, and removed `initialFocus` from the time-range picker's absolute-range panel (no longer a prop in v10). The peer range remains `>=9` so both v9 and v10 are supported by consumers.
