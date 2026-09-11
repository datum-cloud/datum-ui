---
"@datum-cloud/datum-ui": minor
---

Switch now shows its state as a glyph: a cross when off, a check when on, drawn inside the thumb. Previously on and off were carried only by the thumb's position and the track's colour, which is easy to misread at a glance — particularly on a dense settings page where several switches sit in a column.

The control grows from 32×18px to 44×24px, and the thumb from 16px to 20px, so a 12px glyph reads as a glyph rather than a smudge. Anything laying switches out in a tight row may need a look. The glyphs are decorative and marked `aria-hidden`; assistive tech still reads state from `role="switch"` and `aria-checked`, which are unchanged.
