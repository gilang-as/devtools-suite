
import forge from 'node-forge';

export function rsaEncrypt(plaintext: string, publicKeyPem: string): string {
  try {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encrypted = publicKey.encrypt(plaintext, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
      mgf1: {
        md: forge.md.sha256.create()
      }
    });
    return forge.util.encode64(encrypted);
  } catch (e: any) {
    throw new Error('RSA Encryption failed: ' + e.message);
  }
}

export function rsaDecrypt(ciphertextB64: string, privateKeyPem: string): string {
  try {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const ciphertext = forge.util.decode64(ciphertextB64);
    const decrypted = privateKey.decrypt(ciphertext, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
      mgf1: {
        md: forge.md.sha256.create()
      }
    });
    return decrypted;
  } catch (e: any) {
    throw new Error('RSA Decryption failed: ' + e.message);
  }
}

export function rsaSign(message: string, privateKeyPem: string): string {
  try {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const md = forge.md.sha256.create();
    md.update(message, 'utf8');
    const signature = privateKey.sign(md);
    return forge.util.encode64(signature);
  } catch (e: any) {
    throw new Error('RSA Signing failed: ' + e.message);
  }
}

export function rsaVerify(message: string, signatureB64: string, publicKeyPem: string): boolean {
  try {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const signature = forge.util.decode64(signatureB64);
    const md = forge.md.sha256.create();
    md.update(message, 'utf8');
    return publicKey.verify(md.digest().getBytes(), signature);
  } catch (e: any) {
    return false;
  }
}
