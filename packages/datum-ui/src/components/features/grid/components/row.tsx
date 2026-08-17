import type { RowContextType, RowProps, RowState } from '../types/grid.types'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { cn } from '../../../../utils/cn'
import { GRID_PREFIX, RESPONSIVE_MAP } from '../constants/grid.constants'
import { getGutter, isResponsiveGutter, registerMediaQuery } from '../utils/responsive'

export const RowContext = React.createContext<RowContextType | null>(null)

const Row: React.FC<RowProps> = ({
  type,
  align,
  justify,
  className,
  style,
  children,
  gutter = 0,
  prefixCls = GRID_PREFIX,
  ...rest
}) => {
  const [screens, setScreens] = useState<RowState['screens']>({
    xs: true,
    sm: true,
    md: true,
    lg: true,
    xl: true,
    xxl: true,
  })

  useEffect(() => {
    // Register viewport tracking whenever the gutter contains a responsive
    // breakpoint object — for the object form AND the array form (e.g.
    // `[{ md: 16 }, 8]`). Previously the array form bailed here, so its screens
    // never updated and getGutter always resolved to the largest breakpoint
    // (BUG-084).
    if (!isResponsiveGutter(gutter)) {
      return
    }

    const unRegisters = Object.keys(RESPONSIVE_MAP).map(screen =>
      registerMediaQuery(RESPONSIVE_MAP[screen as keyof typeof RESPONSIVE_MAP], {
        match: () => {
          setScreens(prevState => ({
            ...prevState,
            [screen]: true,
          }))
        },
        unmatch: () => {
          setScreens(prevState => ({
            ...prevState,
            [screen]: false,
          }))
        },
      }),
    )

    return () => {
      unRegisters.forEach(unRegister => unRegister())
    }
  }, [gutter])

  const gutters = getGutter(gutter, screens)
  const prefix = `${prefixCls}-row`

  const classes = cn(
    {
      [prefix]: type !== 'flex',
      [`${prefix}-${type}`]: type,
      [`${prefix}-${type}-${justify}`]: type && justify,
      [`${prefix}-${type}-${align}`]: type && align,
    },
    className,
  )

  const rowStyle: React.CSSProperties = {
    ...(gutters[0] > 0
      ? {
          marginLeft: gutters[0] / -2,
          marginRight: gutters[0] / -2,
        }
      : {}),
    ...(gutters[1] > 0
      ? {
          marginTop: gutters[1] / -2,
          marginBottom: gutters[1] / -2,
        }
      : {}),
    ...style,
  }

  const contextValue: RowContextType = {
    gutters,
  }

  return (
    <RowContext value={contextValue}>
      <div {...rest} className={classes} style={rowStyle}>
        {children}
      </div>
    </RowContext>
  )
}

export default Row
