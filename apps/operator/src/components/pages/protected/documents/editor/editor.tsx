import React, { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@repo/ui/button'
import { Panel } from '@repo/ui/panel'
import Editor from '@monaco-editor/react'
import { editorStyles } from './editor.styles'
import validator from '@rjsf/validator-ajv8'
import Form from '@rjsf/core'

import {
  TemplateDocumentType,
  useCreateTemplateMutation,
  useGetTemplateQuery,
  OrganizationWhereInput,
  TemplateWhereInput,
  useFilterTemplatesQuery,
  useUpdateTemplateMutation,
} from '@repo/codegen/src/schema'

const isJsonString = (str: string): boolean => {
  const json = JSON.parse(str)
  return typeof json === 'object'
}

export const TemplateEditor = ({ id }: { id: string }) => {
  const router = useRouter()
  const [schemaData, setSchemaData] = useState('')
  const { columns, column, jsonEditor } = editorStyles()

  // get the session
  const { data: session, status } = useSession()
  const isSessionLoading = status === 'loading'

  // setup the state to save the jsonschema
  const jsonEditorRef = useRef(null)

  // setup the query to get the template data
  const variables = { getTemplateId: id || '' }
  const [templateData] = useGetTemplateQuery({ variables })
  const jsonSchema = templateData.data?.template.jsonconfig || {}

  // save the updated state
  const handleEditJsonSchema = (value: string | undefined) => {
    setSchemaData(value ?? '')
  }

  const [, createTemplateData] = useCreateTemplateMutation()
  const [, updateTemplateData] = useUpdateTemplateMutation()

  // See if document is already saved
  const orgFilter: OrganizationWhereInput[] = [
    {
      id: session?.user?.organization,
    },
  ]
  const whereFilter: TemplateWhereInput = {
    templateType: TemplateDocumentType.DOCUMENT,
    name: templateData.data?.template.name + ' Document',
    hasOwnerWith: orgFilter,
  }

  const [templateDocument] = useFilterTemplatesQuery({
    variables: { where: whereFilter },
  })

  useEffect(() => {
    if (jsonSchema) {
      setSchemaData(JSON.stringify(jsonSchema, null, 2))
    }
  }, [templateData])

  const handleEditorDidMount = (editor: any) => {
    jsonEditorRef.current = editor
  }

  const saveTemplateData = (data: string) => {
    let schema: {} = JSON.parse(data)
    const variables = {
      input: {
        name: templateData.data?.template.name + ' Document' || '',
        templateType: TemplateDocumentType.DOCUMENT,
        jsonconfig: schema,
        description: templateData.data?.template.description,
        uischema: jsonSchema,
        ownerID: session?.user?.organization || '',
      },
    }

    if (templateDocument.data?.templates.edges?.length == 1) {
      const updateId = templateDocument.data.templates.edges[0]?.node?.id || ''
      // template already exists, update it
      updateTemplateData({
        updateTemplateId: updateId,
        input: { ...variables.input },
      }).then((result) => {
        // TODO(hannah or sfunk): this should be a toast or something better with error handling
        if (result.error) {
          alert(result.error)
          return
        }

        if (result.data) {
          alert('Document Updated')

          router.push(
            `/documents/form?id=${result.data?.updateTemplate?.template?.id}`,
          )
        }
      })
    } else {
      createTemplateData(variables).then((result) => {
        // TODO(hannah or sfunk): this should be a toast or something better with error handling
        if (result.error) {
          alert(result.error)
          return
        }

        if (result.data) {
          alert('Document Saved')

          router.push(
            `/documents/form?id=${result.data?.createTemplate?.template?.id}`,
          )
        }
      })
    }
  }

  // Wait for the session and template data
  if (isSessionLoading || templateData.fetching) {
    return <div>loading...</div>
  }

  if (templateData.error) {
    return <div>failed to load</div>
  }

  return (
    <>
      <div className={columns()}>
        <div className={column()}>
          <Panel className={jsonEditor()}>
            <Editor
              defaultLanguage="json"
              defaultValue={schemaData}
              onChange={handleEditJsonSchema}
              onMount={handleEditorDidMount}
              options={{
                codeLens: false,
                lineNumbers: 'off',
                renderWhitespace: 'none',
                scrollBeyondLastLine: false,
                folding: false,
                minimap: { enabled: false },
                overviewRulerBorder: false,
                scrollbar: {
                  horizontal: 'hidden',
                },
              }}
            />
          </Panel>
        </div>
        <div className={column()}>
          <Panel className={jsonEditor()}>
            <Form schema={JSON.parse(schemaData)} validator={validator} />
          </Panel>
        </div>
      </div>
      <Button
        icon={<ArrowUpRight />}
        iconAnimated
        type="button"
        size="md"
        variant="blackberry"
        onClick={() => {
          // saves the initial template schema
          if (Object.keys(schemaData).length === 0) {
            saveTemplateData(
              JSON.stringify(templateData?.data?.template.jsonconfig),
            )
          } else {
            saveTemplateData(JSON.stringify(schemaData))
          }
        }}
      >
        Save Template Schema
      </Button>
      <Button
        icon={<ArrowUpRight />}
        iconAnimated
        type="button"
        size="md"
        variant="blackberry"
        onClick={() => {
          // TODO: this should be a toast or something better with error handling
          isJsonString(JSON.stringify(schemaData))
            ? alert('Valid JSON')
            : alert('Invalid JSON')
        }}
      >
        Validate JSON
      </Button>
    </>
  )
}
