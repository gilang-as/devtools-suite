import forge from 'node-forge';

export type AesMode = 'GCM' | 'CBC' | 'CTR';

export function encryptAes(
  plaintext: string,
  key: string,
  iv: string,
  mode: AesMode = 'GCM'
): string {
  try {
    if (!plaintext) return '';
    
    // Key and IV must be correctly sized
    // 16, 24, or 32 bytes for key
    // 16 bytes for CBC/CTR IV, 12 bytes usually for GCM IV
    
    const cipher = forge.cipher.createCipher(`AES-${mode}`, forge.util.createBuffer(key));
    
    const options: any = { iv: forge.util.createBuffer(iv) };
    
    // GCM specific: tagLength
    if (mode === 'GCM') {
      options.tagLength = 128;
    }

    cipher.start(options);
    cipher.update(forge.util.createBuffer(plaintext, 'utf8'));
    cipher.finish();

    let output = cipher.output.toHex();
    
    // For GCM, append authentication tag to the output
    if (mode === 'GCM') {
      output += (cipher as any).mode.tag.toHex();
    }

    return forge.util.encode64(forge.util.hexToBytes(output));
  } catch (e: any) {
    throw new Error(`Encryption failed: ${e.message}`);
  }
}

export function decryptAes(
  ciphertextB64: string,
  key: string,
  iv: string,
  mode: AesMode = 'GCM'
): string {
  try {
    if (!ciphertextB64) return '';

    const ciphertext = forge.util.decode64(ciphertextB64);
    const decipher = forge.cipher.createDecipher(`AES-${mode}`, forge.util.createBuffer(key));
    
    const options: any = { iv: forge.util.createBuffer(iv) };

    if (mode === 'GCM') {
      options.tagLength = 128;
      // For GCM, the tag is usually at the end of the ciphertext
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
    if (!result) {
      throw new Error('Authentication failed or invalid key/IV');
    }

    return decipher.output.toString();
  } catch (e: any) {
    throw new Error(`Decryption failed: ${e.message}`);
  }
}
