import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Hexadecimal Converter | DevTools Suite',
  description: 'Encode and decode text to and from hexadecimal representation. Convert hex to ASCII and binary formats.',
  path: '/hex',
  keywords: ['hex converter', 'hexadecimal', 'hex encoder', 'hex decoder', 'hex to ascii'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
