/**
 * Type-parity check: the native variant unions must equal the web ones.
 * Compiled by `tsc -p tsconfig.parity.json` (part of `typecheck` and `test`);
 * any drift is a type error.
 */
import type { AlertProps as WebAlertProps } from '@datum-cloud/datum-ui/alert'
import type { BadgeProps as WebBadgeProps } from '@datum-cloud/datum-ui/badge'
import type { ButtonProps as WebButtonProps } from '@datum-cloud/datum-ui/button'
import type { AlertProps } from '../src/components/alert'
import type { BadgeProps } from '../src/components/badge'
import type { ButtonProps } from '../src/components/button'

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Expect<T extends true> = T

type Web<T, K extends keyof T> = NonNullable<T[K]>
type Native<T, K extends keyof T> = NonNullable<T[K]>

export type ButtonParity = [
  Expect<Equal<Native<ButtonProps, 'type'>, Web<WebButtonProps, 'type'>>>,
  Expect<Equal<Native<ButtonProps, 'theme'>, Web<WebButtonProps, 'theme'>>>,
  Expect<Equal<Native<ButtonProps, 'size'>, Web<WebButtonProps, 'size'>>>,
]

export type BadgeParity = [
  Expect<Equal<Native<BadgeProps, 'type'>, Web<WebBadgeProps, 'type'>>>,
  Expect<Equal<Native<BadgeProps, 'theme'>, Web<WebBadgeProps, 'theme'>>>,
]

export type AlertParity = [
  Expect<Equal<Native<AlertProps, 'type'>, Web<WebAlertProps, 'variant'>>>,
]
