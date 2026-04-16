# @datum-cloud/datum-ui

## 0.7.0

### Minor Changes

- f9b4cb4: Sync behavior and primitives that landed in cloud-portal's vendored `app/modules/datum-ui/` fork between March and April 2026.

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

## 0.6.1

### Patch Changes

- 48e2240: Tighten peer and dependency version ranges following upstream patch releases.
  - `@hookform/resolvers`: `^5` → `^5.2.2`
  - `class-variance-authority`: `^0.7` → `^0.7.1`

  Transitive updates via the inlined shadcn primitives:
  - `@types/geojson`: `^7946` → `^7946.0.16`
  - `@types/leaflet.fullscreen`: `^3` → `^3.0.3`

## 0.6.0

### Minor Changes

- a15efc6: Add pluggable form adapter system supporting Conform.js and React Hook Form

  The form system now uses a pluggable adapter architecture, allowing consumers to choose between Conform.js and React Hook Form as their form library backend.

  **New exports:**
  - `@datum-cloud/datum-ui/form/adapters/conform` - Conform.js adapter (existing behavior)
  - `@datum-cloud/datum-ui/form/adapters/rhf` - React Hook Form adapter (new)

  **Migration:** Wrap your app root with the adapter provider:

  ```tsx
  import { ConformAdapter } from "@datum-cloud/datum-ui/form/adapters/conform";

  function App() {
    return (
      <ConformAdapter>
        {/* existing Form.Root usage unchanged */}
      </ConformAdapter>
    );
  }
  ```

  All existing `Form.*` component APIs remain unchanged. The adapter is selected once at the app level.

## 0.5.0

### Minor Changes

- db5b71d: Add CodeEditor and CodeEditorTabs components - Monaco-based code editor with VS Code UX, dual-format JSON/YAML support, and form integration

## 0.4.0

### Minor Changes

- ce285b3: Expose Avatar component in base components

  This change makes the Avatar component available for import from the main package. The Avatar component provides a user profile picture display with fallback support for initials.

## 0.2.0

### Minor Changes

- 270228f: Overhaul CSS architecture: consumers now own their Tailwind setup. Remove DatumProvider in favor of direct ThemeProvider usage. Theme tokens moved from .theme-alpha scoping to :root/.dark. Remove tw-animate-css and tailwind-scrollbar-hide from package deps. Add ./styles export with "style" condition for PostCSS compatibility.
- 270228f: Add per-component subpath exports so consumers only install peer deps for components they use (e.g. `@datum-cloud/datum-ui/button`). Includes 50 component entries, grouped exports for date-picker/map/dropzone/chart/form, and updated docs/storybook imports.
- dae5ade: Complete restructure of the datum-ui package from a flat component library into a scalable monorepo-based design system with a two-layer architecture (shadcn primitives + datum components), full test suite, Storybook explorer, and Fumadocs documentation site
- dae5ade: Add Typography component (Title, Text, Paragraph, Link, List, Blockquote, Code), Map docs and Storybook stories
- 99e72fd: Ship uncompiled CSS instead of compiled Tailwind output (fixes #16)
  - **Breaking:** Grid and NProgress CSS are now separate optional imports (`@datum-cloud/datum-ui/grid`, `@datum-cloud/datum-ui/nprogress`)
  - **Breaking:** Requires Tailwind CSS v4.0.7+ (v4.2.1+ recommended)
  - Removed CSS compilation from build pipeline — raw CSS files are copied to dist
  - Embedded `@source` directive in shipped CSS for zero-config consumer class scanning
  - Pre-expanded grid system `@apply` directives into self-contained CSS
  - Eliminated duplicate Tailwind stylesheets that caused responsive utility conflicts

### Patch Changes

- 270228f: Fix npm publish lifecycle: restore workspace deps in postpublish instead of postpack so the stripped package.json is used during upload
- 270228f: Fix: republish with workspace dependencies correctly stripped
- dae5ade: Add peer dependency documentation to all component doc pages, fix incorrect dependency listings, and add lucide-react guidance to installation docs
- 270228f: Add package README with full component catalog and AI-friendly documentation, update all docs to show multi-package-manager install tabs

## 0.2.0-alpha.8

### Minor Changes

- 50ce0e8: Ship uncompiled CSS instead of compiled Tailwind output (fixes #16)
  - **Breaking:** Grid and NProgress CSS are now separate optional imports (`@datum-cloud/datum-ui/grid`, `@datum-cloud/datum-ui/nprogress`)
  - **Breaking:** Requires Tailwind CSS v4.0.7+ (v4.2.1+ recommended)
  - Removed CSS compilation from build pipeline — raw CSS files are copied to dist
  - Embedded `@source` directive in shipped CSS for zero-config consumer class scanning
  - Pre-expanded grid system `@apply` directives into self-contained CSS
  - Eliminated duplicate Tailwind stylesheets that caused responsive utility conflicts

## 0.2.0-alpha.7

### Patch Changes

- Fix npm publish lifecycle: restore workspace deps in postpublish instead of postpack so the stripped package.json is used during upload

## 0.2.0-alpha.6

### Patch Changes

- Fix: republish with workspace dependencies correctly stripped

## 0.2.0-alpha.5

### Minor Changes

- Overhaul CSS architecture: consumers now own their Tailwind setup. Remove DatumProvider in favor of direct ThemeProvider usage. Theme tokens moved from .theme-alpha scoping to :root/.dark. Remove tw-animate-css and tailwind-scrollbar-hide from package deps. Add ./styles export with "style" condition for PostCSS compatibility.

## 0.2.0-alpha.4

### Minor Changes

- Add per-component subpath exports so consumers only install peer deps for components they use (e.g. `@datum-cloud/datum-ui/button`). Includes 50 component entries, grouped exports for date-picker/map/dropzone/chart/form, and updated docs/storybook imports.

## 0.2.0-alpha.3

### Patch Changes

- Add package README with full component catalog and AI-friendly documentation, update all docs to show multi-package-manager install tabs

## 0.2.0-alpha.2

### Minor Changes

- d3a7f77: Add Typography component (Title, Text, Paragraph, Link, List, Blockquote, Code), Map docs and Storybook stories

## 0.2.0-alpha.1

### Patch Changes

- Add peer dependency documentation to all component doc pages, fix incorrect dependency listings, and add lucide-react guidance to installation docs

## 0.2.0-alpha.0

### Minor Changes

- Complete restructure of the datum-ui package from a flat component library into a scalable monorepo-based design system with a two-layer architecture (shadcn primitives + datum components), full test suite, Storybook explorer, and Fumadocs documentation site
