import { tv, type VariantProps } from 'tailwind-variants'

const editorStyles = tv({
  slots: {
    columns: 'flex gap-6 w-full',
    column: 'flex-1',
    jsonEditor: 'w-full h-full',
  },
})

export type EditorVariants = VariantProps<typeof editorStyles>

export { editorStyles }
