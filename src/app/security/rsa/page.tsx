"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RsaRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/security/rsa/encrypt');
  }, [router]);

  return null;
}