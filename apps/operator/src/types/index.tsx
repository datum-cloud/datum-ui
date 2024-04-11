import { type LucideIcon } from 'lucide-react'

export interface NavItem {
  title: string
  href: string
  icon?: LucideIcon
  isChildren?: boolean
  children?: NavItem[]
}

export interface Separator {
  type: 'separator'
}
