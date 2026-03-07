import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unix Timestamp Converter',
  description: 'Convert Unix epoch timestamps to human-readable dates and back. Supports seconds and milliseconds.',
  openGraph: {
    title: 'Unix Converter | DevTools Suite',
    description: 'Time conversion for developers.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
