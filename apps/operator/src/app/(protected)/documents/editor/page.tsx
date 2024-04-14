'use client';

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from "next-auth/react";
import { TemplateEditor } from '@/components/pages/protected/documents/editor';
import { Provider } from 'urql';
import { createClient } from "../../../../lib/uqrl";
import PageTitle from '../../../../components/page-title'

const Page: React.FC = () => {
  const router = useRouter()

  const searchParams = useSearchParams()
  const templateID = searchParams?.get('id') as string

  // navigate back to the template list if no template id is provided
  if (!templateID) {
    router.push('/documents/templates')
    return <div>loading...</div>
  }

  const { data: session, status } = useSession();
  const isSessionLoading = status === 'loading';

  // Wait for the session and template data
  if (isSessionLoading) {
    return <div>loading...</div>
  }

  const client = createClient(session);

  // lets load the form now
  return (
    <>
      <PageTitle
        description="Document Editor"
        title="Edit document templates for rendering documents."
      />
      <Provider value={client}>
        <TemplateEditor id={templateID} />
      </Provider>
    </>
  )
}

export default Page
