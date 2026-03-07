import { Metadata } from 'next';
import HomeClient from '@/components/home/HomeClient';

export const metadata: Metadata = {
  title: 'DevTools Suite - Developer Tools & Utilities',
  description: 'Free online developer tools suite: Base64 encoder/decoder, JSON formatter, hash generators (SHA-256, MD5), UUID/GUID generator, URL encoder, color converter, and 100+ more utilities for web developers.',
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
