import { getSourceLabel } from '@/lib/marketOverview';
import type { SupportedLanguage } from '@/lib/marketTime';

export type DatasetKey = 'fao_index' | 'commodities' | 'macro_drivers' | 'market_news';
export type FreshnessStatus = 'fresh' | 'stale' | 'delayed' | 'fallback' | 'unknown';

type FreshnessConfig = {
  cadenceLabel: string;
  refreshEveryMs: number;
  staleAfterMs: number;
  delayedAfterMs: number;
};

export const FRESHNESS_CONFIG: Record<DatasetKey, FreshnessConfig> = {
  fao_index: {
    cadenceLabel: 'monthly',
    refreshEveryMs: 24 * 60 * 60 * 1000,
    staleAfterMs: 45 * 24 * 60 * 60 * 1000,
    delayedAfterMs: 75 * 24 * 60 * 60 * 1000,
  },
  commodities: {
    cadenceLabel: '5m',
    refreshEveryMs: 5 * 60 * 1000,
    staleAfterMs: 30 * 60 * 1000,
    delayedAfterMs: 2 * 60 * 60 * 1000,
  },
  macro_drivers: {
    cadenceLabel: '5m',
    refreshEveryMs: 5 * 60 * 1000,
    staleAfterMs: 30 * 60 * 1000,
    delayedAfterMs: 2 * 60 * 60 * 1000,
  },
  market_news: {
    cadenceLabel: '30m',
    refreshEveryMs: 30 * 60 * 1000,
    staleAfterMs: 2 * 60 * 60 * 1000,
    delayedAfterMs: 12 * 60 * 60 * 1000,
  },
};

export function getFreshnessStatus(
  dataset: DatasetKey,
  updatedAt?: string,
  source?: string
): FreshnessStatus {
  if (!updatedAt) {
    return 'unknown';
  }

  if (source === 'fallback') {
    return 'fallback';
  }

  const updatedTime = new Date(updatedAt).getTime();
  if (Number.isNaN(updatedTime)) {
    return 'unknown';
  }

  const ageMs = Date.now() - updatedTime;
  const config = FRESHNESS_CONFIG[dataset];

  if (ageMs <= config.staleAfterMs) {
    return 'fresh';
  }

  if (ageMs <= config.delayedAfterMs) {
    return 'stale';
  }

  return 'delayed';
}

export function isRefreshDue(dataset: DatasetKey, updatedAt?: string) {
  if (!updatedAt) {
    return true;
  }

  const updatedTime = new Date(updatedAt).getTime();
  if (Number.isNaN(updatedTime)) {
    return true;
  }

  return Date.now() - updatedTime >= FRESHNESS_CONFIG[dataset].refreshEveryMs;
}

export function getFreshnessTone(status: FreshnessStatus) {
  switch (status) {
    case 'fresh':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'stale':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'delayed':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'fallback':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
}

const STATUS_LABELS: Record<SupportedLanguage, Record<FreshnessStatus, string>> = {
  pt: {
    fresh: 'Atualizado',
    stale: 'Atenção',
    delayed: 'Atrasado',
    fallback: 'Fallback',
    unknown: 'Sem status',
  },
  en: {
    fresh: 'Fresh',
    stale: 'Aging',
    delayed: 'Delayed',
    fallback: 'Fallback',
    unknown: 'Unknown',
  },
  es: {
    fresh: 'Actualizado',
    stale: 'Atencion',
    delayed: 'Atrasado',
    fallback: 'Fallback',
    unknown: 'Sin estado',
  },
  ru: {
    fresh: 'Aktualno',
    stale: 'Trebuet proverki',
    delayed: 'Zaderzhka',
    fallback: 'Fallback',
    unknown: 'Net statusa',
  },
  ar: {
    fresh: 'محدث',
    stale: 'بحاجة لمراجعة',
    delayed: 'متاخر',
    fallback: 'Fallback',
    unknown: 'بلا حالة',
  },
  zh: {
    fresh: '已更新',
    stale: '需关注',
    delayed: '延迟',
    fallback: '后备模式',
    unknown: '无状态',
  },
};

const META_LABELS: Record<SupportedLanguage, { source: string; cadence: string }> = {
  pt: { source: 'Fonte', cadence: 'Cadencia' },
  en: { source: 'Source', cadence: 'Cadence' },
  es: { source: 'Fuente', cadence: 'Cadencia' },
  ru: { source: 'Istochnik', cadence: 'Kadens' },
  ar: { source: 'المصدر', cadence: 'الوتيرة' },
  zh: { source: '来源', cadence: '频率' },
};

export function getFreshnessLabel(status: FreshnessStatus, language: SupportedLanguage) {
  return STATUS_LABELS[language]?.[status] ?? STATUS_LABELS.en[status];
}

export function getFreshnessMeta(dataset: DatasetKey, source: string | undefined, language: SupportedLanguage) {
  const labels = META_LABELS[language] ?? META_LABELS.en;
  const config = FRESHNESS_CONFIG[dataset];
  return {
    sourceLabel: labels.source,
    sourceValue: getSourceLabel(source ?? 'unknown', language),
    cadenceLabel: labels.cadence,
    cadenceValue: config.cadenceLabel,
  };
}
