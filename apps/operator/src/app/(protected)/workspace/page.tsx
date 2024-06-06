'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import PageTitle from '../../../components/page-title'
import { useGetAllOrganizationsQuery } from '@repo/codegen/src/schema'
import { CreateWorkspaceForm } from '@/components/shared/workspace/create-workspace/create-workspace'

const WorkspaceLanding: React.FC = () => {
  const session = useSession()
  const [allOrgs] = useGetAllOrganizationsQuery()

  if (!allOrgs.data || allOrgs.fetching || allOrgs.error) {
    return null
  }

  const organizations = allOrgs.data?.organizations?.edges ?? []
  console.log(organizations)
  return (
    <section>
      <PageTitle title={<>Welcome to Datum - {organizations.length}</>} />
      {organizations.length > 0 && <></>}
      <CreateWorkspaceForm />
    </section>
  )
}

export default WorkspaceLanding
