import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Regex Tester & Debugger | DevTools Suite',
  description: 'Test and debug regular expressions with real-time highlighting, match information, and visual pattern analysis.',
  path: '/regex/tester',
  keywords: ['regex tester', 'regex debugger', 'regular expression', 'pattern tester', 'regex validator'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
