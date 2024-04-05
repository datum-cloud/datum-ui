import React, { useEffect, useState } from 'react'
import Datum from './datum'
import type { Preview } from '@storybook/react'
import './style.css'
import '@repo/ui/styles.css'

const Background = (Story, context) => {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    if (context.args.theme) {
      setTheme(context.args.theme)
    }
  }, [context.args.theme])

  return (
    <div data-theme={theme}>
      <Story />
    </div>
  )
}

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#E1EBEA' },
        { name: 'dark', value: '#443A5B' },
      ],
    },
    docs: {
      theme: Datum,
    },
  },
  decorators: [Background],
}

export default preview
