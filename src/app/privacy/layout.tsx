import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | DevTools Suite',
  description: 'Privacy policy for DevTools Suite. Learn how we protect your data and ensure your privacy while using our developer tools.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
