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

export interface SlugOptions {
  separator?: '-' | '_';
  lowercase?: boolean;
  removeNumbers?: boolean;
}

export function toSlug(str: string, options: SlugOptions = {}): string {
  const { separator = '-', lowercase = true, removeNumbers = false } = options;
  
  if (!str) return '';

  // Normalize accented characters
  let slug = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (lowercase) {
    slug = slug.toLowerCase();
  }

  if (removeNumbers) {
    slug = slug.replace(/[0-9]/g, '');
  }

  // Replace non-alphanumeric characters with the separator
  slug = slug.replace(/[^a-z0-9]+/gi, separator);

  // Remove duplicate separators
  const escapedSeparator = separator === '-' ? '\\-' : separator;
  const regex = new RegExp(`${escapedSeparator}+`, 'g');
  slug = slug.replace(regex, separator);

  // Trim separators from ends
  if (slug.startsWith(separator)) slug = slug.substring(1);
  if (slug.endsWith(separator)) slug = slug.substring(0, slug.length - 1);

  return slug;
}
