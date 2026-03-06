
/**
 * Utility to convert JSON strings to YAML strings.
 */
import yaml from 'js-yaml';

export function jsonToYaml(jsonStr: string, indent: number = 2): string {
  try {
    const parsed = JSON.parse(jsonStr);
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Input must be a JSON object or array');
    }
    return yaml.dump(parsed, { indent, lineWidth: -1 });
  } catch (e: any) {
    throw new Error(e.message);
  }
}
