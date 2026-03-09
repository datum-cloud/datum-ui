import type { Preview } from 'storybook-react-rsbuild'
import { ThemeProvider } from '@datum-cloud/datum-ui/theme'
import '../stories/storybook.css'

const preview: Preview = {
  decorators: [
    Story => (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div style={{ padding: '1rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  tags: ['autodocs'],
}

export default preview
