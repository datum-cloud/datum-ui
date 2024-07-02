import { tv, type VariantProps } from 'tailwind-variants'

export const pageStyles = tv({
  slots: {
    wrapper: 'flex gap-[26px] flex-col',
    actionIcon: 'text-blackberry-400',
    inviteRow: 'flex items-center justify-center gap-[10px]',
    inviteCount:
      'flex items-center justify-center bg-sunglow-900 text-[11px] font-semibold rounded-[5px] w-[19px] h-[19px] text-white',
    membersSearchRow: 'flex justify-between mb-[26px]',
    membersSearchField: '',
    membersButtons: '',
    nameRow: 'flex gap-2',
    copyIcon: 'text-blackberry-400 cursor-pointer',
  },
})

export type PageVariants = VariantProps<typeof pageStyles>
