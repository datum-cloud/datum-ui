import type { VariantProps } from 'class-variance-authority'
import type { buttonVariants } from './button'

type ButtonSize = VariantProps<typeof buttonVariants>['size']

/**
 * Returns the width/padding class that squares off an icon-only button for a
 * given size. Shared by Button and LinkButton to keep their icon-only sizing
 * in sync.
 *
 * Returns '' when the button is not icon-only, or when the size is already
 * self-sizing: 'icon' (square by variant) and 'link' (inline, content-sized —
 * must never be forced to a fixed square).
 */
export function getIconOnlyClass(size: ButtonSize, isIconOnly: boolean): string {
  if (!isIconOnly || size === 'icon' || size === 'link')
    return ''

  switch (size) {
    case 'xs':
      return 'w-7 px-0'
    case 'small':
      return 'w-8 px-0'
    case 'large':
      return 'w-11 px-0'
    default:
      return 'w-9 px-0'
  }
}
