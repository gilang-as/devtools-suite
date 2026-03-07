import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Base64 Encoder',
  description: 'Quickly encode any text string into Base64 format. Secure, client-side only processing for developer privacy.',
  openGraph: {
    title: 'Base64 Encoder | DevTools Suite',
    description: 'Secure client-side Base64 encoding.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
