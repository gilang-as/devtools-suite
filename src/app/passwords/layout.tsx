import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Password Security Tools | DevTools Suite',
  description: 'Generate strong passwords, check password strength, verify password hashes, and perform secure password management tasks.',
  path: '/passwords',
  keywords: ['password generator', 'password strength', 'password checker', 'secure password', 'password hash'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
