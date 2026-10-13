# @datum-cloud/datum-ui-native

React Native components for the Datum design system. Same prop names and variant unions as `@datum-cloud/datum-ui` on the web (`type`, `theme`, `size`), styled with `StyleSheet` and the shared [`@datum-cloud/datum-ui-tokens`](../tokens/README.md). There is no NativeWind or Tailwind runtime.

## Install

```sh
npx expo install @datum-cloud/datum-ui-native react-native-svg react-native-reanimated react-native-worklets expo-font
# optional: light haptics on Button press
npx expo install expo-haptics
```

Peers: `react` 19, `react-native` ≥ 0.79, `react-native-svg` 15, `react-native-reanimated` 4. `expo-haptics` is optional; Button skips haptics when it is missing.

The package's `react-native` / `source` export condition points at `src/index.ts`, so Metro compiles the TypeScript source directly. That also works when the package is linked from a local checkout. In a monorepo, make sure React Native singletons (`react`, `react-native`, `react-native-reanimated`, `react-native-svg`) resolve to one copy. `apps/native-catalog/metro.config.js` shows how.

## Fonts

The package ships Alliance No.1 (Regular, Medium, SemiBold) and Canela Text (Regular). The files are copied from `@datum-cloud/datum-ui` at build time.

Embed them at build time with the `expo-font` config plugin, so the first frame never waits on font loading:

```json
{
  "expo": {
    "plugins": [
      ["expo-font", {
        "fonts": [
          "node_modules/@datum-cloud/datum-ui-native/fonts/AllianceNo1-Regular.ttf",
          "node_modules/@datum-cloud/datum-ui-native/fonts/AllianceNo1-Medium.ttf",
          "node_modules/@datum-cloud/datum-ui-native/fonts/AllianceNo1-SemiBold.ttf",
          "node_modules/@datum-cloud/datum-ui-native/fonts/CanelaText-Regular.ttf"
        ]
      }]
    ]
  }
}
```

Keep `useFonts(datumFonts)` too, for Expo Go and the web. It is a no-op on iOS once the fonts are embedded:

```tsx
import { datumFonts } from '@datum-cloud/datum-ui-native'
import { useFonts } from 'expo-font'

const [loaded] = useFonts(datumFonts)
```

Font family names depend on the platform. iOS registers an embedded font under its PostScript name (`AllianceNo.1-Regular`, `CanelaTextLCWeb-Regular`). Android registers it under its file name (`AllianceNo1-Regular`). Components handle this for you. In your own styles, use `useDatumTheme().fonts` (or `resolveFontFamily()`), not the raw `fonts` token names.

`datumFontFiles` lists the paths relative to the package root.

## Theme

```tsx
import { DatumThemeProvider, useDatumTheme } from '@datum-cloud/datum-ui-native'

<DatumThemeProvider scheme="system">{/* 'light' | 'dark' | 'system' (default) */}
  <App />
</DatumThemeProvider>

const { scheme, colors, palette, spacing, radius, radiusScale, typography, fonts, motion } = useDatumTheme()
```

Without a provider, `useDatumTheme()` follows the OS appearance.

## Components

| Component                                                                                      | Props (beyond the React Native view/text props)                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Text`                                                                                         | `size` (`5xs`…`8xl`, default `sm`), `weight` (`regular` \| `medium` \| `semibold`), `tone` (`default` \| `muted` \| `primary` \| `secondary` \| `destructive` \| `success` \| `warning` \| `info`), `mono`. Nested `Text` inherits.                                                                                                                                                                                                         |
| `Title`                                                                                        | `level` 1–7 (Canela Text for 1–3, Alliance semibold for 4–7), `weight`, `tone`                                                                                                                                                                                                                                                                                                                                                              |
| `Button`                                                                                       | `type` (`primary` \| `secondary` \| `tertiary` \| `quaternary` \| `warning` \| `danger` \| `success`), `theme` (`solid` \| `light` \| `outline` \| `borderless` \| `link`), `size` (`xs` \| `small` \| `default` \| `large` \| `icon` \| `link`), `block`, `loading`, `icon` (node or `({ color, size }) => node`), `iconPosition`, `haptic` (default `true`), `onPress`. Scales down on press with Reanimated, and respects Reduce Motion. |
| `Badge`                                                                                        | `type` (`primary` \| `secondary` \| `tertiary` \| `quaternary` \| `info` \| `warning` \| `danger` \| `success` \| `muted`), `theme` (`solid` \| `outline` \| `light`), `icon`                                                                                                                                                                                                                                                               |
| `StatusBadge`                                                                                  | `status` (`success` \| `error` \| `pending` \| `unknown`) maps to Badge `success` \| `danger` \| `warning` \| `muted`. Also `label`, `theme` (default `light`). Colours cross-fade when the status changes, and the dot pulses while pending.                                                                                                                                                                                               |
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `CardField` | `Card`: `size` (`sm` \| `md`), `sectioned`. `CardHeader`: `size`, `bordered`, `action`. `CardContent` / `CardFooter`: `padding` (`default` \| `x-none` \| `none`). `CardFooter` also takes `bordered`. `CardField`: `label`, `value` or `children`, `layout` (`inline` \| `stacked`), `separator`.                                                                                                                                          |
| `Alert`                                                                                        | `type` (alias `variant`: `default` \| `secondary` \| `outline` \| `destructive` \| `success` \| `info` \| `warning`), `title`, `description`, `icon`                                                                                                                                                                                                                                                                                        |
| `Skeleton`                                                                                     | `width`, `height`, `radius`, `shimmer` (Reanimated sweep, off under Reduce Motion)                                                                                                                                                                                                                                                                                                                                                          |
| `Spinner`                                                                                      | `ActivityIndicator` props, plus `tone` (default `muted`)                                                                                                                                                                                                                                                                                                                                                                                    |
| `Separator`                                                                                    | `orientation` (`horizontal` \| `vertical`)                                                                                                                                                                                                                                                                                                                                                                                                  |
| `Avatar`                                                                                       | `name`, `src` (URL or image source), `size` (`sm` \| `md` \| `lg` \| `xl` or px). Falls back to initials.                                                                                                                                                                                                                                                                                                                                   |
| `LogoIcon`, `LogoFlat`, `LogoStacked`, `LogoText`                                              | `tone` (`brand` \| `mono-light` \| `mono-dark` \| `white`; default `brand` in light, `mono-light` in dark), `size` (icon) or `height` / `width`, `decorative`                                                                                                                                                                                                                                                                               |
| `EmptyContent`                                                                                 | `title`, `description`, `image`, `action`, `variant` (`default` \| `dashed` \| `minimal`), `decorations`                                                                                                                                                                                                                                                                                                                                    |

## Assistant

Native pieces of Datum's assistant ("Patch"), built on [`@datum-cloud/datum-ui-assistant-core`](../assistant-core/README.md) and matching the web assistant's look: user prompts in a `bg-border` bubble, answers as full-width markdown, suggestion rows in `bg-sidebar-accent`. The host owns state and transport (see the core's `createAssistantTransport`) and passes messages in.

| Component                                     | What it does                                                                                                                                                                                                                                                     |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssistantConfigProvider`                     | Host config: `greeting`, `suggestions`, `toolLabels`, `showReasoning`, `onLinkPress` (route a link in an answer; defaults to `Linking.openURL`), optional `messageActions` / `renderToolOutput`                                                                  |
| `AssistantThread`                             | FlatList of the conversation. Follows the newest text while it streams, stops following when the user scrolls up, and shows a scroll-to-bottom button. `formatUserMessage` customises a prompt bubble; `footer` sits after the last message; `ref.scrollToEnd()` |
| `AssistantMessage`                            | An answer: markdown, the "working" line with the running tool's label, the reasoning block, and copy/share buttons once settled (`onCopy` / `onShare`; omit one to hide it). Memoized                                                                            |
| `AssistantUserMessage`                        | The prompt bubble, with an optional `accessory` (e.g. mention chips)                                                                                                                                                                                             |
| `AssistantMarkdown`                           | Themed `react-native-marked` (pure JS): mono code blocks and tables that scroll sideways, links through `onLinkPress`. While `streaming`, unterminated constructs are closed first and renders are throttled (`throttleMs`, default 80)                          |
| `AssistantComposer`                           | Multiline prompt card; send turns into Stop while `busy`, optional retry, haptics, `accessory` slot. Put it inside a `KeyboardAvoidingView`                                                                                                                      |
| `AssistantSuggestions`, `AssistantEmptyState` | Starter prompt rows; the new-chat screen (BrainGlyph, Canela greeting, suggestions)                                                                                                                                                                              |
| `ThinkingBlock`, `LoadingDots`                | Collapsible reasoning with its measured duration; three staggered Reanimated dots (still under Reduce Motion)                                                                                                                                                    |
| `ConversationRow`                             | A history row: title and relative time                                                                                                                                                                                                                           |
| `BrainGlyph`, `AssistantIcon`                 | The web glyph's path, and the few line icons the assistant uses, in react-native-svg                                                                                                                                                                             |

`react-native-marked` and its dependencies are JS only; nothing here needs a native rebuild.

Also exported: `tokens`, `withAlpha`, `datumFonts`, `datumFontFiles`, `platformFonts`, `resolveFontFamily`, `datumThemes`, `getButtonColors`, `getBadgeColors`, `STATUS_BADGE_TYPE`, `LOGO_TONES`, `impactHaptic`, the variant arrays (`BUTTON_TYPES`, `BUTTON_THEMES`, `BUTTON_SIZES`, `BADGE_TYPES`, `BADGE_THEMES`, `ALERT_TYPES`), and the prop and token types.

## Development

```sh
pnpm --filter @datum-cloud/datum-ui-native test       # jest-expo + type-parity check
pnpm --filter @datum-cloud/datum-ui-native typecheck
pnpm --filter @repo/native-catalog start              # component catalog (Expo)
```

`test/type-parity.ts` fails the typecheck if the Button, Badge or Alert variant unions drift from the web components. The logo test fails if the SVG paths drift from `datum-ui`'s `features/logo`, and the assistant test does the same for the BrainGlyph.
