import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://devtools-suite.app';
const SITE_NAME = 'DevTools Suite';
const DEFAULT_DESCRIPTION = 'Premium online developer tools for everyday encoding, encryption, formatting, and networking tasks. Private, fast, and free.';

export interface SEOConfig {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  canonical?: string;
  keywords?: string[];
  icon?: string;
  generateOG?: boolean;
}

/**
 * Generate comprehensive metadata for a page with OpenGraph and Twitter cards
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    path,
    noindex = false,
    keywords = [],
    icon = '🛠️',
    generateOG = true
  } = config;

  const fullUrl = `${SITE_URL}${path}`;
  
  // Generate dynamic OG image URL if requested
  let imageUrl = config.image || `${SITE_URL}/og-image.png`;
  if (generateOG && !config.image) {
    const params = new URLSearchParams({
      title,
      description,
      icon,
    });
    imageUrl = `${SITE_URL}/api/og?${params.toString()}`;
  }

  return {
    title,
    description,
    keywords: [...keywords, 'developer tools', 'online utilities', 'DevTools Suite'],
    authors: [{ name: 'DevTools Suite Team' }],
    creator: 'DevTools Suite',
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: config.canonical || fullUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: fullUrl,
      title,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@devtoolssuite',
    },
    robots: {
      index: !noindex,
      follow: true,
      googleBot: {
        index: !noindex,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
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
}

/**
 * Generate breadcrumb JSON-LD structured data
 */
export function generateBreadcrumbSchema(breadcrumbs: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/**
 * Generate Tool/SoftwareApplication JSON-LD structured data
 */
export function generateToolSchema(tool: {
  name: string;
  description: string;
  path: string;
  category?: string;
  image?: string;
  price?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: `${SITE_URL}${tool.path}`,
    applicationCategory: tool.category || 'DeveloperApplication',
    operatingSystem: 'Web',
    image: tool.image || `${SITE_URL}/og-image.png`,
    offers: {
      '@type': 'Offer',
      price: tool.price || '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export const SITE_CONFIG = {
  url: SITE_URL,
  name: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
};
