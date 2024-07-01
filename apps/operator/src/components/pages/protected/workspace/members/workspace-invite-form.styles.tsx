import { tv, type VariantProps } from 'tailwind-variants'

const workspaceInviteStyles = tv({
  slots: {
    buttonRow: 'mt-[26px] flex justify-between',
    roleRow: 'flex items-center gap-2',
  },
})

export type WorkspaceInviteVariants = VariantProps<typeof workspaceInviteStyles>

export { workspaceInviteStyles }
