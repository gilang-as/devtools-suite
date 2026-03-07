"use client"

import { Metadata } from 'next';
import HashGenerator from '@/components/tools/HashGenerator';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'SHA-256 Hash Generator | DevTools Suite',
  description: 'Generate SHA-256 cryptographic hashes for text, files, and data. Secure message digest tool for developers.',
  path: '/hashing/sha256',
  keywords: ['SHA-256', 'hash generator', 'SHA256', 'cryptographic hash', 'message digest'],
});

export default function Sha256Page() {
  return <HashGenerator type="sha256" />;
}
