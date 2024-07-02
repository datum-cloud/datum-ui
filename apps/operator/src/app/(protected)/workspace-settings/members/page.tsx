import { PageHeading } from '@repo/ui/page-heading'
import type { Metadata } from 'next/types'
import MembersPage from '@/components/pages/protected/workspace/members/members-page'

export const metadata: Metadata = {
  title: 'Workspace settings',
}

const Page: React.FC = () => {
  return (
    <>
      <PageHeading eyebrow="Workspace settings" heading="Members" />
      <MembersPage />
    </>
  )
}

export default Page
