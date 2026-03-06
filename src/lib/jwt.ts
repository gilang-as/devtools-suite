
import * as jose from 'jose';

export function jwtDecode(token: string) {
  try {
    return jose.decodeJwt(token);
  } catch (e: any) {
    throw new Error('JWT Decoding failed: ' + e.message);
  }
}

export function jwtHeader(token: string) {
  try {
    return jose.decodeProtectedHeader(token);
  } catch (e: any) {
    throw new Error('JWT Header access failed: ' + e.message);
  }
}

export async function jwtVerify(token: string, secret: string): Promise<boolean> {
  try {
    const secretKey = new TextEncoder().encode(secret);
    await jose.jwtVerify(token, secretKey);
    return true;
  } catch (e: any) {
    return false;
  }
}

export async function jwtSign(payload: any, secret: string, expiration: string = '2h'): Promise<string> {
  try {
    const secretKey = new TextEncoder().encode(secret);
    return await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiration)
      .sign(secretKey);
  } catch (e: any) {
    throw new Error('JWT Signing failed: ' + e.message);
  }
}
