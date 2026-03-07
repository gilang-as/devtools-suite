
"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/components/providers/i18n-provider';
import { useTheme } from '@/components/providers/theme-provider';
import { 
  Terminal, 
  Sun, 
  Moon, 
  Monitor, 
  Languages,
  Menu,
  X,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent('toggle-spotlight'));
  };

  const isHome = pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Terminal className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight">
              {mounted ? t('common.title') : 'DevTools Suite'}
            </span>
          </Link>
        </div>

        {/* Search Input - Hidden on Home Page, shown elsewhere. Only rendered if mounted to prevent hydration mismatch */}
        {mounted && !isHome && (
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8 animate-in fade-in zoom-in-95 duration-300">
            <Button 
              variant="outline" 
              className="w-full justify-start text-muted-foreground font-normal bg-muted/50 hover:bg-muted border-dashed rounded-xl h-10 px-4 transition-all hover:border-primary/50 active:scale-[0.98]"
              onClick={openSearch}
            >
              <Search className="mr-2 h-4 w-4" />
              <span className="flex-1 text-left">
                {t('home.search_placeholder')}
              </span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {mounted ? (
            <>
              <div className="flex items-center justify-center w-9 h-9">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Languages className="h-[1.2rem] w-[1.2rem]" />
                      <span className="sr-only">Toggle language</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-accent' : ''}>
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('id')} className={language === 'id' ? 'bg-accent' : ''}>
                      Indonesian
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9" 
                onClick={toggleTheme}
                title={t('common.theme')}
              >
                {theme === 'light' && <Sun className="h-[1.2rem] w-[1.2rem]" />}
                {theme === 'dark' && <Moon className="h-[1.2rem] w-[1.2rem]" />}
                {theme === 'system' && <Monitor className="h-[1.2rem] w-[1.2rem]" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </>
          ) : (
            <div className="w-20 h-9 bg-muted/20 rounded-md animate-pulse" />
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden h-9 w-9"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {mounted && !isHome && (
            <Button 
              variant="outline" 
              className="w-full justify-start h-11"
              onClick={() => {
                setIsMenuOpen(false);
                openSearch();
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              {t('home.search_placeholder')}
            </Button>
          )}
          <Link 
            href="/" 
            className="text-sm font-medium hover:text-primary transition-colors py-2 px-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
        </div>
      )}
    </header>
  );
}
