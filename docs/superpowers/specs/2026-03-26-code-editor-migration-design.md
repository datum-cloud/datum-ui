# Code Editor Component Migration Design

**Date:** 2026-03-26  
**Status:** Approved  
**Approach:** Integration with datum-ui patterns (Approach 2)

## Overview

Migrate the Monaco-based code editor component from staff-portal to datum-ui, integrating it with datum-ui's existing patterns (Tabs, Toast) while maintaining full feature parity. The component provides a Monaco Editor wrapper with dual JSON/YAML format support, validation, and theme integration.

## Goals

- Provide reusable code editor components for datum-ui consumers
- Maintain API compatibility with staff-portal version
- Integrate with datum-ui's component ecosystem (Tabs, Toast)
- Keep optional dependencies separate (Monaco, js-yaml) for lean package size
- Follow datum-ui's established patterns and conventions

## Source Analysis

**Original Location:** `staff-portal/app/modules/datum-ui/code-editor`

**Components:**
1. **CodeEditor** - Base Monaco wrapper (single language support)
2. **CodeEditorTabs** - Tabbed interface with JSON ↔ YAML conversion

**Key Features:**
- Monaco Editor integration with VS Code experience
- Theme-aware (automatic light/dark mode)
- Dual-format editing (JSON ↔ YAML) with seamless conversion
- Form-compatible (works with React Hook Form)
- Validation with Zod schemas
- Error handling with toast notifications
- Responsive layout with automatic resizing

**Dependencies:**
- `@monaco-editor/react` (v4.7.0)
- `monaco-editor`
- `js-yaml` (v4.1.0)
- `zod` (already in datum-ui)

## Architecture

### Directory Structure

```
src/components/features/code-editor/
├── index.ts                    # Public exports
├── code-editor.tsx             # Base Monaco wrapper component
├── code-editor-tabs.tsx        # Tabbed dual-format version
├── lib/
│   └── editor.ts               # Format conversion & validation utilities
├── types.ts                    # TypeScript interfaces & Zod schemas
└── __tests__/
    ├── code-editor.test.tsx
    ├── code-editor-tabs.test.tsx
    └── editor.test.ts
```

### Package Export

**File:** `packages/datum-ui/package.json`

```json
{
  "exports": {
    "./code-editor": {
      "source": "./src/components/features/code-editor/index.ts",
      "types": "./dist/components/features/code-editor/index.d.ts",
      "default": "./dist/code-editor/index.mjs"
    }
  }
}
```

### Public API

**Exports from `index.ts`:**
- **Components:** `CodeEditor`, `CodeEditorTabs`
- **Utilities:** `jsonToYaml`, `yamlToJson`, `formatJson`, `formatYaml`, `isValidJson`, `isValidYaml`
- **Schemas:** `jsonSchema`, `yamlSchema`, `createCodeEditorSchema`
- **Types:** `CodeEditorProps`, `CodeEditorTabsProps`, `EditorLanguage`

## Integration with datum-ui Patterns

### 1. Tabs Component

**Change:** Use datum-ui's Tabs components instead of importing directly from Radix.

**Before (staff-portal):**
```tsx
import * as TabsPrimitive from '@radix-ui/react-tabs'
```

**After (datum-ui):**
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../base/tabs'
// or: import { Tabs, TabsList, TabsTrigger, TabsContent } from '@datum-cloud/datum-ui/tabs'
```

**Rationale:**
- Maintains visual consistency with datum-ui's tab styling
- Reuses existing components (smaller bundle)
- Easier maintenance when tabs implementation changes

### 2. Toast System

**Change:** Use datum-ui's toast utility instead of importing sonner directly.

**Before (staff-portal):**
```tsx
import { toast } from 'sonner'
toast.error('Conversion failed', { id: 'json-to-yaml-error', duration: Infinity })
```

**After (datum-ui):**
```tsx
import { toast } from '../../toast'
// or: import { toast } from '@datum-cloud/datum-ui/toast'
toast.error('Conversion failed', { id: 'json-to-yaml-error' })
```

**Rationale:**
- datum-ui's `toast.error()` already defaults to `Infinity` duration
- Consistent error styling across datum-ui
- Abstraction layer for future toast provider changes

### 3. Theme Integration

**No Change:** Keep existing pattern using datum-ui's theme hook.

```tsx
import { useTheme } from '@datum-cloud/datum-ui/theme'
const { theme } = useTheme()
const monacoTheme = theme === 'dark' ? 'vs-dark' : 'light'
```

### 4. Utilities

**No Change:** Continue using datum-ui's `cn()` utility for className merging.

```tsx
import { cn } from '../../../utils/cn'
```

## Component API & Behavior

### CodeEditor Component

**Purpose:** Basic Monaco Editor wrapper with single language support.

**Props (unchanged from staff-portal):**
```typescript
interface CodeEditorProps {
  value: string
  onChange?: (value: string) => void
  language: EditorLanguage  // e.g., 'yaml', 'json', 'typescript'
  id?: string
  name?: string
  error?: string
  className?: string
  readOnly?: boolean
  minHeight?: string  // default: '200px'
}
```

**Behavior:**
- Monaco Editor with customizable language support
- Automatic theme switching (light/dark)
- Auto-formatting on mount
- Responsive layout with automatic resizing
- Minimap disabled by default
- Hidden input field for form integration
- Read-only mode support
- Custom error state styling

**Changes from staff-portal:** None (only internal import paths)

### CodeEditorTabs Component

**Purpose:** Tabbed interface with JSON ↔ YAML conversion and validation.

**Props (unchanged from staff-portal):**
```typescript
interface CodeEditorTabsProps {
  value: string
  onChange?: (value: string, format: EditorLanguage) => void
  format?: EditorLanguage  // 'json' or 'yaml', default: 'yaml'
  onFormatChange?: (format: EditorLanguage) => void
  error?: string
  id?: string
  name?: string  // default: 'code-editor'
  minHeight?: string  // default: '300px'
}
```

**Behavior:**
- Dual-format editing (JSON ↔ YAML)
- Automatic bidirectional conversion
- Real-time validation before conversion
- Error toasts with infinite duration for conversion failures
- Maintains sync between both formats
- External value synchronization
- Hidden format field for form submission
- Tab switching with validation

**Changes from staff-portal:**
- Tabs UI rendered using datum-ui's `Tabs` components
- Error toasts use datum-ui's `toast.error()`
- Visual styling matches datum-ui patterns
- Behavior identical

### Utility Functions (lib/editor.ts)

**No changes - Copy as-is from staff-portal.**

**Functions:**
```typescript
jsonToYaml(jsonStr: string): string
yamlToJson(yamlStr: string): string
formatJson(jsonStr: string): string
formatYaml(yamlStr: string): string
isValidJson(jsonStr: string): boolean
isValidYaml(yamlStr: string): boolean
```

**YAML Formatting Options:**
- 2-space indentation
- No line wrapping (`lineWidth: -1`)
- No YAML references (`noRefs: true`)

### Validation Schemas (types.ts)

**No changes - Copy Zod schemas as-is.**

**Schemas:**
```typescript
const jsonSchema = z.object({
  jsonContent: z.string()
    .min(1, 'JSON content is required')
    .refine(isValidJson, { message: 'Invalid JSON format' })
})

const yamlSchema = z.object({
  yamlContent: z.string()
    .min(1, 'YAML content is required')
    .refine(isValidYaml, { message: 'Invalid YAML format' })
})

const createCodeEditorSchema = (name?: string) => {
  // Returns format-aware schema based on 'format' field
}
```

## Dependencies

### Package.json Updates

**Optional Peer Dependencies (new):**
```json
{
  "peerDependencies": {
    "@monaco-editor/react": "^4.7.0",
    "monaco-editor": ">=0.44.0",
    "js-yaml": "^4.1.0"
  },
  "peerDependenciesMeta": {
    "@monaco-editor/react": { "optional": true },
    "monaco-editor": { "optional": true },
    "js-yaml": { "optional": true }
  }
}
```

**Rationale:**
- Users only install Monaco and js-yaml if they use code-editor
- Keeps base datum-ui package lightweight (~4MB savings)
- `zod` already exists as peer dependency in datum-ui
- Optional peer dependencies don't break package installation

## Documentation

### 1. README.md

**Update:** Add code-editor to features components table.

**Location:** `packages/datum-ui/README.md`

### 2. CLAUDE.md

**Create:** `src/components/features/code-editor/CLAUDE.md`

**Contents:**
- Component purpose and features
- Required dependencies
- Props documentation for both components
- Integration patterns (standalone, React Hook Form)
- Conversion utilities and validation helpers
- Common use cases and examples

### 3. Docs Site

**Update:** `apps/docs/content/docs/components/features/meta.json`

Add `"code-editor"` under `"---Forms---"` section:
```json
{
  "pages": [
    "---Forms---",
    "form",
    "input-number",
    "input-with-addons",
    "autocomplete",
    "code-editor",
    "calendar-date-picker",
    "dropzone",
    "file-input-button"
  ]
}
```

**Create:** `apps/docs/content/docs/components/features/code-editor.mdx`

**Structure (following form.mdx pattern):**
```markdown
---
title: Code Editor
description: Monaco Editor wrapper with JSON/YAML dual-format support, validation, and theme integration.
---

## Overview
Description of CodeEditor and CodeEditorTabs components.

## Dependencies
Installation command with package-install directive:
```package-install
@monaco-editor/react monaco-editor js-yaml
```

## Usage
Basic import and usage examples for both components.

## Examples
### Basic Editor
JSON, YAML, TypeScript examples

### Tabbed Editor
Format switching example

### With React Hook Form
Integration example

### Read-only Mode
Display-only example

### Error Handling
Validation and error state examples

## API Reference
Props tables for CodeEditor and CodeEditorTabs

## Utilities
Documentation for conversion and validation helpers

## Validation Schemas
Zod schema examples and usage
```

## Testing

### Unit Tests

**File:** `__tests__/code-editor.test.tsx`
- Component renders correctly
- Theme switching (light/dark)
- onChange callback fires with correct value
- Error state displays correctly
- Read-only mode prevents editing
- Hidden form input has correct value

**File:** `__tests__/code-editor-tabs.test.tsx`
- Tab switching works
- JSON to YAML conversion
- YAML to JSON conversion
- Validation prevents invalid conversion
- Error toast appears on conversion failure
- Format field syncs with active tab
- External value updates both editors

**File:** `__tests__/editor.test.ts`
- `jsonToYaml` converts valid JSON to YAML
- `yamlToJson` converts valid YAML to JSON
- `formatJson` formats valid JSON string
- `formatYaml` formats valid YAML string
- `isValidJson` validates JSON correctly
- `isValidYaml` validates YAML correctly
- Edge cases: empty strings, malformed input, special characters

### Storybook Stories

**File:** `apps/storybook/stories/features/code-editor.stories.tsx`

**Stories:**
- **Default (JSON)** - Basic editor with JSON
- **YAML Language** - Basic editor with YAML
- **TypeScript Language** - Basic editor with TypeScript
- **Tabbed Editor** - JSON/YAML format switching
- **With Error** - Error state display
- **Read-only** - Non-editable display
- **Form Integration** - React Hook Form example
- **Custom Height** - Different minHeight values

## Migration Steps Summary

1. **Create directory structure** in `src/components/features/code-editor/`
2. **Copy source files** from staff-portal with updated imports:
   - Replace Radix tabs imports with datum-ui Tabs
   - Replace sonner imports with datum-ui toast
   - Update relative import paths
3. **Update package.json** with optional peer dependencies
4. **Add package export** for `./code-editor`
5. **Create tests** for components and utilities
6. **Create Storybook stories** for interactive examples
7. **Write documentation**:
   - CLAUDE.md in component directory
   - MDX file in docs site
   - Update meta.json in docs
   - Update README.md
8. **Verify integration** with datum-ui patterns
9. **Run tests** and ensure all pass
10. **Create changeset** for minor version bump

## Success Criteria

- ✅ Both CodeEditor and CodeEditorTabs components work identically to staff-portal version
- ✅ All tests pass (unit tests and Storybook visual tests)
- ✅ Documentation complete (CLAUDE.md, docs site, README)
- ✅ Optional peer dependencies installed only when needed
- ✅ Integration with datum-ui Tabs and Toast components
- ✅ Users can import via `@datum-cloud/datum-ui/code-editor`
- ✅ Form integration works (React Hook Form, native forms)
- ✅ Theme switching works (light/dark)
- ✅ JSON ↔ YAML conversion with validation
- ✅ No breaking changes to API

## Non-Goals

- Additional language support beyond what Monaco provides
- Diff viewer mode
- Collaborative editing features
- Code snippets/templates library
- Advanced Monaco features (find/replace, multi-cursor)

These can be added in future iterations based on user feedback.

## Risks & Mitigations

**Risk:** Monaco Editor bundle size (~4MB) bloats datum-ui package.  
**Mitigation:** Use optional peer dependencies so users only install if needed.

**Risk:** Behavior differences between staff-portal and datum-ui versions.  
**Mitigation:** Copy implementation as-is, only change import paths. Comprehensive tests ensure parity.

**Risk:** Datum-ui Tabs component has different behavior than Radix.  
**Mitigation:** Datum-ui Tabs is a thin wrapper over Radix with only styling changes. API is identical.

**Risk:** Toast styling differs between staff-portal and datum-ui.  
**Mitigation:** Visual inspection in Storybook. Acceptable as long as error messages are clear.

## Future Enhancements

- Additional language syntax support (SQL, GraphQL, etc.)
- Diff viewer mode for comparing versions
- Code snippets/templates
- Find and replace functionality
- Multi-cursor editing
- Inline validation decorations
- Auto-completion support
- Format conversion beyond JSON/YAML (TOML, XML)

These are out of scope for initial migration but can be added based on user demand.
