import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON Formatter & Converter',
  description: 'Clean, format, and convert JSON data to various programming languages like Go, Rust, TypeScript, and Java.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
