---
'@datum-cloud/datum-ui': minor
---

`Logs.Root` takes `isFetching` for requests made while earlier results are still showing (filter, search or range changes, refreshes). The explorer keeps those results, dims the rows, spins the Refresh icon and shows a progress bar under the toolbar instead of swapping to skeletons, which are now only for the first load (`isLoading`). No bar shows while Live is on. While a request is in flight, `Logs.Root` also keeps the last facets that had options, so filters don't blank out on each click.
