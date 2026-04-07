import type { StorybookConfig } from 'storybook-react-rsbuild'
import { pluginReact } from '@rsbuild/plugin-react'

const config: StorybookConfig = {
  framework: 'storybook-react-rsbuild',
  stories: [
    '../stories/**/*.stories.tsx',
  ],
  staticDirs: ['./assets'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
    'storybook-addon-pseudo-states',
    'storybook-addon-tag-badges',
  ],
  rsbuildFinal: (config) => {
    config.plugins = [...(config.plugins || []), pluginReact()]
    config.resolve = {
      ...config.resolve,
      conditionNames: ['source', 'import', 'module', 'require', 'browser', 'default'],
    }
    return config
  },
}

export default config
