import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Security & Cryptography Tools | DevTools Suite',
  description: 'Professional security tools for RSA encryption, PGP messages, JWT inspection, SSL certificate decoding, and cryptographic operations.',
  path: '/security',
  keywords: ['RSA encryption', 'JWT decoder', 'SSL certificate', 'PGP encryption', 'cryptography', 'security tools'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
