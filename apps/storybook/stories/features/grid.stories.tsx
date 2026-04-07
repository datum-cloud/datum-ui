import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Col, Row } from '@datum-cloud/datum-ui/grid'

interface GridStoryArgs {
  gutter: number
  columns: number
}

const meta: Meta<GridStoryArgs> = {
  title: 'Features/Grid',
  argTypes: {
    gutter: { control: { type: 'number', min: 0, max: 64 } },
    columns: {
      control: 'select',
      options: [3, 4, 6],
    },
  },
  args: {
    gutter: 16,
    columns: 3,
  },
}

export default meta

type Story = StoryObj<GridStoryArgs>

const colStyle: React.CSSProperties = {
  padding: '16px',
  textAlign: 'center',
  color: 'white',
  fontWeight: 500,
  fontSize: '14px',
  borderRadius: '6px',
}

const colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e']

export const Default: Story = {
  render: (args) => {
    const cols = args.columns ?? 3
    const span = Math.floor(24 / cols)
    return (
      <Row type="flex" gutter={args.gutter}>
        {Array.from({ length: cols }, (_, i) => (
          <Col key={`col-${i}`} span={span}>
            <div style={{ ...colStyle, background: colors[i % colors.length] }}>
              {`Col ${span}`}
            </div>
          </Col>
        ))}
      </Row>
    )
  },
}
