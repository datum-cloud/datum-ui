import type { StorybookConfig } from 'storybook-react-rsbuild'
import { pluginReact } from '@rsbuild/plugin-react'

const config: StorybookConfig = {
  framework: 'storybook-react-rsbuild',
  stories: ['../stories/**/*.stories.tsx'],
  rsbuildFinal: (config) => {
    config.plugins = [...(config.plugins || []), pluginReact()]
    config.resolve = {
      ...config.resolve,
      // Prefer "source" for JS/TS imports so @datum-cloud/datum-ui resolves
      // to TypeScript source files directly, enabling instant HMR.
      // CSS-only exports (./styles, ./grid, ./nprogress) intentionally omit
      // the "source" condition so CSS @import resolves to dist CSS files.
      conditionNames: ['source', 'import', 'module', 'require', 'browser', 'default'],
    }
    return config
  },
}

export default config
