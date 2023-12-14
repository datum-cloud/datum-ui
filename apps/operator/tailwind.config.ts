import type { Config } from 'tailwindcss'
import sharedConfig from '@repo/tailwind-config'

const config: Pick<Config, 'content' | 'presets' | 'prefix'> = {
  content: ['./src/app/**/*.tsx'],
  prefix: undefined,
  presets: [sharedConfig],
}

export default config
