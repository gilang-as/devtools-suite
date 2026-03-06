"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EccRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/security/ecc/sign');
  }, [router]);

  return null;
}