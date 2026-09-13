import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import {
  SettingsNav,
  SettingsNavItem,
  SettingsNavLabel,
} from '@datum-cloud/datum-ui/settings-nav'
import {
  GlobeIcon,
  LockIcon,
  ServerIcon,
  SettingsIcon,
  ShieldIcon,
  SquareLibrary,
  Trash2Icon,
} from 'lucide-react'

const meta: Meta<typeof SettingsNav> = {
  title: 'Base/SettingsNav',
  component: SettingsNav,
  parameters: {
    docs: {
      description: {
        component:
          'Compact inset settings navigation for configuration pages.\n\n'
          + 'Use instead of the app-chrome `NavMenu` when a page needs its own section list: '
          + 'a SETTINGS eyebrow, icon items with an active fill, optional error dots, Soon badges, '
          + 'and a danger item for destructive sections.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof SettingsNav>

export const Default: Story = {
  render: () => (
    <div className="w-56">
      <SettingsNav>
        <SettingsNavLabel>Settings</SettingsNavLabel>
        <SettingsNavItem href="#general" icon={<SquareLibrary />} active>
          General
        </SettingsNavItem>
        <SettingsNavItem href="#hostnames" icon={<GlobeIcon />}>
          Custom Hostnames
        </SettingsNavItem>
        <SettingsNavItem href="#backends" icon={<ServerIcon />}>
          Backend pool
        </SettingsNavItem>
        <SettingsNavItem href="#tls" icon={<LockIcon />} indicator>
          TLS & Certificates
        </SettingsNavItem>
        <SettingsNavItem href="#security" icon={<ShieldIcon />}>
          Security & WAF
        </SettingsNavItem>
        <SettingsNavItem href="#access" icon={<SettingsIcon />} disabled badge="Soon">
          Access Control
        </SettingsNavItem>
        <SettingsNavItem href="#caching" icon={<SettingsIcon />} disabled badge="Soon">
          Caching
        </SettingsNavItem>
        <SettingsNavItem href="#danger" icon={<Trash2Icon />} variant="danger">
          Danger Zone
        </SettingsNavItem>
      </SettingsNav>
    </div>
  ),
}
