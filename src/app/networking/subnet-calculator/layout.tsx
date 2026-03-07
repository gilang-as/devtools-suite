import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IPv4 Subnet Calculator',
  description: 'Calculate network addresses, broadcast ranges, and host capacities for any IPv4 subnet.',
  openGraph: {
    title: 'Subnet Calculator | DevTools Suite',
    description: 'Detailed network planning and subnetting tool.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
