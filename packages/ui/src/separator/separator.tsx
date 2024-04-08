import { separatorStyles, type SeparatorVariants } from './separator.styles'

export interface SeparatorProps extends SeparatorVariants {
  label?: string
}

export const Separator = ({ label }: SeparatorProps) => {
  const { base, line, text } = separatorStyles()

  if (label) {
    return (
      <div className={base()}>
        <div className={line()} />
        <div className={text()}>{label}</div>
        <div className={line()} />
      </div>
    )
  }
  return (
    <div className={base()}>
      <div className={line()}></div>
    </div>
  )
}

export { separatorStyles }
