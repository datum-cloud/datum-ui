'use client'

import { useRouter } from 'next/navigation'
import {
  useFilterTemplatesQuery,
  TemplateWhereInput,
  TemplateDocumentType
} from '../../../../../../../codegen/src/schema';

export const TemplateList = () => {


  const whereFilter: TemplateWhereInput = {
    type: TemplateDocumentType.ROOTTEMPLATE
  }
  const [allTemplates] = useFilterTemplatesQuery({
    variables: { where: whereFilter },
  });

  if (allTemplates.error) {
    console.log(allTemplates.error);
    return <div>failed to load</div>
  }

  // Wait for the session and template data
  if (allTemplates.fetching) {
    return <div>loading...</div>
  }

  const router = useRouter()

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const templateID = event.target.value
    router.push(`/documents/editor?id=${templateID}`)
  }

  return (
    <>
      <h1>Awesome Template Library</h1>
      <p>This is an awesome template library. It provides a wide range of templates for various use cases. You can select a template from the dropdown below to bring up a template editor:</p>
      <select onChange={handleSelectChange}>
        <option key="0" value="">
          Select a template
        </option>
        {[allTemplates.data?.templates?.edges?.map((templateEntry) => (
          <option key={templateEntry?.node?.id} value={templateEntry?.node?.id}>
            {templateEntry?.node?.name}
          </option>
        ))]}
      </select>
    </>
  );
}