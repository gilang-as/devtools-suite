import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { I18nProvider } from '@/components/providers/i18n-provider';
import { FirebaseProvider } from '@/firebase/provider';
import { AnalyticsProvider } from '@/components/providers/analytics-provider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CommandMenu from '@/components/layout/CommandMenu';
import { Toaster } from '@/components/ui/toaster';
import { OrganizationSchema, WebsiteSchema, SoftwareApplicationSchema } from '@/components/layout/StructuredData';

export const viewport: Viewport = {
  themeColor: '#3b82f6',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://devtools-suite.app'),
  title: {
    default: 'DevTools Suite - Modern Developer Toolbelt',
    template: '%s | DevTools Suite',
  },
  description: 'Premium online developer tools for everyday encoding, encryption, formatting, and networking tasks. Private, fast, and free.',
  keywords: ['developer tools', 'base64 encoder', 'json formatter', 'regex tester', 'jwt decoder', 'subnet calculator', 'sha256 hash', 'unix converter'],
  authors: [{ name: 'DevTools Suite Team' }],
  creator: 'DevTools Suite',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://devtools-suite.app',
    title: 'DevTools Suite - Modern Developer Toolbelt',
    description: 'Fast, secure, and modern developer tools for everyone.',
    siteName: 'DevTools Suite',
    images: [
      {
        url: 'https://devtools-suite.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DevTools Suite',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevTools Suite',
    description: 'Modern online developer tools.',
    creator: '@devtoolssuite',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  alternates: {
    canonical: '/',
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
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <OrganizationSchema />
        <WebsiteSchema />
        <SoftwareApplicationSchema />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <I18nProvider>
          <ThemeProvider defaultTheme="system" storageKey="devtools-theme">
            <FirebaseProvider>
              <AnalyticsProvider />
              <Header />
              <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
                {children}
              </main>
              <Footer />
              <CommandMenu />
              <Toaster />
            </FirebaseProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
