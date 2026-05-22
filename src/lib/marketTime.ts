export type SupportedLanguage = 'pt' | 'en' | 'es' | 'ru' | 'ar' | 'zh';

const LOCALE_MAP: Record<SupportedLanguage, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
  ru: 'ru-RU',
  ar: 'ar-AE',
  zh: 'zh-CN',
};

export function getLocale(language: SupportedLanguage) {
  return LOCALE_MAP[language] || LOCALE_MAP.en;
}

export function formatMonthYear(date: Date, language: SupportedLanguage) {
  return new Intl.DateTimeFormat(getLocale(language), {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatShortDate(date: Date, language: SupportedLanguage) {
  return new Intl.DateTimeFormat(getLocale(language), {
    day: 'numeric',
    month: 'short',
  }).format(date);
}

export function formatDate(date: Date, language: SupportedLanguage) {
  return new Intl.DateTimeFormat(getLocale(language), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(date: Date, language: SupportedLanguage) {
  return new Intl.DateTimeFormat(getLocale(language), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getDayMonthParts(date: Date, language: SupportedLanguage) {
  const parts = new Intl.DateTimeFormat(getLocale(language), {
    day: 'numeric',
    month: 'short',
  }).formatToParts(date);

  return {
    day: parts.find((part) => part.type === 'day')?.value ?? '',
    month: parts.find((part) => part.type === 'month')?.value ?? '',
  };
}

export function getPreviousFullYear(date = new Date()) {
  return date.getFullYear() - 1;
}

export function getCurrentCropSeason(date = new Date()) {
  const startYear = date.getMonth() < 6 ? date.getFullYear() - 1 : date.getFullYear();
  const endYear = String((startYear + 1) % 100).padStart(2, '0');
  return `${startYear}/${endYear}`;
}

export function shiftDate(date: Date, days: number) {
  const shifted = new Date(date);
  shifted.setDate(shifted.getDate() + days);
  return shifted;
}
