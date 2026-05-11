import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Logo } from '@datum-cloud/datum-ui/logo'

const LOGO_CONTROLS = ['tone', 'decorative', 'aria-label', 'className']

const meta: Meta<typeof Logo.Flat> = {
  title: 'Features/Logo',
  component: Logo.Flat,
  // Whitelist controls so the panel only surfaces the four logo-specific
  // props instead of every inherited SVG attribute (xmlns, focusable, etc.).
  parameters: {
    controls: { include: LOGO_CONTROLS },
  },
  argTypes: {
    'tone': {
      control: 'inline-radio',
      options: ['brand', 'mono-light', 'mono-dark', 'white'],
    },
    'decorative': { control: 'boolean' },
    'aria-label': { control: 'text' },
    'className': { control: 'text' },
  },
  args: {
    'tone': 'brand',
    'decorative': false,
    'aria-label': 'Datum',
    'className': 'h-8 w-auto',
  },
}
export default meta
type Story = StoryObj<typeof Logo.Flat>

/**
 * Horizontal lockup (D mark + Datum wordmark). The default `brand` tone uses
 * the navy text + rose mark for placement on light surfaces.
 */
export const Flat: Story = {
  render: args => (
    <div className="bg-background flex items-center justify-center p-12">
      <Logo.Flat {...args} />
    </div>
  ),
}

/**
 * Vertical lockup (D mark above the Datum wordmark).
 */
export const Stacked: Story = {
  args: { className: 'h-20 w-auto' },
  render: args => (
    <div className="bg-background flex items-center justify-center p-12">
      <Logo.Stacked {...args} />
    </div>
  ),
}

/**
 * Just the D mark.
 */
export const Icon: Story = {
  args: { className: 'size-12' },
  render: args => (
    <div className="bg-background flex items-center justify-center p-12">
      <Logo.Icon {...args} />
    </div>
  ),
}

/**
 * Just the "Datum" wordmark — no D mark.
 */
export const Text: Story = {
  args: { className: 'h-8 w-auto' },
  render: args => (
    <div className="bg-background flex items-center justify-center p-12">
      <Logo.Text {...args} />
    </div>
  ),
}

/**
 * Demonstrates the `mono-light` tone (all white) on a dark surface — the
 * standard treatment when placing the logo over dark or photographic backgrounds.
 */
export const MonoLightOnDark: Story = {
  name: 'mono-light on dark surface',
  args: { tone: 'mono-light', className: 'h-10 w-auto' },
  render: args => (
    <div className="flex items-center justify-center bg-[#0C1D31] p-12">
      <Logo.Flat {...args} />
    </div>
  ),
}

/**
 * All three tones side by side.
 */
export const AllTones: Story = {
  name: 'All tones',
  // Static showcase — args aren't read, so hide the controls panel for this story.
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6 p-8">
      <div className="bg-background flex items-center justify-center bg-white rounded-lg p-8">
        <Logo.Flat tone="brand" className="h-10 w-auto" />
      </div>
      <div className="flex items-center justify-center rounded-lg bg-[#0C1D31] p-8">
        <Logo.Flat tone="mono-light" className="h-10 w-auto" />
      </div>
      <div className="bg-background flex items-center justify-center bg-white rounded-lg p-8">
        <Logo.Flat tone="mono-dark" className="h-10 w-auto" />
      </div>
      <div className="flex items-center justify-center rounded-lg bg-[#0C1D31] p-8">
        <Logo.Flat tone="white" className="h-10 w-auto" />
      </div>
    </div>
  ),
}
