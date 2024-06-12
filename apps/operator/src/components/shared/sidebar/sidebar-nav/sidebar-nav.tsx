'use client'
import Link from 'next/link'

import { NavHeading, type NavItem, type Separator } from '@/types'
import { usePathname } from 'next/navigation'
import { useSidebar } from '@/hooks/useSidebar'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/shared/sidebar/sidebar-accordion/sidebar-accordion'
import { useEffect, useState } from 'react'
import { cn } from '@repo/ui/lib/utils'
import { Separator as Hr } from '@repo/ui/separator'
import { sidebarNavStyles } from './sidebar-nav.styles'

interface SideNavProps {
  items: (NavItem | Separator | NavHeading)[]
  setOpen?: (open: boolean) => void
  className?: string
}

export function SideNav({ items, setOpen, className }: SideNavProps) {
  const path = usePathname()
  const { isOpen: isSidebarOpen, toggle: toggleOpen } = useSidebar()
  const [openItems, setOpenItems] = useState<string[]>([])
  const [lastOpenItems, setLastOpenItems] = useState<string[]>([])

  const {
    nav,
    icon,
    accordionTrigger,
    link,
    linkLabel,
    accordionItem,
    separator,
    heading,
  } = sidebarNavStyles()

  const isSeparator = (
    item: NavItem | Separator | NavHeading,
  ): item is Separator => {
    return (item as Separator).type === 'separator'
  }

  const isNavHeading = (
    item: NavItem | Separator | NavHeading,
  ): item is NavHeading => {
    return (item as NavHeading).type === 'heading'
  }

  const handleValueChange = (value: string[]) => {
    setOpenItems(value)
    if (!isSidebarOpen) {
      toggleOpen()
    }
  }

  useEffect(() => {
    if (isSidebarOpen) {
      setOpenItems(lastOpenItems)
    } else {
      setLastOpenItems(openItems)
      setOpenItems([])
    }
  }, [isSidebarOpen])

  useEffect(() => {
    if (!isSidebarOpen) {
      setOpenItems([])
    }
  }, [isSidebarOpen])

  return (
    <nav className={nav()}>
      {items.map((item, idx) =>
        isSeparator(item) ? (
          <div key={`${idx}_${item.type}`} className={separator()}>
            <Hr />
          </div>
        ) : isNavHeading(item) ? (
          <div key={`${idx}_${item.type}`} className={heading()}>
            {item.heading}
          </div>
        ) : item.isChildren ? (
          <Accordion
            type="multiple"
            key={item.title}
            value={openItems}
            onValueChange={handleValueChange}
          >
            <AccordionItem value={item.title} className={accordionItem()}>
              <AccordionTrigger className={accordionTrigger()}>
                <div>{item.icon && <item.icon className={icon()} />}</div>
                <div className={cn(linkLabel(), !isSidebarOpen && className)}>
                  {item.title}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {item.children?.map((child) => (
                  <Link
                    key={child.title}
                    href={child.href}
                    onClick={() => {
                      if (setOpen) setOpen(false)
                    }}
                    className={link({ isCurrent: path === child.href })}
                  >
                    {child.icon && (
                      <child.icon
                        className={icon({ isCurrent: path === child.href })}
                      />
                    )}
                    <div
                      className={cn(linkLabel(), !isSidebarOpen && className)}
                    >
                      {child.title}
                    </div>
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <Link
            key={item.title}
            href={item.href}
            onClick={() => {
              if (setOpen) setOpen(false)
            }}
            className={link({ isCurrent: path === item.href })}
          >
            {item.icon && (
              <item.icon className={icon({ isCurrent: path === item.href })} />
            )}
            <span className={cn(linkLabel(), !isSidebarOpen && className)}>
              {item.title}
            </span>
          </Link>
        ),
      )}
    </nav>
  )
}
