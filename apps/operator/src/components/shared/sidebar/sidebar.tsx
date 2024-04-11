import React, { useState } from 'react'

import { useSidebar } from '@/hooks/useSidebar'
import { ArrowLeft, MenuIcon } from 'lucide-react'
import { cn } from '@repo/ui/lib/utils'
import { sidebarStyles } from './sidebar.styles'
import { SideNav } from './sidebar-nav/sidebar-nav'
import { NavItems } from '@/routes/dashboard'

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const { isOpen, toggle } = useSidebar()
  const [status, setStatus] = useState(false)
  const { nav, sideNav, expandNav, expandNavIcon, navInner } = sidebarStyles({
    status,
    isOpen,
  })

  const handleToggle = () => {
    setStatus(true)
    toggle()
    setTimeout(() => setStatus(false), 500)
  }

  return (
    <div className={cn(nav(), className)}>
      <div className={expandNav({ isOpen: !isOpen })} onClick={handleToggle}>
        <MenuIcon strokeWidth={3} width={18} />
        <ArrowLeft className={expandNavIcon()} strokeWidth={3} width={18} />
      </div>

      <SideNav className={sideNav()} items={NavItems} />
    </div>
  )
}
