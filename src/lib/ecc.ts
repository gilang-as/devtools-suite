
import * as jose from 'jose';

export async function eccSign(message: string, privateKeyPem: string): Promise<string> {
  try {
    const privateKey = await jose.importPKCS8(privateKeyPem, 'ES256');
    const signature = await new jose.CompactSign(new TextEncoder().encode(message))
      .setProtectedHeader({ alg: 'ES256' })
      .sign(privateKey);
    return signature;
  } catch (e: any) {
    throw new Error('ECC Signing failed: ' + e.message);
  }
}

export async function eccVerify(message: string, signature: string, publicKeyPem: string): Promise<boolean> {
  try {
    const publicKey = await jose.importSPKI(publicKeyPem, 'ES256');
    const { payload } = await jose.compactVerify(signature, publicKey);
    const decodedMessage = new TextDecoder().decode(payload);
    return decodedMessage === message;
  } catch (e: any) {
    return false;
  }
}
