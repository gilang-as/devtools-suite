import yaml from 'js-yaml';

/**
 * Utility to convert YAML strings to JSON strings.
 */
export function yamlToJson(yamlStr: string, indent: number = 2): string {
  try {
    if (!yamlStr.trim()) return '';
    const parsed = yaml.load(yamlStr);
    if (parsed === undefined) return '';
    return JSON.stringify(parsed, null, indent);
  } catch (e: any) {
    throw new Error(e.message);
  }
}
