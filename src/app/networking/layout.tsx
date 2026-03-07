import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Networking & IP Tools',
  description: 'Calculate IPv4/IPv6 subnets, CIDR ranges, and perform DNS lookups instantly.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
