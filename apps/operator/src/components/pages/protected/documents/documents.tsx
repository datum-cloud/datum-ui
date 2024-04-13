'use client'

import { useRouter } from 'next/navigation'
import {
  useFilterTemplatesQuery,
  TemplateWhereInput,
  TemplateDocumentType
} from '../../../../../../../codegen/src/schema';

export const DocumentList = () => {
  // setup the query to get the organization document data
  const orgFilter: TemplateWhereInput = {
    type: TemplateDocumentType.DOCUMENT
  }
  const [allDocuments] = useFilterTemplatesQuery({
    variables: { where: orgFilter },
  });

  if (allDocuments.error) {
    console.log(allDocuments.error);
    return <div>failed to load</div>
  }


  // Wait for the session and template data
  if (allDocuments.fetching) {
    return <div>loading...</div>
  }

  const router = useRouter()

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const templateID = event.target.value
    router.push(`/documents/editor?id=${templateID}`)
  }

  return (
    <>
      <h1>Awesome Document Library</h1>
      <p>The organization documents that can be used to create documents such as invoices, quotes, etc.</p>
      <select onChange={handleSelectChange}>
        <option key="0" value="">
          Select a document
        </option>
        {[allDocuments.data?.templates?.edges?.map((templateEntry) => (
          <option key={templateEntry?.node?.id} value={templateEntry?.node?.id}>
            {templateEntry?.node?.name}
          </option>
        ))]}
      </select>
    </>
  );
}