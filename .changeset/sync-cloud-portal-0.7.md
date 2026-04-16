---
"@datum-cloud/datum-ui": minor
---

Sync behavior and primitives that landed in cloud-portal's vendored `app/modules/datum-ui/` fork between March and April 2026.

**Added**

- `useBreakpoint` hook returning `'mobile' | 'tablet' | 'desktop'` tier (SSR-safe, matchMedia-backed).
- `MobileSheet` base primitive — bottom-sheet wrapper around `Sheet` for mobile UX.
- `ResponsiveDropdown` base primitive — `DropdownMenu` on desktop/tablet, `MobileSheet` on mobile.
- `RichTextEditor` feature component (compound API: `RichTextEditor.Toolbar`, `.Bold`, `.Italic`, `.Underline`, `.Strike`, `.Link`, `.Content`, `.CharacterCount`) with TipTap 3.x as optional peer deps.
- `RichTextContent` read-only renderer with DOMPurify sanitization.
- Optional Canela font export at `@datum-cloud/datum-ui/styles/canela` (opt-in; default stack is system sans).
- Mobile long-press tooltip support via `TouchTooltipBubble` (500ms press → show, 1500ms auto-dismiss).
- `ResponsivePopover` base primitive — `Popover` on desktop/tablet, `MobileSheet` on mobile. Honors `InSheetContext` to avoid sheet-in-sheet stacking.
- `InSheetContext` / `useInSheet` helper exported from `@datum-cloud/datum-ui/mobile-sheet` — lets nested responsive components detect when they're already inside a sheet and stay as popovers.
- `MultiSelect` feature component (ported from cloud-portal) with responsive overlay support.

**Changed**

- `PageTitle` — title now uses `font-title text-3xl leading-none`, description gains `max-w-2xl`, title span exposes `data-e2e="page-title"`.
- `TagsInput` — new optional props `delimiters`, `normalizer`, `validator` (Zod); auto-confirms pending input on blur. Defaults preserve existing behavior.
- `Form.Dialog` — new optional `showHeaderClose` prop (default `true`); passing `false` disables the header close (X).
- `Form.Field` — label row now uses `items-start` (visual alignment change — multi-line labels now top-align with help icon). New optional `showErrors` prop (default `true`). Help-icon tooltip now wraps responsively on narrow viewports (`w-[calc(100vw-2rem)] sm:w-auto sm:max-w-xs`).
- `TimeRangePicker` — renders inside `MobileSheet` on mobile viewports; existing Popover behavior preserved on tablet/desktop.
- `Tooltip` — `TooltipContent` gains `max-w-[calc(100vw-2rem)]` so narrow viewports don't clip long messages.
- `TaskQueueDropdown` now uses `ResponsiveDropdown` — renders as a bottom sheet on mobile with a "Tasks" title; keeps the desktop dropdown layout (384px fixed width) on ≥768px viewports. `TaskPanelHeader` is hidden on mobile. Upstream's `summaryRenderContent` feature is preserved.
- `ResponsiveDropdown` gains optional `responsive?: boolean` prop (default `true`) and honors `InSheetContext` — nested instances inside a `MobileSheet` automatically stay as dropdowns to prevent sheet-in-sheet stacking.
- Popover/dropdown consumers are now responsive by default. Each gains optional `responsive?: boolean` (default `true`) and `sheetTitle?: string` props. Desktop behavior unchanged. Affected: `Combobox`, `Autocomplete`, `Autosearch`, `CalendarDatePicker`, `DateTimePicker`, `MoreActions`, `RichTextEditor` link toolbar, `AbsoluteRangePanel` (TimeRangePicker internal, context-suppressed), `DataTable` row actions and checkbox/select filter popovers.

- Option-picker components (`Autocomplete`, `MultiSelect`, `Autosearch`, `CheckboxFilter`) now share an internal engine (`useOptionPicker` + `OptionList`) that owns search filtering, keyboard navigation, empty/creatable rows, and virtualization. No public API changes — the refactor is internal and behavior-preserving.

- `CalendarDatePicker` internally decomposed into 5 focused files (types, hook, header, presets, trigger + composition root). No public API changes — 901 lines → 170-line composition root.
- `MoreActions` action shape renamed: `action` property → `onClick` for consistency with `DataTable`'s `ActionItem<TData>`. Shared `ActionRow` component extracted; consumed by both `MoreActions` and `DataTable` row actions.

- `CheckboxFilter` (data-table) is now a thin adapter over `MultiSelect`. Visually matches MultiSelect's badge trigger. No public API change to `FilterCheckboxProps`.
- `CalendarDatePicker` and `DateTimePicker` share a `useDateConstraints` hook for minDate/maxDate/disablePast/disableFuture constraint derivation (internal, no API change). `DateTimePicker` gains optional `disablePast`/`disableFuture` props.
- `TimePicker` upgraded from native `<input type="time">` to a scrollable time-slot dropdown (ResponsivePopover + OptionList). Breaking: `step` prop is now in minutes (default 15); native mobile time picker replaced by MobileSheet with time slots.

**Removed**

- `Combobox` is removed. Migrate to `Autocomplete` — the APIs overlap for the common case (`options`, `value`, `onValueChange`, `placeholder`, `disabled`). `Autocomplete` additionally supports option grouping, virtualization, custom rendering, and creatable items. `Form.Combobox` continues to work (now wraps `Autocomplete` internally).

**Dependencies**

- New optional peer deps: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-underline`, `@tiptap/extension-character-count`, `@tiptap/extension-placeholder` (all `>=3`, required only if consuming `RichTextEditor`).
- New runtime dep: `isomorphic-dompurify` (required by `RichTextContent` sanitization).
