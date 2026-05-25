'use client';

import { PUBLIC_LANGUAGE_OPTIONS, useTranslation } from '@/context/TranslationContext';

type LanguageSwitcherProps = {
  className?: string;
};

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { setLanguage, language } = useTranslation();

  return (
    <div className={`flex items-center gap-1 rounded-lg bg-slate-100 p-1 ${className}`.trim()}>
      {PUBLIC_LANGUAGE_OPTIONS.map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`rounded px-2 py-1 text-[10px] font-bold transition-all ${
            language === lang
              ? 'bg-white text-emerald-600 shadow-sm'
              : 'text-slate-400 hover:bg-slate-200/50 hover:text-slate-600'
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
