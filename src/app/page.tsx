
"use client"

import { useState, useMemo } from 'react';
import { TOOLS } from '@/tools/config';
import ToolCard from '@/components/tools/ToolCard';
import { useTranslation } from '@/components/providers/i18n-provider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories from TOOLS
  const categories = useMemo(() => {
    const cats = new Set(TOOLS.map(tool => tool.category));
    return Array.from(cats).sort();
  }, []);

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesSearch = 
        t(tool.nameKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
        t(tool.descriptionKey).toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || tool.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, t]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
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

      <section className="max-w-4xl mx-auto space-y-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder={t('home.search_placeholder') || 'Search tools...'}
            className="pl-10 h-12 text-lg bg-card border-border shadow-sm focus-visible:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

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
      </section>

      {filteredTools.length > 0 ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </section>
      ) : (
        <section className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-border">
          <div className="max-w-xs mx-auto space-y-4">
            <div className="bg-background p-4 rounded-2xl inline-block shadow-sm">
              <Search className="h-10 w-10 text-muted-foreground opacity-20" />
            </div>
            <h3 className="text-xl font-bold">{t('home.no_results_title') || 'No tools found'}</h3>
            <p className="text-muted-foreground">
              {t('home.no_results_desc') || "We couldn't find any tools matching your search or filters."}
            </p>
            <Button variant="link" onClick={clearFilters} className="text-primary font-bold">
              {t('home.clear_all_filters') || 'Clear all filters'}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
