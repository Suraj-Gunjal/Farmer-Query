'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from '../../messages/en.json';
import ml from '../../messages/ml.json';

type Messages = typeof en;
type Language = 'en' | 'ml';

interface TranslationContextType {
  t: Messages;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [messages, setMessages] = useState<Messages>(en);

  useEffect(() => {
    // Load saved language preference
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'en' || saved === 'ml')) {
      setLanguageState(saved);
      setMessages(saved === 'ml' ? ml : en);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setMessages(lang === 'ml' ? ml : en);
    localStorage.setItem('language', lang);
  };

  return (
    <TranslationContext.Provider value={{ t: messages, language, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}
