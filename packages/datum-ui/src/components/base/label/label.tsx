import { Label as ShadcnLabel } from '@repo/shadcn/ui/label'
import * as React from 'react'
import { cn } from '../../../utils/cn'

/**
 * Datum Label component - extends shadcn Label with Datum-specific styling
 *
 * This component wraps the shadcn Label and allows for Datum-specific
 * class customizations without modifying the core shadcn component.
 *
 * @example
 * ```tsx
 * <Label
 *   htmlFor="input-id"
 *   className="custom-class"
 * >
 *   Field Label
 * </Label>
 * ```
 */
function Label({ ref, className, ...props }: React.ComponentProps<typeof ShadcnLabel> & { ref?: React.RefObject<React.ElementRef<typeof ShadcnLabel> | null> }) {
  return (
    <ShadcnLabel
      ref={ref}
      className={cn(
        // Datum-specific customizations can be added here
        // These classes will merge with shadcn defaults
        className,
      )}
      {...props}
    />
  )
}

Label.displayName = 'Label'

export { Label }
