
import { parse, stringify } from 'smol-toml';

/**
 * Utility to convert between TOML and JSON strings.
 */

export function tomlToJson(tomlStr: string): string {
  try {
    if (!tomlStr.trim()) return '';
    const parsed = parse(tomlStr);
    return JSON.stringify(parsed, null, 2);
  } catch (e: any) {
    throw new Error('TOML Parsing Error: ' + e.message);
  }
}

export function jsonToToml(jsonStr: string): string {
  try {
    if (!jsonStr.trim()) return '';
    const parsed = JSON.parse(jsonStr);
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Input must be a JSON object or array');
    }
    // TOML root must be an object
    const data = Array.isArray(parsed) ? { items: parsed } : parsed;
    return stringify(data);
  } catch (e: any) {
    throw new Error('JSON to TOML Error: ' + e.message);
  }
}
