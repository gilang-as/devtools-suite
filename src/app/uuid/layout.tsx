import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UUID & GUID Generators',
  description: 'Generate unique identifiers (UUID v1, v4, v7) and standard GUIDs for your applications.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
