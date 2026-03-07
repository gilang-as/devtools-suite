import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'DNS Lookup Tool',
  description: 'Perform deep DNS inspection using multiple providers. Fetch A, AAAA, MX, TXT, and CNAME records with real-time status and security verification.',
  path: '/networking/dns-lookup',
  keywords: ['dns lookup', 'dns record checker', 'dig online', 'mx lookup', 'txt records'],
  icon: '🌐',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
