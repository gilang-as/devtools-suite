import forge from 'node-forge';
import * as jose from 'jose';
import * as openpgp from 'openpgp';
import { encode } from 'cbor-x';

export async function parseAsn1(input: string) {
  try {
    let der;
    if (input.includes('BEGIN')) {
      const pem = forge.pki.pemToDer(input);
      der = pem;
    } else if (/^[0-9a-fA-F\s]+$/.test(input)) {
      der = forge.util.hexToBytes(input.replace(/\s/g, ''));
    } else {
      der = forge.util.decode64(input);
    }
    
    const asn1 = forge.asn1.fromDer(der);
    return formatAsn1Node(asn1);
  } catch (e: any) {
    throw new Error('Failed to parse ASN.1: ' + e.message);
  }
}

function formatAsn1Node(node: any): any {
  const types: Record<number, string> = {
    [forge.asn1.Type.Boolean]: 'BOOLEAN',
    [forge.asn1.Type.Integer]: 'INTEGER',
    [forge.asn1.Type.BitString]: 'BIT STRING',
    [forge.asn1.Type.OctetString]: 'OCTET STRING',
    [forge.asn1.Type.Null]: 'NULL',
    [forge.asn1.Type.OID]: 'OBJECT IDENTIFIER',
    [forge.asn1.Type.Sequence]: 'SEQUENCE',
    [forge.asn1.Type.Set]: 'SET',
    [forge.asn1.Type.UTF8]: 'UTF8String',
    [forge.asn1.Type.PrintableString]: 'PrintableString',
    [forge.asn1.Type.IA5String]: 'IA5String',
    [forge.asn1.Type.UtcTime]: 'UTCTime',
    [forge.asn1.Type.GeneralizedTime]: 'GeneralizedTime',
  };

  const result: any = {
    tagClass: node.tagClass,
    type: types[node.type] || `UNKNOWN (${node.type})`,
    constructed: node.constructed,
  };

  if (node.constructed) {
    result.children = node.value.map((child: any) => formatAsn1Node(child));
  } else {
    if (node.type === forge.asn1.Type.OID) {
      result.value = forge.asn1.derToOid(node.value);
    } else if (node.type === forge.asn1.Type.Integer) {
      result.value = forge.util.bytesToHex(node.value);
    } else {
      result.value = typeof node.value === 'string' ? node.value : forge.util.bytesToHex(node.value);
    }
  }

  return result;
}

export async function generateJwt(payload: any, secret: string, alg: string = 'HS256') {
  const secretKey = new TextEncoder().encode(secret);
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(secretKey);
}

export async function generatePgpKey(name: string, email: string) {
  const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey({
    type: 'rsa',
    rsaBits: 2048,
    userIDs: [{ name, email }],
  });
  return { privateKey, publicKey, revocationCertificate };
}

export function encodeCose(data: any) {
  const cborData = encode(data);
  return forge.util.encode64(forge.util.createBuffer(cborData).getBytes());
}

export function formatSpki(publicKeyPem: string) {
  try {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    // SPKI is standard for SubjectPublicKeyInfo
    const der = forge.pki.publicKeyToAsn1(publicKey);
    const spkiDer = forge.asn1.toDer(der).getBytes();
    return forge.util.encode64(spkiDer);
  } catch (e: any) {
    throw new Error('Invalid Public Key PEM: ' + e.message);
  }
}
