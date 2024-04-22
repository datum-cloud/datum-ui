import React, { useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@repo/ui/button'
import Form from '@rjsf/core'
import { RJSFSchema, UiSchema } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'

import {
  useCreateDocumentDataMutation,
  useGetTemplateQuery,
} from '@repo/codegen/src/schema'

function printPDF() {
  alert('Coming soon!')
}

export const TemplateEditor = ({ id }: { id: string }) => {
  // get the session
  const { data: session, status } = useSession()
  const isSessionLoading = status === 'loading'

  // setup the state to save the form data
  const [data, setData] = useState({})

  // setup the state to save the jsonschema
  const [schemaData, setSchemaData] = useState({})
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  // setup the query to get the template data
  const variables = { getTemplateId: id || '' }
  const [templateData] = useGetTemplateQuery({ variables })
  const jsonSchema: RJSFSchema = templateData.data?.template.jsonconfig
  //const uiSchema: UiSchema = templateData.data?.template.uischema

  // setup the mutation to save the form data
  const [dataResult, createDocumentData] = useCreateDocumentDataMutation()
  function saveDocumentData() {
    const variables = {
      input: {
        data: data,
        templateID: templateData?.data?.template.id || '',
      },
    }

    createDocumentData(variables)
    alert('Form Data Saved')
  }

  // Wait for the session and template data
  if (isSessionLoading || templateData.fetching) {
    return <div>loading...</div>
  }

  if (templateData.error) {
    return <div>failed to load</div>
  }

  return (
    <Form schema={jsonSchema} validator={validator}>
      <div>
        <Button
          icon={<ArrowUpRight />}
          iconAnimated
          type="button"
          size="md"
          variant="blackberry"
          onClick={() => {
            saveDocumentData()
          }}
        >
          Save Form
        </Button>
        <Button
          icon={<ArrowUpRight />}
          iconAnimated
          type="button"
          size="md"
          variant="blackberry"
          onClick={() => {
            printPDF()
          }}
        >
          Print PDF
        </Button>
      </div>
    </Form>
  )
}
