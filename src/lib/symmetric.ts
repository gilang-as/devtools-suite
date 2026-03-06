import forge from 'node-forge';
import CryptoJS from 'crypto-js';
import { chacha20 } from '@noble/ciphers/chacha';

export type SymmetricAlgo = 'AES' | 'DES' | '3DES' | 'ChaCha20';
export type AesMode = 'GCM' | 'CBC' | 'CTR';
export type BlockMode = 'CBC' | 'ECB';

export function encryptSymmetric(
  algo: SymmetricAlgo,
  plaintext: string,
  key: string,
  iv: string,
  mode?: string
): string {
  try {
    if (!plaintext) return '';

    switch (algo) {
      case 'AES':
        return encryptAes(plaintext, key, iv, (mode as AesMode) || 'GCM');
      case 'DES':
        return encryptDes(plaintext, key, iv, (mode as BlockMode) || 'CBC');
      case '3DES':
        return encrypt3Des(plaintext, key, iv, (mode as BlockMode) || 'CBC');
      case 'ChaCha20':
        return encryptChaCha20(plaintext, key, iv);
      default:
        throw new Error('Unsupported algorithm');
    }
  } catch (e: any) {
    throw new Error(`Encryption failed: ${e.message}`);
  }
}

export function decryptSymmetric(
  algo: SymmetricAlgo,
  ciphertextB64: string,
  key: string,
  iv: string,
  mode?: string
): string {
  try {
    if (!ciphertextB64) return '';

    switch (algo) {
      case 'AES':
        return decryptAes(ciphertextB64, key, iv, (mode as AesMode) || 'GCM');
      case 'DES':
        return decryptDes(ciphertextB64, key, iv, (mode as BlockMode) || 'CBC');
      case '3DES':
        return decrypt3Des(ciphertextB64, key, iv, (mode as BlockMode) || 'CBC');
      case 'ChaCha20':
        return decryptChaCha20(ciphertextB64, key, iv);
      default:
        throw new Error('Unsupported algorithm');
    }
  } catch (e: any) {
    throw new Error(`Decryption failed: ${e.message}`);
  }
}

// AES implementation using forge
function encryptAes(plaintext: string, key: string, iv: string, mode: AesMode): string {
  const cipher = forge.cipher.createCipher(`AES-${mode}`, forge.util.createBuffer(key));
  const options: any = { iv: forge.util.createBuffer(iv) };
  if (mode === 'GCM') options.tagLength = 128;

  cipher.start(options);
  cipher.update(forge.util.createBuffer(plaintext, 'utf8'));
  cipher.finish();

  let output = cipher.output.toHex();
  if (mode === 'GCM') output += (cipher as any).mode.tag.toHex();
  return forge.util.encode64(forge.util.hexToBytes(output));
}

function decryptAes(ciphertextB64: string, key: string, iv: string, mode: AesMode): string {
  const ciphertext = forge.util.decode64(ciphertextB64);
  const decipher = forge.cipher.createDecipher(`AES-${mode}`, forge.util.createBuffer(key));
  const options: any = { iv: forge.util.createBuffer(iv) };

  if (mode === 'GCM') {
    options.tagLength = 128;
    const tagHex = forge.util.bytesToHex(ciphertext.slice(-16));
    const encryptedData = ciphertext.slice(0, -16);
    options.tag = forge.util.createBuffer(forge.util.hexToBytes(tagHex));
    decipher.start(options);
    decipher.update(forge.util.createBuffer(encryptedData));
  } else {
    decipher.start(options);
    decipher.update(forge.util.createBuffer(ciphertext));
  }

  const result = decipher.finish();
  if (!result) throw new Error('Authentication failed or invalid key/IV');
  return decipher.output.toString();
}

// DES & 3DES using CryptoJS
function encryptDes(plaintext: string, key: string, iv: string, mode: BlockMode): string {
  const encrypted = CryptoJS.DES.encrypt(plaintext, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: mode === 'CBC' ? CryptoJS.mode.CBC : CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}

function decryptDes(ciphertext: string, key: string, iv: string, mode: BlockMode): string {
  const decrypted = CryptoJS.DES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: mode === 'CBC' ? CryptoJS.mode.CBC : CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

function encrypt3Des(plaintext: string, key: string, iv: string, mode: BlockMode): string {
  const encrypted = CryptoJS.TripleDES.encrypt(plaintext, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: mode === 'CBC' ? CryptoJS.mode.CBC : CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}

function decrypt3Des(ciphertext: string, key: string, iv: string, mode: BlockMode): string {
  const decrypted = CryptoJS.TripleDES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: mode === 'CBC' ? CryptoJS.mode.CBC : CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// ChaCha20 implementation using @noble/ciphers
function encryptChaCha20(plaintext: string, key: string, nonce: string): string {
  const keyBytes = new TextEncoder().encode(key.padEnd(32, '\0').substring(0, 32));
  const nonceBytes = new TextEncoder().encode(nonce.padEnd(12, '\0').substring(0, 12));
  const dataBytes = new TextEncoder().encode(plaintext);
  
  const encrypted = chacha20(keyBytes, nonceBytes, dataBytes);
  
  // Use forge for safe base64 encoding of Uint8Array
  return forge.util.encode64(forge.util.createBuffer(encrypted).getBytes());
}

function decryptChaCha20(ciphertextB64: string, key: string, nonce: string): string {
  const keyBytes = new TextEncoder().encode(key.padEnd(32, '\0').substring(0, 32));
  const nonceBytes = new TextEncoder().encode(nonce.padEnd(12, '\0').substring(0, 12));
  
  // Use forge for safe base64 decoding
  const ciphertextBytes = forge.util.decode64(ciphertextB64);
  const dataBytes = new Uint8Array(ciphertextBytes.length);
  for (let i = 0; i < ciphertextBytes.length; i++) {
    dataBytes[i] = ciphertextBytes.charCodeAt(i);
  }
  
  const decrypted = chacha20(keyBytes, nonceBytes, dataBytes);
  return new TextDecoder().decode(decrypted);
}
