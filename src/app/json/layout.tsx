import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'JSON Tools & Converters',
  description: 'Clean, format, validate, and convert JSON data to various programming languages like Go, Rust, and TypeScript.',
  path: '/json',
  keywords: ['json formatter', 'json converter', 'json to typescript', 'json to go'],
  icon: 'JS',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
