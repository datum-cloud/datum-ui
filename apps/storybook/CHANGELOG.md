# @repo/storybook

## 1.0.3

### Patch Changes

- f9b4cb4: Cover the components and props synced from cloud-portal in `@datum-cloud/datum-ui@0.7`.

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

- Updated dependencies [f9b4cb4]
  - @datum-cloud/datum-ui@0.7.0

## 1.0.2

### Patch Changes

- 48e2240: Bump Rsbuild toolchain to latest patches and update the shared publish workflow action.
  - `@rsbuild/core`: `^1` → `^1.7.5`
  - `@rsbuild/plugin-react`: `^1` → `^1.4.6`
  - `datum-cloud/actions` reusable workflows: `v1.13.1` → `v1.13.2`

- Updated dependencies [48e2240]
  - @datum-cloud/datum-ui@0.6.1

## 1.0.1

### Patch Changes

- 2441eef: test production release flow with GIT_PAT

## 1.0.0

### Major Changes

- a397fee: Transforms the Storybook setup from a basic development tool into a production-quality component documentation and exploration platform for both internal developers and external npm consumers.
