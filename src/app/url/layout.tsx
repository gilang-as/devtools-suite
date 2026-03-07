import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'URL Encoder & Parser | DevTools Suite',
  description: 'Safely encode/decode URLs, parse query parameters, and decompose complex URL strings into structured parts.',
  path: '/url',
  keywords: ['URL encoder', 'URL decoder', 'URL parser', 'query parameter', 'percent encoding'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
