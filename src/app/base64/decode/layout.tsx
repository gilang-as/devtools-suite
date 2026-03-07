import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Base64 Decoder',
  description: 'Decode Base64 strings back into readable text instantly. All processing happens in your browser for maximum security.',
  path: '/base64/decode',
  keywords: ['base64 decoder', 'decode base64', 'base64 to text'],
  icon: '🔓',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
