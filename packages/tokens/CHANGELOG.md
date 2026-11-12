# @datum-cloud/datum-ui-tokens

## 0.1.1

### Patch Changes

- 202d9f4: Warning and info toasts now have their own muted colours (new `toast-warning-*` and `toast-info-*` tokens) instead of reusing the error and success ones, and every status toast shows a labelled status icon. `toast.message` keeps its current look. The toast root now lays out as a flex row and carries a `data-variant` attribute.

## 0.1.0

### Minor Changes

- d296271: Add React Native support. `@datum-cloud/datum-ui-tokens` publishes the datum-ui design tokens (palette, light/dark semantic colours, spacing, radius, type scale, fonts, motion) as plain TypeScript generated from the CSS, with a `check:tokens` drift check in CI. `@datum-cloud/datum-ui-native` adds React Native components that keep the web prop names and variant unions: Text, Title, Button, Badge, StatusBadge, Card, Alert, Skeleton, Spinner, Separator, Avatar, the Logo family and EmptyContent, plus `DatumThemeProvider` / `useDatumTheme` and the bundled Alliance No.1 and Canela Text fonts.
