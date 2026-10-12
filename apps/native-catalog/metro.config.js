// Expo's default config already handles the pnpm workspace (watch folders,
// node_modules paths). On top of that, force the React Native singletons to
// resolve from this app: @datum-cloud/datum-ui-native is consumed from source
// and its own devDependencies would otherwise pull in a second copy.
const path = require('node:path')
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

const SINGLETONS = [
  'react',
  'react-native',
  'react-native-reanimated',
  'react-native-worklets',
  'react-native-svg',
  'expo-haptics',
]
const appEntry = path.join(__dirname, 'index.ts')

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const singleton = SINGLETONS.some(name => moduleName === name || moduleName.startsWith(`${name}/`))
  const ctx = singleton ? { ...context, originModulePath: appEntry } : context
  return ctx.resolveRequest(ctx, moduleName, platform)
}

module.exports = config
