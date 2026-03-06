
"use client"

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/components/providers/i18n-provider';
import { useTheme, type ColorScheme } from '@/components/providers/theme-provider';
import { TOOLS } from '@/tools/config';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Hash, KeyRound, Fingerprint, Braces, Terminal, CodeXml, 
  LayoutPanelLeft, Palette, ScrollText, Code2, Link as LinkIcon, 
  Binary, Hexagon, ShieldCheck, FileKey, Lock, ShieldAlert, Zap, 
  ChevronRight, FileBadge, Type, Network, Sun, Moon, Monitor, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, any> = {
  Hash, KeyRound, Fingerprint, Braces, Terminal, CodeXml, LayoutPanelLeft, 
  Palette, ScrollText, Code2, LinkIcon, Binary, Hexagon, ShieldCheck, 
  FileKey, Lock, ShieldAlert, Zap, FileBadge, Type, Network, Sun, Moon, 
  Monitor, Sparkles
};

export default function CommandMenu() {
  const router = useRouter();
  const { t } = useTranslation();
  const { setTheme, setColorScheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [category, setCategory] = React.useState<string | null>(null);
  
  const itemRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  // Appearance Actions
  const appearanceActions = [
    { id: 'mode-light', name: 'Switch to Light Mode', desc: 'Change appearance to light', icon: 'Sun', category: 'Appearance', action: () => setTheme('light') },
    { id: 'mode-dark', name: 'Switch to Dark Mode', desc: 'Change appearance to dark', icon: 'Moon', category: 'Appearance', action: () => setTheme('dark') },
    { id: 'mode-system', name: 'Switch to System Mode', desc: 'Follow system appearance settings', icon: 'Monitor', category: 'Appearance', action: () => setTheme('system') },
  ];

  // Color Scheme Actions
  const colorActions = [
    { id: 'theme-default', name: 'Default Blue Theme', desc: 'Classic professional blue', icon: 'Palette', category: 'Theme', action: () => setColorScheme('default') },
    { id: 'theme-latte', name: 'Catppuccin Latte', desc: 'Light and airy palette', icon: 'Sparkles', category: 'Theme', action: () => setColorScheme('latte') },
    { id: 'theme-frappe', name: 'Catppuccin Frappé', desc: 'Low-contrast dark theme', icon: 'Sparkles', category: 'Theme', action: () => setColorScheme('frappe') },
    { id: 'theme-macchiato', name: 'Catppuccin Macchiato', desc: 'Medium-contrast dark theme', icon: 'Sparkles', category: 'Theme', action: () => setColorScheme('macchiato') },
    { id: 'theme-mocha', name: 'Catppuccin Mocha', desc: 'High-contrast dark theme', icon: 'Sparkles', category: 'Theme', action: () => setColorScheme('mocha') },
    { id: 'theme-spring', name: 'Spring Theme', desc: 'Fresh greens and pinks', icon: 'Palette', category: 'Theme', action: () => setColorScheme('spring') },
    { id: 'theme-summer', name: 'Summer Theme', desc: 'Vibrant blues and yellows', icon: 'Palette', category: 'Theme', action: () => setColorScheme('summer') },
    { id: 'theme-fall', name: 'Fall Theme', desc: 'Warm oranges and browns', icon: 'Palette', category: 'Theme', action: () => setColorScheme('fall') },
    { id: 'theme-winter', name: 'Winter Theme', desc: 'Cool icy blues and greys', icon: 'Palette', category: 'Theme', action: () => setColorScheme('winter') },
    { id: 'theme-sakura', name: 'Sakura Theme', desc: 'Japanese cherry blossom pinks', icon: 'Palette', category: 'Theme', action: () => setColorScheme('sakura') },
    { id: 'theme-china', name: 'China Theme', desc: 'Imperial red and gold', icon: 'Palette', category: 'Theme', action: () => setColorScheme('china') },
  ];

  const categories = React.useMemo(() => {
    const cats = new Set([...TOOLS.map(t => t.category), 'Appearance', 'Theme']);
    return Array.from(cats).sort();
  }, []);

  const filteredItems = React.useMemo(() => {
    const allItems = [
      ...appearanceActions.map(a => ({ ...a, nameKey: a.name, descriptionKey: a.desc, isAction: true })),
      ...colorActions.map(c => ({ ...c, nameKey: c.name, descriptionKey: c.desc, isAction: true })),
      ...TOOLS.map(t => ({ ...t, isAction: false }))
    ];

    return allItems.filter(item => {
      const name = item.isAction ? item.nameKey : t(item.nameKey);
      const desc = item.isAction ? item.descriptionKey : t(item.descriptionKey);
      
      const matchesQuery = 
        name.toLowerCase().includes(query.toLowerCase()) ||
        desc.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !category || item.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category, t]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [query, category]);

  React.useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [selectedIndex]);

  const handleSelect = (item: any) => {
    if (item.isAction && item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
    }
    setOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden border-none shadow-2xl bg-background/80 backdrop-blur-xl [&>button]:hidden flex flex-col">
        <DialogHeader className="p-0 border-b shrink-0">
          <DialogTitle className="sr-only">{t('home.spotlight_title')}</DialogTitle>
          <div className="flex items-center gap-4 px-6 h-16">
            <Search className="h-6 w-6 text-muted-foreground shrink-0" />
            <Input
              placeholder={t('home.search_placeholder')}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none text-lg p-0 h-full bg-transparent placeholder:text-muted-foreground/40 shadow-none hover:bg-transparent focus:bg-transparent flex-1"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <div className="flex items-center gap-1.5 ml-auto shrink-0">
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">ESC</span>
              </kbd>
            </div>
          </div>
        </DialogHeader>

        <div className="flex p-2 bg-muted/30 gap-1 overflow-x-auto border-b shrink-0 scrollbar-hide">
          <Badge 
            variant={category === null ? 'default' : 'outline'} 
            className="cursor-pointer whitespace-nowrap px-3"
            onClick={() => setCategory(null)}
          >
            {t('home.all')}
          </Badge>
          {categories.map((cat) => (
            <Badge 
              key={cat} 
              variant={category === cat ? 'default' : 'outline'} 
              className="cursor-pointer whitespace-nowrap px-3"
              onClick={() => setCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>

        <ScrollArea className="max-h-[400px] w-full overflow-hidden flex-1">
          <div className="p-2 flex flex-col gap-1 w-full overflow-hidden">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => {
                const Icon = iconMap[item.icon] || Terminal;
                const isCurrentItem = index === selectedIndex;
                const name = item.isAction ? item.nameKey : t(item.nameKey);
                const desc = item.isAction ? item.descriptionKey : t(item.descriptionKey);

                return (
                  <div
                    key={item.id}
                    ref={(el) => { itemRefs.current[index] = el; }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all w-full overflow-hidden",
                      isCurrentItem ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className={cn(
                      "p-2 rounded-md shrink-0",
                      isCurrentItem ? "bg-white/20" : "bg-primary/10 text-primary"
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden text-left">
                      <p className="font-bold text-sm truncate w-full">{name}</p>
                      <p className={cn(
                        "text-xs truncate w-full",
                        isCurrentItem ? "text-primary-foreground/80" : "text-muted-foreground"
                      )}>
                        {desc}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <Badge variant="secondary" className={cn(
                        "text-[10px] uppercase font-black",
                        isCurrentItem && "bg-white/20 text-white border-transparent"
                      )}>
                        {item.category}
                      </Badge>
                      {isCurrentItem && <ChevronRight className="h-4 w-4 shrink-0" />}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-muted-foreground w-full">
                <Search className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p>{t('home.no_results_title')} "{query}"</p>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-3 border-t bg-muted/20 flex items-center justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-widest shrink-0">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><kbd className="border bg-background px-1 rounded">↑↓</kbd> {t('home.navigate')}</span>
            <span className="flex items-center gap-1"><kbd className="border bg-background px-1 rounded">Enter</kbd> {t('home.select')}</span>
          </div>
          <span>{t('home.spotlight_title')}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
