import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Col, Row } from '@datum-cloud/datum-ui/grid'

interface GridStoryArgs {
  gutter: number
  columns: number
}

const meta: Meta<GridStoryArgs> = {
  title: 'Features/Grid',
  parameters: {
    docs: {
      description: {
        component:
          'A 24-column responsive grid system with Row and Col components for flexible page layouts.\n\n'
          + 'The Grid system provides a 24-column layout using `Row` and `Col` components. Rows manage '
          + 'horizontal spacing and alignment, while columns define width spans and support responsive '
          + 'breakpoints (`xs`, `sm`, `md`, `lg`, `xl`, `xxl`) for adaptive layouts. Import the grid '
          + 'CSS with `@import \'@datum-cloud/datum-ui/grid\'` in your app stylesheet.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story:
          'Basic equal-width column layout. Adjust `gutter` (pixel spacing) and `columns` (3, 4, or 6) '
          + 'via the controls. Each column span is computed as `24 / columns`.',
      },
    },
  },
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

export const ResponsiveColumns: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use breakpoint props on `Col` to adapt column widths at different screen sizes. '
          + 'The example stacks to full-width (`xs=24`) on mobile and narrows progressively up to `lg=6`.',
      },
    },
  },
  render: () => (
    <Row type="flex" gutter={16}>
      {[0, 1, 2, 3].map(i => (
        <Col key={i} xs={24} sm={12} md={8} lg={6}>
          <div style={{ ...colStyle, background: colors[i % colors.length] }}>
            xs=24 sm=12 md=8 lg=6
          </div>
        </Col>
      ))}
    </Row>
  ),
}

export const MixedColumnWidths: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Columns can have different `span` values as long as they sum to 24 (or less) per row. '
          + 'This example shows a 6 + 12 + 6 layout.',
      },
    },
  },
  render: () => (
    <Row type="flex" gutter={16}>
      <Col span={6}>
        <div style={{ ...colStyle, background: '#14b8a6' }}>Col 6</div>
      </Col>
      <Col span={12}>
        <div style={{ ...colStyle, background: '#06b6d4' }}>Col 12</div>
      </Col>
      <Col span={6}>
        <div style={{ ...colStyle, background: '#0ea5e9' }}>Col 6</div>
      </Col>
    </Row>
  ),
}

export const ColumnOffset: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use the `offset` prop on `Col` to push it right by a specified number of grid columns.',
      },
    },
  },
  render: () => (
    <Row type="flex" gutter={16}>
      <Col span={6}>
        <div style={{ ...colStyle, background: '#3b82f6' }}>Col 6</div>
      </Col>
      <Col span={6} offset={6}>
        <div style={{ ...colStyle, background: '#6366f1' }}>Col 6, Offset 6</div>
      </Col>
    </Row>
  ),
}

export const Alignment: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Control vertical and horizontal alignment with `align` and `justify` on a flex `Row`. '
          + 'This example centers columns both horizontally and vertically.',
      },
    },
  },
  render: () => (
    <Row
      type="flex"
      justify="center"
      align="middle"
      gutter={16}
      style={{ minHeight: '100px', background: '#f1f5f9', borderRadius: '6px' }}
    >
      {[0, 1, 2].map((i) => {
        const paddings = ['16px', '32px 16px', '16px']
        return (
          <Col key={i} span={4}>
            <div style={{ ...colStyle, padding: paddings[i], background: colors[i] }}>
              Centered
            </div>
          </Col>
        )
      })}
    </Row>
  ),
}
