import type { Preview } from 'storybook-react-rsbuild'
import { DatumProvider } from '@datum-cloud/datum-ui'
import '../stories/storybook.css'

const preview: Preview = {
  decorators: [
    Story => (
      <DatumProvider>
        <div style={{ padding: '1rem' }}>
          <Story />
        </div>
      </DatumProvider>
    ),
  ],
  tags: ['autodocs'],
}

export default preview
