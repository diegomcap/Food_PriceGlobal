'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import pt from '../../translations/pt.json';
import en from '../../translations/en.json';
import es from '../../translations/es.json';
import ru from '../../translations/ru.json';
import ar from '../../translations/ar.json';
import zh from '../../translations/zh.json';

export type Language = 'pt' | 'en' | 'es' | 'ru' | 'ar' | 'zh';
export const PUBLIC_LANGUAGE_OPTIONS: Language[] = ['pt', 'en', 'es', 'ru', 'ar', 'zh'];
const STORAGE_KEY = 'foodpriceglobal-language';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, any>> = {
  pt,
  en,
  es,
  ru,
  ar,
  zh,
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && PUBLIC_LANGUAGE_OPTIONS.includes(stored as Language)) {
      setLanguage(stored as Language);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    // Check for direct key match first (handles keys with dots like "nav.home")
    if (translations[language][key]) {
      return translations[language][key];
    }

    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
