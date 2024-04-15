import { tv, type VariantProps } from 'tailwind-variants'

export const avatarStyles = tv({
  slots: {
    avatarImageWrap:
      'relative flex h-11 w-11 shrink-0 overflow-hidden border-none rounded-md p-0',
    avatarImage: 'aspect-square h-full w-full',
    avatarFallBack:
      'uppercase flex h-full w-full items-center justify-center rounded-md bg-sunglow-900 text-white',
  },
})

export type AvatarVariants = VariantProps<typeof avatarStyles>
