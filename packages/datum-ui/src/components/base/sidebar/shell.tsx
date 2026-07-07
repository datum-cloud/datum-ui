import { Button } from '@repo/shadcn/ui/button'
import { Separator } from '@repo/shadcn/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@repo/shadcn/ui/sheet'
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react'
import * as React from 'react'
import { cn } from '../../../utils/cn'
import { Icon } from '../../icons/icon-wrapper'
import { Input } from '../input/input'
import { Tooltip } from '../tooltip/tooltip'
import { SIDEBAR_WIDTH_MOBILE, useSidebar } from './context'

function Sidebar({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  side?: 'left' | 'right'
  variant?: 'sidebar' | 'floating' | 'inset'
  collapsible?: 'offcanvas' | 'icon' | 'none'
}) {
  const {
    isMobile,
    state,
    openMobile,
    setOpenMobile,
    handleMouseEnter,
    handleMouseLeave,
    expandBehavior,
    showBackdrop,
    forceClose,
  } = useSidebar()
  const sidebarRef = React.useRef<HTMLDivElement>(null)
  const [showBackdropElement, setShowBackdropElement] = React.useState(false)
  const [backdropVisible, setBackdropVisible] = React.useState(false)

  // Handle backdrop animation state
  React.useEffect(() => {
    if (showBackdrop && expandBehavior === 'overlay' && state === 'expanded') {
      // First mount the element
      setShowBackdropElement(true)
      // Then trigger the animation in the next frame
      requestAnimationFrame(() => {
        setBackdropVisible(true)
      })
    }
    else {
      // First trigger the fade-out animation
      setBackdropVisible(false)
      // Then unmount the element after animation completes
      const timer = setTimeout(() => {
        setShowBackdropElement(false)
      }, 200) // Match the transition duration
      return () => clearTimeout(timer)
    }
  }, [showBackdrop, expandBehavior, state])

  if (collapsible === 'none') {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          'bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col',
          side === 'left' ? 'border-r' : 'border-l',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          onOpenAutoFocus={e => e.preventDefault()}
          className="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          {/* Radix Dialog.Root renders no DOM element, so forward caller-supplied
              className and DOM props onto this real container div instead. */}
          <div className={cn('flex h-full w-full flex-col', className)} {...props}>
            {children}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      className="group peer text-sidebar-foreground hidden md:block"
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        className={cn(
          'relative w-(--sidebar-width) bg-transparent transition-[width] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[side=right]:rotate-180',
          // In overlay mode, gap stays at collapsed width; in push mode, gap transitions
          expandBehavior === 'overlay'
            ? variant === 'floating' || variant === 'inset'
              ? 'w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
              : 'w-(--sidebar-width-icon)'
            : variant === 'floating' || variant === 'inset'
              ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
              : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
        )}
      />
      <div
        ref={sidebarRef}
        className={cn(
          'border-sidebar-border fixed inset-y-0 hidden w-(--sidebar-width) transition-[left,right,width] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] md:flex',
          // Z-index: Higher for overlay mode to float above content
          expandBehavior === 'overlay' ? 'z-50' : 'z-10',
          side === 'left'
            ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
            : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          // Adjust the padding for floating and inset variants.
          variant === 'floating' || variant === 'inset'
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          className={cn(
            'bg-sidebar flex h-full w-full flex-col',
            'group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm',
            // Add shadow when expanded in overlay mode
            expandBehavior === 'overlay' && state === 'expanded' && 'shadow-lg',
          )}
        >
          {children}
        </div>
      </div>

      {/* Backdrop/Overlay - only shown in overlay mode when expanded */}
      {showBackdropElement && (
        <div
          className={cn(
            'fixed inset-0 z-40 hidden bg-black/50 transition-opacity duration-200 ease-in-out md:block',
            backdropVisible ? 'opacity-100' : 'opacity-0',
          )}
          onMouseEnter={() => forceClose()}
          onClick={() => forceClose()}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar, open } = useSidebar()

  return (
    <Tooltip
      message={open ? 'Close Sidebar' : 'Open Sidebar'}
      side="right"
      align="center"
      delayDuration={500}
    >
      <Button
        data-sidebar="trigger"
        data-slot="sidebar-trigger"
        variant="ghost"
        size="icon"
        className={cn(
          'text-icon-primary hover:bg-sidebar hover:text-sidebar-primary h-8 w-8 rounded-lg transition-all',
          className,
        )}
        onClick={(event) => {
          onClick?.(event)
          toggleSidebar()
        }}
        {...props}
      >
        {open
          ? (
              <Icon icon={PanelLeftCloseIcon} className="size-4" />
            )
          : (
              <Icon icon={PanelLeftOpenIcon} className="size-4" />
            )}
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    </Tooltip>
  )
}

function SidebarRail({ className, ...props }: React.ComponentProps<'button'>) {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        'hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-[cubic-bezier(0.25,0.1,0.25,1)] group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex',
        'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
        '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        'hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full',
        '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
        className,
      )}
      {...props}
    />
  )
}

function SidebarInset({ className, ...props }: React.ComponentProps<'main'>) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        'bg-background relative flex w-full min-w-0 flex-1 flex-col',
        'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
        className,
      )}
      {...props}
    />
  )
}

function SidebarInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn('bg-background h-8 w-full shadow-none', className)}
      {...props}
    />
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  )
}

function SidebarSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn('bg-sidebar-border w-full', className)}
      {...props}
    />
  )
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
        className,
      )}
      {...props}
    />
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
}
