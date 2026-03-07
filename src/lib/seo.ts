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
  icon?: string;
  generateOG?: boolean;
}

/**
 * Generate comprehensive metadata for a page with OpenGraph and Twitter cards
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const fullUrl = `${SITE_URL}${config.path}`;
  
  // Generate dynamic OG image URL if requested
  let imageUrl = config.image || `${SITE_URL}/og-image.png`;
  if (config.generateOG) {
    const params = new URLSearchParams({
      title: config.title,
      description: config.description,
      icon: config.icon || '🛠️',
    });
    imageUrl = `${SITE_URL}/api/og?${params.toString()}`;
  }

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
 * Generate FAQ JSON-LD structured data
 */
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Tool/SoftwareApplication JSON-LD structured data
 */
export function generateToolSchema(tool: {
  name: string;
  description: string;
  url: string;
  category?: string;
  image?: string;
  price?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: tool.url,
    applicationCategory: 'Utility',
    operatingSystem: 'Web',
    image: tool.image || `${SITE_URL}/og-image.png`,
    offers: {
      '@type': 'Offer',
      price: tool.price || '0',
      priceCurrency: 'USD',
    },
  };
}

/**
 * Generate Article JSON-LD structured data
 */
export function generateArticleSchema(article: {
  headline: string;
  description: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    image: article.image || `${SITE_URL}/og-image.png`,
    datePublished: article.datePublished || new Date().toISOString(),
    dateModified: article.dateModified || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: article.author || SITE_NAME,
    },
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
