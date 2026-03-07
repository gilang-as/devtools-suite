import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Programming & Logic Tools',
  description: 'Essential developer tools including text diffing, regex testing, case conversion, and code formatting.',
  path: '/programming',
  keywords: ['diff checker', 'regex tester', 'case converter', 'word counter'],
  icon: '💻',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
