---
"@datum-cloud/datum-ui": minor
---

Raise the `zod` peer floor to `>=4.6.6`.

Zod through 4.6.5 has a HIGH memory-exhaustion bug: when a large array fails an array schema without a length constraint, `$ZodArray` collects one issue per failing element with no cap, and the process can run out of memory. The old floor of `>=4` let a consumer install an affected version. Any 4.x release from 4.6.6 on is patched, so moving within the 4.x line is enough.
