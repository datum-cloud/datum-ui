import type { Config } from 'tailwindcss'
import sharedConfig from '@repo/tailwind-config'

const config: Pick<Config, 'prefix' | 'content' | 'presets'> = {
  content: ['./src/**/*.tsx'],
  presets: [sharedConfig],
}

export default config
