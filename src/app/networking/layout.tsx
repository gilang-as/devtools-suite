import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Networking & IP Utilities',
  description: 'Calculate IPv4/IPv6 subnets, CIDR ranges, and perform deep DNS lookups with multiple fallback providers.',
  path: '/networking',
  keywords: ['subnet calculator', 'dns lookup', 'ip calculator', 'ipv6'],
  icon: '🌐',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
