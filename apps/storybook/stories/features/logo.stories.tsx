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
    docs: {
      description: {
        component:
          'Datum brand logo family — horizontal lockup, stacked lockup, and standalone D mark with tone variants for any surface.\n\n'
          + '`Logo` is a compound namespace exposing four SVG components: `Logo.Flat` (horizontal lockup), '
          + '`Logo.Stacked` (vertical lockup), `Logo.Icon` (standalone D mark), and `Logo.Text` (wordmark only). '
          + 'Each accepts a `tone` prop — `brand` (navy + rose, default), `mono-light` (lime + white for dark surfaces), '
          + '`mono-dark` (solid navy, no rose accent), and `white` (solid white for coloured surfaces). '
          + 'Sizing is driven entirely by Tailwind classes on `className`. All components default to '
          + '`role="img"` with `aria-label="Datum"`; pass `decorative` to mark a logo as decorative (`aria-hidden`).',
      },
    },
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
  parameters: {
    docs: {
      description: {
        story: 'Horizontal lockup (`Logo.Flat`) with the default `brand` tone — navy text and rose mark, for light surfaces.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Vertical lockup (`Logo.Stacked`) — D mark above the Datum wordmark.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Standalone D mark (`Logo.Icon`) — use when horizontal space is limited.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: '`Logo.Text` renders just the "Datum" wordmark — useful when the D mark is already shown separately, such as in a brand bar.',
      },
    },
  },
  args: { className: 'h-8 w-auto' },
  render: args => (
    <div className="bg-background flex items-center justify-center p-12">
      <Logo.Text {...args} />
    </div>
  ),
}

/**
 * Demonstrates the `mono-light` tone (lime mark + white text) on a dark surface — the
 * standard treatment when placing the logo over dark or photographic backgrounds.
 */
export const MonoLightOnDark: Story = {
  name: 'mono-light on dark surface',
  parameters: {
    docs: {
      description: {
        story: '`mono-light` tone — lime mark + white text — is the standard treatment for dark or photographic surfaces.',
      },
    },
  },
  args: { tone: 'mono-light', className: 'h-10 w-auto' },
  render: args => (
    <div className="flex items-center justify-center bg-[#0C1D31] p-12">
      <Logo.Flat {...args} />
    </div>
  ),
}

/**
 * All four tones side by side.
 */
export const AllTones: Story = {
  name: 'All tones',
  // Static showcase — args aren't read, so hide the controls panel for this story.
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'All four `tone` values: `brand` (navy + rose) on light, `mono-light` (lime + white) on dark, '
          + '`mono-dark` (solid navy) on light, and `white` (solid white) on a coloured surface.',
      },
    },
  },
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
      <div className="flex items-center justify-center rounded-lg bg-[#7c3aed] p-8">
        <Logo.Flat tone="white" className="h-10 w-auto" />
      </div>
    </div>
  ),
}
