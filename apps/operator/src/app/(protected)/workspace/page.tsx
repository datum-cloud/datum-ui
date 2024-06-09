'use client'

import React from 'react'
import PageTitle from '../../../components/page-title'
import { CreateWorkspaceForm } from '@/components/shared/workspace/create-workspace/create-workspace'

const WorkspaceLanding: React.FC = () => {
  return (
    <section>
      <PageTitle title='Welcome to Datum' centered />
      <CreateWorkspaceForm />
    </section>
  )
}

export default WorkspaceLanding
