/**
 * Utility for text and code obfuscation.
 */

/**
 * ROT13 Implementation
 */
export function rot13(str: string): string {
  return str.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

/**
 * Simple Text Obfuscator (Custom mapping + Base64)
 */
export function obfuscateText(str: string): string {
  if (!str) return '';
  // Simple Caesar shift then Base64
  const shifted = str.split('').map(char => String.fromCharCode(char.charCodeAt(0) + 1)).join('');
  try {
    return btoa(unescape(encodeURIComponent(shifted)));
  } catch (e) {
    return 'Error: Could not obfuscate text';
  }
}

export function deobfuscateText(str: string): string {
  if (!str) return '';
  try {
    const decoded = decodeURIComponent(escape(atob(str)));
    return decoded.split('').map(char => String.fromCharCode(char.charCodeAt(0) - 1)).join('');
  } catch (e) {
    return 'Error: Invalid obfuscated string';
  }
}

/**
 * Basic JavaScript Obfuscator
 * - Minifies whitespace
 * - Hex-encodes strings
 * - Wraps in eval(atob())
 */
export function obfuscateJs(code: string): string {
  if (!code.trim()) return '';
  
  // 1. Basic minification
  let output = code
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim();

  // 2. String to Hex conversion for sensitive looking parts (very basic)
  // Real obfuscators use AST parsing, this is an MVP version.
  
  try {
    const b64 = btoa(unescape(encodeURIComponent(output)));
    return `eval(decodeURIComponent(escape(atob("${b64}"))));`;
  } catch (e) {
    return 'Error: Could not obfuscate JavaScript';
  }
}
