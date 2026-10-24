import type { Preview } from '@storybook/react-native'
import type { ReactNode } from 'react'
import { datumFonts, DatumThemeProvider } from '@datum-cloud/datum-ui-native'
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds'
import { useFonts } from 'expo-font'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

// Storybook's preview module exports a config object, so this component is not
// a Fast Refresh boundary.
// eslint-disable-next-line react-refresh/only-export-components
function DatumCanvas({ children }: { children: ReactNode }) {
  const [fontsLoaded] = useFonts(datumFonts)
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light'

  if (!fontsLoaded)
    return null

  return (
    <SafeAreaProvider>
      <DatumThemeProvider scheme={scheme}>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          {children}
        </SafeAreaView>
      </DatumThemeProvider>
    </SafeAreaProvider>
  )
}

const preview: Preview = {
  decorators: [
    withBackgrounds,
    Story => <DatumCanvas><Story /></DatumCanvas>,
  ],
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f6f6f5' },
        { name: 'dark', value: '#0c1d31' },
      ],
    },
  },
}

export default preview
