import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'JSON Formatter & Converter | DevTools Suite',
  description: 'Clean, format, validate, and convert JSON data to programming languages like Go, Rust, TypeScript, Java, and Python.',
  path: '/json',
  keywords: ['JSON formatter', 'JSON converter', 'JSON validator', 'JSON parser', 'code generation'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
