import yaml from 'js-yaml'

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
    yaml.load(yamlStr, { schema: yaml.FAILSAFE_SCHEMA })
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
    const parsed = yaml.load(yamlStr, { schema: yaml.FAILSAFE_SCHEMA })
    return yaml.dump(parsed, {
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
    return yaml.dump(parsed, {
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
    const parsed = yaml.load(yamlStr, { schema: yaml.FAILSAFE_SCHEMA })
    return JSON.stringify(parsed, null, 2)
  }
  catch (error) {
    throw new Error(`Invalid YAML format: ${error instanceof Error ? error.message : String(error)}`)
  }
}
