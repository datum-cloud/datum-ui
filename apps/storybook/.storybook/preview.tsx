import type { Preview } from 'storybook-react-rsbuild'
import { ThemeProvider } from '@datum-cloud/datum-ui/theme'
import { useEffect } from 'react'
import { datumViewports } from './viewport'
import '../stories/storybook.css'

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Toggle dark mode',
      toolbar: {
        title: 'Theme',
        icon: 'moon',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light'

      useEffect(() => {
        const html = document.documentElement
        if (theme === 'dark') {
          html.classList.add('dark')
        }
        else {
          html.classList.remove('dark')
        }
      }, [theme])

      return (
        <ThemeProvider attribute="class" defaultTheme={theme} enableSystem={false} forcedTheme={theme}>
          <div style={{ padding: '1rem' }}>
            <Story />
          </div>
        </ThemeProvider>
      )
    },
  ],
  parameters: {
    viewport: {
      viewports: datumViewports,
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
        ],
      },
    },
  },
  tags: ['autodocs'],
}

export default preview
