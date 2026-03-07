import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure Hash Generators',
  description: 'Generate secure message digests using SHA-256, SHA-512, MD5, and modern password hashing like Argon2 or Bcrypt.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
