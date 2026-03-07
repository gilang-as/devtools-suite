import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Networking & IP Tools | DevTools Suite',
  description: 'Calculate IPv4/IPv6 subnets, CIDR ranges, perform DNS lookups, and analyze network configurations.',
  path: '/networking',
  keywords: ['subnet calculator', 'IP calculator', 'CIDR', 'DNS lookup', 'IPv4', 'IPv6', 'network tools'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
