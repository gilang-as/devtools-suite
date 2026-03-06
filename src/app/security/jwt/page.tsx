"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function JwtRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/security/jwt/decode');
  }, [router]);

  return null;
}