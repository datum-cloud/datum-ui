---
'@datum-cloud/datum-ui': patch
---

Fix `ResponsiveDropdown` closing when the window loses focus. `@radix-ui/react-menu` ≥2.1.17 closes menus on window blur, which unmounted dropdown content whenever the native file picker opened (or the user switched apps to drag a file in) — silently breaking flows like the DNS record import dropzone. The desktop variant now renders a Radix Popover, which keeps the same anchored dropdown UX without the blur-close behavior and is the correct semantics for the arbitrary interactive content this component hosts.
