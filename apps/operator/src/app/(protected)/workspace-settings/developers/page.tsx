import { PageHeading } from '@repo/ui/page-heading'
import type { Metadata } from 'next/types'
import DevelopersPage from '@/components/pages/protected/workspace/developers/developers-page'

export const metadata: Metadata = {
  title: 'Workspace settings',
}

const Page: React.FC = () => {
  return (
    <>
      <PageHeading heading="Developers" />
      <DevelopersPage />
    </>
  )
}

export default Page
