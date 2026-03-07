import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Secure Hash Generators | DevTools Suite',
  description: 'Generate secure message digests using SHA-256, SHA-512, MD5, Bcrypt, Argon2, and other cryptographic hash functions.',
  path: '/hashing',
  keywords: ['SHA-256', 'SHA-512', 'hash generator', 'MD5', 'bcrypt', 'argon2', 'cryptographic hash'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
