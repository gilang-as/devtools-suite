import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security & Cryptography Tools',
  description: 'Professional security tools for RSA encryption, PGP messages, JWT inspection, and SSL certificate decoding.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
