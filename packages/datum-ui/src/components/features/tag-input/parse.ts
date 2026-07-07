import { z } from 'zod'

/**
 * Used for identifying split characters when pasting.
 * Splits on: newlines, tabs, semicolons, commas, and pipes.
 * Does NOT split on dots (.) or slashes (/) to preserve email addresses and URLs.
 */
export const SPLITTER_REGEX = /[\n\t;,|]+/

/**
 * Used for trimming leading/trailing whitespace and special characters.
 * Preserves alphanumeric characters, dots, @, hyphens, and underscores.
 */
export const FORMATTING_REGEX = /^[\s"'<>]+|[\s"'<>]+$/g

/** Default keys that confirm the current input as a tag. */
export const DEFAULT_DELIMITERS = ['Enter', ',']

/** A function that normalizes a tag value before validation and adding. */
export type Normalizer = (value: string) => string | null

/**
 * Split a pasted string into candidate tag values.
 * Trims each value, drops empties, and strips wrapping quote/angle characters.
 */
export function splitByDelimiters(text: string): string[] {
  return text
    .split(SPLITTER_REGEX)
    .map(val => val.trim())
    .filter(Boolean)
    .map(val => val.replace(FORMATTING_REGEX, ''))
    .filter(Boolean)
}

/**
 * Trim then apply an optional normalizer.
 * Returns `null` for empty or normalizer-rejected values.
 */
export function normalizeTag(raw: string, normalizer?: Normalizer): string | null {
  const trimmed = raw.trim()
  if (!trimmed)
    return null

  const normalized = normalizer ? normalizer(trimmed) : trimmed
  return normalized || null
}

export interface ValidateResult {
  ok: boolean
  error?: string
}

/**
 * Validate a single tag value against an optional Zod schema.
 * Returns `{ ok: true }` when no validator is supplied.
 */
export function validateTag(value: string, validator?: z.ZodType<string>): ValidateResult {
  if (!validator)
    return { ok: true }

  try {
    validator.parse(value)
    return { ok: true }
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      return { ok: false, error: error.issues[0]?.message || 'Invalid input' }
    }
    return { ok: false, error: 'Validation failed' }
  }
}

export interface ProcessPastedOptions {
  normalizer?: Normalizer
  validator?: z.ZodType<string>
  maxItems?: number
}

export interface ProcessPastedResult {
  /** Normalized, de-duplicated, validated values ready to add. */
  validValues: string[]
  /** True when at least one candidate failed schema validation. */
  hadInvalid: boolean
  /** True when candidates were dropped because the max-items limit was reached. */
  exceededMax: boolean
}

/**
 * Normalize, de-duplicate, validate and cap a list of pasted candidate values.
 *
 * Applies the same normalizer used for single-value entry (so casing rules etc.
 * are consistent) and reports when values were dropped for validation or the
 * max-items limit so the caller can surface feedback.
 */
export function processPastedValues(
  rawValues: string[],
  existing: string[],
  { normalizer, validator, maxItems = Infinity }: ProcessPastedOptions = {},
): ProcessPastedResult {
  const validValues: string[] = []
  let hadInvalid = false
  let exceededMax = false

  for (const raw of rawValues) {
    const normalized = normalizeTag(raw, normalizer)
    if (!normalized)
      continue

    // Skip duplicates against both existing tags and this batch.
    if (existing.includes(normalized) || validValues.includes(normalized))
      continue

    // Stop once the max-items limit is reached; flag remaining values as dropped.
    if (existing.length + validValues.length >= maxItems) {
      exceededMax = true
      break
    }

    const result = validateTag(normalized, validator)
    if (!result.ok) {
      hadInvalid = true
      continue
    }

    validValues.push(normalized)
  }

  return { validValues, hadInvalid, exceededMax }
}
