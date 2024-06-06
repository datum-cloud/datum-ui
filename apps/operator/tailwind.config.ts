import type { Config } from 'tailwindcss'
import sharedConfig from '@repo/tailwind-config'

const config: Pick<Config, 'darkMode' | 'content' | 'presets' | 'prefix'> = {
  darkMode: 'class',
  content: ['./src/app/**/*.tsx', './src/components/**/*.tsx'],
  prefix: undefined,
  presets: [sharedConfig],
}

export default config
