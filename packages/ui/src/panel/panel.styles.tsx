import { tv, type VariantProps } from 'tailwind-variants'

export const panelStyles = tv({
  slots: {
    panel:
      'flex flex-col border rounded-lg bg-white border-gray-300 p-4 min-h-[400px]',
  },
  variants: {
    gap: {
      0: { panel: 'gap-0' },
      1: { panel: 'gap-1' },
      2: { panel: 'gap-2' },
      4: { panel: 'gap-4' },
      6: { panel: 'gap-6' },
      8: { panel: 'gap-8' },
    },
    align: {
      start: { panel: 'items-start' },
      center: { panel: 'items-center' },
      end: { panel: 'items-end' },
      stretch: { panel: 'items-stretch' },
    },
    justify: {
      start: { panel: 'justify-start' },
      center: { panel: 'justify-center' },
      end: { panel: 'justify-end' },
      between: { panel: 'justify-between' },
      around: { panel: 'justify-around' },
      evenly: { panel: 'justify-evenly' },
    },
    textAlign: {
      left: { panel: 'text-left' },
      right: { panel: 'text-right' },
      center: { panel: 'text-center' },
    },
  },
  defaultVariants: {
    gap: 6,
    align: 'stretch',
    justify: 'start',
    textAlign: 'left',
  },
})

export type PanelVariants = VariantProps<typeof panelStyles>
