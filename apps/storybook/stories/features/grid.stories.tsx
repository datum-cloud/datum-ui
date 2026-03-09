import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Col, Row } from '@datum-cloud/datum-ui/grid'

const meta: Meta = {
  title: 'Features/Grid',
  argTypes: {
    gutter: {
      control: { type: 'number' },
    },
  },
  args: {
    gutter: 16,
  },
}

export default meta

type Story = StoryObj

const colStyle: React.CSSProperties = {
  padding: '16px',
  textAlign: 'center',
  color: 'white',
  fontWeight: 500,
  fontSize: '14px',
  borderRadius: '6px',
}

export const Default: Story = {
  render: (args: Record<string, unknown>) => (
    <Row type="flex" gutter={args.gutter as number}>
      <Col span={8}>
        <div style={{ ...colStyle, background: '#3b82f6' }}>Col 8</div>
      </Col>
      <Col span={8}>
        <div style={{ ...colStyle, background: '#6366f1' }}>Col 8</div>
      </Col>
      <Col span={8}>
        <div style={{ ...colStyle, background: '#8b5cf6' }}>Col 8</div>
      </Col>
    </Row>
  ),
}

export const ResponsiveGrid: Story = {
  args: {
    gutter: 32,
  },

  render: (args: Record<string, unknown>) => (
    <div className="flex flex-col gap-4">
      <Row type="flex" gutter={args.gutter as number}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <div style={{ ...colStyle, background: '#3b82f6' }}>xs=24 sm=12 md=8 lg=6</div>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <div style={{ ...colStyle, background: '#6366f1' }}>xs=24 sm=12 md=8 lg=6</div>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <div style={{ ...colStyle, background: '#8b5cf6' }}>xs=24 sm=12 md=8 lg=6</div>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <div style={{ ...colStyle, background: '#a855f7' }}>xs=24 sm=12 md=8 lg=6</div>
        </Col>
      </Row>

      <Row type="flex" gutter={args.gutter as number}>
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
    </div>
  ),
}
