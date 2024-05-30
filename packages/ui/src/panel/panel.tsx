import React, { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { panelStyles, type PanelVariants } from './panel.styles'

interface PanelProps extends PanelVariants {
  className?: string
  children: ReactNode
}

const Panel: React.FC<PanelProps> = ({
  gap,
  align,
  justify,
  textAlign,
  className,
  children,
}) => {
  const styles = panelStyles({ gap, align, justify, textAlign })
  return <div className={cn(styles.panel(), className)}>{children}</div>
}

export { Panel }
