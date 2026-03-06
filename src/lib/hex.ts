/**
 * Utility to encode and decode hexadecimal strings.
 */

export function encodeHex(str: string): string {
  try {
    if (!str) return '';
    return str
      .split('')
      .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
      .join(' ');
  } catch (e) {
    return 'Error: Invalid input for hex encoding';
  }
}

export function decodeHex(hex: string): string {
  try {
    if (!hex.trim()) return '';
    // Remove all whitespace
    const cleanHex = hex.replace(/\s+/g, '');
    
    // Check if it's only hex characters
    if (!/^[0-9a-fA-F]*$/.test(cleanHex)) {
      return 'Error: Input contains non-hex characters';
    }

    if (cleanHex.length % 2 !== 0) {
      return 'Error: Hex string length must be even (2 hex characters per byte)';
    }

    let result = '';
    for (let i = 0; i < cleanHex.length; i += 2) {
      const byte = cleanHex.substring(i, i + 2);
      result += String.fromCharCode(parseInt(byte, 16));
    }
    return result;
  } catch (e) {
    return 'Error: Invalid hex string';
  }
}
