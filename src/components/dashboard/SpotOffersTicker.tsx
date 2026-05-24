'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowDownRight, ArrowUpRight, Clock3, Radar } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { formatDateTime, type SupportedLanguage } from '@/lib/marketTime';
import DataFreshnessBadge from '@/components/dashboard/DataFreshnessBadge';
import {
  formatPercent,
  getCategoryLabel,
  getSourceLabel,
  mapCommodityQuotes,
  WATCHLIST_SYMBOLS,
  type CommoditiesApiResponse,
  type MarketCommodity,
} from '@/lib/marketOverview';

const COPY = {
  pt: {
    eyebrow: 'Watchlist Critica',
    title: 'Mercados em Monitoramento',
    subtitle: 'Contratos-chave para acompanhar risco, timing e precificacao na cadeia global de alimentos.',
    status: 'Quase em tempo real',
    source: 'Fonte',
  },
  en: {
    eyebrow: 'Critical Watchlist',
    title: 'Markets Under Monitoring',
    subtitle: 'Key contracts to track risk, timing and pricing across the global food chain.',
    status: 'Near real-time',
    source: 'Source',
  },
  es: {
    eyebrow: 'Watchlist Critica',
    title: 'Mercados en Monitoreo',
    subtitle: 'Contratos clave para seguir riesgo, timing y formacion de precios en la cadena global de alimentos.',
    status: 'Casi en tiempo real',
    source: 'Fuente',
  },
  ru: {
    eyebrow: 'Critical Watchlist',
    title: 'Rynki pod monitoringom',
    subtitle: 'Klyuchevye kontrakty dlya otsenki riska, taiminga i tsenoobrazovaniya v globalnoy tsepochke prodovolstviya.',
    status: 'Pochti v realnom vremeni',
    source: 'Istochnik',
  },
  ar: {
    eyebrow: 'قائمة مراقبة حرجة',
    title: 'اسواق تحت المراقبة',
    subtitle: 'عقود رئيسية لمتابعة المخاطر والتوقيت وتسعير سلسلة الغذاء العالمية.',
    status: 'شبه لحظي',
    source: 'المصدر',
  },
  zh: {
    eyebrow: '关键观察名单',
    title: '重点监控市场',
    subtitle: '跟踪全球食品链风险、时机和定价的关键合约。',
    status: '接近实时',
    source: '来源',
  },
} as const;

const SpotOffersTicker = () => {
  const { t, language } = useTranslation();
  const [watchlist, setWatchlist] = useState<MarketCommodity[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [source, setSource] = useState<string>('yahoo-finance');
  const [loading, setLoading] = useState(true);
  const copy = useMemo(() => {
    const activeLanguage = (['pt', 'en', 'es', 'ru', 'ar', 'zh'].includes(language) ? language : 'en') as keyof typeof COPY;
    return COPY[activeLanguage];
  }, [language]);

  const skeletonCards = Array.from({ length: 6 }, (_, index) => index);

  useEffect(() => {
    let cancelled = false;

    async function loadWatchlist() {
      try {
        const response = await fetch('/api/commodities');
        if (!response.ok) {
          throw new Error(`Unable to fetch commodities (${response.status})`);
        }

        const data = (await response.json()) as CommoditiesApiResponse;
        const mapped = mapCommodityQuotes(data.quotes).filter((item) =>
          WATCHLIST_SYMBOLS.includes(item.symbol as (typeof WATCHLIST_SYMBOLS)[number])
        );

        if (!cancelled) {
          setWatchlist(
            WATCHLIST_SYMBOLS.map((symbol) => mapped.find((item) => item.symbol === symbol)).filter(
              (item): item is MarketCommodity => item !== undefined
            )
          );
          setUpdatedAt(data.updatedAt);
          setSource(data.source);
        }
      } catch (error) {
        console.error('Unable to load critical watchlist:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadWatchlist();
    const interval = setInterval(loadWatchlist, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <section id="watchlist-critica" className="py-14 bg-slate-900 border-y border-slate-800 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 mb-4">
              <Radar className="w-3.5 h-3.5" />
              {copy.eyebrow}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{copy.title}</h2>
            <p className="text-slate-300 max-w-3xl">{copy.subtitle}</p>
          </div>
          <div className="text-sm text-slate-400">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {copy.status}
            </div>
            <div>
              {t('last_update')}:{' '}
              {updatedAt
                ? formatDateTime(new Date(updatedAt), language as SupportedLanguage)
                : formatDateTime(new Date(), language as SupportedLanguage)}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <DataFreshnessBadge
            dataset="commodities"
            updatedAt={updatedAt}
            source={source}
            language={language as SupportedLanguage}
            theme="dark"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {loading && watchlist.length === 0
            ? skeletonCards.map((index) => (
                <article
                  key={`skeleton-${index}`}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                >
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 w-24 rounded bg-white/10"></div>
                    <div className="h-8 w-28 rounded bg-white/10"></div>
                    <div className="h-4 w-full rounded bg-white/10"></div>
                  </div>
                </article>
              ))
            : watchlist.map((item) => (
                <article
                  key={item.symbol}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                >
                  <>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">
                          {getCategoryLabel(item.category, language as SupportedLanguage)}
                        </div>
                        <h3 className="text-xl font-semibold text-white">{t(item.id)}</h3>
                      </div>
                      <div
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          item.change >= 0 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-300'
                        }`}
                      >
                        {item.change >= 0 ? (
                          <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5 mr-1" />
                        )}
                        {formatPercent(item.change)}
                      </div>
                    </div>

                    <div className="text-3xl font-bold text-white mb-4">{item.price.toFixed(2)}</div>

                    <div className="space-y-3 text-sm text-slate-300">
                      <div className="flex items-center justify-between gap-4">
                        <span className="inline-flex items-center gap-2 text-slate-400">
                          <Activity className="w-4 h-4" />
                          {item.market}
                        </span>
                        <span>{item.unit}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="inline-flex items-center gap-2 text-slate-400">
                          <Clock3 className="w-4 h-4" />
                          {t('last_update')}
                        </span>
                        <span>{updatedAt ? formatDateTime(new Date(updatedAt), language as SupportedLanguage) : '--'}</span>
                      </div>
                    </div>
                  </>
                </article>
              ))}
        </div>

        <div className="mt-6 text-right text-xs text-slate-500">
          {copy.source}: {getSourceLabel(source, language as SupportedLanguage)}
        </div>
      </div>
    </section>
  );
};

export default SpotOffersTicker;
