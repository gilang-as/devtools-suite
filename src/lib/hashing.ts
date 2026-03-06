import CryptoJS from 'crypto-js';
import bcrypt from 'bcryptjs';

export type HashType = 'md5' | 'sha1' | 'sha256' | 'sha512' | 'sha3';

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
    // Dynamically import argon2-browser to bypass Turbopack's static analysis issues with its WASM loader
    const argon2 = await import('argon2-browser');
    const result = await argon2.hash({
      pass: password,
      salt: salt,
      time: iterations,
      mem: memory,
      hashLen: 32,
      parallelism: parallelism,
      type: argon2.ArgonType.Argon2id
    });
    return result.encoded;
  } catch (e: any) {
    throw new Error('Argon2 Error: ' + e.message);
  }
}
