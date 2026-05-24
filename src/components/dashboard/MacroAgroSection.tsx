'use client';

import { useEffect, useState } from 'react';
import { Flame, Globe2, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { formatDateTime, type SupportedLanguage } from '@/lib/marketTime';
import { formatPercent, getSourceLabel } from '@/lib/marketOverview';
import DataFreshnessBadge from '@/components/dashboard/DataFreshnessBadge';

type MacroDriver = {
  symbol: string;
  label: string;
  price: number;
  previousClose: number;
  unit: string;
};

type MacroApiResponse = {
  drivers: MacroDriver[];
  source: string;
  updatedAt: string;
};

const COPY = {
  pt: {
    eyebrow: 'Macro Agro',
    title: 'Drivers Macro e Energia',
    subtitle: 'Os sinais externos que mais afetam câmbio, frete, insumos e precificação da cadeia alimentar.',
    loading: 'Carregando drivers macro...',
    source: 'Fonte',
    update: 'Ultima leitura',
    notes: {
      'DX=F': 'Referencia para competitividade exportadora e formação de basis.',
      'CL=F': 'Afeta frete, fertilizantes e custo logístico internacional.',
      'NG=F': 'Pressiona energia e parte dos custos industriais e de fertilizantes.',
      'GC=F': 'Sinaliza busca por proteção e aversão global a risco.',
    },
  },
  en: {
    eyebrow: 'Macro Agro',
    title: 'Macro and Energy Drivers',
    subtitle: 'External signals with direct impact on FX, freight, inputs and food-chain pricing.',
    loading: 'Loading macro drivers...',
    source: 'Source',
    update: 'Last reading',
    notes: {
      'DX=F': 'Reference for export competitiveness and basis formation.',
      'CL=F': 'Impacts freight, fertilizers and international logistics costs.',
      'NG=F': 'Pressures energy and part of industrial and fertilizer costs.',
      'GC=F': 'Signals demand for protection and global risk aversion.',
    },
  },
  es: {
    eyebrow: 'Macro Agro',
    title: 'Drivers Macro y Energia',
    subtitle: 'Las senales externas con mayor impacto sobre FX, flete, insumos y formacion de precios de la cadena alimentaria.',
    loading: 'Cargando drivers macro...',
    source: 'Fuente',
    update: 'Ultima lectura',
    notes: {
      'DX=F': 'Referencia para competitividad exportadora y formacion de basis.',
      'CL=F': 'Impacta flete, fertilizantes y costo logistico internacional.',
      'NG=F': 'Presiona energia y parte de los costos industriales y de fertilizantes.',
      'GC=F': 'Senala busqueda de proteccion y aversion global al riesgo.',
    },
  },
  ru: {
    eyebrow: 'Macro Agro',
    title: 'Makro i energeticheskie draivery',
    subtitle: 'Vneshnie signaly, silnee vsego vliyayushchie na FX, freyt, inputy i tsenoobrazovanie v prodovolstvennoy tsepochke.',
    loading: 'Zagruzhaem makro-draivery...',
    source: 'Istochnik',
    update: 'Poslednee chtenie',
    notes: {
      'DX=F': 'Orientir dlya eksportnoy konkurentosposobnosti i formirovaniya basis.',
      'CL=F': 'Vliyaet na freyt, udobreniya i mezhdunarodnye logisticheskie zatraty.',
      'NG=F': 'Davlenie na energiyu i chast promyshlennykh i fertilizernykh zatrat.',
      'GC=F': 'Signaliziruet spros na zashchitu i globalnuyu risk-aversion.',
    },
  },
  ar: {
    eyebrow: 'Macro Agro',
    title: 'العوامل الكلية والطاقة',
    subtitle: 'الاشارات الخارجية الاكثر تاثيرا على العملات والشحن والمدخلات وتسعير سلسلة الغذاء.',
    loading: 'جار تحميل العوامل الكلية...',
    source: 'المصدر',
    update: 'اخر قراءة',
    notes: {
      'DX=F': 'مرجع لقدرة التصدير التنافسية وتكوين الاساس السعري.',
      'CL=F': 'يؤثر في الشحن والاسمدة والتكلفة اللوجستية الدولية.',
      'NG=F': 'يضغط على الطاقة وجزء من التكاليف الصناعية وتكاليف الاسمدة.',
      'GC=F': 'يشير الى طلب على التحوط وارتفاع النفور العالمي من المخاطر.',
    },
  },
  zh: {
    eyebrow: 'Macro Agro',
    title: '宏观与能源驱动',
    subtitle: '对外汇、运费、投入成本和食品链定价影响最大的外部信号。',
    loading: '正在加载宏观驱动因素...',
    source: '来源',
    update: '最近读取',
    notes: {
      'DX=F': '用于衡量出口竞争力和基差形成。',
      'CL=F': '影响运费、化肥和国际物流成本。',
      'NG=F': '推动能源以及部分工业和化肥成本。',
      'GC=F': '反映避险需求和全球风险厌恶情绪。',
    },
  },
} as const;

function getIcon(symbol: string) {
  switch (symbol) {
    case 'DX=F':
      return Globe2;
    case 'CL=F':
      return Flame;
    case 'NG=F':
      return Zap;
    default:
      return Globe2;
  }
}

export default function MacroAgroSection() {
  const { language } = useTranslation();
  const activeLanguage = (['pt', 'en', 'es', 'ru', 'ar', 'zh'].includes(language) ? language : 'en') as keyof typeof COPY;
  const copy = COPY[activeLanguage];
  const [drivers, setDrivers] = useState<MacroDriver[]>([]);
  const [source, setSource] = useState<string>('yahoo-finance');
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadMacroDrivers() {
      try {
        const response = await fetch('/api/macro-drivers');
        if (!response.ok) {
          throw new Error(`Unable to fetch macro drivers (${response.status})`);
        }

        const data = (await response.json()) as MacroApiResponse;
        if (!cancelled) {
          setDrivers(data.drivers);
          setSource(data.source);
          setUpdatedAt(data.updatedAt);
        }
      } catch (error) {
        console.error('Unable to load macro drivers:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMacroDrivers();
    const interval = setInterval(loadMacroDrivers, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <section id="macro-agro" className="py-20 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 mb-4">
              <Globe2 className="w-3.5 h-3.5" />
              {copy.eyebrow}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{copy.title}</h2>
            <p className="text-slate-300 max-w-3xl">{copy.subtitle}</p>
          </div>
          <div className="text-sm text-slate-400">
            {copy.update}:{' '}
            {updatedAt
              ? formatDateTime(new Date(updatedAt), language as SupportedLanguage)
              : formatDateTime(new Date(), language as SupportedLanguage)}
          </div>
        </div>

        <div className="mb-6">
          <DataFreshnessBadge
            dataset="macro_drivers"
            updatedAt={updatedAt}
            source={source}
            language={language as SupportedLanguage}
            theme="dark"
          />
        </div>

        {loading && drivers.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">{copy.loading}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {drivers.map((driver) => {
              const Icon = getIcon(driver.symbol);
              const change = ((driver.price - driver.previousClose) / driver.previousClose) * 100;
              return (
                <article key={driver.symbol} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${change >= 0 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-300'}`}>
                      {change >= 0 ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                      {formatPercent(change)}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">{driver.label}</h3>
                  <div className="text-3xl font-black text-white mb-1">{driver.price.toFixed(2)}</div>
                  <div className="text-sm text-slate-400 mb-4">{driver.unit}</div>
                  <p className="text-sm leading-6 text-slate-300">{copy.notes[driver.symbol as keyof typeof copy.notes]}</p>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-6 text-right text-xs text-slate-500">
          {copy.source}: {getSourceLabel(source, language as SupportedLanguage)}
        </div>
      </div>
    </section>
  );
}
