import type { Plugin } from 'tsdown'
import fs from 'node:fs'
import path from 'node:path'
import { tailwindPlugin } from '@bosh-code/tsdown-plugin-tailwindcss'
import { defineConfig } from 'tsdown'

const STABLE_CSS_NAME = 'style.css'

/**
 * Re-injects CSS import statements into output JS entry chunks and
 * renames the hashed CSS file to a stable name for predictable exports.
 */
function reinjectCssPlugin(): Plugin {
  const cssFileMap = new Map<string, string>() // hashed name -> stable name

  return {
    name: 'reinject-css',
    generateBundle(_options, bundle) {
      // Find CSS files and record them for renaming later
      const cssFiles = Object.keys(bundle).filter(
        k => k.endsWith('.css') && !k.endsWith('.css.map'),
      )
      if (cssFiles.length === 0)
        return

      for (const cssFile of cssFiles) {
        cssFileMap.set(cssFile, STABLE_CSS_NAME)
      }

      // Inject CSS import into every entry chunk using the stable name
      for (const [name, chunk] of Object.entries(bundle)) {
        if (chunk.type !== 'chunk' || !chunk.isEntry)
          continue

        const chunkDir = path.dirname(name)
        let relativePath = path.relative(chunkDir, STABLE_CSS_NAME)
        if (!relativePath.startsWith('.')) {
          relativePath = `./${relativePath}`
        }
        chunk.code = `import '${relativePath}';\n${chunk.code}`
      }
    },

    writeBundle(options) {
      const outDir = options.dir || 'dist'

      // Rename hashed CSS files to stable names on disk
      for (const [hashedName, stableName] of cssFileMap) {
        const hashedPath = path.resolve(outDir, hashedName)
        const stablePath = path.resolve(outDir, stableName)

        if (fs.existsSync(hashedPath)) {
          fs.renameSync(hashedPath, stablePath)
        }

        // Also rename source map
        const hashedMapPath = `${hashedPath}.map`
        const stableMapPath = `${stablePath}.map`
        if (fs.existsSync(hashedMapPath)) {
          fs.renameSync(hashedMapPath, stableMapPath)
        }
      }
    },
  }
}

export default defineConfig({
  entry: {
    // Barrel
    'index': 'src/index.ts',
    // Components
    'components/index': 'src/components/index.ts',
    // Providers
    'providers/index': 'src/providers/index.ts',
    // Hooks
    'hooks/index': 'src/hooks/index.ts',
    // Icons
    'icons/index': 'src/components/icons/index.ts',
    // Utilities
    'utils/index': 'src/utils/index.ts',
  },
  format: ['esm'],
  dts: false,
  noExternal: [/^@repo\//],
  external: [
    'react',
    'react-dom',
    'react-router',
    // Optional peer deps
    '@conform-to/react',
    '@conform-to/zod',
    '@stepperize/react',
    /^@tanstack\//,
    'date-fns',
    'date-fns-tz',
    'motion',
    'motion/react',
    'nprogress',
    'react-day-picker',
    'react-dropzone',
    'react-number-format',
    'zod',
    // Transitive deps from @repo/shadcn
    /^@radix-ui\//,
    'sonner',
    'clsx',
    'tailwind-merge',
    'cmdk',
    /^leaflet/,
    /^react-leaflet/,
    '@react-leaflet/core',
    /^recharts/,
    'react-hook-form',
    '@hookform/resolvers',
    'react-resizable-panels',
    'embla-carousel-react',
    'input-otp',
    'vaul',
  ],
  clean: true,
  loader: {
    '.woff2': 'dataurl',
    '.ttf': 'dataurl',
    '.png': 'dataurl',
    '.svg': 'dataurl',
  },
  plugins: [tailwindPlugin(), reinjectCssPlugin()],
})
