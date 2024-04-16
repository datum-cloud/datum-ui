import { tv, type VariantProps } from 'tailwind-variants'

const userMenuStyles = tv({
  slots: {
    trigger: 'flex items-center gap-2 cursor-pointer',
    email: 'text-blackberry-500 ',
    userSettingsLink: 'flex items-center gap-2 text-sunglow-900 mt-2',
    themeRow: 'px-2 flex space-between text-sm items-center',
    themeToggle: 'ml-auto',
    commandRow: 'px-2 flex space-between items-center text-sm mb-5',
    commands: 'ml-auto flex space-between text-sm gap-1',
  },
})

export type UserMenuVariants = VariantProps<typeof userMenuStyles>

export { userMenuStyles }
