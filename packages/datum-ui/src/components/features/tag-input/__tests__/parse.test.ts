import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import {
  normalizeTag,
  processPastedValues,
  splitByDelimiters,
  validateTag,
} from '../parse'

describe('splitByDelimiters', () => {
  it('splits on commas, newlines, tabs, semicolons and pipes', () => {
    expect(splitByDelimiters('a,b\nc\td;e|f')).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
  })

  it('preserves dots and slashes to keep emails and urls intact', () => {
    expect(splitByDelimiters('a@b.com, https://x.io')).toEqual(['a@b.com', 'https://x.io'])
  })

  it('trims whitespace and strips wrapping quote/angle characters', () => {
    expect(splitByDelimiters('  "hi" , <there> ')).toEqual(['hi', 'there'])
  })

  it('drops empty segments', () => {
    expect(splitByDelimiters(',,a,,')).toEqual(['a'])
  })
})

describe('normalizeTag', () => {
  it('trims by default', () => {
    expect(normalizeTag('  hello  ')).toBe('hello')
  })

  it('applies the normalizer after trimming', () => {
    expect(normalizeTag('  HELLO ', v => v.toLowerCase())).toBe('hello')
  })

  it('returns null for empty input', () => {
    expect(normalizeTag('   ')).toBeNull()
  })

  it('returns null when the normalizer rejects the value', () => {
    expect(normalizeTag('a', () => null)).toBeNull()
  })
})

describe('validateTag', () => {
  it('passes when no validator is provided', () => {
    expect(validateTag('anything')).toEqual({ ok: true })
  })

  it('passes a valid value against the schema', () => {
    expect(validateTag('user@example.com', z.string().email())).toEqual({ ok: true })
  })

  it('returns the schema error message on failure', () => {
    const result = validateTag('nope', z.string().email())
    expect(result.ok).toBe(false)
    expect(result.error).toBeTruthy()
  })
})

describe('processPastedValues', () => {
  it('applies the normalizer to pasted values (BUG-043)', () => {
    const result = processPastedValues(['A@B.COM', 'C@D.COM'], [], {
      normalizer: v => v.toLowerCase(),
    })
    expect(result.validValues).toEqual(['a@b.com', 'c@d.com'])
  })

  it('de-duplicates against existing and within the batch (normalized)', () => {
    const result = processPastedValues(['A', 'a', 'B'], ['b'], {
      normalizer: v => v.toLowerCase(),
    })
    expect(result.validValues).toEqual(['a'])
  })

  it('flags invalid values and skips them', () => {
    const result = processPastedValues(['good@x.com', 'bad'], [], {
      validator: z.string().email(),
    })
    expect(result.validValues).toEqual(['good@x.com'])
    expect(result.hadInvalid).toBe(true)
  })

  it('caps at maxItems and reports the overflow (BUG-160)', () => {
    const result = processPastedValues(['c', 'd', 'e'], ['a', 'b'], { maxItems: 3 })
    expect(result.validValues).toEqual(['c'])
    expect(result.exceededMax).toBe(true)
  })

  it('does not flag overflow when everything fits', () => {
    const result = processPastedValues(['c', 'd'], ['a'], { maxItems: 5 })
    expect(result.validValues).toEqual(['c', 'd'])
    expect(result.exceededMax).toBe(false)
  })
})
