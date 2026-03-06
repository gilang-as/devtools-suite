
"use client"

import { TOOLS } from '@/tools/config';
import ToolCard from '@/components/tools/ToolCard';
import { useTranslation } from '@/components/providers/i18n-provider';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="space-y-12 py-10">
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-headline font-extrabold tracking-tight">
          {t('home.heading')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('home.subheading')}
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </section>
    </div>
  );
}
