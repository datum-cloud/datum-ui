---
'@datum-cloud/datum-ui': patch
---

GroupedTable was slicing rows to TanStack's default page of 10, so later groups (Notes, Platform Core, Other) rendered as open headers with no rows. Show every filtered row, and animate group open/close with Motion height:auto instead of Radix CollapsibleContent so later groups cannot measure as 0px height.
