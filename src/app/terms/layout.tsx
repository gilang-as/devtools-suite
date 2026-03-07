import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | DevTools Suite',
  description: 'Terms of service for DevTools Suite. Read our terms, conditions, and usage policies for our free developer tools.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
