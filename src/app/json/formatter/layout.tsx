import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator',
  description: 'Clean, format, and validate your JSON data. Supports minification, sorting, and tree-view inspection.',
  openGraph: {
    title: 'JSON Formatter | DevTools Suite',
    description: 'Professional JSON formatting and validation tools.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
