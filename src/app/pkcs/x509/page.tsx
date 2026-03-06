"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectX509() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/security/x509');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground italic">
      Redirecting to Security / X.509 Certificate...
    </div>
  );
}
