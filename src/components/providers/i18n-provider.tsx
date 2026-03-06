
"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '@/i18n/en.json';
import id from '@/i18n/id.json';

type Language = 'en' | 'id';
type TranslationData = typeof en;

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, TranslationData> = { en, id };

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('devtools-lang') as Language;
    if (saved && (saved === 'en' || saved === 'id')) {
      setLanguage(saved);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('devtools-lang', lang);
  };

  const t = (path: string): string => {
    if (!path || typeof path !== 'string') return String(path || '');
    
    const keys = path.split('.');
    let result: any = translations[language];
    
    for (const key of keys) {
      if (result && result[key]) {
        result = result[key];
      } else {
        return path;
      }
    }
    
    return typeof result === 'string' ? result : path;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}
