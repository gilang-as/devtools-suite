
"use client"

import Link from 'next/link';
import { TOOLS } from '@/tools/config';
import { useTranslation } from '@/components/providers/i18n-provider';
import { Terminal } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const categories = Array.from(new Set(TOOLS.map(tool => tool.category))).sort();

  return (
    <footer className="w-full border-t bg-card mt-auto pt-12 pb-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Mega Footer Content - Optimized Column Layout */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-12 mb-12">
          {categories.map((category) => (
            <div key={category} className="break-inside-avoid mb-10 group">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary/40 mb-4 border-b border-primary/5 pb-2 group-hover:text-primary/70 transition-colors">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {TOOLS.filter(t => t.category === category).map((tool) => (
                  <li key={tool.id}>
                    <Link 
                      href={tool.href}
                      className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-block"
                    >
                      {t(tool.nameKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <span className="font-headline font-bold text-lg tracking-tight block leading-none">
                {t('common.title')}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                Developer Toolbelt
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2 text-sm text-muted-foreground">
            <p className="font-medium">
              © {year} {t('common.title')}. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
