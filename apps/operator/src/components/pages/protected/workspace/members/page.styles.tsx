import { tv, type VariantProps } from 'tailwind-variants'

export const pageStyles = tv({
  slots: {
    wrapper: 'flex gap-[26px] flex-col',
    actionIcon: 'text-blackberry-400',
    inviteRow: 'flex items-center justify-center gap-[10px]',
    inviteCount:
      'flex items-center justify-center bg-sunglow-900 text-[11px] font-semibold rounded-[5px] w-[19px] h-[19px] text-white',
  },
})

export type PageVariants = VariantProps<typeof pageStyles>
