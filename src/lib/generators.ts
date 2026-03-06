/**
 * Utility for generating cryptographically secure random keys and tokens.
 * Also includes checksum algorithms like CRC32 and Adler32.
 */

import forge from 'node-forge';

export type GeneratorFormat = 'hex' | 'base64' | 'alphanumeric' | 'base58' | 'urlsafe';

export function generateSecureRandom(bytes: number, format: GeneratorFormat): string {
  const randomBytes = forge.random.getBytesSync(bytes);
  
  switch (format) {
    case 'hex':
      return forge.util.bytesToHex(randomBytes);
    case 'base64':
      return forge.util.encode64(randomBytes);
    case 'urlsafe':
      return forge.util.encode64(randomBytes)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    case 'alphanumeric': {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < bytes; i++) {
        result += chars.charAt(randomBytes.charCodeAt(i) % chars.length);
      }
      return result;
    }
    case 'base58': {
      const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
      let result = '';
      for (let i = 0; i < bytes; i++) {
        result += chars.charAt(randomBytes.charCodeAt(i) % chars.length);
      }
      return result;
    }
    default:
      return forge.util.bytesToHex(randomBytes);
  }
}

/**
 * CRC32 Implementation
 */
export function computeCrc32(str: string): string {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }

  let crc = 0 ^ (-1);
  for (let i = 0; i < str.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ str.charCodeAt(i)) & 0xFF];
  }
  
  const result = (crc ^ (-1)) >>> 0;
  return result.toString(16).toUpperCase().padStart(8, '0');
}

/**
 * Adler32 Implementation
 */
export function computeAdler32(str: string): string {
  let s1 = 1;
  let s2 = 0;
  const MOD = 65521;

  for (let i = 0; i < str.length; i++) {
    s1 = (s1 + str.charCodeAt(i)) % MOD;
    s2 = (s2 + s1) % MOD;
  }

  const result = ((s2 << 16) | s1) >>> 0;
  return result.toString(16).toUpperCase().padStart(8, '0');
}
