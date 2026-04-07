import { addons } from 'storybook/manager-api'
import { datumDark, datumLight } from './theme'

addons.register('datum-theme-switcher', (_api) => {
  const channel = addons.getChannel()

  channel.on('updateGlobals', ({ globals }: { globals: Record<string, unknown> }) => {
    if ('theme' in globals) {
      addons.setConfig({
        theme: globals.theme === 'dark' ? datumDark : datumLight,
      })
    }
  })
})

addons.setConfig({
  theme: datumLight,
})
