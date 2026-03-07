import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'UUID & GUID Generators | DevTools Suite',
  description: 'Generate unique identifiers (UUID v1, v4, v7) and standard GUIDs for your applications and databases.',
  path: '/uuid',
  keywords: ['UUID generator', 'GUID generator', 'UUID v4', 'unique identifier', 'identifier generator'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
