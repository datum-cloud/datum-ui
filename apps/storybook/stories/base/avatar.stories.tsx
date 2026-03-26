import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Avatar, AvatarFallback, AvatarImage } from '@datum-cloud/datum-ui/avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Base/Avatar',
  component: Avatar,
  args: {},
}

export default meta

type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/150?u=avatar1" alt="User Avatar" />
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
}

export const WithImage: Story = {
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
