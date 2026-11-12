---
"@datum-cloud/datum-ui": patch
---

Stop the form adapters marking optional fields that use `.transform()`, `.catch()` or `z.preprocess()` as required, so they no longer show a required asterisk or `aria-required`. Schema defaults now read through the same wrappers, so fields wrapped in `.catch()`, `.readonly()`, `.nonoptional()`, `.prefault()` or `z.preprocess()` start from their type's empty value (or the prefault value) instead of `undefined`.
