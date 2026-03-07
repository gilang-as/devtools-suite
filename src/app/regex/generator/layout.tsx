import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Regex Generator',
  description: 'Generate complex regular expressions using natural language descriptions powered by Generative AI.',
  openGraph: {
    title: 'AI Regex Generator | DevTools Suite',
    description: 'Convert plain English into powerful regex patterns.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
