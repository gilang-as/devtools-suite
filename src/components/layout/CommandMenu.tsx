
"use client"

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/components/providers/i18n-provider';
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
import { Search, Hash, KeyRound, Fingerprint, Braces, Terminal, CodeXml, LayoutPanelLeft, Palette, ScrollText, Code2, Link as LinkIcon, Binary, Hexagon, ShieldCheck, FileKey, Lock, ShieldAlert, Zap, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, any> = {
  Hash, KeyRound, Fingerprint, Braces, Terminal, CodeXml, LayoutPanelLeft, Palette, ScrollText, Code2, LinkIcon, Binary, Hexagon, ShieldCheck, FileKey, Lock, ShieldAlert, Zap,
};

export default function CommandMenu() {
  const router = useRouter();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [category, setCategory] = React.useState<string | null>(null);

  const categories = React.useMemo(() => {
    return Array.from(new Set(TOOLS.map(t => t.category))).sort();
  }, []);

  const filteredTools = React.useMemo(() => {
    return TOOLS.filter(tool => {
      const matchesQuery = 
        t(tool.nameKey).toLowerCase().includes(query.toLowerCase()) ||
        t(tool.descriptionKey).toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !category || tool.category === category;
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

  const handleSelect = (tool: any) => {
    router.push(tool.href);
    setOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredTools.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % filteredTools.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTools[selectedIndex]) {
        handleSelect(filteredTools[selectedIndex]);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden border-none shadow-2xl bg-background/80 backdrop-blur-xl">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="sr-only">Search Tools</DialogTitle>
          <div className="flex items-center gap-3 px-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Type to search tools... (e.g. 'jwt', 'base64')"
              className="border-none focus-visible:ring-0 text-lg p-0 h-auto bg-transparent"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <div className="flex items-center gap-1.5 ml-auto">
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">ESC</span>
              </kbd>
            </div>
          </div>
        </DialogHeader>

        <div className="flex p-2 bg-muted/30 gap-1 overflow-x-auto border-b">
          <Badge 
            variant={category === null ? 'default' : 'outline'} 
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setCategory(null)}
          >
            All
          </Badge>
          {categories.map((cat) => (
            <Badge 
              key={cat} 
              variant={category === cat ? 'default' : 'outline'} 
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>

        <ScrollArea className="max-h-[400px]">
          <div className="p-2 space-y-1">
            {filteredTools.length > 0 ? (
              filteredTools.map((tool, index) => {
                const Icon = iconMap[tool.icon] || Terminal;
                return (
                  <div
                    key={tool.id}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all",
                      index === selectedIndex ? "bg-primary text-primary-foreground shadow-lg scale-[1.01]" : "hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={() => handleSelect(tool)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className={cn(
                      "p-2 rounded-md",
                      index === selectedIndex ? "bg-white/20" : "bg-primary/10 text-primary"
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold text-sm truncate">{t(tool.nameKey)}</p>
                      <p className={cn(
                        "text-xs truncate",
                        index === selectedIndex ? "text-primary-foreground/80" : "text-muted-foreground"
                      )}>
                        {t(tool.descriptionKey)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="secondary" className={cn(
                        "text-[10px] uppercase font-black",
                        index === selectedIndex && "bg-white/20 text-white border-transparent"
                      )}>
                        {tool.category}
                      </Badge>
                      {index === selectedIndex && <ChevronRight className="h-4 w-4" />}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <Search className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p>No tools found for "{query}"</p>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-3 border-t bg-muted/20 flex items-center justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><kbd className="border bg-background px-1 rounded">↑↓</kbd> Navigate</span>
            <span className="flex items-center gap-1"><kbd className="border bg-background px-1 rounded">Enter</kbd> Select</span>
          </div>
          <span>DevTools Suite Spotlight</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
