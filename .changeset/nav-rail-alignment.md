---
"@datum-cloud/datum-ui": patch
---

Keep `AppNavigation` rows at the same height whether the sidebar is collapsed or expanded, so hover-expanding no longer shifts the hovered item out from under the pointer. Group headers keep their row in the icon rail (shown as a short rule), and rail rows lose the extra baseline space under their tooltip wrapper. Group headers also no longer take an active background when a child route is selected.

Collapsing and expanding is now one smooth motion: icons stay at the same position in both states, rows shrink with the sidebar instead of snapping to the rail shape first, and labels, badges and chevrons fade out as the edge passes them. Rail tooltips open only for a hover that starts while the sidebar is collapsed, so leaving a hover-expanded sidebar no longer flashes the last row's tooltip.
