import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter, Source_Code_Pro } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { I18nProvider } from '@/components/providers/i18n-provider';
import { FirebaseProvider } from '@/firebase/provider';
import { AnalyticsProvider } from '@/components/providers/analytics-provider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CommandMenu from '@/components/layout/CommandMenu';
import { Toaster } from '@/components/ui/toaster';
import { OrganizationSchema, WebsiteSchema, SoftwareApplicationSchema } from '@/components/layout/StructuredData';
import { SITE_CONFIG } from '@/lib/seo';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-code',
});

export const viewport: Viewport = {
  themeColor: '#3b82f6',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} - Modern Developer Toolbelt`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: ['developer tools', 'base64 encoder', 'json formatter', 'regex tester', 'jwt decoder', 'subnet calculator', 'sha256 hash', 'unix converter'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [`${SITE_CONFIG.url}/og-image.png`],
    creator: '@devtoolssuite',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceCodePro.variable}`} suppressHydrationWarning>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <OrganizationSchema />
        <WebsiteSchema />
        <SoftwareApplicationSchema />
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
