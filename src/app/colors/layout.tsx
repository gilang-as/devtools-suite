import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Color Tools & Palette Generators | DevTools Suite',
  description: 'Convert color formats (HEX, RGB, HSL, HSLA) and generate harmonic color palettes for UI design and web development.',
  path: '/colors',
  keywords: ['color converter', 'hex to rgb', 'color palette', 'color generator', 'color harmony'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
