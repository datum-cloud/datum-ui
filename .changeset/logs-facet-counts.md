---
"@datum-cloud/datum-ui": minor
---

`Logs.Filters` keeps ticked values listed even when the facet data stops including them, so a selection can always be cleared. Previously, if a host built facets from rows already narrowed by the selection, the other options and sometimes the ticked one disappeared. New `buildLogFacetCountQuery` and `facetFromLokiCounts` helpers let hosts fetch each facet's full option list and counts for the time range from Loki, independent of what is ticked.
