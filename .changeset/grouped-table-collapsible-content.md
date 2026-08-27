---
'@datum-cloud/datum-ui': patch
---

GroupedTable was slicing rows to TanStack's default page of 10, so later groups (Notes, Platform Core, Other) rendered as open headers with no rows. Show every filtered row, and stop wrapping group bodies in Radix CollapsibleContent so they cannot measure as 0px height.
