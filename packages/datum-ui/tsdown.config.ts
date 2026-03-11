import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    // Root barrel (convenience — requires all peer deps)
    'index': 'src/index.ts',

    // Theme
    'theme/index': 'src/components/themes/index.ts',

    // Hooks
    'hooks/index': 'src/hooks/index.ts',

    // Icons
    'icons/index': 'src/components/icons/index.ts',

    // Utils
    'utils/index': 'src/utils/index.ts',

    // Base components
    'alert/index': 'src/components/base/alert/index.ts',
    'badge/index': 'src/components/base/badge/index.ts',
    'breadcrumb/index': 'src/components/base/breadcrumb/index.ts',
    'button/index': 'src/components/base/button/index.tsx',
    'button-group/index': 'src/components/base/button-group/index.ts',
    'calendar/index': 'src/components/base/calendar/index.ts',
    'card/index': 'src/components/base/card/index.ts',
    'checkbox/index': 'src/components/base/checkbox/index.ts',
    'collapsible/index': 'src/components/base/collapsible/index.ts',
    'command/index': 'src/components/base/command/index.ts',
    'dialog/index': 'src/components/base/dialog/index.ts',
    'hover-card/index': 'src/components/base/hover-card/index.ts',
    'input/index': 'src/components/base/input/index.ts',
    'input-group/index': 'src/components/base/input-group/index.ts',
    'label/index': 'src/components/base/label/index.ts',
    'popover/index': 'src/components/base/popover/index.ts',
    'radio-group/index': 'src/components/base/radio-group/index.ts',
    'select/index': 'src/components/base/select/index.ts',
    'separator/index': 'src/components/base/separator/index.ts',
    'sheet/index': 'src/components/base/sheet/index.ts',
    'skeleton/index': 'src/components/base/skeleton/index.ts',
    'spinner/index': 'src/components/base/spinner/index.ts',
    'switch/index': 'src/components/base/switch/index.ts',
    'table/index': 'src/components/base/table/index.ts',
    'tabs/index': 'src/components/base/tabs/index.ts',
    'textarea/index': 'src/components/base/textarea/index.ts',
    'tooltip/index': 'src/components/base/tooltip/index.ts',
    'typography/index': 'src/components/base/typography/index.ts',
    'visually-hidden/index': 'src/components/base/visuallyhidden/index.ts',

    // Grouped features (shared heavy deps)
    'chart/index': 'src/components/base/chart/index.ts',
    'date-picker/index': 'src/components/features/date-picker/index.ts',
    'dropzone/index': 'src/components/features/dropzone/index.ts',
    'form/index': 'src/components/features/form/index.ts',
    'map/index': 'src/exports/map.ts',

    // Standalone features
    'autocomplete/index': 'src/components/features/autocomplete/index.ts',
    'avatar-stack/index': 'src/components/features/avatar-stack/index.ts',
    'dropdown/index': 'src/components/features/dropdown/index.ts',
    'empty-content/index': 'src/components/features/empty-content/index.ts',
    'grid/index': 'src/components/features/grid/index.ts',
    'input-number/index': 'src/components/features/input-number/index.ts',
    'input-with-addons/index': 'src/components/features/input-with-addons/index.ts',
    'loader-overlay/index': 'src/components/features/loader-overlay/index.ts',
    'more-actions/index': 'src/components/features/more-actions/index.ts',
    'nprogress/index': 'src/components/features/nprogress/index.ts',
    'page-title/index': 'src/components/features/page-title/index.ts',
    'sidebar/index': 'src/components/features/sidebar/index.ts',
    'stepper/index': 'src/components/features/stepper/index.ts',
    'tag-input/index': 'src/components/features/tag-input/index.ts',
    'task-queue/index': 'src/components/features/task-queue/index.ts',
    'toast/index': 'src/components/features/toast/index.ts',
    'data-table/index': 'src/components/features/data-table/index.ts',
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
    'nuqs',
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
    '.png': 'dataurl',
    '.svg': 'dataurl',
  },
})
