import { tv, type VariantProps } from 'tailwind-variants'

const workspaceSelectorStyles = tv({
  slots: {
    logoWrapper: 'hidden items-center justify-between gap-2 md:flex',
    container: 'flex content-center gap-4',
    workspaceLabel:
      'text-sunglow-900 uppercase font-mono text-xs font-semibold tracking-wide',
    workspaceDropdown: 'flex items-center gap-1 text-lg cursor-pointer',
    dropdownContent: 'p-0',
    allWorkspacesLink: 'flex items-center gap-2 text-sunglow-900 mt-2',
  },
})

export type WorkspaceSelectorVariants = VariantProps<
  typeof workspaceSelectorStyles
>

export { workspaceSelectorStyles }
