'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Gauge, MoveRight } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { formatDateTime, type SupportedLanguage } from '@/lib/marketTime';
import {
  formatPercent,
  getCategoryLabel,
  getSourceLabel,
  mapCommodityQuotes,
  type CommoditiesApiResponse,
  type MarketCommodity,
} from '@/lib/marketOverview';

const COPY = {
  pt: {
    eyebrow: 'Market Movers',
    title: 'Maiores Movimentos',
    subtitle: 'Os contratos com maior deslocamento percentual na cesta monitorada.',
    gainers: 'Pressao compradora',
    losers: 'Pressao vendedora',
    lastUpdate: 'Ultima leitura',
    source: 'Fonte',
    loading: 'Carregando movers do mercado...',
  },
  en: {
    eyebrow: 'Market Movers',
    title: 'Top Movers',
    subtitle: 'Contracts with the strongest percentage displacement inside the monitored basket.',
    gainers: 'Upside pressure',
    losers: 'Downside pressure',
    lastUpdate: 'Last reading',
    source: 'Source',
    loading: 'Loading market movers...',
  },
  es: {
    eyebrow: 'Market Movers',
    title: 'Mayores Movimientos',
    subtitle: 'Los contratos con mayor desplazamiento porcentual dentro de la cesta monitoreada.',
    gainers: 'Presion compradora',
    losers: 'Presion vendedora',
    lastUpdate: 'Ultima lectura',
    source: 'Fuente',
    loading: 'Cargando movers del mercado...',
  },
  ru: {
    eyebrow: 'Market Movers',
    title: 'Krupneyshie dvizheniya',
    subtitle: 'Kontrakty s naibolshim protsentnym sdvigom v otslezhivaemoy korzine.',
    gainers: 'Pokupatelskoe davlenie',
    losers: 'Prodavtsovskoe davlenie',
    lastUpdate: 'Poslednee chtenie',
    source: 'Istochnik',
    loading: 'Zagruzhaem dvizheniya rynka...',
  },
  ar: {
    eyebrow: 'Market Movers',
    title: 'اكبر التحركات',
    subtitle: 'العقود ذات اكبر تحرك نسبي داخل السلة التي تتم مراقبتها.',
    gainers: 'ضغط صعودي',
    losers: 'ضغط هبوطي',
    lastUpdate: 'اخر قراءة',
    source: 'المصدر',
    loading: 'جار تحميل تحركات السوق...',
  },
  zh: {
    eyebrow: 'Market Movers',
    title: '最大波动',
    subtitle: '监控篮子中涨跌幅最明显的合约。',
    gainers: '上涨压力',
    losers: '下跌压力',
    lastUpdate: '最近读取',
    source: '来源',
    loading: '正在加载市场波动...',
  },
} as const;

function MoversColumn({
  title,
  tone,
  items,
  language,
  t,
}: {
  title: string;
  tone: 'emerald' | 'red';
  items: MarketCommodity[];
  language: SupportedLanguage;
  t: (key: string) => string;
}) {
  const toneClasses =
    tone === 'emerald'
      ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
      : 'bg-red-50 border-red-100 text-red-700';

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${toneClasses}`}>
          {tone === 'emerald' ? <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-1" />}
          {items.length}
        </span>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <article key={item.symbol} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h4 className="font-semibold text-slate-900">{t(item.id)}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  {item.market} <MoveRight className="inline w-3 h-3 mx-1" />
                  {getCategoryLabel(item.category, language)}
                </p>
              </div>
              <div className={`text-sm font-bold ${tone === 'emerald' ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatPercent(item.change)}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <div className="text-slate-700 font-mono">{item.price.toFixed(2)}</div>
              <div className="text-slate-500">{item.unit}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function TopMoversSection() {
  const { t, language } = useTranslation();
  const activeLanguage = (['pt', 'en', 'es', 'ru', 'ar', 'zh'].includes(language) ? language : 'en') as keyof typeof COPY;
  const copy = COPY[activeLanguage];
  const [commodities, setCommodities] = useState<MarketCommodity[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [source, setSource] = useState<string>('yahoo-finance');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadMovers() {
      try {
        const response = await fetch('/api/commodities');
        if (!response.ok) {
          throw new Error(`Unable to fetch commodities (${response.status})`);
        }

        const data = (await response.json()) as CommoditiesApiResponse;
        if (!cancelled) {
          setCommodities(mapCommodityQuotes(data.quotes));
          setUpdatedAt(data.updatedAt);
          setSource(data.source);
        }
      } catch (error) {
        console.error('Unable to load top movers:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMovers();
    const interval = setInterval(loadMovers, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const gainers = useMemo(
    () => [...commodities].sort((a, b) => b.change - a.change).slice(0, 4),
    [commodities]
  );

  const losers = useMemo(
    () => [...commodities].sort((a, b) => a.change - b.change).slice(0, 4),
    [commodities]
  );

  return (
    <section id="top-movers" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-white text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-4">
              <Gauge className="w-3.5 h-3.5" />
              {copy.eyebrow}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{copy.title}</h2>
            <p className="text-slate-600 max-w-3xl">{copy.subtitle}</p>
          </div>
          <div className="text-sm text-slate-500">
            {copy.lastUpdate}:{' '}
            {updatedAt
              ? formatDateTime(new Date(updatedAt), language as SupportedLanguage)
              : formatDateTime(new Date(), language as SupportedLanguage)}
          </div>
        </div>

        {loading && commodities.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500">{copy.loading}</div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <MoversColumn title={copy.gainers} tone="emerald" items={gainers} language={language as SupportedLanguage} t={t} />
            <MoversColumn title={copy.losers} tone="red" items={losers} language={language as SupportedLanguage} t={t} />
          </div>
        )}

        <div className="mt-6 text-right text-xs text-slate-500">
          {copy.source}: {getSourceLabel(source, language as SupportedLanguage)}
        </div>
      </div>
    </section>
  );
}
