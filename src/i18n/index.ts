import { createContext, useContext, useState, useEffect, ReactNode, createElement } from 'react';
import { SupportedLocale, Translations } from './types';
export type { SupportedLocale, Translations };
import { en } from './locales/en';
import { zh } from './locales/zh';
import { ja } from './locales/ja';
import { ko } from './locales/ko';
import { ptBR } from './locales/pt-BR';
import { es } from './locales/es';

const translationsMap: Record<SupportedLocale, Translations> = {
  en,
  zh,
  ja,
  ko,
  'pt-BR': ptBR,
  es
};

export const LOCALE_OPTIONS: { code: SupportedLocale; label: string; nativeLabel: string }[] = [
  { code: 'zh', label: 'Simplified Chinese', nativeLabel: '简体中文' },
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語' },
  { code: 'ko', label: 'Korean', nativeLabel: '한국어' },
  { code: 'pt-BR', label: 'Portuguese', nativeLabel: 'Português (Brasil)' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' }
];

export function detectSystemLocale(): SupportedLocale {
  if (typeof navigator === 'undefined') return 'en';
  const lang = (navigator.language || '').toLowerCase();
  if (lang.startsWith('zh')) return 'zh';
  if (lang.startsWith('ja')) return 'ja';
  if (lang.startsWith('ko')) return 'ko';
  if (lang.startsWith('pt')) return 'pt-BR';
  if (lang.startsWith('es')) return 'es';
  return 'en';
}

interface I18nContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: en
});

export function I18nProvider({
  children,
  initialLocale
}: {
  children: ReactNode;
  initialLocale?: SupportedLocale;
}) {
  const [locale, setLocaleState] = useState<SupportedLocale>(
    initialLocale || detectSystemLocale()
  );

  useEffect(() => {
    const saved = localStorage.getItem('qvreader_locale') as SupportedLocale;
    if (saved && translationsMap[saved]) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem('qvreader_locale', newLocale);
  };

  const value: I18nContextValue = {
    locale,
    setLocale,
    t: translationsMap[locale] || en
  };

  return createElement(I18nContext.Provider, { value }, children);
}

export function useI18n() {
  return useContext(I18nContext);
}
