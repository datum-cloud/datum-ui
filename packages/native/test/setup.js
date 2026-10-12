/* global jest */
// Reanimated 4 / Worklets: swap the native worklet runtime for its JS mock and
// let Reanimated run animations synchronously under the test renderer.
jest.mock('react-native-worklets', () => require('react-native-worklets/lib/module/mock'))
require('react-native-reanimated').setUpTests()
