import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Regex Tester & Debugger',
  description: 'Test and debug your regular expressions with real-time highlighting and detailed match information.',
  openGraph: {
    title: 'Regex Tester | DevTools Suite',
    description: 'Visual regex testing and debugging environment.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
