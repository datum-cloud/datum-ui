import type { ChartConfig, CustomTooltipProps } from '@datum-cloud/datum-ui/chart'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@datum-cloud/datum-ui/chart'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts'

const barData = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 214, mobile: 140 },
]

const chartConfig: ChartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2))',
  },
}

const meta: Meta = {
  title: 'Base/Chart',
  parameters: {
    docs: {
      description: {
        component:
          'Data visualization components built on Recharts.\n\n'
          + 'Chart provides `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, '
          + 'and `ChartLegendContent` — a thin Datum-styled wrapper around Recharts. '
          + '`ChartContainer` accepts a `config` map that binds label and color tokens to data keys, '
          + 'keeping chart colors consistent with the design system. Requires `recharts` as a peer dependency.',
      },
    },
  },
}

export default meta

type Story = StoryObj

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A grouped bar chart using `ChartContainer` with a two-series config (`desktop`, `mobile`) '
          + 'and `ChartTooltip` for interactive data labels.',
      },
    },
  },
  render: () => (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart data={barData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip
          content={props => <ChartTooltipContent {...(props as CustomTooltipProps)} />}
        />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
}
