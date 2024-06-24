import React, { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import {
  panelHeaderStyles,
  panelStyles,
  type PanelVariants,
  type PanelHeaderVariants,
} from './panel.styles'

interface PanelProps extends PanelVariants {
  className?: string
  children: ReactNode
}

interface PanelHeaderProps extends PanelHeaderVariants {
  className?: string
  heading: React.ReactNode
  subheading?: React.ReactNode
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

const PanelHeader: React.FC<PanelHeaderProps> = ({
  className,
  heading,
  subheading,
  noBorder,
}) => {
  const styles = panelHeaderStyles({ noBorder })
  return (
    <div className={cn(styles.header(), className)}>
      <h2 className={styles.heading()}>{heading}</h2>
      {subheading && <p className={styles.subheading()}>{subheading}</p>}
    </div>
  )
}

export { Panel, PanelHeader }
