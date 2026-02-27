import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@repo/shadcn/lib/utils';
import { XIcon } from 'lucide-react';
import {
  Dialog as DialogShadcn,
  DialogTrigger as DialogTriggerShadcn,
  DialogPortal as DialogPortalShadcn,
  DialogClose as DialogCloseShadcn,
} from '@repo/shadcn/ui/dialog';

// Pass-through sub-components (no Datum overrides needed)
const Dialog = DialogShadcn;
const DialogTrigger = DialogTriggerShadcn;
const DialogPortal = DialogPortalShadcn;
const DialogClose = DialogCloseShadcn;

// DialogOverlay — Datum overlay styles
export interface DialogOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {}

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    data-slot="dialog-overlay"
    className={cn(
      // Datum overlay: semi-transparent with blur, standard open/close animations
      'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = 'DialogOverlay';

// DialogContent — Datum styled panel (centered, rounded, shadowed)
// Composes DialogPortal + DialogOverlay (Datum) + Radix Content so the overlay
// uses Datum tokens instead of the shadcn base bg-black/80.
export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      data-slot="dialog-content"
      className={cn(
        // Positioning: fixed, centered via translate
        'fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
        // Datum surface + border + shadow
        'bg-background border border-border rounded-lg shadow-lg',
        // Sizing
        'w-full max-w-[calc(100%-2rem)] sm:max-w-lg',
        // Inner layout
        'grid gap-4 p-6',
        // Open/close animations
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'duration-200',
        className
      )}
      {...props}
    >
      {children}
      <DialogCloseShadcn className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
        <XIcon />
        <span className="sr-only">Close</span>
      </DialogCloseShadcn>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = 'DialogContent';

// DialogHeader — flex column layout with gap
export interface DialogHeaderProps extends React.ComponentProps<'div'> {}

const DialogHeader = ({ className, ...props }: DialogHeaderProps) => (
  <div
    data-slot="dialog-header"
    className={cn('flex flex-col gap-2', className)}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

// DialogFooter — flex row layout, right-aligned with gap
export interface DialogFooterProps extends React.ComponentProps<'div'> {}

const DialogFooter = ({ className, ...props }: DialogFooterProps) => (
  <div
    data-slot="dialog-footer"
    className={cn('flex flex-row justify-end gap-2', className)}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

// DialogTitle — heading typography
export interface DialogTitleProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {}

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    data-slot="dialog-title"
    className={cn('text-lg leading-none font-semibold', className)}
    {...props}
  />
));
DialogTitle.displayName = 'DialogTitle';

// DialogDescription — muted supporting text
export interface DialogDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {}

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    data-slot="dialog-description"
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
