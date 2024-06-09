import { tv, type VariantProps } from 'tailwind-variants'

const workspaceSelectorStyles = tv({
  slots: {
    logoWrapper: 'hidden items-center justify-between gap-2 md:flex',
    container: 'flex content-center gap-4',
    workspaceLabel:
      'text-sunglow-900 uppercase font-mono text-xs font-semibold tracking-wide',
    workspaceDropdown: 'flex items-center gap-1 text-lg cursor-pointer',
    dropdownContent: 'p-0',
    allWorkspacesLink:
      'flex items-center gap-2 text-sunglow-900 py-5 px-6 border-t border-winter-sky-900',
    popoverContent: 'p-0 w-[400px]',
    searchWrapper: 'py-5 px-6',
    orgWrapper:
      'transition-all duration-500 flex gap-3 items-center py-4 px-6 border-t border-winter-sky-900 hover:bg-winter-sky-700 cursor-pointer relative', // add relative positioning to orgWrapper
    orgInfo: 'flex flex-col gap-1 items-start flex-1',
    orgTitle: 'text-sm text-blackberry-800',
    orgSelect: 'opacity-0 group-hover:opacity-100 transition-opacity duration-300', // initially hidden, shown on hover
  },
})

export type WorkspaceSelectorVariants = VariantProps<
  typeof workspaceSelectorStyles
>

export { workspaceSelectorStyles }
