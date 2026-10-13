/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo/ios',
  setupFiles: ['<rootDir>/test/setup.js'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.{ts,tsx}'],
  // pnpm keeps packages under node_modules/.pnpm, so allow-list by package name
  // anywhere in the path.
  transformIgnorePatterns: [
    'node_modules/(?!(?:\\.pnpm/[^/]+/node_modules/)?(?:(?:jest-)?react-native|@react-native(?:-community)?|expo(?:nent)?|@expo(?:nent)?/.*|react-native-svg|react-native-reanimated|react-native-worklets|react-native-marked|react-native-reanimated-table|marked|@jsamr/.*|github-slugger|html-entities|svg-parser|@datum-cloud/.*))',
  ],
}
