import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Developer Productivity Tools',
  description: 'A suite of programming tools for diff checking, word counting, case conversion, and code formatting.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
