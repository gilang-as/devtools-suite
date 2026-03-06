/**
 * Utility for networking operations: IP Subnet, CIDR, IPv6, and DNS lookups.
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

export interface IPv6Details {
  ip: string;
  expandedIp: string;
  prefix: number;
  networkPrefix: string;
  firstAddress: string;
  lastAddress: string;
  totalAddresses: string;
}

/**
 * DNS Lookup Types
 */
export type DnsRecordType = 'A' | 'AAAA' | 'MX' | 'TXT' | 'NS' | 'CNAME' | 'SOA' | 'SRV' | 'CAA' | 'DNSKEY' | 'DS' | 'RRSIG' | 'ANY';

export interface DnsAnswer {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

export interface DnsLookupResult {
  Status: number;
  TC: boolean;
  RD: boolean;
  RA: boolean;
  AD: boolean;
  CD: boolean;
  Question: { name: string; type: number }[];
  Answer?: DnsAnswer[];
  Authority?: any[];
  Additional?: any[];
  provider: string;
}

const DNS_PROVIDERS = [
  { name: 'Google DNS', url: 'https://dns.google/resolve' },
  { name: 'Cloudflare DNS', url: 'https://cloudflare-dns.com/dns-query' },
  { name: 'Quad9 DNS', url: 'https://dns.quad9.net/dns-query' },
  { name: 'AdGuard DNS', url: 'https://dns.adguard.com/dns-query' },
  { name: 'DNS.SB', url: 'https://doh.dns.sb/dns-query' },
  { name: 'Mullvad DNS', url: 'https://dns.mullvad.net/dns-query' }
];

/**
 * Performs a DNS lookup with fallback providers
 */
export async function dnsLookup(domain: string, type: DnsRecordType): Promise<DnsLookupResult> {
  let lastError = null;

  for (const provider of DNS_PROVIDERS) {
    try {
      const response = await fetch(`${provider.url}?name=${encodeURIComponent(domain)}&type=${type}`, {
        headers: {
          'Accept': 'application/dns-json'
        }
      });

      if (!response.ok) continue;

      const data = await response.json();
      return { ...data, provider: provider.name };
    } catch (e) {
      lastError = e;
      continue;
    }
  }

  throw lastError || new Error('All DNS providers failed to resolve.');
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
 * Core calculation logic for Subnetting (IPv4)
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

/**
 * IPv6 Logic
 */

export function expandIPv6(ip: string): string {
  if (!ip.includes('::')) {
    const parts = ip.split(':');
    return parts.map(p => p.padStart(4, '0')).join(':');
  }
  const [left, right] = ip.split('::');
  const leftParts = left ? left.split(':') : [];
  const rightParts = right ? right.split(':') : [];
  const missingCount = 8 - (leftParts.length + rightParts.length);
  const middle = new Array(missingCount).fill('0000');
  return [...leftParts.map(p => p.padStart(4, '0')), ...middle, ...rightParts.map(p => p.padStart(4, '0'))].join(':');
}

export function ipv6ToBigInt(ip: string): bigint {
  const expanded = expandIPv6(ip);
  const parts = expanded.split(':');
  let bn = BigInt(0);
  for (const part of parts) {
    bn = (bn << BigInt(16)) + BigInt(parseInt(part, 16));
  }
  return bn;
}

export function bigIntToIPv6(bn: bigint): string {
  let s = bn.toString(16).padStart(32, '0');
  const parts = s.match(/.{4}/g) || [];
  return parts.join(':');
}

export function calculateIPv6(ip: string, prefix: number): IPv6Details {
  try {
    const ipBn = ipv6ToBigInt(ip);
    const mask = (BigInt(1) << BigInt(128)) - (BigInt(1) << BigInt(128 - prefix));
    
    const networkBn = ipBn & mask;
    const totalCount = BigInt(1) << BigInt(128 - prefix);
    const lastBn = networkBn + totalCount - BigInt(1);

    return {
      ip,
      expandedIp: expandIPv6(ip),
      prefix,
      networkPrefix: bigIntToIPv6(networkBn),
      firstAddress: bigIntToIPv6(networkBn),
      lastAddress: bigIntToIPv6(lastBn),
      totalAddresses: totalCount.toLocaleString()
    };
  } catch (e) {
    throw new Error('Invalid IPv6 address');
  }
}
