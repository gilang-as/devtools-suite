import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JWT Decoder',
  description: 'Decode and inspect JSON Web Tokens (JWT) instantly to view header and payload data.',
  openGraph: {
    title: 'JWT Decoder | DevTools Suite',
    description: 'Inspect JWT contents securely.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
