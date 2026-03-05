import type { StorybookConfig } from 'storybook-react-rsbuild'
import { pluginReact } from '@rsbuild/plugin-react'

const config: StorybookConfig = {
  framework: 'storybook-react-rsbuild',
  stories: ['../stories/**/*.stories.tsx'],
  rsbuildFinal: (config) => {
    config.plugins = [...(config.plugins || []), pluginReact()]
    return config
  },
}

export default config
