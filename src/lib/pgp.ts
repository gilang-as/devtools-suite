
import * as openpgp from 'openpgp';

export async function pgpEncrypt(message: string, publicKeyArmored: string): Promise<string> {
  try {
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
    const encrypted = await openpgp.encrypt({
      message: await openpgp.createMessage({ text: message }),
      encryptionKeys: publicKey,
    });
    return encrypted as string;
  } catch (e: any) {
    throw new Error('PGP Encryption failed: ' + e.message);
  }
}

export async function pgpDecrypt(ciphertextArmored: string, privateKeyArmored: string, passphrase?: string): Promise<string> {
  try {
    const privateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });
    const decryptedKey = passphrase 
      ? await openpgp.decryptKey({ privateKey, passphrase }) 
      : privateKey;
    
    const message = await openpgp.readMessage({ armoredMessage: ciphertextArmored });
    const { data: decrypted } = await openpgp.decrypt({
      message,
      decryptionKeys: decryptedKey,
    });
    return decrypted as string;
  } catch (e: any) {
    throw new Error('PGP Decryption failed: ' + e.message);
  }
}

export async function pgpSign(message: string, privateKeyArmored: string, passphrase?: string): Promise<string> {
  try {
    const privateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });
    const decryptedKey = passphrase 
      ? await openpgp.decryptKey({ privateKey, passphrase }) 
      : privateKey;

    const signature = await openpgp.sign({
      message: await openpgp.createMessage({ text: message }),
      signingKeys: decryptedKey,
      detached: true
    });
    return signature as string;
  } catch (e: any) {
    throw new Error('PGP Signing failed: ' + e.message);
  }
}

export async function pgpVerify(message: string, signatureArmored: string, publicKeyArmored: string): Promise<boolean> {
  try {
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
    const signature = await openpgp.readSignature({ armoredSignature: signatureArmored });
    const verification = await openpgp.verify({
      message: await openpgp.createMessage({ text: message }),
      signature,
      verificationKeys: publicKey
    });
    const { verified } = verification.signatures[0];
    try {
      await verified;
      return true;
    } catch (e) {
      return false;
    }
  } catch (e: any) {
    return false;
  }
}
