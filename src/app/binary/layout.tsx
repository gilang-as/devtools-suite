import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Binary Converter | DevTools Suite',
  description: 'Convert text to binary (0s and 1s) and back to readable text. Encode and decode binary data instantly.',
  path: '/binary',
  keywords: ['binary converter', 'text to binary', 'binary encoder', 'binary decoder'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
