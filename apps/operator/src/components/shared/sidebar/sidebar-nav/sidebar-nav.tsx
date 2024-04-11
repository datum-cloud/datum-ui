'use client'
import Link from 'next/link'

import { type NavItem, type Separator } from '@/types'
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
import { ChevronDownIcon } from 'lucide-react'
import { Separator as Hr } from '@repo/ui/separator'
import { sidebarNavStyles } from './sidebar-nav.styles'

interface SideNavProps {
  items: (NavItem | Separator)[]
  setOpen?: (open: boolean) => void
  className?: string
}

export function SideNav({ items, setOpen, className }: SideNavProps) {
  const path = usePathname()
  const { isOpen: isSidebarOpen, toggle: toggleOpen } = useSidebar()
  const [openItem, setOpenItem] = useState('')
  const [lastOpenItem, setLastOpenItem] = useState('')

  const {
    nav,
    icon,
    accordionTrigger,
    link,
    expandArrow,
    linkLabel,
    accordionItem,
    separator,
  } = sidebarNavStyles()

  const isSeparator = (item: NavItem | Separator): item is Separator => {
    return (item as Separator).type === 'separator'
  }

  const handleValueChange = (value: string) => {
    setOpenItem(value)
    if (!isSidebarOpen) {
      toggleOpen()
    }
  }

  useEffect(() => {
    if (isSidebarOpen) {
      setOpenItem(lastOpenItem)
    } else {
      setLastOpenItem(openItem)
      setOpenItem('')
    }
  }, [])

  useEffect(() => {
    if (!isSidebarOpen) {
      setOpenItem('')
    }
  }, [isSidebarOpen])

  return (
    <nav className={nav()}>
      {items.map((item, idx) =>
        isSeparator(item) ? (
          <div className={separator()}>
            <Hr key={`${idx}_${item.type}`} />
          </div>
        ) : item.isChildren ? (
          <Accordion
            type="single"
            collapsible
            key={item.title}
            value={openItem}
            onValueChange={handleValueChange}
          >
            <AccordionItem value={item.title} className={accordionItem()}>
              <AccordionTrigger className={accordionTrigger()}>
                <div>{item.icon && <item.icon className={icon()} />}</div>
                <div className={cn(linkLabel(), !isSidebarOpen && className)}>
                  {item.title}
                </div>

                {isSidebarOpen && <ChevronDownIcon className={expandArrow()} />}
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
