import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Secure Hash Generators',
  description: 'Generate high-security message digests using SHA-256, SHA-512, MD5, and password-specific hashes like Bcrypt and Argon2.',
  path: '/hashing',
  keywords: ['hash generator', 'sha256', 'md5', 'bcrypt', 'argon2'],
  icon: '🔑',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
