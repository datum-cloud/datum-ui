import { datumFonts } from '@datum-cloud/datum-ui-native'
import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import { ScrollView } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { CatalogSplit } from './catalog/sections'

export default function App() {
  const [fontsLoaded] = useFonts(datumFonts)

  if (!fontsLoaded)
    return null

  return (
    <SafeAreaProvider>
      <StatusBar />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <CatalogSplit />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
