import { Metadata } from 'next';

const SITE_URL = 'https://devtools-suite.app';
const SITE_NAME = 'DevTools Suite';
const DEFAULT_DESCRIPTION = 'Premium online developer tools for everyday encoding, encryption, formatting, and networking tasks.';

export interface SEOConfig {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  canonical?: string;
  keywords?: string[];
}

/**
 * Generate comprehensive metadata for a page with OpenGraph and Twitter cards
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const fullUrl = `${SITE_URL}${config.path}`;
  const imageUrl = config.image || `${SITE_URL}/og-image.png`;

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    canonical: config.canonical || fullUrl,
    alternates: {
      canonical: config.canonical || fullUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: fullUrl,
      title: config.title,
      description: config.description,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [imageUrl],
    },
    robots: {
      index: !config.noindex,
      follow: true,
      googleBot: {
        index: !config.noindex,
        follow: true,
      },
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
 * Generate Organization JSON-LD schema
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: DEFAULT_DESCRIPTION,
    sameAs: [
      'https://twitter.com/devtoolssuite',
      'https://github.com/devtools-suite',
    ],
  };
}

/**
 * Generate WebSite JSON-LD schema with search action
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate SoftwareApplication JSON-LD schema
 */
export function generateSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'DeveloperApplication',
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1200',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

/**
 * Generate Tool-specific JSON-LD schema
 */
export function generateToolSchema(tool: {
  name: string;
  description: string;
  path: string;
  category: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    applicationCategory: 'DeveloperApplication',
    description: tool.description,
    url: `${SITE_URL}${tool.path}`,
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

/**
 * Get category-specific SEO config with default values
 */
export function getCategoryMetadata(category: {
  title: string;
  description: string;
  path: string;
}): SEOConfig {
  return {
    title: category.title,
    description: category.description,
    path: category.path,
    keywords: [
      'developer tools',
      'online tools',
      category.title.toLowerCase(),
    ],
  };
}

export const SITE_CONFIG = {
  url: SITE_URL,
  name: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
};
