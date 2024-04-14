'use client';

import React from 'react'
import { Provider } from 'urql';
import { TemplateList } from '@/components/pages/protected/documents/templates';
import { createClient } from "../../../../lib/uqrl";
import { useSession } from "next-auth/react";
import PageTitle from '../../../../components/page-title'

const Page: React.FC = () => {
  const { data: session, status } = useSession();
  const isSessionLoading = status === 'loading';

  // Wait for the session and template data
  if (isSessionLoading) {
    return <div>loading...</div>
  }

  const client = createClient(session);

  return (
    <>
      <PageTitle
        description="Template Library"
        title="Datum provided template library"
      />
      <Provider value={client}>
        < TemplateList />
      </Provider>
    </>
  );
}

export default Page
