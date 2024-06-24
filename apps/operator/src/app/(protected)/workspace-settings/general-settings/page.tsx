import { PageHeading } from '@repo/ui/page-heading'
import type { Metadata } from 'next/types'
import { WorkspaceNameForm } from '@/components/pages/protected/workspace/general-settings/workspace-name-form'
import { AvatarUpload } from '@/components/shared/avatar-upload/avatar-upload'
import { pageStyles } from './page.styles'
import { WorkspaceEmailForm } from '@/components/pages/protected/workspace/general-settings/workspace-email-form'

export const metadata: Metadata = {
  title: 'Workspace settings',
}

const Page: React.FC = () => {
  const { wrapper } = pageStyles()
  return (
    <>
      <PageHeading eyebrow="Workspace settings" heading="General" />
      <div className={wrapper()}>
        <WorkspaceNameForm />
        <AvatarUpload />
        <WorkspaceEmailForm />
      </div>
    </>
  )
}

export default Page
