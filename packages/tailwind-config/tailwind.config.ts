import type { Config } from 'tailwindcss'

// We want each package to be responsible for its own content.
export const config: Omit<Config, 'content'> = {
  plugins: [require('@tailwindcss/forms')],
  theme: {
    extend: {
      colors: {
        'surface-0': '#F5F5F7',
        'dk-surface-0': '#383238',
        'orange-0': '#F37967',
      },
    },
  },
}
export default config
