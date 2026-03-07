import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Color Tools & Palette Generators',
  description: 'Convert color formats (HEX, RGB, HSL) and generate harmonic color palettes for your UI design.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
