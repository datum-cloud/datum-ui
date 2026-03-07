# @datum-cloud/datum-ui

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
