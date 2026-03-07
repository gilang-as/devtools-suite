import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Security & Cryptography Studio',
  description: 'Professional-grade security tools for RSA encryption, PGP messages, JWT inspection, and SSL certificate analysis.',
  path: '/security',
  keywords: ['encryption', 'cryptography', 'rsa', 'pgp', 'jwt', 'security tools'],
  icon: '🛡️',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
