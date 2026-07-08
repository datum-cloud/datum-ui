import type { OnMount } from '@monaco-editor/react'
import type { CodeEditorProps } from './types'
import Editor from '@monaco-editor/react'
import { useEffect, useRef } from 'react'
import { cn } from '../../../utils/cn'
import { useTheme } from '../../themes'

/** Delay before the initial auto-format runs, giving Monaco time to settle. */
const AUTO_FORMAT_DELAY_MS = 300

type MonacoEditor = Parameters<OnMount>[0]

/**
 * CodeEditor - Monaco-based code editor component
 *
 * A Monaco Editor wrapper with single language support, theme integration,
 * and form compatibility. Provides a VS Code-like editing experience with
 * automatic formatting, responsive layout, and error state handling.
 *
 * Features:
 * - Monaco Editor with VS Code experience
 * - Theme-aware (automatic light/dark mode)
 * - Form-compatible (hidden input for React Hook Form)
 * - Responsive layout with automatic resizing
 * - Read-only mode support
 * - Custom error state styling
 *
 * @example
 * ```tsx
 * import { CodeEditor } from '@datum-cloud/datum-ui/code-editor'
 *
 * // Basic usage
 * <CodeEditor
 *   value={code}
 *   onChange={(newValue) => setCode(newValue)}
 *   language="yaml"
 *   minHeight="400px"
 * />
 *
 * // With error state
 * <CodeEditor
 *   value={invalidJson}
 *   onChange={handleChange}
 *   language="json"
 *   error="Invalid JSON format"
 * />
 *
 * // Read-only mode
 * <CodeEditor
 *   value={config}
 *   language="yaml"
 *   readOnly={true}
 * />
 * ```
 *
 * @param props - Component props
 * @param props.value - Editor content
 * @param props.onChange - Content change callback
 * @param props.language - Syntax highlighting language
 * @param props.id - Input element ID for form integration
 * @param props.name - Input element name for form submission (default: 'code-editor')
 * @param props.error - Error message to display below the editor
 * @param props.className - Additional CSS classes
 * @param props.readOnly - Read-only mode (default: false)
 * @param props.minHeight - Minimum editor height (default: '200px')
 * @returns Rendered Monaco editor with form integration
 */
export function CodeEditor({
  value,
  onChange,
  language,
  placeholder,
  id,
  name = 'code-editor',
  error,
  className,
  readOnly = false,
  minHeight = '200px',
}: CodeEditorProps) {
  const { theme } = useTheme()
  const editorRef = useRef<MonacoEditor | null>(null)
  const formatTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const monacoTheme = theme === 'dark' ? 'vs-dark' : 'light'
  const showPlaceholder = !!placeholder && value.length === 0

  // Clear any pending auto-format timer on unmount so the callback can't fire
  // after the component is gone and mutate a controlled value via onChange.
  useEffect(() => {
    return () => {
      if (formatTimerRef.current !== null) {
        clearTimeout(formatTimerRef.current)
      }
    }
  }, [])

  const handleEditorChange = (newValue: string | undefined) => {
    onChange?.(newValue || '')
  }

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor
    // Schedule the initial auto-format here rather than in an effect keyed on
    // mount state: @monaco-editor/react's onMount fires only after the async
    // loader creates the editor (post-first-effect), so an effect would never
    // re-run and the format would never happen.
    formatTimerRef.current = setTimeout(() => {
      editor.getAction('editor.action.formatDocument')?.run()
    }, AUTO_FORMAT_DELAY_MS)
  }

  return (
    <div className={cn('relative', className)}>
      <Editor
        height={minHeight}
        language={language}
        value={value}
        theme={monacoTheme}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          tabSize: 2,
          wordWrap: 'on',
          lineNumbers: 'on',
          folding: true,
          automaticLayout: true,
        }}
        className={cn(error && 'border border-destructive rounded-md')}
      />
      {showPlaceholder && (
        <div
          aria-hidden="true"
          className="text-input-placeholder pointer-events-none absolute top-0 left-14 z-10 py-0.5 text-sm whitespace-pre-wrap"
        >
          {placeholder}
        </div>
      )}
      <input type="hidden" id={id} name={name} value={value} />
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  )
}
