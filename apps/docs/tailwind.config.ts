import type { Config } from 'tailwindcss'
import sharedConfig from '@repo/tailwind-config'

const config: Pick<Config, 'content' | 'presets' | 'prefix'> = {
  content: [
    './src/app/**/*.tsx',
    './src/components/**/*.tsx',
    './src/pages/**/*.tsx',
    './src/pages/**/*.mdx',
    './src/pages/**/*.md',
  ],
  prefix: undefined,
  presets: [sharedConfig],
}

export default config
