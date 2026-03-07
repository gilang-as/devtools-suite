
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Hash, KeyRound, Fingerprint, Braces, Terminal, CodeXml, 
  LayoutPanelLeft, Palette, ScrollText, Code2, Link as LinkIcon, 
  Binary, Hexagon, ShieldCheck, FileKey, Lock, ShieldAlert, Zap, 
  ChevronRight, FileBadge, Type, Network, Sun, Moon, Monitor, Sparkles,
  ArrowLeft, Laptop
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, any> = {
  Hash, KeyRound, Fingerprint, Braces, Terminal, CodeXml, LayoutPanelLeft, 
  Palette, ScrollText, Code2, LinkIcon, Binary, Hexagon, ShieldCheck, 
  FileKey, Lock, ShieldAlert, Zap, FileBadge, Type, Network, Sun, Moon, 
  Monitor, Sparkles, Laptop
};

type View = 'root' | 'colors' | 'modes' | 'color-modes';

export default function CommandMenu() {
  const router = useRouter();
  const { t } = useTranslation();
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();
  
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [view, setView] = React.useState<View>('root');
  const [selectedColor, setSelectedColor] = React.useState<ColorScheme | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [isKeyboard, setIsKeyboard] = React.useState(false);
  
  const absoluteInitialState = React.useRef<{ theme: any, colorScheme: ColorScheme } | null>(null);
  const [checkpoints, setCheckpoints] = React.useState<Record<View, { theme: any, colorScheme: ColorScheme } | null>>({
    root: null,
    colors: null,
    modes: null,
    'color-modes': null
  });

  const itemRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const categoryRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  // Auto-scroll logic for keyboard navigation
  React.useEffect(() => {
    if (isKeyboard && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'auto'
      });
    }
  }, [selectedIndex, isKeyboard]);

  const colorOptions: { id: ColorScheme; name: string; category: string; icon: string }[] = [
    { id: 'default', name: 'Default Blue', category: 'Standard', icon: 'Palette' },
    { id: 'latte', name: 'Catppuccin Latte', category: 'Catppuccin', icon: 'Sparkles' },
    { id: 'frappe', name: 'Catppuccin Frappé', category: 'Catppuccin', icon: 'Sparkles' },
    { id: 'macchiato', name: 'Catppuccin Macchiato', category: 'Catppuccin', icon: 'Sparkles' },
    { id: 'mocha', name: 'Catppuccin Mocha', category: 'Catppuccin', icon: 'Sparkles' },
    { id: 'spring', name: 'Spring Theme', category: 'Seasonal', icon: 'Palette' },
    { id: 'summer', name: 'Summer Theme', category: 'Seasonal', icon: 'Palette' },
    { id: 'fall', name: 'Fall Theme', category: 'Seasonal', icon: 'Palette' },
    { id: 'winter', name: 'Winter Theme', category: 'Seasonal', icon: 'Palette' },
    { id: 'sakura', name: 'Sakura Theme', category: 'Cultural', icon: 'Palette' },
    { id: 'china', name: 'China Theme', category: 'Cultural', icon: 'Palette' },
  ];

  const modeOptions = [
    { id: 'light', name: 'Light Mode', icon: 'Sun' },
    { id: 'dark', name: 'Dark Mode', icon: 'Moon' },
    { id: 'system', name: 'System Default', icon: 'Monitor' },
  ];

  const baseItems = React.useMemo(() => {
    if (view === 'root') {
      const tools = TOOLS.map(t => ({ ...t, isAction: false, type: 'tool' }));
      const settings = [
        { id: 'nav-colors', nameKey: 'Change Color Scheme', descriptionKey: 'Browse seasonal and Catppuccin themes', icon: 'Palette', category: 'Appearance', isAction: true, type: 'nav', target: 'colors' },
        { id: 'nav-modes', nameKey: 'Change Appearance Mode', descriptionKey: 'Toggle between Light, Dark, and System', icon: 'Sun', category: 'Appearance', isAction: true, type: 'nav', target: 'modes' },
      ];
      
      const all = [...settings, ...tools];
      return all.filter(item => {
        const name = item.isAction ? item.nameKey : t(item.nameKey || '');
        const desc = item.isAction ? item.descriptionKey : t(item.descriptionKey || '');
        return (name || '').toLowerCase().includes(query.toLowerCase()) || (desc || '').toLowerCase().includes(query.toLowerCase());
      });
    }

    if (view === 'colors') {
      const items = [
        { id: 'back', name: 'Back to Search', icon: 'ArrowLeft', isBack: true },
        ...colorOptions.map(c => ({ ...c, isAction: true, type: 'color' }))
      ];
      return items.filter(item => (item.name || '').toLowerCase().includes(query.toLowerCase()));
    }

    if (view === 'modes') {
      const items = [
        { id: 'back', name: 'Back to Search', icon: 'ArrowLeft', isBack: true },
        ...modeOptions.map(m => ({ ...m, isAction: true, type: 'mode' }))
      ];
      return items.filter(item => (item.name || '').toLowerCase().includes(query.toLowerCase()));
    }

    if (view === 'color-modes') {
      const colorName = colorOptions.find(c => c.id === selectedColor)?.name || 'Theme';
      const items = [
        { id: 'back', name: `Back to Colors`, icon: 'ArrowLeft', isBack: true },
        ...modeOptions.map(m => ({ ...m, id: m.id, name: `${colorName} (${m.name})`, isAction: true, type: 'apply-all' }))
      ];
      return items.filter(item => (item.name || '').toLowerCase().includes(query.toLowerCase()));
    }

    return [];
  }, [view, query, selectedColor, t]);

  const availableCategories = React.useMemo(() => {
    if (view !== 'root') return [];
    const cats = new Set<string>();
    baseItems.forEach(item => {
      if (!item.isAction && item.category) {
        cats.add(item.category);
      }
    });
    return Array.from(cats).sort();
  }, [baseItems, view]);

  const filteredItems = React.useMemo(() => {
    if (view === 'root' && selectedCategory) {
      return baseItems.filter(item => item.isAction || item.category === selectedCategory);
    }
    return baseItems;
  }, [baseItems, view, selectedCategory]);

  // Preview logic for theme/mode changes
  React.useEffect(() => {
    if (!open) return;

    const activeItem = filteredItems[selectedIndex];
    
    if (!activeItem || activeItem.isBack) {
      // Revert to checkpoint if back/nothing selected
      const checkpoint = checkpoints[view];
      if (checkpoint) {
        setTheme(checkpoint.theme);
        setColorScheme(checkpoint.colorScheme);
      }
      return;
    }

    if (view === 'colors' && activeItem.type === 'color') {
      setColorScheme(activeItem.id);
    } else if (view === 'modes' && activeItem.type === 'mode') {
      setTheme(activeItem.id as any);
    } else if (view === 'color-modes' && activeItem.type === 'apply-all') {
      setTheme(activeItem.id as any);
    }
  }, [selectedIndex, filteredItems, view, open, setTheme, setColorScheme, checkpoints]);

  const handleSelect = (item: any) => {
    if (item.isBack) {
      const prevViewMap: Record<View, View> = {
        'root': 'root',
        'colors': 'root',
        'modes': 'root',
        'color-modes': 'colors'
      };
      
      const targetView = prevViewMap[view];
      const checkpoint = checkpoints[view]; 
      
      if (checkpoint) {
        setTheme(checkpoint.theme);
        setColorScheme(checkpoint.colorScheme);
      }
      
      setView(targetView);
      setQuery('');
      setSelectedIndex(0);
      return;
    }

    if (item.type === 'nav') {
      setCheckpoints(prev => ({ ...prev, [item.target]: { theme, colorScheme } }));
      setView(item.target);
      setQuery('');
      setSelectedIndex(0);
    } else if (item.type === 'color') {
      setCheckpoints(prev => ({ ...prev, 'color-modes': { theme, colorScheme } }));
      setColorScheme(item.id);
      setSelectedColor(item.id);
      setView('color-modes');
      setQuery('');
      setSelectedIndex(0);
    } else if (item.type === 'mode' || item.type === 'apply-all') {
      setTheme(item.id as any);
      absoluteInitialState.current = null; // Mark as saved
      setOpen(false);
    } else if (item.href) {
      router.push(item.href);
      setOpen(false);
    }
  };

  React.useEffect(() => {
    const handleToggle = () => setOpen(prev => !prev);
    window.addEventListener('toggle-spotlight', handleToggle);

    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        setIsKeyboard(true);
      }
    };
    
    const mouseMove = () => setIsKeyboard(false);
    
    document.addEventListener('keydown', down);
    document.addEventListener('mousemove', mouseMove);
    return () => {
      window.removeEventListener('toggle-spotlight', handleToggle);
      document.removeEventListener('keydown', down);
      document.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  React.useEffect(() => {
    if (open) {
      absoluteInitialState.current = { theme, colorScheme };
      setCheckpoints(prev => ({ ...prev, root: { theme, colorScheme } }));
    } else {
      if (absoluteInitialState.current) {
        setTheme(absoluteInitialState.current.theme);
        setColorScheme(absoluteInitialState.current.colorScheme);
      }
      setView('root');
      setQuery('');
      setSelectedColor(null);
      setSelectedCategory(null);
      setSelectedIndex(0);
      setCheckpoints({ root: null, colors: null, modes: null, 'color-modes': null });
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'ArrowRight' && view === 'root' && availableCategories.length > 0) {
      e.preventDefault();
      const currentIndex = selectedCategory ? availableCategories.indexOf(selectedCategory) : -1;
      const nextIndex = currentIndex + 1;
      if (nextIndex < availableCategories.length) {
        setSelectedCategory(availableCategories[nextIndex]);
      } else {
        setSelectedCategory(null);
      }
      setSelectedIndex(0);
    } else if (e.key === 'ArrowLeft' && view === 'root' && availableCategories.length > 0) {
      e.preventDefault();
      const currentIndex = selectedCategory ? availableCategories.indexOf(selectedCategory) : availableCategories.length;
      const nextIndex = currentIndex - 1;
      if (nextIndex >= 0) {
        setSelectedCategory(availableCategories[nextIndex]);
      } else {
        setSelectedCategory(null);
      }
      setSelectedIndex(0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) handleSelect(filteredItems[selectedIndex]);
    } else if (e.key === 'Backspace' && query === '' && view !== 'root') {
      e.preventDefault();
      handleSelect({ isBack: true });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden border-none shadow-2xl bg-background/80 backdrop-blur-xl [&>button]:hidden flex flex-col data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-90 data-[state=open]:slide-in-from-top-10 data-[state=open]:duration-300">
        <DialogHeader className="p-0 border-b shrink-0">
          <DialogTitle className="sr-only">Spotlight</DialogTitle>
          <div className="flex items-center gap-4 px-6 h-16">
            {view !== 'root' ? (
              <Button variant="ghost" size="icon" onClick={() => handleSelect({ isBack: true })} className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            ) : (
              <Search className="h-6 w-6 text-muted-foreground shrink-0" />
            )}
            <Input
              placeholder={
                view === 'root' ? t('home.search_placeholder') :
                view === 'colors' ? 'Select color scheme...' :
                view === 'modes' ? 'Select appearance mode...' :
                'Confirm mode for theme...'
              }
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none text-lg p-0 h-full bg-transparent placeholder:text-muted-foreground/40 shadow-none hover:bg-transparent focus:bg-transparent flex-1"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          
          {view === 'root' && availableCategories.length > 0 && (
            <div className="px-6 pb-3 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
              <Button
                variant={selectedCategory === null ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  "h-7 text-[10px] uppercase font-bold tracking-widest rounded-full px-3 transition-all",
                  selectedCategory === null && "shadow-md"
                )}
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedIndex(0);
                }}
              >
                All
              </Button>
              {availableCategories.map((cat, idx) => (
                <Button
                  key={cat}
                  ref={el => { categoryRefs.current[idx] = el; }}
                  variant={selectedCategory === cat ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    "h-7 text-[10px] uppercase font-bold tracking-widest rounded-full px-3 transition-all whitespace-nowrap",
                    selectedCategory === cat && "shadow-md"
                  )}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedIndex(0);
                  }}
                >
                  {cat}
                </Button>
              ))}
            </div>
          )}
        </DialogHeader>

        <ScrollArea className="max-h-[450px] w-full flex-1 [&>[data-radix-scroll-area-viewport]>div]:!block overflow-auto">
          <div className="p-2 flex flex-col gap-1 w-full box-border">
            {filteredItems.length > 0 ? (
              filteredItems.map((item: any, index) => {
                const Icon = iconMap[item.icon] || Terminal;
                const isCurrentItem = index === selectedIndex;
                
                const name = item.isBack ? item.name : (item.isAction ? (item.nameKey || item.name) : t(item.nameKey || ''));
                const desc = item.isBack ? '' : (item.isAction ? (item.descriptionKey || item.category) : t(item.descriptionKey || ''));

                return (
                  <div
                    key={item.id || item.name}
                    ref={(el) => { itemRefs.current[index] = el; }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all w-full overflow-hidden",
                      isCurrentItem ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => {
                      if (!isKeyboard) setSelectedIndex(index);
                    }}
                  >
                    <div className={cn(
                      "p-2 rounded-md shrink-0",
                      isCurrentItem ? "bg-white/20" : "bg-primary/10 text-primary"
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden text-left">
                      <p className="font-bold text-sm truncate w-full">{name}</p>
                      {desc && (
                        <p className={cn(
                          "text-xs truncate w-full",
                          isCurrentItem ? "text-primary-foreground/80" : "text-muted-foreground"
                        )}>
                          {desc}
                        </p>
                      )}
                    </div>
                    {item.type === 'nav' || item.type === 'color' ? (
                      <ChevronRight className={cn("h-4 w-4 shrink-0", isCurrentItem ? "text-white" : "text-muted-foreground")} />
                    ) : item.category && (
                      <Badge variant="secondary" className={cn("text-[10px] uppercase font-black shrink-0", isCurrentItem && "bg-white/20 text-white")}>
                        {item.category}
                      </Badge>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-muted-foreground w-full">
                <Search className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p>No results found</p>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-3 border-t bg-muted/20 flex items-center justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-widest shrink-0">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span className="flex items-center gap-1"><kbd className="border bg-background px-1 rounded">↑↓</kbd> {t('home.navigate')}</span>
            {view === 'root' && availableCategories.length > 0 && (
              <span className="flex items-center gap-1"><kbd className="border bg-background px-1 rounded">←→</kbd> Categories</span>
            )}
            <span className="flex items-center gap-1"><kbd className="border bg-background px-1 rounded">Enter</kbd> {t('home.select')}</span>
            {view !== 'root' && (
              <span className="flex items-center gap-1"><kbd className="border bg-background px-1 rounded">BS</kbd> Back</span>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Badge variant="outline" className="text-[9px] border-primary/20 text-primary uppercase">
              {view} view
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
