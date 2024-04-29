import { tv, type VariantProps } from 'tailwind-variants'

const panelStyles = tv({
  slots: {
    base: 'bg-white border-winter-sky-900 border rounded-md p-8',
  },
  variants: {
    noPadding: {
      true: {
        base: 'p-0',
      },
    },
  },
})

export type PanelVariants = VariantProps<typeof panelStyles>

export { panelStyles }
