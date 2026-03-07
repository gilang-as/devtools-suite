import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Password Security Tools',
  description: 'Generate strong passwords, check password strength, and compare password hashes securely in your browser.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
