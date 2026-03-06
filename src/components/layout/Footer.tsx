
"use client"

import { useTranslation } from '@/components/providers/i18n-provider';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-card py-6">
      <div className="container mx-auto max-w-7xl px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground">
          © {year} {t('common.title')}. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Built for Developers</span>
        </div>
      </div>
    </footer>
  );
}
