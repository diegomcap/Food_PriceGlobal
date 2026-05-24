'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, LineChart, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { formatDateTime, type SupportedLanguage } from '@/lib/marketTime';
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
    eyebrow: 'Commodity Intelligence',
    title: 'Hubs Prioritarios por Commodity',
    subtitle: 'Cada hub resume o sinal de mercado, o risco dominante e o proximo passo de leitura para as cadeias mais sensiveis.',
    cta: 'Abrir leitura',
    source: 'Fonte',
    update: 'Ultima leitura',
    loading: 'Montando hubs estrategicos...',
    notes: {
      'ZS=F': 'Monitorar premio de exportacao, spread com farelo e risco de origem Brasil/EUA.',
      'ZC=F': 'Ler oferta, clima e fluxo logístico para capturar impacto em ração e etanol.',
      'ZW=F': 'Acompanhar safra no hemisferio norte e risco geopolítico no corredor do Mar Negro.',
      'SB=F': 'Combinar oferta asiática, energia e arbitragem entre açúcar e etanol.',
      'KC=F': 'Cruzar clima no Brasil, estoques certificados e demanda premium.',
      'LE=F': 'Observar China, frigoríficos, spread de proteína e margens de abate.',
    },
  },
  en: {
    eyebrow: 'Commodity Intelligence',
    title: 'Priority Commodity Hubs',
    subtitle: 'Each hub condenses market signal, dominant risk and the next analytical step for the most sensitive chains.',
    cta: 'Open brief',
    source: 'Source',
    update: 'Last reading',
    loading: 'Building strategic commodity hubs...',
    notes: {
      'ZS=F': 'Track export premium, meal spread and Brazil/US origin risk.',
      'ZC=F': 'Read supply, weather and logistics flow to measure feed and ethanol impact.',
      'ZW=F': 'Follow northern hemisphere crop and Black Sea geopolitical risk.',
      'SB=F': 'Combine Asian supply, energy and sugar-to-ethanol arbitrage.',
      'KC=F': 'Cross Brazil weather, certified stocks and premium demand.',
      'LE=F': 'Watch China, packers, protein spread and slaughter margins.',
    },
  },
  es: {
    eyebrow: 'Commodity Intelligence',
    title: 'Hubs Prioritarios por Commodity',
    subtitle: 'Cada hub resume la senal del mercado, el riesgo dominante y el siguiente paso de lectura para las cadenas mas sensibles.',
    cta: 'Abrir lectura',
    source: 'Fuente',
    update: 'Ultima lectura',
    loading: 'Armando hubs estrategicos...',
    notes: {
      'ZS=F': 'Monitorear premio de exportacion, spread de harina y riesgo de origen Brasil/EE.UU.',
      'ZC=F': 'Leer oferta, clima y flujo logistico para medir impacto en racion y etanol.',
      'ZW=F': 'Seguir cosecha del hemisferio norte y riesgo geopolitico en el corredor del Mar Negro.',
      'SB=F': 'Combinar oferta asiatica, energia y arbitraje entre azucar y etanol.',
      'KC=F': 'Cruzar clima en Brasil, stocks certificados y demanda premium.',
      'LE=F': 'Observar China, frigorificos, spread de proteina y margenes de faena.',
    },
  },
  ru: {
    eyebrow: 'Commodity Intelligence',
    title: 'Prioritetnye commodity hubs',
    subtitle: 'Kazhdyy hub sobiraet signal rynka, dominiruyushchiy risk i sleduyushchiy shag analiza po naibolee chuvstvitelnym tsepochkam.',
    cta: 'Otkryt brief',
    source: 'Istochnik',
    update: 'Poslednee chtenie',
    loading: 'Sobiraem strategicheskie huby...',
    notes: {
      'ZS=F': 'Sledit za eksportnoy premiyey, spreadom po shrotu i riskom proiskhozhdeniya Braziliya/SSHA.',
      'ZC=F': 'Otsenivat predlozhenie, pogodu i logisticheskiy potok dlya kormov i etanola.',
      'ZW=F': 'Sledit za urozhayem severnogo polushariya i geopolitikoy v Chernomorskom koridore.',
      'SB=F': 'Sovmeshchat aziatskoe predlozhenie, energiyu i arbitrazh sakhar/etanol.',
      'KC=F': 'Sopostavlyat pogodu v Brazilii, sertifitsirovannye zapasy i premium-spros.',
      'LE=F': 'Nablyudat za Kitaem, pererabotchikami, proteinovym spreadom i marzhoy uboya.',
    },
  },
  ar: {
    eyebrow: 'Commodity Intelligence',
    title: 'مراكز اولوية حسب السلعة',
    subtitle: 'كل مركز يلخص اشارة السوق والمخاطر المهيمنة والخطوة التحليلية التالية للسلاسل الاكثر حساسية.',
    cta: 'فتح القراءة',
    source: 'المصدر',
    update: 'اخر قراءة',
    loading: 'جار بناء المراكز الاستراتيجية...',
    notes: {
      'ZS=F': 'راقب علاوة التصدير وفارق وجبة الصويا ومخاطر المنشا بين البرازيل والولايات المتحدة.',
      'ZC=F': 'اقرأ العرض والطقس والتدفق اللوجستي لقياس الاثر على الاعلاف والايثانول.',
      'ZW=F': 'تابع محصول نصف الكرة الشمالي والمخاطر الجيوسياسية في ممر البحر الاسود.',
      'SB=F': 'ادمج العرض الاسيوي والطاقة والمراجحة بين السكر والايثانول.',
      'KC=F': 'اربط بين طقس البرازيل والمخزونات المعتمدة والطلب المتميز.',
      'LE=F': 'راقب الصين وشركات التعبئة وفارق البروتين وهوامش الذبح.',
    },
  },
  zh: {
    eyebrow: 'Commodity Intelligence',
    title: '重点商品枢纽',
    subtitle: '每个枢纽都汇总市场信号、主导风险以及针对最敏感产业链的下一步分析方向。',
    cta: '打开简报',
    source: '来源',
    update: '最近读取',
    loading: '正在构建战略商品枢纽...',
    notes: {
      'ZS=F': '关注出口升贴水、豆粕价差以及巴西/美国原产地风险。',
      'ZC=F': '结合供给、天气和物流流向，评估对饲料和乙醇的影响。',
      'ZW=F': '跟踪北半球收成以及黑海走廊的地缘政治风险。',
      'SB=F': '结合亚洲供给、能源和糖/乙醇套利。',
      'KC=F': '交叉观察巴西天气、认证库存和高端需求。',
      'LE=F': '关注中国、屠宰加工商、蛋白价差和屠宰利润。',
    },
  },
} as const;

const HUB_LINKS: Record<(typeof WATCHLIST_SYMBOLS)[number], string> = {
  'ZS=F': '#tabela-commodities',
  'ZC=F': '#tabela-commodities',
  'ZW=F': '#tendencias',
  'SB=F': '#top-movers',
  'KC=F': '#noticias',
  'LE=F': '#analise-mercado',
};

export default function CommodityHubsSection() {
  const { t, language } = useTranslation();
  const activeLanguage = (['pt', 'en', 'es', 'ru', 'ar', 'zh'].includes(language) ? language : 'en') as keyof typeof COPY;
  const copy = COPY[activeLanguage];
  const [commodities, setCommodities] = useState<MarketCommodity[]>([]);
  const [source, setSource] = useState<string>('yahoo-finance');
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadCommodityHubs() {
      try {
        const response = await fetch('/api/commodities');
        if (!response.ok) {
          throw new Error(`Unable to fetch commodities (${response.status})`);
        }

        const data = (await response.json()) as CommoditiesApiResponse;
        const mapped = mapCommodityQuotes(data.quotes);

        if (!cancelled) {
          setCommodities(
            WATCHLIST_SYMBOLS.map((symbol) => mapped.find((item) => item.symbol === symbol)).filter(
              (item): item is MarketCommodity => item !== undefined
            )
          );
          setSource(data.source);
          setUpdatedAt(data.updatedAt);
        }
      } catch (error) {
        console.error('Unable to load commodity hubs:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCommodityHubs();
    const interval = setInterval(loadCommodityHubs, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const hubs = useMemo(() => commodities.slice(0, 6), [commodities]);

  return (
    <section id="commodity-hubs" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              {copy.eyebrow}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{copy.title}</h2>
            <p className="text-slate-600 max-w-3xl">{copy.subtitle}</p>
          </div>
          <div className="text-sm text-slate-500">
            {copy.update}:{' '}
            {updatedAt
              ? formatDateTime(new Date(updatedAt), language as SupportedLanguage)
              : formatDateTime(new Date(), language as SupportedLanguage)}
          </div>
        </div>

        {loading && hubs.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-slate-500">{copy.loading}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {hubs.map((hub) => (
              <article key={hub.symbol} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">
                      {getCategoryLabel(hub.category, language as SupportedLanguage)}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{t(hub.id)}</h3>
                  </div>
                  <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${hub.change >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {formatPercent(hub.change)}
                  </div>
                </div>

                <div className="flex items-end justify-between gap-4 mb-5">
                  <div>
                    <div className="text-3xl font-black text-slate-900">{hub.price.toFixed(2)}</div>
                    <div className="text-sm text-slate-500 mt-1">
                      {hub.market} · {hub.unit}
                    </div>
                  </div>
                  <LineChart className="w-8 h-8 text-slate-300" />
                </div>

                <p className="text-sm leading-6 text-slate-600 mb-6">
                  {copy.notes[hub.symbol as keyof typeof copy.notes]}
                </p>

                <div className="flex items-center justify-between gap-4 text-xs text-slate-500">
                  <span>
                    {copy.source}: {getSourceLabel(source, language as SupportedLanguage)}
                  </span>
                  <Link href={HUB_LINKS[hub.symbol as (typeof WATCHLIST_SYMBOLS)[number]]} className="inline-flex items-center gap-2 font-semibold text-slate-900 hover:text-emerald-600 transition-colors">
                    {copy.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
