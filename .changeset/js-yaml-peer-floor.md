---
"@datum-cloud/datum-ui": minor
---

Raise the `js-yaml` peer floor to `>=5.4.1`.

js-yaml 5.4.0 and earlier are affected by GHSA-r3ph-w7gj-g6xm: `maxTotalMergeKeys` does not count empty mappings, so a document can merge a long sequence of them repeatedly and burn CPU without ever reaching the configured limit. The fix landed in 5.4.1, so the peer range starts there. The old floor was `>=5.2.2`, which let a consumer install an affected version.
