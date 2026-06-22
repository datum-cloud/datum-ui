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
  it('converts valid YAML to JSON', () => {
    const yaml = 'name: test\nage: 30'
    const result = yamlToJson(yaml)
    const parsed = JSON.parse(result)
    expect(parsed).toEqual({ name: 'test', age: '30' })
  })

  it('throws error for invalid YAML', () => {
    expect(() => yamlToJson('foo: [bar')).toThrow('Invalid YAML format')
  })
})
