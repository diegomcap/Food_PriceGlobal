import { getSourceLabel } from '@/lib/marketOverview';
import type { SupportedLanguage } from '@/lib/marketTime';
import { getMarketSourceTier, type MarketSourceSeverity, type PipelineDatasetKey } from '@/lib/marketSources';

export type PipelineAlertSeverity = Extract<MarketSourceSeverity, 'warning' | 'critical'>;

const DATASET_LABELS: Record<SupportedLanguage, Record<PipelineDatasetKey, string>> = {
  pt: {
    commodities: 'Commodities',
    macro_drivers: 'Drivers macro',
  },
  en: {
    commodities: 'Commodities',
    macro_drivers: 'Macro drivers',
  },
  es: {
    commodities: 'Commodities',
    macro_drivers: 'Drivers macro',
  },
  ru: {
    commodities: 'Commodities',
    macro_drivers: 'Makro-drayvery',
  },
  ar: {
    commodities: 'السلع',
    macro_drivers: 'العوامل الكلية',
  },
  zh: {
    commodities: '大宗商品',
    macro_drivers: '宏观驱动',
  },
};

const TIER_LABELS: Record<SupportedLanguage, Record<'primary' | 'secondary' | 'tertiary' | 'persisted' | 'fallback' | 'unknown', string>> = {
  pt: {
    primary: 'primaria',
    secondary: 'secundaria',
    tertiary: 'terciaria',
    persisted: 'snapshot persistido',
    fallback: 'fallback local',
    unknown: 'desconhecida',
  },
  en: {
    primary: 'primary',
    secondary: 'secondary',
    tertiary: 'tertiary',
    persisted: 'persisted snapshot',
    fallback: 'local fallback',
    unknown: 'unknown',
  },
  es: {
    primary: 'primaria',
    secondary: 'secundaria',
    tertiary: 'terciaria',
    persisted: 'snapshot persistido',
    fallback: 'fallback local',
    unknown: 'desconocida',
  },
  ru: {
    primary: 'primary',
    secondary: 'secondary',
    tertiary: 'tertiary',
    persisted: 'persisted snapshot',
    fallback: 'fallback',
    unknown: 'unknown',
  },
  ar: {
    primary: 'اساسية',
    secondary: 'ثانوية',
    tertiary: 'ثالثية',
    persisted: 'لقطة محفوظة',
    fallback: 'وضع احتياطي',
    unknown: 'غير معروفة',
  },
  zh: {
    primary: '主来源',
    secondary: '次来源',
    tertiary: '第三级来源',
    persisted: '持久化快照',
    fallback: '本地后备',
    unknown: '未知',
  },
};

const ALERT_COPY: Record<
  SupportedLanguage,
  {
    tertiaryTitle: (dataset: string) => string;
    tertiaryDetail: (source: string) => string;
    persistedTitle: (dataset: string) => string;
    persistedDetail: (source: string) => string;
    fallbackTitle: (dataset: string) => string;
    fallbackDetail: (source: string) => string;
  }
> = {
  pt: {
    tertiaryTitle: (dataset) => `${dataset} operando em fonte terciaria`,
    tertiaryDetail: (source) => `As fontes premium estao indisponiveis ou nao configuradas. O sistema esta servindo ${source} temporariamente.`,
    persistedTitle: (dataset) => `${dataset} operando em snapshot persistido`,
    persistedDetail: (source) => `As fontes live estao indisponiveis. O serving caiu para ${source} ate a ingestao voltar a normalidade.`,
    fallbackTitle: (dataset) => `${dataset} operando em contingencia local`,
    fallbackDetail: (source) => `As camadas live e persistida falharam. O sistema esta servindo ${source}; valide providers, snapshot e cron jobs agora.`,
  },
  en: {
    tertiaryTitle: (dataset) => `${dataset} running on tertiary source`,
    tertiaryDetail: (source) => `Premium feeds are unavailable or not configured. The system is temporarily serving ${source}.`,
    persistedTitle: (dataset) => `${dataset} running on persisted snapshot`,
    persistedDetail: (source) => `Live feeds are unavailable. Serving has fallen back to ${source} until ingestion recovers.`,
    fallbackTitle: (dataset) => `${dataset} running on local contingency`,
    fallbackDetail: (source) => `Both live and persisted layers are unavailable. The system is serving ${source}; validate providers, snapshots and cron jobs now.`,
  },
  es: {
    tertiaryTitle: (dataset) => `${dataset} operando en fuente terciaria`,
    tertiaryDetail: (source) => `Las fuentes premium estan indisponibles o no configuradas. El sistema esta sirviendo ${source} temporalmente.`,
    persistedTitle: (dataset) => `${dataset} operando en snapshot persistido`,
    persistedDetail: (source) => `Las fuentes live estan indisponibles. El servicio cayo a ${source} hasta que la ingesta se recupere.`,
    fallbackTitle: (dataset) => `${dataset} operando en contingencia local`,
    fallbackDetail: (source) => `Las capas live y persistida fallaron. El sistema esta sirviendo ${source}; valide providers, snapshot y cron jobs ahora.`,
  },
  ru: {
    tertiaryTitle: (dataset) => `${dataset} rabotaet na tretychnom istochnike`,
    tertiaryDetail: (source) => `Premium-istochniki nedostupny ili ne nastroeny. Sistema vremenno otdaet ${source}.`,
    persistedTitle: (dataset) => `${dataset} rabotaet na sohranennom snimke`,
    persistedDetail: (source) => `Live-istochniki nedostupny. Serving pereshel na ${source}, poka ingest ne vosstanovitsya.`,
    fallbackTitle: (dataset) => `${dataset} rabotaet v rezervnom rezhime`,
    fallbackDetail: (source) => `Live i persisted sloi nedostupny. Sistema otdaet ${source}; proverit providers, snapshots i cron jobs seychas.`,
  },
  ar: {
    tertiaryTitle: (dataset) => `${dataset} تعمل على مصدر ثالثي`,
    tertiaryDetail: (source) => `المصادر المميزة غير متاحة او غير مهيأة. النظام يقدم ${source} بشكل مؤقت.`,
    persistedTitle: (dataset) => `${dataset} تعمل على لقطة محفوظة`,
    persistedDetail: (source) => `المصادر الحية غير متاحة. الخدمة انتقلت الى ${source} حتى تتعافى عملية الادخال.`,
    fallbackTitle: (dataset) => `${dataset} تعمل في وضع طوارئ محلي`,
    fallbackDetail: (source) => `طبقات البيانات الحية والمحفوظة غير متاحة. النظام يقدم ${source} حاليا؛ تحقق من المزودين واللقطات وكرون الآن.`,
  },
  zh: {
    tertiaryTitle: (dataset) => `${dataset} 正在使用第三级来源`,
    tertiaryDetail: (source) => `高级数据源不可用或尚未配置，系统当前临时提供 ${source}。`,
    persistedTitle: (dataset) => `${dataset} 正在使用持久化快照`,
    persistedDetail: (source) => `实时数据源不可用，系统已切换到 ${source}，直到采集恢复。`,
    fallbackTitle: (dataset) => `${dataset} 正在使用本地应急数据`,
    fallbackDetail: (source) => `实时层和持久化层都不可用。系统正在提供 ${source}；请立即检查 provider、snapshot 与 cron job。`,
  },
};

export function getPipelineDatasetLabel(dataset: PipelineDatasetKey, language: SupportedLanguage) {
  return DATASET_LABELS[language]?.[dataset] ?? DATASET_LABELS.en[dataset];
}

export function getPipelineTierLabel(
  tier: 'primary' | 'secondary' | 'tertiary' | 'persisted' | 'fallback' | 'unknown',
  language: SupportedLanguage
) {
  return TIER_LABELS[language]?.[tier] ?? TIER_LABELS.en[tier];
}

export function getPipelineAlertTone(severity: PipelineAlertSeverity) {
  return severity === 'critical'
    ? 'border-red-200 bg-red-50 text-red-700'
    : 'border-amber-200 bg-amber-50 text-amber-700';
}

export function getPipelineSourceAlert(
  dataset: PipelineDatasetKey,
  source: string | undefined,
  language: SupportedLanguage
) {
  const tier = getMarketSourceTier(dataset, source);
  const sourceLabel = getSourceLabel(source ?? 'unknown', language);
  const datasetLabel = getPipelineDatasetLabel(dataset, language);
  const copy = ALERT_COPY[language] ?? ALERT_COPY.en;

  if (tier === 'tertiary') {
    return {
      severity: 'warning' as const,
      tier,
      title: copy.tertiaryTitle(datasetLabel),
      detail: copy.tertiaryDetail(sourceLabel),
    };
  }

  if (tier === 'persisted') {
    return {
      severity: 'critical' as const,
      tier,
      title: copy.persistedTitle(datasetLabel),
      detail: copy.persistedDetail(sourceLabel),
    };
  }

  if (tier === 'fallback') {
    return {
      severity: 'critical' as const,
      tier,
      title: copy.fallbackTitle(datasetLabel),
      detail: copy.fallbackDetail(sourceLabel),
    };
  }

  return null;
}
