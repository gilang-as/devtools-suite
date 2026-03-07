import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Base64 Decoder',
  description: 'Decode Base64 strings back into readable text instantly. All processing happens in your browser for maximum security.',
  openGraph: {
    title: 'Base64 Decoder | DevTools Suite',
    description: 'Safe and fast Base64 decoding.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
