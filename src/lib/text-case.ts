/**
 * Utility for converting text between different cases.
 */

const getWords = (str: string): string[] => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2') // split camelCase
    .replace(/[^a-zA-Z0-9]+/g, ' ')      // replace non-alphanumeric with spaces
    .trim()
    .split(/\s+/);
};

export function toLowerCase(str: string): string {
  return str.toLowerCase();
}

export function toUpperCase(str: string): string {
  return str.toUpperCase();
}

export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function toSentenceCase(str: string): string {
  const s = str.trim().toLowerCase();
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function toCamelCase(str: string): string {
  const words = getWords(str);
  if (words.length === 0) return '';
  return words[0].toLowerCase() + 
    words.slice(1)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('');
}

export function toPascalCase(str: string): string {
  const words = getWords(str);
  return words
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

export function toSnakeCase(str: string): string {
  return getWords(str)
    .map(w => w.toLowerCase())
    .join('_');
}

export function toKebabCase(str: string): string {
  return getWords(str)
    .map(w => w.toLowerCase())
    .join('-');
}

export function toConstantCase(str: string): string {
  return getWords(str)
    .map(w => w.toUpperCase())
    .join('_');
}
