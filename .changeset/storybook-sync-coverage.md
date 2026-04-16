---
"@repo/storybook": patch
---

Cover the components and props synced from cloud-portal in `@datum-cloud/datum-ui@0.7`.

**Added stories**

- `base/mobile-sheet` — Default, WithDescription, NoFooter
- `base/responsive-dropdown` — Default menu, WithCustomContent. Children use plain buttons because Radix `DropdownMenuItem` requires a `DropdownMenu` context that only exists on the desktop branch of `ResponsiveDropdown`.
- `features/rich-text-editor` — Editor + ReadOnly (`RichTextContent`)
- `features/form-dialog` — `showHeaderClose` toggle
- `base/responsive-popover` — Default, ResponsiveFalse
- `features/multi-select` — Default, WithPresetSelection

**Enhanced stories**

- `features/tag-input` — new variants covering `delimiters`, `normalizer`, `validator`, and auto-confirm-on-blur
- `features/page-title` — `LongDescription` variant showing the new `max-w-2xl` constraint
- `base/tooltip` — docs note describing the new mobile long-press behavior

**Styling**

- `stories/storybook.css` opts into `@datum-cloud/datum-ui/styles/canela` so the `font-title` utility renders Canela instead of the system-sans fallback.
