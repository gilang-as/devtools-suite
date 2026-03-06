/**
 * Utility for networking operations: IP Subnet and CIDR calculations.
 */

export interface NetworkDetails {
  ip: string;
  mask: string;
  cidr: number;
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  wildcardMask: string;
  totalHosts: number;
  usableHosts: number;
  binaryIp: string;
  binaryMask: string;
}

/**
 * Converts IP string to 32-bit integer
 */
export function ipToLong(ip: string): number {
  let d = ip.split('.');
  return ((((((+d[0]) * 256) + (+d[1])) * 256) + (+d[2])) * 256) + (+d[3]);
}

/**
 * Converts 32-bit integer to IP string
 */
export function longToIp(l: number): string {
  return [
    (l >>> 24) & 0xFF,
    (l >>> 16) & 0xFF,
    (l >>> 8) & 0xFF,
    l & 0xFF
  ].join('.');
}

/**
 * Converts number to 32-bit binary string with dots
 */
export function longToBinary(l: number): string {
  const bin = (l >>> 0).toString(2).padStart(32, '0');
  return bin.match(/.{8}/g)?.join('.') || bin;
}

/**
 * Gets CIDR from Subnet Mask string
 */
export function maskToCidr(mask: string): number {
  const long = ipToLong(mask);
  return (long >>> 0).toString(2).split('1').length - 1;
}

/**
 * Gets Subnet Mask string from CIDR
 */
export function cidrToMask(cidr: number): string {
  let mask = 0;
  for (let i = 0; i < cidr; i++) {
    mask += (1 << (31 - i));
  }
  return longToIp(mask);
}

/**
 * Core calculation logic for Subnetting
 */
export function calculateSubnet(ip: string, maskOrCidr: string | number): NetworkDetails {
  try {
    const ipLong = ipToLong(ip);
    let maskLong: number;
    let cidr: number;

    if (typeof maskOrCidr === 'number') {
      cidr = maskOrCidr;
      maskLong = ipToLong(cidrToMask(cidr));
    } else {
      maskLong = ipToLong(maskOrCidr);
      cidr = maskToCidr(maskOrCidr);
    }

    const networkLong = (ipLong & maskLong) >>> 0;
    const wildcardLong = (~maskLong) >>> 0;
    const broadcastLong = (networkLong | wildcardLong) >>> 0;

    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = cidr >= 31 ? 0 : totalHosts - 2;

    return {
      ip,
      mask: longToIp(maskLong),
      cidr,
      networkAddress: longToIp(networkLong),
      broadcastAddress: longToIp(broadcastLong),
      firstHost: usableHosts > 0 ? longToIp(networkLong + 1) : 'n/a',
      lastHost: usableHosts > 0 ? longToIp(broadcastLong - 1) : 'n/a',
      wildcardMask: longToIp(wildcardLong),
      totalHosts,
      usableHosts: Math.max(0, usableHosts),
      binaryIp: longToBinary(ipLong),
      binaryMask: longToBinary(maskLong)
    };
  } catch (e) {
    throw new Error('Invalid IP or Subnet configuration');
  }
}
