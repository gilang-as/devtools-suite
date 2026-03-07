import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Binary Converter',
  description: 'Convert text to binary (0s and 1s) and back to readable text.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
