
import React, { useState } from 'react'
import { useSession } from "next-auth/react";
import { JsonForms } from "@jsonforms/react";
import { Button } from '@repo/ui/button';
import { SimpleForm } from '@repo/ui/simple-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs'
import {
  JsonFormsStyleContext,
  vanillaCells,
} from "@jsonforms/vanilla-renderers";
import {
  TemplateDocumentType,
  useCreateDocumentDataMutation,
  useCreateTemplateMutation,
  useGetTemplateQuery
} from '../../../../../../../codegen/src/schema';
import { renderers, styleContextValue } from '@/components/pages/protected/documents/styles'

function printPDF() {
  alert('Coming soon!')
}

export const TemplateEditor = ({ id }: { id: string }) => {
  // get the session
  const { data: session, status } = useSession();
  const isSessionLoading = status === 'loading';

  const [data, setData] = useState({});


  // setup the query to get the template data
  const variables = { getTemplateId: id || "" }
  const [templateData] = useGetTemplateQuery({ variables })

  const [templateResult, createTemplateData] = useCreateTemplateMutation()
  function saveTemplateData() {
    // TODO (sfunk): the jsonconfig should come from teh text area, and not the templateData
    const variables = {
      input: {
        name: templateData.data?.template.name || "",
        type: TemplateDocumentType.DOCUMENT,
        jsonconfig: templateData?.data?.template.jsonconfig,
        description: templateData.data?.template.description,
        uischema: templateData?.data?.template.uischema,
        ownerID: session?.user?.organization || "",
      }
    };

    createTemplateData(variables).then(result => {
      // TODO(hannah or sfunk): this should be a toast or something better with error handling
      if (templateResult.error) {
        alert(templateResult.error)
        return
      }

      alert(templateResult.data?.createTemplate?.template?.name + ' Saved')
    });
  }

  // setup the mutation to save the form data
  const [dataResult, createDocumentData] = useCreateDocumentDataMutation()
  function saveDocumentData() {
    const variables = {
      input: {
        data: data, templateID: templateData?.data?.template.id || ""
      }
    };

    createDocumentData(variables)
    alert('Form Data Saved')
  }

  // set the default tab
  const defaultTab = 'form'

  // Wait for the session and template data
  if (isSessionLoading || templateData.fetching) {
    return <div>loading...</div>
  }

  if (templateData.error) {
    console.log(templateData.error);
    return <div>failed to load</div>
  }

  return (
    <>
      <Tabs
        defaultValue={defaultTab}
      >
        <TabsList>
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
        </TabsList>
        <TabsContent value="form">
          <JsonFormsStyleContext.Provider value={styleContextValue}>
            <JsonForms
              schema={templateData?.data?.template.jsonconfig}
              data={data}
              renderers={renderers}
              cells={vanillaCells}
              onChange={({ data }) => setData(data)}
            />
          </JsonFormsStyleContext.Provider>
          <Button
            onClick={() => {
              saveDocumentData()
            }
            }>
            Save Form
          </ Button>
          &nbsp;&nbsp;&nbsp;
          <Button
            onClick={() => {
              printPDF()
            }}>
            Print PDF
          </ Button>
        </TabsContent>
        <TabsContent value="schema">
          <SimpleForm
          >
            <textarea name='jsonconfig'
              style={{ width: '100vw', height: '100vw' }}>
              {JSON.stringify(templateData?.data?.template.jsonconfig, null, 2)}
            </textarea>
          </SimpleForm>
          <Button
            onClick={() => {
              saveTemplateData()
            }}>
            Save Template Schema
          </ Button>
        </TabsContent>
      </Tabs >
    </ >
  )
}
