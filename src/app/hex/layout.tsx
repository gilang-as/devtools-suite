import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hexadecimal Converter',
  description: 'Encode and decode text to and from hexadecimal representation.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
