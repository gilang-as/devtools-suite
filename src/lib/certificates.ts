import forge from 'node-forge';

export interface DecodedCertificate {
  subject: Record<string, string>;
  issuer: Record<string, string>;
  serialNumber: string;
  validity: {
    notBefore: Date;
    notAfter: Date;
    isValid: boolean;
  };
  publicKey: {
    algorithm: string;
    bits: number;
  };
  fingerprints: {
    sha1: string;
    sha256: string;
  };
}

export function decodeX509(pem: string): DecodedCertificate {
  try {
    const cert = forge.pki.certificateFromPem(pem);
    const now = new Date();

    const getAttributes = (attrs: any[]) => {
      const map: Record<string, string> = {};
      attrs.forEach(a => {
        const name = a.name || a.shortName || a.type;
        if (name) map[name] = a.value;
      });
      return map;
    };

    // Fingerprints
    const der = forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes();
    const mdSha1 = forge.md.sha1.create();
    mdSha1.update(der);
    const mdSha256 = forge.md.sha256.create();
    mdSha256.update(der);

    return {
      subject: getAttributes(cert.subject.attributes),
      issuer: getAttributes(cert.issuer.attributes),
      serialNumber: cert.serialNumber,
      validity: {
        notBefore: cert.validity.notBefore,
        notAfter: cert.validity.notAfter,
        isValid: now >= cert.validity.notBefore && now <= cert.validity.notAfter
      },
      publicKey: {
        algorithm: (cert.publicKey as any).n ? 'RSA' : 'ECC',
        bits: (cert.publicKey as any).n ? (cert.publicKey as any).n.bitLength() : 256
      },
      fingerprints: {
        sha1: mdSha1.digest().toHex().match(/.{2}/g)?.join(':').toUpperCase() || '',
        sha256: mdSha256.digest().toHex().match(/.{2}/g)?.join(':').toUpperCase() || ''
      }
    };
  } catch (e: any) {
    throw new Error('Invalid X.509 PEM certificate: ' + e.message);
  }
}

export function decodeCsr(pem: string) {
  try {
    const csr = forge.pki.certificationRequestFromPem(pem);
    const getAttributes = (attrs: any[]) => {
      const map: Record<string, string> = {};
      attrs.forEach(a => {
        const name = a.name || a.shortName || a.type;
        if (name) map[name] = a.value;
      });
      return map;
    };

    return {
      subject: getAttributes(csr.subject.attributes),
      publicKey: {
        algorithm: (csr.publicKey as any).n ? 'RSA' : 'ECC',
        bits: (csr.publicKey as any).n ? (csr.publicKey as any).n.bitLength() : 256
      }
    };
  } catch (e: any) {
    throw new Error('Invalid CSR PEM: ' + e.message);
  }
}

export function pemToDer(pem: string): string {
  try {
    const der = forge.pki.pemToDer(pem);
    return forge.util.encode64(der.getBytes());
  } catch (e: any) {
    throw new Error('PEM to DER conversion failed: ' + e.message);
  }
}

export function derToPem(b64: string, type: string = 'CERTIFICATE'): string {
  try {
    const der = forge.util.decode64(b64);
    // Generic PEM wrapping if specific forge methods aren't enough
    const prefix = `-----BEGIN ${type}-----\n`;
    const postfix = `\n-----END ${type}-----`;
    const body = forge.util.encode64(der).match(/.{1,64}/g)?.join('\n');
    return prefix + body + postfix;
  } catch (e: any) {
    throw new Error('DER to PEM conversion failed: ' + e.message);
  }
}
