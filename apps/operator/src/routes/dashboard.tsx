import {
  AppWindowMacIcon,
  AtSign,
  BarChart3Icon,
  CircleGaugeIcon,
  HandshakeIcon,
  LandmarkIcon,
  LayersIcon,
  ListChecks,
  ScrollText,
  Settings2Icon,
  SettingsIcon,
  ShapesIcon,
  ShoppingCartIcon,
  SlidersHorizontalIcon,
  UserRoundCogIcon,
  Users,
} from 'lucide-react'
import { type NavItem, type Separator } from '@/types'

export const NavItems: (NavItem | Separator)[] = [
  {
    title: 'Home',
    href: '/dashboard',
    icon: CircleGaugeIcon,
  },
  {
    title: 'Tasks',
    href: '/tasks',
    icon: ListChecks,
  },
  {
    title: 'Mentions',
    href: '/mentions',
    icon: AtSign,
  },
  {
    title: 'Logs',
    href: '/logs',
    icon: ScrollText,
  },
  {
    type: 'separator',
  },
  {
    title: 'Customers',
    href: '/customers',
    icon: Users,
    isChildren: true,
    children: [
      { title: 'Users', href: '/customers/users' },
      { title: 'Organizations', href: '/customers/organizations' },
    ],
  },
  {
    title: 'Sales',
    href: '/sales',
    icon: LandmarkIcon,
    isChildren: true,
    children: [
      { title: 'Prospects', href: '/sales/prospects' },
      { title: 'Territories', href: '/sales/territories' },
      { title: 'Rep Assignments', href: '/sales/rep-assignments' },
      { title: 'Deal Rooms', href: '/sales/deal-rooms' },
      { title: 'Quotes', href: '/sales/quotes' },
    ],
  },
  {
    title: 'Orders',
    href: '/orders',
    icon: ShoppingCartIcon,
    isChildren: true,
    children: [
      { title: 'Pending', href: '/orders/pending' },
      { title: 'Signed', href: '/orders/signed' },
      { title: 'Delivered', href: '/orders/delivered' },
      {
        title: 'Cancellations & Renewals',
        href: '/orders/cancellations-renewals',
      },
      { title: 'Compliance', href: '/orders/compliance' },
    ],
  },
  {
    title: 'Relationships',
    href: '/relationships',
    icon: HandshakeIcon,
    isChildren: true,
    children: [
      {
        title: 'Marketing Subscribers',
        href: '/relationships/marketing-subscribers',
      },
      { title: 'Partners', href: '/relationships/partners' },
      { title: 'Marketplaces', href: '/relationships/marketplaces' },
      {
        title: 'Vendors',
        href: '/relationships/vendors',
      },
      { title: 'Internal Users', href: '/relationships/internal-users' },
    ],
  },
  {
    title: 'Assets',
    href: '/assets',
    icon: ShapesIcon,
    isChildren: true,
    children: [
      { title: 'Standard Agreements', href: '/assets/standard-agreements' },
      { title: 'Standard Policies', href: '/assets/standard-policies' },
      {
        title: 'Marketing Assets',
        href: '/assets/marketing-assets',
      },
    ],
  },
  {
    title: 'Reporting',
    href: '/reporting',
    icon: BarChart3Icon,
    isChildren: true,
    children: [
      {
        title: 'Revenue & Usage',
        href: '/reporting/revenue-usage',
      },
      {
        title: 'Revenue Recognition',
        href: '/reporting/revenue-recognition',
      },
      {
        title: 'Attribution',
        href: '/reporting/attribution',
      },
      {
        title: 'Showback',
        href: '/reporting/showback',
      },
      {
        title: 'Compliance',
        href: '/reporting/compliance',
      },
      {
        title: 'Insights',
        href: '/reporting/insights',
      },
    ],
  },
  {
    type: 'separator',
  },
  {
    title: 'Workspace settings',
    href: '/workspace-settings',
    icon: SettingsIcon,
    isChildren: true,
    children: [
      {
        title: 'General Settings',
        href: '/workspace-settings/general-settings',
      },
      {
        title: 'Members',
        href: '/workspace-settings/members',
      },
      {
        title: 'Audit Forwarding',
        href: '/workspace-settings/audit-forwarding',
      },
      {
        title: 'Authentication',
        href: '/workspace-settings/authentication',
      },
      {
        title: 'End User Privacy',
        href: '/workspace-settings/end-user-privacy',
      },
      {
        title: 'Billing & Usage',
        href: '/workspace-settings/billing-usage',
      },
    ],
  },
  {
    title: 'Alerts & Preferences',
    href: '/alerts-preferences',
    icon: UserRoundCogIcon,
  },
  {
    title: 'Product Configuration',
    href: '/product-configuration',
    icon: SlidersHorizontalIcon,
    isChildren: true,
    children: [
      {
        title: 'Branding',
        href: '/product-configuration/branding',
      },
      {
        title: 'Agreements & Policies',
        href: '/product-configuration/agreements-policies',
      },
      {
        title: 'Taxes, Payments, Localization',
        href: '/product-configuration/payments',
      },
      {
        title: 'Data Locality',
        href: '/product-configuration/data-locality',
      },
      {
        title: 'Users & Orgs',
        href: '/product-configuration/users-orgs',
      },
      {
        title: 'Product Experience',
        href: '/product-configuration/product-experience',
      },
      {
        title: 'Monetization',
        href: '/product-configuration/monetization',
      },
      {
        title: 'GTM',
        href: '/product-configuration/gtm',
      },
      {
        title: 'Management & Reporting',
        href: '/product-configuration/management-reporting',
      },
    ],
  },
  {
    title: 'Integrations',
    href: '/integrations',
    icon: LayersIcon,
    isChildren: true,
    children: [
      {
        title: 'Installed Datum Apps',
        href: '/integrations/installed-datum-apps',
      },
      {
        title: 'Authorized Datum Apps',
        href: '/integrations/authorized-datum-apps',
      },
      {
        title: 'Authorized OAuth Apps',
        href: '/integrations/authorized-oauth-apps',
      },
    ],
  },
  {
    title: 'Developers',
    href: '/developers',
    icon: AppWindowMacIcon,
    isChildren: true,
    children: [
      {
        title: 'API Tokens',
        href: '/developers/api-tokens',
      },
      {
        title: 'Register a New App',
        href: '/developers/new-app',
      },
      {
        title: 'Request Datum Swag',
        href: '/developers/datum-swag',
      },
      {
        title: 'Startup Program',
        href: '/developers/startup-program',
      },
    ],
  },
]
