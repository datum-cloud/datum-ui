'use client'

/**
 * Client-side re-export of datum-ui components.
 *
 * datum-ui's bundle includes React hooks at the top level, which makes it
 * incompatible with Next.js server components. MDX files must import from
 * this wrapper instead of '@datum-cloud/datum-ui' directly.
 */
export * from '@datum-cloud/datum-ui'
