import type { Config } from 'tailwindcss'
import sharedConfig from '@repo/tailwind-config'

const config: Pick<Config, 'content' | 'presets' | 'prefix'> = {
  content: [
    './src/app/**/*.tsx',
    './src/app/**/*.ts',
    './src/components/**/*.tsx',
    './src/components/**/*.ts',
    './src/pages/**/*.tsx',
  ],
  prefix: undefined,
  presets: [sharedConfig],
}

export default config
