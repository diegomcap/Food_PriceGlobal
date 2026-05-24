'use client';

import Link from 'next/link';
import { Database, ExternalLink, RadioTower, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

export function DataSources() {
  const { language } = useTranslation();

  const COPY = {
    pt: {
      title: 'Fontes Monitoradas',
      subtitle:
        'Camadas que sustentam a leitura operacional do produto, separando referencia oficial, sinais de mercado e contexto macro.',
      badges: {
        live: 'Camada live',
        resilience: 'Camada de continuidade',
      },
      sources: [
        {
          name: 'FAO',
          role: 'Referencia oficial',
          detail: 'Indice global de alimentos e subindices mensais para leitura estrutural.',
          url: 'https://www.fao.org/worldfoodsituation/foodpricesindex/en/',
        },
        {
          name: 'Yahoo Finance',
          role: 'Mercado monitorado',
          detail: 'Futuros e leituras de mercado usadas como camada terciaria quando premium nao esta disponivel.',
          url: 'https://finance.yahoo.com/',
        },
        {
          name: 'Trading Economics',
          role: 'Fonte premium',
          detail: 'Macro drivers e referencia de mercado para operacao com prioridade mais alta quando configurada.',
          url: 'https://tradingeconomics.com/commodities',
        },
        {
          name: 'Barchart',
          role: 'Fonte premium',
          detail: 'Camada premium para commodities e macro quando a chave esta configurada.',
          url: 'https://www.barchart.com/',
        },
        {
          name: 'World Bank',
          role: 'Contexto estrutural',
          detail: 'Referencia complementar para pesquisa e contexto de commodities globais.',
          url: 'https://www.worldbank.org/en/research/commodity-markets',
        },
        {
          name: 'IMF',
          role: 'Contexto macro',
          detail: 'Serie macro complementar para leitura internacional de preco e demanda.',
          url: 'https://www.imf.org/en/Research/commodity-prices',
        },
      ],
    },
    en: {
      title: 'Monitored Sources',
      subtitle:
        'Layers behind the platform operating view, separating official references, market signals and macro context.',
      badges: {
        live: 'Live layer',
        resilience: 'Continuity layer',
      },
      sources: [
        {
          name: 'FAO',
          role: 'Official reference',
          detail: 'Global food index and monthly sub-indexes for structural reading.',
          url: 'https://www.fao.org/worldfoodsituation/foodpricesindex/en/',
        },
        {
          name: 'Yahoo Finance',
          role: 'Monitored market feed',
          detail: 'Futures and market readings used as a tertiary layer when premium feeds are not available.',
          url: 'https://finance.yahoo.com/',
        },
        {
          name: 'Trading Economics',
          role: 'Premium source',
          detail: 'Macro drivers and market reference with higher priority when configured.',
          url: 'https://tradingeconomics.com/commodities',
        },
        {
          name: 'Barchart',
          role: 'Premium source',
          detail: 'Premium layer for commodities and macro when the key is configured.',
          url: 'https://www.barchart.com/',
        },
        {
          name: 'World Bank',
          role: 'Structural context',
          detail: 'Complementary reference for research and global commodity context.',
          url: 'https://www.worldbank.org/en/research/commodity-markets',
        },
        {
          name: 'IMF',
          role: 'Macro context',
          detail: 'Complementary macro series for international price and demand context.',
          url: 'https://www.imf.org/en/Research/commodity-prices',
        },
      ],
    },
    es: {
      title: 'Fuentes Monitorizadas',
      subtitle:
        'Capas que sostienen la lectura operativa del producto, separando referencias oficiales, senales de mercado y contexto macro.',
      badges: {
        live: 'Capa live',
        resilience: 'Capa de continuidad',
      },
      sources: [
        {
          name: 'FAO',
          role: 'Referencia oficial',
          detail: 'Indice global de alimentos y subindices mensuales para lectura estructural.',
          url: 'https://www.fao.org/worldfoodsituation/foodpricesindex/en/',
        },
        {
          name: 'Yahoo Finance',
          role: 'Mercado monitoreado',
          detail: 'Futuros y lecturas de mercado usados como capa terciaria cuando las fuentes premium no estan disponibles.',
          url: 'https://finance.yahoo.com/',
        },
        {
          name: 'Trading Economics',
          role: 'Fuente premium',
          detail: 'Drivers macro y referencia de mercado con prioridad mas alta cuando esta configurada.',
          url: 'https://tradingeconomics.com/commodities',
        },
        {
          name: 'Barchart',
          role: 'Fuente premium',
          detail: 'Capa premium para commodities y macro cuando la clave esta configurada.',
          url: 'https://www.barchart.com/',
        },
        {
          name: 'World Bank',
          role: 'Contexto estructural',
          detail: 'Referencia complementaria para investigacion y contexto global de commodities.',
          url: 'https://www.worldbank.org/en/research/commodity-markets',
        },
        {
          name: 'IMF',
          role: 'Contexto macro',
          detail: 'Serie macro complementaria para lectura internacional de precios y demanda.',
          url: 'https://www.imf.org/en/Research/commodity-prices',
        },
      ],
    },
    ru: {
      title: 'Istochniki monitoringa',
      subtitle:
        'Sloi, kotorye podderzhivayut operatsionnuyu kartinu produkta, razdelyaya ofitsialnye orientiry, rynochnye signaly i makrokontekst.',
      badges: {
        live: 'Zhivoy sloy',
        resilience: 'Sloy nepreryvnosti',
      },
      sources: [
        {
          name: 'FAO',
          role: 'Ofitsialnyy orientir',
          detail: 'Globalnyy indeks prodovolstviya i ezhemesyachnye subindeksy dlya strukturnogo chteniya.',
          url: 'https://www.fao.org/worldfoodsituation/foodpricesindex/en/',
        },
        {
          name: 'Yahoo Finance',
          role: 'Monitorimyy rynok',
          detail: 'Fyuchersy i rynochnye chteniya kak tretichnyy sloy, kogda premium-istochniki nedostupny.',
          url: 'https://finance.yahoo.com/',
        },
        {
          name: 'Trading Economics',
          role: 'Premium-istochnik',
          detail: 'Makrodrayvery i rynochnyy orientir s bolee vysokim prioritetom pri nalichii nastroiki.',
          url: 'https://tradingeconomics.com/commodities',
        },
        {
          name: 'Barchart',
          role: 'Premium-istochnik',
          detail: 'Premium-sloy dlya commodities i makro, kogda klyuch nastroen.',
          url: 'https://www.barchart.com/',
        },
        {
          name: 'World Bank',
          role: 'Strukturnyy kontekst',
          detail: 'Dopolnitelnaya ssylka dlya issledovaniy i globalnogo konteksta po commodities.',
          url: 'https://www.worldbank.org/en/research/commodity-markets',
        },
        {
          name: 'IMF',
          role: 'Makrokontekst',
          detail: 'Dopolnitelnaya makroseriya dlya mezhdunarodnoy otsenki tsen i sprosa.',
          url: 'https://www.imf.org/en/Research/commodity-prices',
        },
      ],
    },
    ar: {
      title: 'المصادر المراقبة',
      subtitle:
        'طبقات تدعم القراءة التشغيلية للمنتج عبر فصل المرجع الرسمي واشارات السوق والسياق الكلي.',
      badges: {
        live: 'طبقة مباشرة',
        resilience: 'طبقة الاستمرارية',
      },
      sources: [
        {
          name: 'FAO',
          role: 'مرجع رسمي',
          detail: 'مؤشر الغذاء العالمي والمؤشرات الفرعية الشهرية للقراءة الهيكلية.',
          url: 'https://www.fao.org/worldfoodsituation/foodpricesindex/en/',
        },
        {
          name: 'Yahoo Finance',
          role: 'سوق مراقب',
          detail: 'العقود المستقبلية وقراءات السوق تستخدم كطبقة ثالثية عندما لا تكون المصادر المميزة متاحة.',
          url: 'https://finance.yahoo.com/',
        },
        {
          name: 'Trading Economics',
          role: 'مصدر مميز',
          detail: 'محركات كلية ومرجع سوقي باولوية اعلى عند تفعيل الاعداد.',
          url: 'https://tradingeconomics.com/commodities',
        },
        {
          name: 'Barchart',
          role: 'مصدر مميز',
          detail: 'طبقة مميزة للسلع والماكرو عند تفعيل المفتاح.',
          url: 'https://www.barchart.com/',
        },
        {
          name: 'World Bank',
          role: 'سياق هيكلي',
          detail: 'مرجع مكمل للبحث وسياق السلع العالمية.',
          url: 'https://www.worldbank.org/en/research/commodity-markets',
        },
        {
          name: 'IMF',
          role: 'سياق كلي',
          detail: 'سلسلة كلية مكملة لقراءة الاسعار والطلب الدوليين.',
          url: 'https://www.imf.org/en/Research/commodity-prices',
        },
      ],
    },
    zh: {
      title: '监控数据源',
      subtitle:
        '支撑产品操作视图的多层来源，区分官方参考、市场信号与宏观背景。',
      badges: {
        live: '实时层',
        resilience: '连续性层',
      },
      sources: [
        {
          name: 'FAO',
          role: '官方参考',
          detail: '全球食品价格指数及月度子指数，用于结构性解读。',
          url: 'https://www.fao.org/worldfoodsituation/foodpricesindex/en/',
        },
        {
          name: 'Yahoo Finance',
          role: '监控市场',
          detail: '当高级数据源不可用时，期货与市场读数作为第三层参考。',
          url: 'https://finance.yahoo.com/',
        },
        {
          name: 'Trading Economics',
          role: '高级来源',
          detail: '在完成配置后，提供更高优先级的宏观驱动与市场参考。',
          url: 'https://tradingeconomics.com/commodities',
        },
        {
          name: 'Barchart',
          role: '高级来源',
          detail: '在密钥配置完成后，为大宗商品与宏观数据提供高级层。',
          url: 'https://www.barchart.com/',
        },
        {
          name: 'World Bank',
          role: '结构背景',
          detail: '用于研究与全球大宗商品背景的补充参考。',
          url: 'https://www.worldbank.org/en/research/commodity-markets',
        },
        {
          name: 'IMF',
          role: '宏观背景',
          detail: '用于国际价格与需求解读的补充宏观序列。',
          url: 'https://www.imf.org/en/Research/commodity-prices',
        },
      ],
    },
  } as const;

  const activeLanguage = (['pt', 'en', 'es', 'ru', 'ar', 'zh'].includes(language) ? language : 'en') as keyof typeof COPY;
  const copy = COPY[activeLanguage];

  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-950 p-8 text-white">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h4 className="flex items-center gap-2 text-xl font-bold">
            <Database className="h-5 w-5 text-emerald-300" />
            {copy.title}
          </h4>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{copy.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-semibold">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-200">
            <RadioTower className="h-3.5 w-3.5 text-emerald-300" />
            {copy.badges.live}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-200">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
            {copy.badges.resilience}
          </span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {copy.sources.map((source) => (
          <Link
            key={source.name}
            href={source.url}
            target="_blank"
            className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:border-emerald-400/30 hover:bg-white/8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{source.role}</p>
                <p className="mt-2 text-lg font-semibold text-white">{source.name}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-slate-500 transition-colors group-hover:text-emerald-300" />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">{source.detail}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
