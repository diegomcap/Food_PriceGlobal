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
    title: 'Watchlist Operacional',
    subtitle: 'Contratos-chave para acompanhar risco, timing e formacao de preco com base no feed monitorado da plataforma.',
    status: 'Feed monitorado continuamente',
    source: 'Fonte',
  },
  en: {
    eyebrow: 'Critical Watchlist',
    title: 'Operating Watchlist',
    subtitle: 'Key contracts to track risk, timing and price formation from the platform monitored feed.',
    status: 'Continuously monitored feed',
    source: 'Source',
  },
  es: {
    eyebrow: 'Watchlist Critica',
    title: 'Watchlist Operativa',
    subtitle: 'Contratos clave para seguir riesgo, timing y formacion de precios a partir del feed monitoreado por la plataforma.',
    status: 'Feed monitoreado continuamente',
    source: 'Fuente',
  },
  ru: {
    eyebrow: 'Critical Watchlist',
    title: 'Operating Watchlist',
    subtitle: 'Key contracts to track risk, timing and price formation from the platform monitored feed.',
    status: 'Continuously monitored feed',
    source: 'Istochnik',
  },
  ar: {
    eyebrow: 'قائمة مراقبة حرجة',
    title: 'قائمة تشغيلية',
    subtitle: 'عقود رئيسية لمتابعة المخاطر والتوقيت وتكوين السعر اعتمادا على المصدر الذي تراقبه المنصة.',
    status: 'مصدر مراقب بشكل مستمر',
    source: 'المصدر',
  },
  zh: {
    eyebrow: '关键观察名单',
    title: '操作观察名单',
    subtitle: '基于平台持续监控的数据源，跟踪风险、时机与价格形成的关键合约。',
    status: '持续监控的数据源',
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
    <section id="watchlist-critica" className="relative z-20 overflow-hidden border-y border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.08),_transparent_22%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.08),_transparent_24%)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm">
              <Radar className="w-3.5 h-3.5" />
              {copy.eyebrow}
            </div>
            <h2 className="mb-3 text-3xl font-bold tracking-[-0.02em] text-slate-900 md:text-4xl">{copy.title}</h2>
            <p className="max-w-3xl text-[1.02rem] leading-8 text-slate-600">{copy.subtitle}</p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white/85 px-5 py-4 text-sm text-slate-500 shadow-sm backdrop-blur-sm">
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
            theme="light"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {loading && watchlist.length === 0
            ? skeletonCards.map((index) => (
                <article
                  key={`skeleton-${index}`}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 w-24 rounded bg-slate-200"></div>
                    <div className="h-8 w-28 rounded bg-slate-200"></div>
                    <div className="h-4 w-full rounded bg-slate-200"></div>
                  </div>
                </article>
              ))
            : watchlist.map((item) => (
                <article
                  key={item.symbol}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
                >
                  <>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                          {getCategoryLabel(item.category, language as SupportedLanguage)}
                        </div>
                        <h3 className="text-xl font-semibold tracking-[-0.01em] text-slate-900">{t(item.id)}</h3>
                      </div>
                      <div
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          item.change >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
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

                    <div className="mb-4 text-3xl font-bold tracking-[-0.02em] text-slate-900">{item.price.toFixed(2)}</div>

                    <div className="space-y-3 text-sm text-slate-600">
                      <div className="flex items-center justify-between gap-4">
                        <span className="inline-flex items-center gap-2 text-slate-500">
                          <Activity className="w-4 h-4" />
                          {item.market}
                        </span>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">{item.unit}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="inline-flex items-center gap-2 text-slate-500">
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

        <div className="mt-6 text-right text-xs uppercase tracking-[0.16em] text-slate-500">
          {copy.source}: {getSourceLabel(source, language as SupportedLanguage)}
        </div>
      </div>
    </section>
  );
};

export default SpotOffersTicker;
