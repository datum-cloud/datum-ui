import speedometerIcon from '../../public/icons/speedometer.svg'
import carbonIcon from '../../public/icons/carbon_neutral.svg'
import tasksIcon from '../../public/icons/tasks.svg'
import envelopOpenIcon from '../../public/icons/envelope-open.svg'
import userGroupsIcon from '../../public/icons/users-group.svg'
import assetsIcon from '../../public/icons/window.svg'
import productsIcon from '../../public/icons/tag.svg'
import revenueIcon from '../../public/icons/shopping.svg'
import integrationsIcon from '../../public/icons/code-fork.svg'
import configIcon from '../../public/icons/adjustments-horizontal.svg'
import billingIcon from '../../public/icons/store.svg'

const divider = '_divider'

export const routes = [
  {
    name: 'Dashboard',
    description: '',
    href: '#',
    icon: speedometerIcon,
    current: true,
    detail: true,
    children: [
      {
        name: 'Assets',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Users & Groups',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Connected Integrations',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Active Sessions',
        description: '',
        href: '#',
        current: false,
      },
    ],
  },
  {
    name: 'Tasks & Mentions',
    description: '',
    href: '#',
    icon: tasksIcon,
    current: false,
  },
  {
    name: 'Inbox',
    description: '',
    href: '#',
    icon: envelopOpenIcon,
    current: false,
    detail: true,
    children: [
      {
        name: 'Unread',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'All',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Deleted',
        description: '',
        href: '#',
        current: false,
      },
    ],
  },
  { name: divider },
  {
    name: 'Assets',
    description: '',
    href: '#',
    icon: assetsIcon,
    current: false,
    detail: true,
    children: [
      {
        name: 'Discovery / Reconciliation',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Items',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Applications',
        description: '',
        href: '#',
        current: false,
      },
    ],
  },
  {
    name: 'Products',
    description: '',
    href: '#',
    icon: productsIcon,
    current: false,
    detail: true,
    children: [
      {
        name: 'Catalog',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Plans',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Price Books',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Subscriptions',
        description: '',
        href: '#',
        current: false,
      },
    ],
  },
  {
    name: 'People & Groups',
    description: '',
    href: '#',
    icon: userGroupsIcon,
    current: false,
    detail: true,
    children: [
      {
        name: 'Permissions & Connections',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Users',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Companies',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Organizations',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Root Organizations',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Tags',
        description: '',
        href: '#',
        current: false,
      },
    ],
  },
  { name: divider },
  {
    name: 'Revenue',
    description: '',
    href: '#',
    icon: revenueIcon,
    current: false,
    detail: true,
    children: [
      {
        name: 'Quotes',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Contracts',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Invoices',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Showback',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Chargeback',
        description: '',
        href: '#',
        current: false,
      },
    ],
  },
  {
    name: 'Sustainability',
    description: '',
    href: '#',
    icon: carbonIcon,
    current: false,
    detail: true,
    children: [
      {
        name: 'Track',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Measure',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Status',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Reports',
        description: '',
        href: '#',
        current: false,
      },
    ],
  },
  {
    name: 'Integrations',
    description: '',
    href: '#',
    icon: integrationsIcon,
    current: false,
    detail: true,
    children: [
      {
        name: 'Marketplace',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Github',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Slack',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'My Apps',
        description: '',
        href: '#',
        current: false,
      },
    ],
  },
  { name: divider },
  {
    name: 'Configuration',
    description: '',
    href: '#',
    icon: configIcon,
    current: false,
    detail: true,
    children: [
      {
        name: 'API Access',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Personal Settings',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Organization Settings',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Features',
        description: '',
        href: '#',
        current: false,
      },
    ],
  },
  {
    name: 'Billing',
    description: '',
    href: '#',
    icon: billingIcon,
    current: false,
    detail: true,
    children: [
      {
        name: 'Invoices',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'My Plan',
        description: '',
        href: '#',
        current: false,
      },
      {
        name: 'Payment Methods',
        description: '',
        href: '#',
        current: false,
      },
    ],
  },
]

export default routes
