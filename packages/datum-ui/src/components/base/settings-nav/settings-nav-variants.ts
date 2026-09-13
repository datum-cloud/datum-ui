import { cva } from 'class-variance-authority'

export const settingsNavItemVariants = cva(
  'group/settings-nav-item relative flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-normal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
  {
    variants: {
      variant: {
        // Hover uses a primary tint (not `muted`, which is near-invisible on
        // the light theme's background) so it reads as a lighter step of the
        // active fill.
        default:
          'text-foreground hover:bg-primary/5 hover:text-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary',
        danger:
          'text-destructive hover:bg-destructive/10 data-[active=true]:bg-destructive/10 data-[active=true]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)
