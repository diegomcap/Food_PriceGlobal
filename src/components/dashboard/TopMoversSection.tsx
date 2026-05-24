'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Gauge, MoveRight, Sparkles } from 'lucide-react';
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
    subtitle: 'Os contratos com maior deslocamento percentual dentro da cesta monitorada neste momento.',
    gainers: 'Pressao compradora',
    losers: 'Pressao vendedora',
    lastUpdate: 'Ultima leitura',
    source: 'Fonte',
    loading: 'Carregando movers do mercado...',
    deskNote: 'Leitura rapida para enxergar onde o mercado acelerou, perdeu tracao ou mudou o spread do dia.',
  },
  en: {
    eyebrow: 'Market Movers',
    title: 'Top Movers',
    subtitle: 'Contracts showing the strongest percentage displacement inside the monitored basket right now.',
    gainers: 'Upside pressure',
    losers: 'Downside pressure',
    lastUpdate: 'Last reading',
    source: 'Source',
    loading: 'Loading market movers...',
    deskNote: 'Fast read to see where the market accelerated, lost momentum or changed the day spread.',
  },
  es: {
    eyebrow: 'Market Movers',
    title: 'Mayores Movimientos',
    subtitle: 'Los contratos con mayor desplazamiento porcentual dentro de la cesta monitoreada en este momento.',
    gainers: 'Presion compradora',
    losers: 'Presion vendedora',
    lastUpdate: 'Ultima lectura',
    source: 'Fuente',
    loading: 'Cargando movers del mercado...',
    deskNote: 'Lectura rapida para ver donde el mercado acelero, perdio traccion o cambio el spread del dia.',
  },
  ru: {
    eyebrow: 'Market Movers',
    title: 'Top Movers',
    subtitle: 'Contracts showing the strongest percentage displacement inside the monitored basket right now.',
    gainers: 'Upside pressure',
    losers: 'Downside pressure',
    lastUpdate: 'Last reading',
    source: 'Source',
    loading: 'Loading market movers...',
    deskNote: 'Fast read to see where the market accelerated, lost momentum or changed the day spread.',
  },
  ar: {
    eyebrow: 'Market Movers',
    title: 'اكبر التحركات',
    subtitle: 'العقود صاحبة اكبر تحرك نسبي داخل السلة التي تتم مراقبتها حاليا.',
    gainers: 'ضغط صعودي',
    losers: 'ضغط هبوطي',
    lastUpdate: 'اخر قراءة',
    source: 'المصدر',
    loading: 'جار تحميل تحركات السوق...',
    deskNote: 'قراءة سريعة لمعرفة اين تسارع السوق او فقد الزخم او غير سبريد اليوم.',
  },
  zh: {
    eyebrow: 'Market Movers',
    title: '最大波动',
    subtitle: '当前监控篮子中涨跌幅最明显的合约。',
    gainers: '上涨压力',
    losers: '下跌压力',
    lastUpdate: '最近读取',
    source: '来源',
    loading: '正在加载市场波动...',
    deskNote: '快速查看哪些合约正在加速、失去动能或改变当日价差。',
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
      ? 'bg-emerald-500/10 border-emerald-400/20 text-emerald-200'
      : 'bg-rose-500/10 border-rose-400/20 text-rose-200';

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 md:p-7 shadow-[0_20px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-[1.05rem] font-semibold tracking-[-0.01em] text-white">{title}</h3>
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${toneClasses}`}>
          {tone === 'emerald' ? <ArrowUpRight className="mr-1 h-3.5 w-3.5" /> : <ArrowDownRight className="mr-1 h-3.5 w-3.5" />}
          {items.length}
        </span>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <article
            key={item.symbol}
            className="rounded-[1.5rem] border border-white/10 bg-slate-950/45 p-4 md:p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-slate-950/55"
          >
            <div className="mb-3.5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold ${toneClasses}`}>
                  0{index + 1}
                </div>
                <div>
                  <h4 className="font-semibold tracking-[-0.01em] text-white">{t(item.id)}</h4>
                  <p className="mt-1.5 text-xs text-slate-400">
                    {item.market} <MoveRight className="mx-1 inline h-3 w-3" />
                    {getCategoryLabel(item.category, language)}
                  </p>
                </div>
              </div>
              <div className={`text-sm font-bold tracking-[-0.01em] ${tone === 'emerald' ? 'text-emerald-300' : 'text-rose-300'}`}>
                {formatPercent(item.change)}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <div className="font-mono text-slate-100">{item.price.toFixed(2)}</div>
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[12px] text-slate-300">
                {item.unit}
              </div>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full ${tone === 'emerald' ? 'bg-gradient-to-r from-emerald-500 to-lime-300' : 'bg-gradient-to-r from-rose-500 to-orange-300'}`}
                style={{ width: `${Math.min(100, Math.max(20, Math.abs(item.change) * 12))}%` }}
              />
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
    <section id="top-movers" className="relative overflow-hidden bg-slate-950 py-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.10),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(244,63,94,0.10),_transparent_24%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              <Gauge className="h-3.5 w-3.5" />
              {copy.eyebrow}
            </div>
            <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">{copy.title}</h2>
            <p className="max-w-3xl text-[1.02rem] leading-8 text-slate-300">{copy.subtitle}</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100">
              <Sparkles className="h-3.5 w-3.5" />
              {copy.deskNote}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300 shadow-[0_10px_30px_rgba(2,6,23,0.18)]">
            {copy.lastUpdate}:{' '}
            {updatedAt
              ? formatDateTime(new Date(updatedAt), language as SupportedLanguage)
              : formatDateTime(new Date(), language as SupportedLanguage)}
          </div>
        </div>

        {loading && commodities.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-slate-300">{copy.loading}</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <MoversColumn title={copy.gainers} tone="emerald" items={gainers} language={language as SupportedLanguage} t={t} />
            <MoversColumn title={copy.losers} tone="red" items={losers} language={language as SupportedLanguage} t={t} />
          </div>
        )}

        <div className="mt-7 flex justify-end">
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">
            {copy.source}: {getSourceLabel(source, language as SupportedLanguage)}
          </div>
        </div>
      </div>
    </section>
  );
}
