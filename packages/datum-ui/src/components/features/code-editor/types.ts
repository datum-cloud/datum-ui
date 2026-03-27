import { z } from 'zod'
import { isValidJson, isValidYaml } from './lib/editor'

export type EditorLanguage = 'json' | 'yaml' | 'typescript' | 'javascript' | 'python' | 'sql' | 'html' | 'css' | 'markdown'

/**
 * Props for the CodeEditor component.
 *
 * Base Monaco Editor wrapper with single language support, theme integration,
 * and form compatibility.
 *
 * @example
 * ```tsx
 * import { CodeEditor } from '@datum-cloud/datum-ui/code-editor'
 *
 * <CodeEditor
 *   value={code}
 *   onChange={(newValue) => setCode(newValue)}
 *   language="yaml"
 *   minHeight="400px"
 * />
 * ```
 */
export interface CodeEditorProps {
  /** Editor content */
  value: string
  /** Content change callback */
  onChange?: (value: string) => void
  /** Syntax highlighting language */
  language: EditorLanguage
  /** Input element ID for form integration */
  id?: string
  /** Input element name for form submission (default: 'code-editor') */
  name?: string
  /** Error message to display below the editor */
  error?: string
  /** Additional CSS classes */
  className?: string
  /** Read-only mode (default: false) */
  readOnly?: boolean
  /** Minimum editor height (default: '200px') */
  minHeight?: string
}

/**
 * Props for the CodeEditorTabs component.
 *
 * Tabbed interface with JSON ↔ YAML conversion, validation, and automatic
 * bidirectional synchronization.
 *
 * @example
 * ```tsx
 * import { CodeEditorTabs } from '@datum-cloud/datum-ui/code-editor'
 *
 * <CodeEditorTabs
 *   value={config}
 *   format="yaml"
 *   onChange={(value, format) => {
 *     setConfig(value)
 *     setFormat(format)
 *   }}
 *   onFormatChange={(format) => setFormat(format)}
 *   name="configuration"
 *   minHeight="500px"
 * />
 * ```
 */
export interface CodeEditorTabsProps {
  /** Editor content */
  value: string
  /** Content and format change callback */
  onChange?: (value: string, format: EditorLanguage) => void
  /** Active format ('json' or 'yaml', default: 'yaml') */
  format?: EditorLanguage
  /** Format change callback */
  onFormatChange?: (format: EditorLanguage) => void
  /** Error message to display below the editor */
  error?: string
  /** Input element ID for form integration */
  id?: string
  /** Input element name for form submission (default: 'code-editor') */
  name?: string
  /** Minimum editor height (default: '300px') */
  minHeight?: string
}

export const jsonSchema = z.object({
  jsonContent: z
    .string()
    .min(1, 'JSON content is required')
    .refine(isValidJson, { message: 'Invalid JSON format' }),
})

export const yamlSchema = z.object({
  yamlContent: z
    .string()
    .min(1, 'YAML content is required')
    .refine(isValidYaml, { message: 'Invalid YAML format' }),
})

export function createCodeEditorSchema(name = 'code-editor') {
  return z
    .object({
      [name]: z.string().min(1, `${name} content is required`),
      format: z.enum(['json', 'yaml']),
    })
    .superRefine((data, ctx) => {
      const content = data[name] as string
      if (data.format === 'json' && !isValidJson(content)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid JSON format',
          path: [name],
        })
      }
      else if (data.format === 'yaml' && !isValidYaml(content)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid YAML format',
          path: [name],
        })
      }
    })
}
