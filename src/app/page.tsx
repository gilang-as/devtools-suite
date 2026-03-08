import { Metadata } from 'next';
import HomeClient from '@/components/home/HomeClient';
import { SITE_CONFIG } from '@/lib/seo';

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} - Developer Tools & Utilities`,
  description: SITE_CONFIG.description,
  keywords: 'developer tools, hash generator, base64, JSON formatter, UUID generator, regex tester, color converter, online tools, web development',
  openGraph: {
    title: `${SITE_CONFIG.name} - 100+ Free Developer Tools`,
    description: 'Complete suite of online developer tools for encoding, hashing, formatting, and data transformation.',
    type: 'website',
    url: SITE_CONFIG.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: 'Free developer tools and utilities for web development',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
};

export default function Home() {
  return <HomeClient />;
}
