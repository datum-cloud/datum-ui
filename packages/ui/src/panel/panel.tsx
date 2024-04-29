import { HTMLAttributes } from 'react'
import { panelStyles, type PanelVariants } from './panel.styles'

export interface panelProps
  extends PanelVariants,
    HTMLAttributes<HTMLDivElement> {}

export const Panel = ({
  children,
  className,
  noPadding,
  ...rest
}: panelProps) => {
  const { base } = panelStyles()

  return (
    <div
      className={`${base({ noPadding })} ${className ? ` ${className}` : ''}`}
      {...rest}
    >
      {children}
    </div>
  )
}

export { panelStyles }
