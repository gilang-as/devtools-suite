
"use client"

import { useState, useMemo } from 'react';
import { TOOLS } from '@/tools/config';
import ToolCard from '@/components/tools/ToolCard';
import { useTranslation } from '@/components/providers/i18n-provider';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(TOOLS.map(tool => tool.category));
    return Array.from(cats).sort();
  }, []);

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesCategory = !selectedCategory || tool.category === selectedCategory;
      return matchesCategory;
    });
  }, [selectedCategory]);

  const openSpotlight = () => {
    window.dispatchEvent(new CustomEvent('toggle-spotlight'));
  };

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

      <section className="max-w-4xl mx-auto space-y-8">
        {/* Search Trigger - Transitions into Spotlight */}
        <div 
          className="relative group cursor-pointer active:scale-[0.98] transition-all transform hover:scale-[1.01]"
          onClick={openSpotlight}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
          <div className="flex items-center pl-12 h-14 text-xl text-muted-foreground/60 bg-card border border-border shadow-md rounded-2xl transition-all group-hover:border-primary/50 group-hover:shadow-lg">
            {t('home.search_placeholder') || 'Search tools...'}
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="rounded-full px-6"
            >
              {t('home.all_tools') || 'All Tools'}
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full px-6"
              >
                {category}
              </Button>
            ))}
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">{t('home.quick_access')}</p>
            <div 
              className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-primary/[0.03] border border-primary/10 shadow-sm cursor-pointer hover:bg-primary/[0.05] transition-all"
              onClick={openSpotlight}
            >
              <div className="flex items-center gap-1.5">
                <kbd className="bg-background border-2 border-primary/20 shadow-sm px-2 py-1 rounded-lg text-sm font-bold text-primary min-w-[32px] text-center">⌘</kbd>
                <span className="text-muted-foreground/40 font-bold">+</span>
                <kbd className="bg-background border-2 border-primary/20 shadow-sm px-2 py-1 rounded-lg text-sm font-bold text-primary min-w-[32px] text-center">K</kbd>
              </div>
              <div className="h-4 w-px bg-primary/10 mx-1" />
              <span className="text-sm font-medium text-muted-foreground">{t('home.shortcut_hint')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </section>
    </div>
  );
}
