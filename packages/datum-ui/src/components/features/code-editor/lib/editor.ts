import type { ScalarTagDefinition } from 'js-yaml'
import { CORE_SCHEMA, dump, FAILSAFE_SCHEMA, floatCoreTag, intCoreTag, load } from 'js-yaml'

/**
 * Wraps a numeric CORE scalar tag so that a token whose parsed number cannot be
 * re-serialized without loss is preserved as its original string rather than a
 * corrupted number. Precision loss beyond 2^53 (`12345678901234567890`) and
 * formatting normalization (`1.0`, `0755`, `1e3`) are detected by comparing the
 * source token against the number's canonical `String()` form. Genuine numbers
 * (`8080`, `3.14`, `-5`) still resolve to native JS numbers, preserving the
 * original BUG-008 fix where `port: 8080` must stay a number.
 */
function preserveLosslessNumbers(
  baseTag: ScalarTagDefinition<number>,
): ScalarTagDefinition<number | string> {
  return {
    ...baseTag,
    resolve(source, isExplicit, tagName) {
      const value = baseTag.resolve(source, isExplicit, tagName)
      if (
        typeof value === 'number'
        && String(value) !== source
        && `+${String(value)}` !== source
      ) {
        return source
      }
      return value
    },
  }
}

/**
 * CORE schema that keeps native number/boolean/null types while preserving any
 * number scalar that would lose fidelity on round-trip as its raw string. Used
 * for YAML→JSON conversion so config values are never silently corrupted.
 */
const PRECISION_SAFE_SCHEMA = CORE_SCHEMA
  .withTags(preserveLosslessNumbers(intCoreTag))
  .withTags(preserveLosslessNumbers(floatCoreTag))

export function isValidJson(jsonStr: string): boolean {
  try {
    JSON.parse(jsonStr)
    return true
  }
  catch {
    return false
  }
}

export function isValidYaml(yamlStr: string): boolean {
  try {
    // Validate with the same precision-safe schema used for conversion so that
    // otherwise-valid YAML (e.g. explicit `!!int`/`!!float` tags) is not
    // rejected, and validity matches what yamlToJson will actually accept.
    load(yamlStr, { schema: PRECISION_SAFE_SCHEMA })
    return true
  }
  catch {
    return false
  }
}

export function formatJson(jsonStr: string): string {
  try {
    const parsed = JSON.parse(jsonStr)
    return JSON.stringify(parsed, null, 2)
  }
  catch (error) {
    throw new Error(`Invalid JSON format: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export function formatYaml(yamlStr: string): string {
  try {
    const parsed = load(yamlStr, { schema: FAILSAFE_SCHEMA })
    return dump(parsed, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
    })
  }
  catch (error) {
    throw new Error(`Invalid YAML format: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export function jsonToYaml(jsonStr: string): string {
  try {
    const parsed = JSON.parse(jsonStr)
    return dump(parsed, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
    })
  }
  catch (error) {
    throw new Error(`Invalid JSON format: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export function yamlToJson(yamlStr: string): string {
  try {
    // Use the precision-safe schema so YAML scalars keep their native types
    // (`port: 8080` -> number, `enabled: true` -> boolean, `x: null` -> null)
    // while scalars that would lose fidelity on round-trip (big integers beyond
    // 2^53, or formatting-normalized values like `1.0`, `0755`, `1e3`) are
    // preserved as their original strings. FAILSAFE_SCHEMA coerces every scalar
    // to a string; the plain default schema silently corrupts such numerics.
    const parsed = load(yamlStr, { schema: PRECISION_SAFE_SCHEMA })
    return JSON.stringify(parsed, null, 2)
  }
  catch (error) {
    throw new Error(`Invalid YAML format: ${error instanceof Error ? error.message : String(error)}`)
  }
}
