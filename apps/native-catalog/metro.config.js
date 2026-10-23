// Expo's default config already handles the pnpm workspace (watch folders,
// node_modules paths). On top of that, force the React Native singletons to
// resolve from this app: @datum-cloud/datum-ui-native is consumed from source
// and its own devDependencies would otherwise pull in a second copy.
const path = require('node:path')
const process = require('node:process')
const { withStorybook } = require('@storybook/react-native/metro/withStorybook')
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

const SINGLETONS = [
  'react',
  'react-native',
  'react-native-gesture-handler',
  'react-native-reanimated',
  'react-native-worklets',
  'react-native-svg',
  'expo-haptics',
]
const appEntry = path.join(__dirname, 'index.ts')
const storybookEntry = path.join(__dirname, '.rnstorybook/index.js')
const storybookEnabled = process.env.STORYBOOK_ENABLED === 'true'

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const singleton = SINGLETONS.some(name => moduleName === name || moduleName.startsWith(`${name}/`))
  const ctx = singleton ? { ...context, originModulePath: appEntry } : context
  const resolved = ctx.resolveRequest(ctx, moduleName, platform)

  // The Metro wrapper does not swap the entry point; only the bundler-agnostic
  // one does, and we need the Metro wrapper for the singleton resolver. Swap
  // here so the fallback app stays the entry unless STORYBOOK_ENABLED is set.
  if (storybookEnabled && resolved?.filePath && path.resolve(resolved.filePath) === appEntry)
    return { filePath: storybookEntry, type: 'sourceFile' }

  return resolved
}

module.exports = withStorybook(config, {
  enabled: storybookEnabled,
})
