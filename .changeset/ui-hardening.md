---
"@datum-cloud/datum-ui": minor
---

Broad correctness and hardening pass across the component library:

- Fixed bugs across base and feature components: button sizing, alert dismissal,
  responsive dropdown/popover handlers and modal default, sidebar state, multi-select
  selection, autocomplete/autosearch, tag-input, transfer, input-number, task-queue
  scheduling/timeout/reload, date-time pickers, grid gutters, code-editor YAML precision,
  rich-text editor, and data-table.
- Fixed form data integrity: multi-step value merging, adapter type preservation, and
  dirty-state detection for Date/Map defaults.
- Fixed the map module (listener leaks, crash paths) and place-autocomplete refetch loop.
- Fixed theming/no-flash scripts and shared hooks (copy-to-clipboard, debounce, breakpoint).
- Tightened peer dependency ranges to the tested majors (e.g. react-day-picker v10);
  consumers on older majors should verify.
- Internal: split oversized modules, removed the legacy picker family, added import-layering
  enforcement, an export generator, and coverage/test gates.
