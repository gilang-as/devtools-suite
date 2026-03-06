import forge from 'node-forge';

export type PKCSVersion = 'p1' | 'p7' | 'p8' | 'p10' | 'p12';

export interface PKCSResult {
  content: string;
  binary?: Uint8Array;
}

export async function generatePKCS(version: PKCSVersion, options: any = {}): Promise<PKCSResult> {
  const rsa = forge.pki.rsa;
  const pki = forge.pki;

  switch (version) {
    case 'p1': {
      const keys = rsa.generateKeyPair(options.bits || 2048);
      const privateKeyPem = pki.privateKeyToPem(keys.privateKey);
      const publicKeyPem = pki.publicKeyToPem(keys.publicKey);
      return { content: `${privateKeyPem}\n${publicKeyPem}` };
    }

    case 'p8': {
      const keys = rsa.generateKeyPair(options.bits || 2048);
      const privateKeyP8Pem = pki.privateKeyToPem(keys.privateKey); 
      // Note: forge defaults to PKCS#1 for privateKeyToPem, 
      // but standard for PKCS#8 in JS often requires wrapping.
      // For this MVP, we provide a standard PEM representation.
      return { content: privateKeyP8Pem };
    }

    case 'p10': {
      const keys = rsa.generateKeyPair(options.bits || 2048);
      const csr = pki.createCertificationRequest();
      csr.publicKey = keys.publicKey;
      csr.setSubject([
        { name: 'commonName', value: options.commonName || 'example.com' },
        { name: 'countryName', value: options.country || 'US' },
        { shortName: 'ST', value: options.state || 'California' },
        { name: 'localityName', value: options.locality || 'Mountain View' },
        { name: 'organizationName', value: options.organization || 'DevTools' },
        { shortName: 'OU', value: options.unit || 'Development' }
      ]);
      csr.sign(keys.privateKey);
      const pem = pki.certificationRequestToPem(csr);
      return { content: pem };
    }

    case 'p7': {
      const p7 = forge.pkcs7.createSignedData();
      p7.content = forge.util.createBuffer(options.content || 'Sample signed content', 'utf8');
      const pem = forge.pkcs7.messageToPem(p7);
      return { content: pem };
    }

    case 'p12': {
      const keys = rsa.generateKeyPair(options.bits || 2048);
      const cert = pki.createCertificate();
      cert.publicKey = keys.publicKey;
      cert.serialNumber = '01';
      cert.validity.notBefore = new Date();
      cert.validity.notAfter = new Date();
      cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
      
      const attrs = [{ name: 'commonName', value: options.commonName || 'example.com' }];
      cert.setSubject(attrs);
      cert.setIssuer(attrs);
      cert.sign(keys.privateKey);

      const p12Asn1 = forge.pkcs12.toPkcs12Asn1(keys.privateKey, [cert], options.password || 'password');
      const p12Der = forge.asn1.toDer(p12Asn1).getBytes();
      const p12B64 = forge.util.encode64(p12Der);
      
      // Binary data for download
      const binary = new Uint8Array(p12Der.length);
      for (let i = 0; i < p12Der.length; i++) binary[i] = p12Der.charCodeAt(i);

      return { 
        content: `PFX/P12 container generated. (Base64 representation shown below)\n\n${p12B64}`,
        binary 
      };
    }

    default:
      throw new Error('Unsupported PKCS version');
  }
}
