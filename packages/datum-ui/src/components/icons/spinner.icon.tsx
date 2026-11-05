import type { VariantProps } from 'class-variance-authority'
import type { SVGMotionProps } from 'motion/react'
import { cva } from 'class-variance-authority'
import { motion } from 'motion/react'
import * as React from 'react'
import { cn } from '../../utils/cn'

const spinnerVariants = cva('shrink-0', {
  variants: {
    size: {
      'xs': 'size-3',
      'sm': 'size-4',
      'md': 'size-6',
      'lg': 'size-8',
      'xl': 'size-10',
      '2xl': 'size-12',
      '3xl': 'size-14',
      '4xl': 'size-16',
      '5xl': 'size-18',
      '6xl': 'size-20',
      '7xl': 'size-22',
      '8xl': 'size-24',
      '9xl': 'size-26',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

/** Seconds per full turn. Quick enough that waiting feels shorter. */
const REVOLUTION = 0.8

const CENTER = 32
const RADIUS = 29
/**
 * The indicator: an arc running clockwise from 12 o'clock. Its tail sits at
 * the top and its head at the far end, so the head leads as the spinner turns.
 */
const ARC_DEGREES = 150
const ARC_END = {
  x: CENTER + RADIUS * Math.sin((ARC_DEGREES * Math.PI) / 180),
  y: CENTER - RADIUS * Math.cos((ARC_DEGREES * Math.PI) / 180),
}
const ARC_PATH = `M ${CENTER} ${CENTER - RADIUS} A ${RADIUS} ${RADIUS} 0 0 1 ${ARC_END.x} ${ARC_END.y}`

/** Track opacity when it follows the indicator colour. */
const TRACK_OPACITY = 0.18

export interface SpinnerIconProps
  extends React.SVGProps<SVGSVGElement>, VariantProps<typeof spinnerVariants> {
  /**
   * Colour of the track (background circle). By default the track is the
   * indicator colour at low opacity, so recolouring the indicator recolours both.
   */
  trackClassName?: string
  /** Colour of the spinning indicator */
  indicatorClassName?: string
}

/**
 * A loading spinner: a faint full-circle track with an arc that fades from a
 * transparent tail to a solid, rounded head, turning clockwise.
 *
 * The rotation runs through Motion as a full `transform` keyframe animation,
 * which Motion hands to the Web Animations API. That keeps it on the
 * compositor, so the spinner stays smooth while the main thread is busy doing
 * whatever the user is waiting for. It keeps spinning under reduced motion:
 * it is essential loading feedback, not decoration.
 */
export function SpinnerIcon({
  size,
  className,
  trackClassName,
  indicatorClassName = 'text-primary',
  ...props
}: SpinnerIconProps) {
  // useId output contains characters that are not safe in a url(#id) reference.
  const gradientId = `spinner-tail-${React.useId().replace(/[^\w-]/g, '')}`

  return (
    <motion.svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-slot="spinner"
      className={cn(spinnerVariants({ size }), className)}
      animate={{ transform: ['rotate(0deg)', 'rotate(360deg)'] }}
      transition={{ duration: REVOLUTION, ease: 'linear', repeat: Infinity }}
      // SVG attributes only. Motion's own handler props are never passed here,
      // so the overlap between the two prop types does not matter.
      {...(props as SVGMotionProps<SVGSVGElement>)}
    >
      {/* The gradient lives inside the coloured group so its `currentColor`
          stops inherit the indicator colour. */}
      <g className={indicatorClassName}>
        <defs>
          <linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            x1={CENTER}
            y1={CENTER - RADIUS}
            x2={ARC_END.x}
            y2={ARC_END.y}
          >
            <stop offset="0" stopColor="currentColor" stopOpacity="0" />
            <stop offset="1" stopColor="currentColor" />
          </linearGradient>
        </defs>
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke="currentColor"
          strokeWidth="5"
          opacity={trackClassName ? undefined : TRACK_OPACITY}
          className={trackClassName}
        />
        <path
          d={ARC_PATH}
          stroke={`url(#${gradientId})`}
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
    </motion.svg>
  )
}
