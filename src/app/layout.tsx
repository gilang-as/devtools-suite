
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { I18nProvider } from '@/components/providers/i18n-provider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'DevTools Suite',
  description: 'Modern developer tools for everyday encoding, decoding, and formatting tasks.',
  openGraph: {
    title: 'DevTools Suite',
    description: 'Modern developer tools for everyday encoding, decoding, and formatting tasks.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <I18nProvider>
          <ThemeProvider defaultTheme="system" storageKey="devtools-theme">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
              {children}
            </main>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
