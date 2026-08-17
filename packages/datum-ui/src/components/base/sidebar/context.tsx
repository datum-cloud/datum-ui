import { useIsMobile } from '@repo/shadcn/hooks/use-mobile'
import { TooltipProvider } from '@repo/shadcn/ui/tooltip'
import * as React from 'react'
import { cn } from '../../../utils/cn'

const SIDEBAR_COOKIE_NAME = 'sidebar_state'
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = '13rem'
const SIDEBAR_WIDTH_MOBILE = '18rem'
const SIDEBAR_WIDTH_ICON = '3rem'
const SIDEBAR_KEYBOARD_SHORTCUT = 'b'
const LG_BREAKPOINT = 1024

interface SidebarContext {
  state: 'expanded' | 'collapsed'
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
  handleMouseEnter: () => void
  handleMouseLeave: () => void
  forceClose: () => void
  closeForNavigation: () => void
  hasSubLayout: boolean
  setHasSubLayout: (value: boolean) => void
  expandBehavior: 'push' | 'overlay'
  showBackdrop: boolean
}

// eslint-disable-next-line ts/no-redeclare
const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.use(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }

  return context
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  expandOnHover = false,
  expandBehavior = 'push',
  showBackdrop = false,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  expandOnHover?: boolean
  expandBehavior?: 'push' | 'overlay'
  showBackdrop?: boolean
}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const [hasSubLayout, setHasSubLayout] = React.useState(false)
  const hoverTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const hoverLockRef = React.useRef(false)
  const userClosedSidebarRef = React.useRef(false)

  // Use defaultOpen as initial state for both server and client to avoid hydration mismatch.
  // Viewport-based adjustments happen in useLayoutEffect (synchronous, before paint).
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open

  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      }
      else {
        _setOpen(openState)
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open],
  )

  // Synchronously adjust sidebar state based on viewport before first paint.
  // This prevents both hydration mismatch and visual flash.
  React.useLayoutEffect(() => {
    if (isMobile) {
      _setOpen(false)
      setOpenMobile(false)
    }
    else if (window.innerWidth < LG_BREAKPOINT) {
      _setOpen(false)
    }
  }, [isMobile])

  // When viewport goes below md, reset "user closed" so sidebar auto-opens at lg+.
  React.useEffect(() => {
    if (isMobile) {
      userClosedSidebarRef.current = false
    }
  }, [isMobile])

  // Respond to viewport changes: collapse below lg, restore at lg+ (unless user explicitly closed).
  // Route through setOpen so controlled consumers stay responsive and onOpenChange fires.
  React.useEffect(() => {
    if (isMobile)
      return
    const mql = window.matchMedia(`(min-width: ${LG_BREAKPOINT}px)`)
    const onChange = () => {
      if (window.innerWidth >= LG_BREAKPOINT) {
        if (!userClosedSidebarRef.current)
          setOpen(true)
      }
      else {
        setOpen(false)
      }
    }
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [isMobile, setOpen])

  // Determine the effective open state, considering hover if enabled.
  const effectiveOpen = open || (expandOnHover && isHovered)

  // Handlers for the hover functionality.
  const handleMouseEnter = React.useCallback(() => {
    if (!expandOnHover)
      return
    // Prevent hover expansion if we just closed on navigation
    if (hoverLockRef.current)
      return
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    setIsHovered(true)
  }, [expandOnHover])

  const handleMouseLeave = React.useCallback(() => {
    if (!expandOnHover)
      return
    // In overlay mode, use shorter delay for more responsive feel
    // In push mode, use a longer delay for better UX
    const delay = expandBehavior === 'overlay' ? 200 : 300
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false)
    }, delay)
  }, [expandOnHover, expandBehavior])

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile(current => !current)
      return
    }

    // Derive from the effective (visible) open state so a hover-expanded sidebar
    // collapses on click instead of getting pinned open.
    const newState = !effectiveOpen
    if (!newState)
      userClosedSidebarRef.current = true
    else userClosedSidebarRef.current = false
    setOpen(newState)

    // If closing, ensure hover state is also cleared.
    if (!newState && expandOnHover) {
      setIsHovered(false)
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [isMobile, setOpen, effectiveOpen, setOpenMobile, expandOnHover])

  // Force close the sidebar (used for backdrop clicks and outside clicks in overlay mode)
  const forceClose = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile(false)
      return
    }

    userClosedSidebarRef.current = true
    setOpen(false)
    setIsHovered(false)
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
  }, [isMobile, setOpen, setOpenMobile])

  // Close sidebar on navigation with hover lock to prevent immediate re-expansion
  // The hover lock prevents the sidebar from immediately re-expanding when clicking
  // menu items while the mouse is still hovering over the sidebar
  const closeForNavigation = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile(false)
      return
    }

    setOpen(false)
    setIsHovered(false)
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    // Lock hover expansion for a short time to prevent immediate re-expansion
    // when clicking menu items while mouse is still over the sidebar
    hoverLockRef.current = true
    setTimeout(() => {
      hoverLockRef.current = false
    }, 300)
  }, [isMobile, setOpen, setOpenMobile])

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar])

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = effectiveOpen ? 'expanded' : 'collapsed'

  const contextValue = React.useMemo<SidebarContext>(
    () => ({
      state,
      open: effectiveOpen,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      handleMouseEnter,
      handleMouseLeave,
      forceClose,
      closeForNavigation,
      hasSubLayout,
      setHasSubLayout,
      expandBehavior,
      showBackdrop,
    }),
    [
      state,
      effectiveOpen,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      handleMouseEnter,
      handleMouseLeave,
      forceClose,
      closeForNavigation,
      hasSubLayout,
      setHasSubLayout,
      expandBehavior,
      showBackdrop,
    ],
  )

  return (
    <SidebarContext value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH,
              '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            'group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full',
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext>
  )
}

export {
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
  SIDEBAR_WIDTH_MOBILE,
  SidebarProvider,
  useSidebar,
}
