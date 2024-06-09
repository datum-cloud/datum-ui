import * as React from 'react'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { toastStyles, type ToastVariants } from './toast.styles'

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => {
  const { viewport } = toastStyles()
  return (
    <ToastPrimitives.Viewport
      ref={ref}
      className={cn(viewport, className)}
      {...props}
    />
  )
})
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & ToastVariants
>(({ className, variant, ...props }, ref) => {
  const { root } = toastStyles({ variant })
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(root, className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => {
  const { action } = toastStyles()
  return (
    <ToastPrimitives.Action
      ref={ref}
      className={cn(action, className)}
      {...props}
    />
  )
})
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => {
  const { close } = toastStyles()
  return (
    <ToastPrimitives.Close
      ref={ref}
      className={cn(close, className)}
      {...props}
    >
      <X className="h-4 w-4" />
    </ToastPrimitives.Close>
  )
})
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => {
  const { title } = toastStyles()
  return (
    <ToastPrimitives.Title
      ref={ref}
      className={cn(title, className)}
      {...props}
    />
  )
})
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => {
  const { description } = toastStyles()
  return (
    <ToastPrimitives.Description
      ref={ref}
      className={cn(description, className)}
      {...props}
    />
  )
})
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
