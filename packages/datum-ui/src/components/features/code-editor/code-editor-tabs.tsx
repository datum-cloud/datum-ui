import type { CodeEditorTabsProps, EditorLanguage } from './types'
import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../base/tabs'
import { toast } from '../../toast'
import { CodeEditor } from './code-editor'
import { jsonToYaml, yamlToJson } from './lib/editor'

/**
 * CodeEditorTabs - Dual-format code editor with JSON ↔ YAML conversion
 *
 * A tabbed interface that provides JSON and YAML editing with automatic
 * bidirectional conversion and validation. Prevents tab switching when
 * content has syntax errors and shows error toasts for conversion failures.
 *
 * Features:
 * - Dual-format editing (JSON ↔ YAML)
 * - Automatic bidirectional conversion
 * - Real-time validation before conversion
 * - Error toasts for conversion failures
 * - Maintains sync between both formats
 * - Hidden format field for form submission
 *
 * @example
 * ```tsx
 * import { CodeEditorTabs } from '@datum-cloud/datum-ui/code-editor'
 *
 * // Basic usage
 * <CodeEditorTabs
 *   value={config}
 *   format="yaml"
 *   onChange={(value, format) => {
 *     setConfig(value)
 *     setFormat(format)
 *   }}
 *   name="configuration"
 *   minHeight="500px"
 * />
 *
 * // With React Hook Form
 * const { watch, setValue } = useForm()
 *
 * <CodeEditorTabs
 *   value={watch('config')}
 *   onChange={(value) => setValue('config', value)}
 *   name="config"
 * />
 *
 * // With format change handler
 * <CodeEditorTabs
 *   value={data}
 *   format={currentFormat}
 *   onChange={(value, format) => console.log({ value, format })}
 *   onFormatChange={(format) => setCurrentFormat(format)}
 * />
 * ```
 *
 * @param props - Component props
 * @param props.value - Editor content
 * @param props.onChange - Content and format change callback
 * @param props.format - Active format ('json' or 'yaml', default: 'yaml')
 * @param props.onFormatChange - Format change callback
 * @param props.error - Error message to display below the editor
 * @param props.id - Input element ID for form integration
 * @param props.name - Input element name for form submission (default: 'code-editor')
 * @param props.minHeight - Minimum editor height (default: '300px')
 * @returns Rendered tabbed editor with JSON/YAML conversion
 */
export function CodeEditorTabs({
  value,
  onChange,
  format = 'yaml',
  onFormatChange,
  error,
  id,
  name = 'code-editor',
  minHeight = '300px',
}: CodeEditorTabsProps) {
  const [jsonContent, setJsonContent] = useState('')
  const [yamlContent, setYamlContent] = useState('')
  const [activeTab, setActiveTab] = useState<EditorLanguage>(format)

  useEffect(() => {
    if (format === 'json') {
      setJsonContent(value)
      try {
        setYamlContent(jsonToYaml(value))
      }
      catch {
        // Silent fail for sync
      }
    }
    else {
      setYamlContent(value)
      try {
        setJsonContent(yamlToJson(value))
      }
      catch {
        // Silent fail for sync
      }
    }
  }, [value, format])

  const handleJsonChange = (newValue: string) => {
    setJsonContent(newValue)
    try {
      const converted = jsonToYaml(newValue)
      setYamlContent(converted)
      if (activeTab === 'json') {
        onChange?.(newValue, 'json')
      }
    }
    catch (error) {
      console.error('Failed to convert JSON to YAML:', error)
    }
  }

  const handleYamlChange = (newValue: string) => {
    setYamlContent(newValue)
    try {
      const converted = yamlToJson(newValue)
      setJsonContent(converted)
      if (activeTab === 'yaml') {
        onChange?.(newValue, 'yaml')
      }
    }
    catch (error) {
      console.error('Failed to convert YAML to JSON:', error)
    }
  }

  const handleTabChange = (newTab: string) => {
    const newFormat = newTab as EditorLanguage
    const currentContent = activeTab === 'json' ? jsonContent : yamlContent

    try {
      if (activeTab === 'json') {
        jsonToYaml(currentContent)
      }
      else {
        yamlToJson(currentContent)
      }
      setActiveTab(newFormat)
      onFormatChange?.(newFormat)
      const newContent = newFormat === 'json' ? jsonContent : yamlContent
      onChange?.(newContent, newFormat)
    }
    catch {
      const errorMsg
        = activeTab === 'json'
          ? 'Invalid JSON format. Please fix errors before switching tabs.'
          : 'Invalid YAML format. Please fix errors before switching tabs.'
      toast.error(errorMsg, {
        id: `${activeTab}-to-${newFormat}-error`,
      })
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="yaml">YAML</TabsTrigger>
        <TabsTrigger value="json">JSON</TabsTrigger>
      </TabsList>
      <TabsContent value="yaml">
        <CodeEditor
          value={yamlContent}
          onChange={handleYamlChange}
          language="yaml"
          minHeight={minHeight}
          error={error}
        />
      </TabsContent>
      <TabsContent value="json">
        <CodeEditor
          value={jsonContent}
          onChange={handleJsonChange}
          language="json"
          minHeight={minHeight}
          error={error}
        />
      </TabsContent>
      <input type="hidden" id={id} name={name} value={activeTab === 'json' ? jsonContent : yamlContent} />
      <input type="hidden" name={`${name}-format`} value={activeTab} />
    </Tabs>
  )
}
