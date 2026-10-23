# Native Catalog

The on-device Storybook for `@datum-cloud/datum-ui-native`, built with Expo. Stories live in `src/stories` and render inside the Datum theme provider, so components look the same here as they do in an app.

## Scripts

| Command                                            | Description                                 |
| -------------------------------------------------- | ------------------------------------------- |
| `pnpm --filter @repo/native-catalog storybook`     | Expo dev server with Storybook              |
| `pnpm --filter @repo/native-catalog storybook:ios` | Build/run the iOS dev client with Storybook |
| `pnpm --filter @repo/native-catalog start`         | The fallback app without Storybook          |

`STORYBOOK_ENABLED=true` is set by the Storybook scripts. The Storybook UI runs on the device (or simulator) over the Expo dev server; there is no web URL.

Without that flag, `start` launches the fallback catalog app in `src/app.tsx`, and Metro excludes the Storybook modules from the bundle.
