import type { StorybookConfig } from 'storybook-react-rsbuild'
import path from 'node:path'
import { pluginReact } from '@rsbuild/plugin-react'

const config: StorybookConfig = {
  framework: 'storybook-react-rsbuild',
  stories: ['../stories/**/*.stories.tsx'],
  rsbuildFinal: (config) => {
    config.plugins = [...(config.plugins || []), pluginReact()]
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@datum-cloud/datum-ui': path.resolve(
          import.meta.dirname,
          '../../../packages/datum-ui/src',
        ),
      },
    }
    return config
  },
}

export default config
