import { tv, type VariantProps } from 'tailwind-variants'

const existingWorkspacesStyles = tv({
  slots: {
    container: 'flex content-center gap-4 w-full max-w-[575px] mx-auto',
  },
})

export type ExistingWorkspacesVariants = VariantProps<typeof existingWorkspacesStyles>

export { existingWorkspacesStyles }
