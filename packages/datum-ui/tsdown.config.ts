import { defineConfig } from 'tsdown'
import { buildTsdownEntry } from './scripts/exports-manifest.mjs'

export default defineConfig({
  // The entry map is DERIVED from scripts/exports-manifest.mjs — the single
  // source of truth shared with the package.json `exports` map. To add / remove
  // an entry point, edit the manifest (then run `pnpm gen:exports`), never this
  // file. See scripts/exports-manifest.mjs for the derivation rules.
  entry: buildTsdownEntry(),
  format: ['esm'],
  dts: false,
  deps: {
    alwaysBundle: [/^@repo\//],
    neverBundle: [
      'react',
      'react-dom',
      'react-router',
      // Optional peer deps
      '@conform-to/react',
      '@conform-to/zod',
      '@stepperize/react',
      'lucide-react',
      /^@tanstack\//,
      'date-fns',
      'date-fns-tz',
      'motion',
      'motion/react',
      'nprogress',
      'react-day-picker',
      'react-dropzone',
      'react-number-format',
      'nuqs',
      'zod',
      // Code editor optional peer deps
      '@monaco-editor/react',
      'monaco-editor',
      'js-yaml',
      // Transitive deps from @repo/shadcn (heavy/optional only)
      'sonner',
      /^leaflet/,
      /^react-leaflet/,
      '@react-leaflet/core',
      /^recharts/,
      'react-hook-form',
      '@hookform/resolvers',
      // TipTap optional peer deps
      '@tiptap/react',
      '@tiptap/starter-kit',
      '@tiptap/extension-link',
      '@tiptap/extension-underline',
      '@tiptap/extension-character-count',
      '@tiptap/extension-placeholder',
    ],
  },
  clean: true,
  loader: {
    '.png': 'dataurl',
    '.svg': 'dataurl',
  },
})
