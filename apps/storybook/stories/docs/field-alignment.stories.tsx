import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Autocomplete } from '@datum-cloud/datum-ui/autocomplete'
import { Button } from '@datum-cloud/datum-ui/button'
import { ButtonGroup, ButtonGroupText } from '@datum-cloud/datum-ui/button-group'
import { Icon } from '@datum-cloud/datum-ui/icons'
import { Input } from '@datum-cloud/datum-ui/input'
import { MultiSelect } from '@datum-cloud/datum-ui/multi-select'
import { DateTimeRangePicker } from '@datum-cloud/datum-ui/picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@datum-cloud/datum-ui/select'
import { cn } from '@datum-cloud/datum-ui/utils'
import { RefreshCw } from 'lucide-react'
import * as React from 'react'

/**
 * Not a component: a check page for the input-like triggers that sit side by
 * side in toolbars and filter rows (Select, Autocomplete, MultiSelect, the
 * pickers, ButtonGroupText). If one of them drifts, it shows up here first.
 */
const meta: Meta = {
  title: 'Foundations/Field Alignment',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Every input-like trigger shares one spec so they line up when placed next to each other:\n\n'
          + '| | Spec |\n'
          + '|---|---|\n'
          + '| Inline padding | `px-3` (12px), the same as `Input` |\n'
          + '| Text | `text-sm`, regular weight, for both the value and the placeholder |\n'
          + '| Placeholder colour | `text-input-placeholder`, the same as `Input` |\n'
          + '| Icons | 16px (`size-4`), `text-muted-foreground`, 1px stroke via `Icon`, no margins. Clear (X) icons are 14px so they don\'t outweigh the chevron |\n'
          + '| Spacing | `gap-2` (8px) between the leading icon, the value and trailing icons |\n'
          + '| Box | `rounded-lg`, `border-input-border`, `bg-input-background/50`, no shadow |\n\n'
          + 'So the value text starts 12px from the left border and the chevron (or clear icon) ends '
          + '12px from the right border on every trigger. The `Stacked` story draws those two lines.\n\n'
          + 'The classes live in `src/utils/field-styles.ts` inside datum-ui. New triggers should use it '
          + 'rather than copying classes.',
      },
    },
  },
}

export default meta

type Story = StoryObj

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const REGION_OPTIONS = [
  { label: 'US East (Ashburn)', value: 'us-east' },
  { label: 'US West (Hillsboro)', value: 'us-west' },
  { label: 'EU West (Amsterdam)', value: 'eu-west' },
  { label: 'AP South (Singapore)', value: 'ap-south' },
]

const STATUS_OPTIONS = [
  { label: '2xx', value: '2xx' },
  { label: '3xx', value: '3xx' },
  { label: '4xx', value: '4xx' },
  { label: '5xx', value: '5xx' },
]

const STEP_OPTIONS = [
  { label: 'Auto', value: 'auto' },
  { label: '15s', value: '15s' },
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
]

const REFRESH_OPTIONS = [
  { label: 'Off', value: 'off' },
  { label: '10s', value: '10s' },
  { label: '30s', value: '30s' },
  { label: '1m', value: '1m' },
]

const FIXED_RANGE = { from: '2026-11-09T10:08:00.000Z', to: '2026-11-09T10:13:00.000Z' }

type Density = 'default' | 'compact'

/** Height override used by dense toolbars such as the metrics page. */
const COMPACT = 'h-8 min-h-8'

function heightFor(density: Density) {
  return density === 'compact' ? COMPACT : undefined
}

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------

function LabelledSelect({
  label,
  options,
  defaultValue,
  density,
}: {
  label: React.ReactNode
  options: { label: string, value: string }[]
  defaultValue: string
  density: Density
}) {
  return (
    <ButtonGroup className={heightFor(density)}>
      {typeof label === 'string' ? <ButtonGroupText>{label}</ButtonGroupText> : label}
      <Select defaultValue={defaultValue}>
        <SelectTrigger className={cn('w-auto', heightFor(density))}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(o => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </ButtonGroup>
  )
}

function RefreshButton() {
  return (
    <Button
      type="quaternary"
      theme="outline"
      size="icon"
      aria-label="Refresh"
      // Stretch to the group's height and use the field border so it reads as
      // part of the control rather than a separate button.
      className="border-input-border bg-input-background/50 text-muted-foreground dark:border-input-border dark:text-muted-foreground h-auto w-10"
    >
      <Icon icon={RefreshCw} className="size-4" />
    </Button>
  )
}

function MetricsToolbar({ density, filled }: { density: Density, filled: boolean }) {
  const [regions, setRegions] = React.useState<string[]>(filled ? ['us-east', 'eu-west'] : [])
  const [statuses, setStatuses] = React.useState<string[]>(filled ? ['5xx'] : [])
  const [range, setRange] = React.useState<{ from: string, to: string } | null>(filled ? FIXED_RANGE : null)

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <MultiSelect
          className={cn('w-auto min-w-64', heightFor(density))}
          options={REGION_OPTIONS}
          value={regions}
          onValueChange={setRegions}
          placeholder="Select regions..."
          maxCount={2}
        />
        <MultiSelect
          className={cn('w-auto min-w-44', heightFor(density))}
          options={STATUS_OPTIONS}
          value={statuses}
          onValueChange={setStatuses}
          placeholder="Status class"
          maxCount={2}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <DateTimeRangePicker
          className={cn('w-auto min-w-64', heightFor(density))}
          value={range}
          onChange={setRange}
          timezone="UTC"
          clearable
          placeholder="Select time range"
        />
        <LabelledSelect label="Step" options={STEP_OPTIONS} defaultValue="auto" density={density} />
        <LabelledSelect label={<RefreshButton />} options={REFRESH_OPTIONS} defaultValue="off" density={density} />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * The metrics page toolbar rebuilt from datum-ui parts. Text size and weight,
 * icon size and the chevron's distance from the right edge now match across
 * every control.
 */
export const Toolbar: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <h3 className="text-muted-foreground text-xs">Empty</h3>
        <MetricsToolbar density="default" filled={false} />
      </section>
      <section className="flex flex-col gap-2">
        <h3 className="text-muted-foreground text-xs">With values</h3>
        <MetricsToolbar density="default" filled />
      </section>
      <section className="flex flex-col gap-2">
        <h3 className="text-muted-foreground text-xs">
          Compact (
          <code>h-8 min-h-8</code>
          , as on the metrics page)
        </h3>
        <MetricsToolbar density="compact" filled />
      </section>
    </div>
  ),
}

function Guides() {
  // Two dashed lines 12px inside each border (1px border + 12px padding).
  // Placeholder/value text should start on the left line and every trailing
  // icon should end on the right line.
  return (
    <>
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[13px] z-10 border-l border-dashed border-rose-500/70" />
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-[13px] z-10 border-r border-dashed border-rose-500/70" />
    </>
  )
}

function Row({ name, children }: { name: string, children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[9rem_1fr] items-center gap-4">
      <span className="text-muted-foreground font-mono text-xs">{name}</span>
      {children}
    </div>
  )
}

function StackedStory() {
  const [multi, setMulti] = React.useState<string[]>(['us-east'])
  const [auto, setAuto] = React.useState('')
  const [range, setRange] = React.useState<{ from: string, to: string } | null>(FIXED_RANGE)

  return (
    <div className="flex flex-col gap-3">
      <p className="text-muted-foreground max-w-prose text-sm">
        Every trigger at the same width. Text should start on the left guide and the last icon
        should end on the right guide.
      </p>
      <div className="relative w-[32rem]">
        <div className="absolute inset-y-0 right-0 left-[calc(9rem+1rem)]">
          <Guides />
        </div>
        <div className="flex flex-col gap-3">
          <Row name="Input">
            <Input placeholder="Placeholder" />
          </Row>
          <Row name="Select">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Placeholder" />
              </SelectTrigger>
              <SelectContent>
                {STEP_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </Row>
          <Row name="Select (value)">
            <Select defaultValue="auto">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STEP_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </Row>
          <Row name="Autocomplete">
            <Autocomplete
              options={REGION_OPTIONS}
              value={auto}
              onValueChange={setAuto}
              placeholder="Placeholder"
            />
          </Row>
          <Row name="MultiSelect">
            <MultiSelect options={REGION_OPTIONS} value={[]} onValueChange={() => {}} placeholder="Placeholder" />
          </Row>
          <Row name="MultiSelect (value)">
            <MultiSelect options={REGION_OPTIONS} value={multi} onValueChange={setMulti} placeholder="Placeholder" />
          </Row>
          <Row name="DateTimeRangePicker">
            <DateTimeRangePicker value={null} onChange={() => {}} timezone="UTC" placeholder="Placeholder" />
          </Row>
          <Row name="… (value, clearable)">
            <DateTimeRangePicker value={range} onChange={setRange} timezone="UTC" clearable />
          </Row>
        </div>
      </div>
    </div>
  )
}

/**
 * All triggers stacked at one width with guide lines 12px inside each border.
 */
export const Stacked: Story = {
  render: () => <StackedStory />,
}

/** Disabled triggers dim the same way. */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Input className="w-44" placeholder="Input" disabled />
      <Select disabled>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent />
      </Select>
      <div className="w-44">
        <Autocomplete options={REGION_OPTIONS} value="" onValueChange={() => {}} placeholder="Autocomplete" disabled />
      </div>
      <MultiSelect className="w-44" options={REGION_OPTIONS} value={[]} onValueChange={() => {}} placeholder="MultiSelect" disabled />
      <DateTimeRangePicker className="w-56" value={null} onChange={() => {}} timezone="UTC" placeholder="Picker" disabled />
    </div>
  ),
}
