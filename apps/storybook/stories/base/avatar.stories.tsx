import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Avatar, AvatarFallback, AvatarImage } from '@datum-cloud/datum-ui/avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Base/Avatar',
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component:
          'Display user profile images with automatic fallback support for missing or failed-to-load images.\n\n'
          + 'Avatar displays a user\'s profile picture in a circular frame with built-in fallback handling. '
          + 'When an image fails to load or is not provided, a fallback element (typically initials or an '
          + 'icon) is displayed instead. Built on `@radix-ui/react-avatar` for accessibility and fallback handling.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
    },
  },
  args: {},
}

export default meta

type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic usage of the Avatar component with a profile image and initials fallback.',
      },
    },
  },
  render: args => (
    <Avatar {...args}>
      <AvatarImage src="https://i.pravatar.cc/150?u=avatar1" alt="User Avatar" />
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
}

export const WithImage: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Display multiple user avatars each with a profile image and an initials fallback.',
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/150?u=user1" alt="Alice Johnson" />
        <AvatarFallback>AJ</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/150?u=user2" alt="Bob Smith" />
        <AvatarFallback>BS</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/150?u=user3" alt="Charlie Brown" />
        <AvatarFallback>CB</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const FallbackOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When no image is provided or the image fails to load, the fallback is displayed. '
          + 'Use initials, icons, or any custom content.',
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback>AJ</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>BS</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>CB</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const FailedImageLoading: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The fallback is automatically displayed when an image URL fails to load.',
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src="https://invalid-url.example/image.jpg" alt="Failed" />
        <AvatarFallback>FL</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://invalid-url.example/404.jpg" alt="Not Found" />
        <AvatarFallback>NF</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const CustomSizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Customize the avatar size using Tailwind `size-*` utility classes on the `Avatar` container.',
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="size-6">
        <AvatarImage src="https://i.pravatar.cc/150?u=size1" alt="Small" />
        <AvatarFallback className="text-xs">S</AvatarFallback>
      </Avatar>
      <Avatar className="size-8">
        <AvatarImage src="https://i.pravatar.cc/150?u=size2" alt="Default" />
        <AvatarFallback className="text-sm">D</AvatarFallback>
      </Avatar>
      <Avatar className="size-12">
        <AvatarImage src="https://i.pravatar.cc/150?u=size3" alt="Medium" />
        <AvatarFallback>M</AvatarFallback>
      </Avatar>
      <Avatar className="size-16">
        <AvatarImage src="https://i.pravatar.cc/150?u=size4" alt="Large" />
        <AvatarFallback className="text-lg">L</AvatarFallback>
      </Avatar>
      <Avatar className="size-24">
        <AvatarImage src="https://i.pravatar.cc/150?u=size5" alt="XLarge" />
        <AvatarFallback className="text-2xl">XL</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const CustomFallbackContent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The fallback can contain any custom content, not just text initials. '
          + 'Use icons or custom SVGs styled with background and foreground classes.',
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback className="bg-primary text-primary-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-blue-500 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </AvatarFallback>
      </Avatar>
    </div>
  ),
}
