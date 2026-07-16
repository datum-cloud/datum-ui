---
"@datum-cloud/datum-ui": minor
---

Add the `assistant` feature (`@datum-cloud/datum-ui/assistant`): a props-driven AI assistant workspace plus composable pieces (conversation, composer, message rendering, turn rail, history) and an `AssistantConfig` context for host-specific copy, models, tool labels, and link rendering. Host apps own state and transport and feed the workspace via props, so staff-portal and cloud-portal share one presentational layer.
