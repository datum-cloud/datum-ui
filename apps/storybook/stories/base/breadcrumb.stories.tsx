import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@datum-cloud/datum-ui/breadcrumb'

const meta: Meta<typeof Breadcrumb> = {
  title: 'Base/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    docs: {
      description: {
        component:
          'A navigational trail showing the user\'s current location within a hierarchy.\n\n'
          + 'Breadcrumb renders a horizontal list of links representing the user\'s current path within '
          + 'the application hierarchy. It follows the WAI-ARIA breadcrumb pattern with '
          + '`nav[aria-label="breadcrumb"]` and `aria-current="page"` on the current page. '
          + 'Built on Radix UI\'s Slot for polymorphic link rendering via the `asChild` prop on `BreadcrumbLink`.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof Breadcrumb>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A three-level breadcrumb trail with home, an intermediate page, and the current page.',
      },
    },
  },
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Current Page</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}

export const WithFrameworkLinks: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `asChild` on `BreadcrumbLink` to render a framework link component (e.g. React Router\'s `<Link>`, Next.js\'s `<Link>`) instead of a plain `<a>`. '
          + 'Storybook has no router, so this example uses a plain `<a>` to illustrate the `asChild` API — swap it for your framework\'s link component in real usage.',
      },
    },
  },
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <a href="/">Home</a>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <a href="/projects">Projects</a>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Settings</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}

export const WithEllipsis: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'For deep hierarchies, collapse middle items with `BreadcrumbEllipsis` to keep the trail compact.',
      },
    },
  },
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/projects/acme/services">Services</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>API Gateway</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}
