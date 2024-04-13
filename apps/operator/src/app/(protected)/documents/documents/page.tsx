'use client';

import React from 'react'
import { Provider } from 'urql';
import { createClient } from "../../../../lib/uqrl";
import { useSession } from "next-auth/react";
import { DocumentList } from '@/components/pages/protected/documents/documents';

const Page: React.FC = () => {
  const { data: session, status } = useSession();
  const isSessionLoading = status === 'loading';

  // Wait for the session and template data
  if (isSessionLoading) {
    return <div>loading...</div>
  }

  const client = createClient(session);

  return (
    <Provider value={client}>
      < DocumentList />
    </Provider>
  );
}

export default Page
