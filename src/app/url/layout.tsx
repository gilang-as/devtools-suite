import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'URL Encoder & Parser',
  description: 'Safely encode/decode URLs and decompose complex URL strings into structured parts.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
