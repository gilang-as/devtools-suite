import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Base64 Encoder | DevTools Suite',
  description: 'Encode text and strings to Base64 format. Fast, free, and easy-to-use Base64 encoding tool for developers.',
  path: '/base64/encode',
  keywords: ['Base64 encoder', 'Base64 encoding', 'text encoder', 'encode to Base64'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
