import { Metadata } from 'next';
import HomeClient from '@/components/home/HomeClient';

export const metadata: Metadata = {
  title: 'DevTools Suite - Developer Tools & Utilities',
  description: '100+ free online developer tools: Base64, JSON formatter, SHA-256, UUID, and more. Secure, private, and fast utilities for modern web development.',
  keywords: 'developer tools, hash generator, base64, JSON formatter, UUID generator, regex tester, color converter, online tools, web development',
  openGraph: {
    title: 'DevTools Suite - 100+ Free Developer Tools',
    description: 'Complete suite of online developer tools for encoding, hashing, formatting, and data transformation.',
    type: 'website',
    url: 'https://devtools-suite.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevTools Suite',
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
