'use client'

import React from 'react'
import PageTitle from '../../../components/page-title'
import { CreateWorkspaceForm } from '@/components/shared/workspace/create-workspace/create-workspace'
import { ExistingWorkspaces } from '@/components/shared/workspace/existing-workspaces/existing-workspaces'

const WorkspaceLanding: React.FC = () => {
  return (
    <section>
      <PageTitle title="Welcome to Datum" centered />
      <ExistingWorkspaces />
      <CreateWorkspaceForm />
    </section>
  )
}

export default WorkspaceLanding
