import { describe, expect, it } from 'vitest'
import {
  formatJson,
  formatYaml,
  isValidJson,
  isValidYaml,
  jsonToYaml,
  yamlToJson,
} from '../lib/editor'

describe('isValidJson', () => {
  it('returns true for valid JSON', () => {
    expect(isValidJson('{"name":"test"}')).toBe(true)
    expect(isValidJson('[]')).toBe(true)
    expect(isValidJson('null')).toBe(true)
  })

  it('returns false for invalid JSON', () => {
    expect(isValidJson('')).toBe(false)
    expect(isValidJson('{')).toBe(false)
    expect(isValidJson('not json')).toBe(false)
  })
})

describe('isValidYaml', () => {
  it('returns true for valid YAML', () => {
    expect(isValidYaml('name: test')).toBe(true)
    expect(isValidYaml('- item1\n- item2')).toBe(true)
  })

  it('returns false for invalid YAML', () => {
    expect(isValidYaml('{')).toBe(false)
    // unclosed flow sequence — invalid under the YAML 1.2 parser
    expect(isValidYaml('foo: [bar')).toBe(false)
  })
})

describe('formatJson', () => {
  it('formats valid JSON with 2-space indentation', () => {
    const input = '{"name":"test","age":30}'
    const expected = '{\n  "name": "test",\n  "age": 30\n}'
    expect(formatJson(input)).toBe(expected)
  })

  it('throws error for invalid JSON', () => {
    expect(() => formatJson('invalid')).toThrow('Invalid JSON format')
  })
})

describe('formatYaml', () => {
  it('formats valid YAML with 2-space indentation', () => {
    const input = 'name:    test\nage:   30'
    const result = formatYaml(input)
    expect(result).toContain('name: test')
    expect(result).toContain('age: \'30\'')
  })

  it('throws error for invalid YAML', () => {
    expect(() => formatYaml('foo: [bar')).toThrow('Invalid YAML format')
  })
})

describe('jsonToYaml', () => {
  it('converts valid JSON to YAML', () => {
    const json = '{"name":"test","age":30}'
    const result = jsonToYaml(json)
    expect(result).toContain('name: test')
    expect(result).toContain('age: 30')
  })

  it('throws error for invalid JSON', () => {
    expect(() => jsonToYaml('invalid')).toThrow('Invalid JSON format')
  })
})

describe('yamlToJson', () => {
  it('converts valid YAML to JSON preserving scalar types', () => {
    const yaml = 'name: test\nage: 30'
    const result = yamlToJson(yaml)
    const parsed = JSON.parse(result)
    // Numbers, booleans, and null keep their native types (not coerced to
    // strings) so downstream config consumers receive correctly-typed values.
    expect(parsed).toEqual({ name: 'test', age: 30 })
  })

  it('preserves booleans and null as native JSON types', () => {
    const yaml = 'port: 8080\nenabled: true\nextra: null'
    const parsed = JSON.parse(yamlToJson(yaml))
    expect(parsed).toEqual({ port: 8080, enabled: true, extra: null })
  })

  it('preserves scalars that would lose fidelity as their original strings', () => {
    // Regression (CR-002): the plain default schema silently corrupts these
    // numerics on round-trip. They must be preserved losslessly as strings.
    const yaml = [
      'id: 12345678901234567890', // > 2^53, precision loss -> ...567000
      'version: 1.0', // decimal normalizes to 1
      'mode: 0755', // leading zero normalizes to 755
      'rate: 1e3', // exponent normalizes to 1000
    ].join('\n')
    const parsed = JSON.parse(yamlToJson(yaml))
    expect(parsed).toEqual({
      id: '12345678901234567890',
      version: '1.0',
      mode: '0755',
      rate: '1e3',
    })
  })

  it('keeps genuine numbers native inside a nested map', () => {
    const yaml = 'server:\n  port: 8080\n  ratio: 3.14\n  retries: -5\n  name: api'
    const parsed = JSON.parse(yamlToJson(yaml))
    expect(parsed).toEqual({
      server: { port: 8080, ratio: 3.14, retries: -5, name: 'api' },
    })
  })

  it('throws error for invalid YAML', () => {
    expect(() => yamlToJson('foo: [bar')).toThrow('Invalid YAML format')
  })
})
