import CryptoJS from 'crypto-js';
import bcrypt from 'bcryptjs';
import { argon2id } from 'hash-wasm';

export type HashType = 'md5' | 'sha1' | 'sha256' | 'sha512' | 'sha3';
export type HmacType = 'sha1' | 'sha256' | 'sha512';

export function computeHash(text: string, type: HashType): string {
  if (!text) return '';
  switch (type) {
    case 'md5':
      return CryptoJS.MD5(text).toString();
    case 'sha1':
      return CryptoJS.SHA1(text).toString();
    case 'sha256':
      return CryptoJS.SHA256(text).toString();
    case 'sha512':
      return CryptoJS.SHA512(text).toString();
    case 'sha3':
      return CryptoJS.SHA3(text).toString();
    default:
      return '';
  }
}

export function computeHmac(text: string, key: string, type: HmacType): string {
  if (!text || !key) return '';
  switch (type) {
    case 'sha1':
      return CryptoJS.HmacSHA1(text, key).toString();
    case 'sha256':
      return CryptoJS.HmacSHA256(text, key).toString();
    case 'sha512':
      return CryptoJS.HmacSHA512(text, key).toString();
    default:
      return '';
  }
}

export function computePbkdf2(password: string, salt: string, iterations: number = 1000, keySize: number = 256): string {
  if (!password || !salt) return '';
  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: keySize / 32,
    iterations: iterations
  });
  return key.toString();
}

export function computeBcrypt(password: string, rounds: number = 10): string {
  if (!password) return '';
  const salt = bcrypt.genSaltSync(rounds);
  return bcrypt.hashSync(password, salt);
}

export async function computeArgon2(password: string, salt: string, iterations: number = 10, memory: number = 1024, parallelism: number = 1): Promise<string> {
  try {
    const hash = await argon2id({
      password: password,
      salt: new TextEncoder().encode(salt),
      iterations: iterations,
      memorySize: memory,
      parallelism: parallelism,
      hashLength: 32,
      outputType: 'encoded',
    });
    return hash;
  } catch (e: any) {
    throw new Error('Argon2 Error: ' + e.message);
  }
}
