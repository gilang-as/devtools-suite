import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Programming & Developer Tools | DevTools Suite',
  description: 'Essential developer productivity tools including diff checking, word counting, case conversion, HTTP header parsing, and code formatting.',
  path: '/programming',
  keywords: ['diff checker', 'word counter', 'case converter', 'developer tools', 'code tools'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
