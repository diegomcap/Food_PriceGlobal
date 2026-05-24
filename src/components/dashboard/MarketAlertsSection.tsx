'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Radar, ShieldAlert } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { formatDateTime, formatMonthYear, type SupportedLanguage } from '@/lib/marketTime';
import {
  formatPercent,
  getSourceLabel,
  mapCommodityQuotes,
  type CommoditiesApiResponse,
  type FaoApiResponse,
  type MarketCommodity,
} from '@/lib/marketOverview';

type AlertCard = {
  id: string;
  tag: string;
  title: string;
  detail: string;
  tone: 'emerald' | 'amber' | 'red' | 'blue';
};

const COPY = {
  pt: {
    eyebrow: 'Mesa de Inteligencia',
    title: 'Alertas do Dia',
    subtitle: 'Leituras curtas e acionaveis para risco, timing e movimentos-chave do mercado.',
    deskNote: 'Resumo editorial montado a partir da referencia FAO e da cesta monitorada de commodities.',
    loading: 'Montando alertas com base nos dados mais recentes...',
    fallback: 'Operando em leitura de contingencia',
    lastUpdate: 'Ultima leitura',
    faoTag: 'FAO',
    futuresTag: 'Futuros',
    riskTag: 'Risco',
    flowTag: 'Fluxo',
    faoTitle: (direction: string, change: string, month: string) =>
      `FAO: indice global de alimentos ${direction} ${change} em ${month}`,
    faoDetail: (value: number, source: string) =>
      `Leitura oficial em ${value.toFixed(1)} pontos; sinal consolidado para contratos e repasse internacional. Fonte ${source}.`,
    moverTitle: (name: string, direction: string) => `${name} lidera os movimentos do dia e opera em ${direction}`,
    moverDetail: (market: string, price: number, unit: string, change: string) =>
      `${market} marca ${price.toFixed(2)} ${unit}, variando ${change}; acompanhar impacto em hedge, spread e origens.`,
    cerealsTitle: (direction: string, month: string) => `Cereais entram em ${direction} na referencia oficial de ${month}`,
    cerealsDetail: (value: number, change: string) =>
      `Subindice FAO de cereais em ${value.toFixed(1)} pontos, com variacao mensal de ${change}; monitorar milho e trigo no fluxo global.`,
    crossTitle: (label: string, direction: string) => `${label} concentra o ajuste mais sensivel da cesta monitorada`,
    crossDetail: (label: string, value: number, change: string, month: string) =>
      `${label} fecha ${month} em ${value.toFixed(1)} pontos, com movimento de ${change}; revisar margem e custo de reposicao.`,
  },
  en: {
    eyebrow: 'Market Desk',
    title: 'Today Alerts',
    subtitle: 'Short and actionable reads for risk, timing and key market moves.',
    deskNote: 'Editorial brief assembled from the FAO reference and the monitored commodities basket.',
    loading: 'Building alerts from the latest market inputs...',
    fallback: 'Running on contingency snapshot',
    lastUpdate: 'Last reading',
    faoTag: 'FAO',
    futuresTag: 'Futures',
    riskTag: 'Risk',
    flowTag: 'Flow',
    faoTitle: (direction: string, change: string, month: string) =>
      `FAO: global food index ${direction} ${change} in ${month}`,
    faoDetail: (value: number, source: string) =>
      `Official print at ${value.toFixed(1)} points; a consolidated signal for contracts and international price pass-through. Source ${source}.`,
    moverTitle: (name: string, direction: string) => `${name} leads today's monitored moves and trades ${direction}`,
    moverDetail: (market: string, price: number, unit: string, change: string) =>
      `${market} prints ${price.toFixed(2)} ${unit}, moving ${change}; track hedge, spread and origin risk.`,
    cerealsTitle: (direction: string, month: string) => `Cereals move ${direction} in the official ${month} reference`,
    cerealsDetail: (value: number, change: string) =>
      `FAO cereals sub-index at ${value.toFixed(1)} points with a monthly move of ${change}; monitor corn and wheat flow.`,
    crossTitle: (label: string, direction: string) => `${label} shows the sharpest adjustment inside the monitored basket`,
    crossDetail: (label: string, value: number, change: string, month: string) =>
      `${label} closes ${month} at ${value.toFixed(1)} points, moving ${change}; revisit margin and replacement cost.`,
  },
  es: {
    eyebrow: 'Mesa de Inteligencia',
    title: 'Alertas del Dia',
    subtitle: 'Lecturas cortas y accionables para riesgo, timing y movimientos clave del mercado.',
    deskNote: 'Resumen editorial armado con la referencia FAO y la cesta monitoreada de commodities.',
    loading: 'Armando alertas con base en los datos mas recientes...',
    fallback: 'Operando en modo de contingencia',
    lastUpdate: 'Ultima lectura',
    faoTag: 'FAO',
    futuresTag: 'Futuros',
    riskTag: 'Riesgo',
    flowTag: 'Flujo',
    faoTitle: (direction: string, change: string, month: string) =>
      `FAO: el indice global de alimentos ${direction} ${change} en ${month}`,
    faoDetail: (value: number, source: string) =>
      `Lectura oficial en ${value.toFixed(1)} puntos; senal consolidada para contratos y traslado internacional de precios. Fuente ${source}.`,
    moverTitle: (name: string, direction: string) => `${name} lidera los movimientos del dia y opera ${direction}`,
    moverDetail: (market: string, price: number, unit: string, change: string) =>
      `${market} marca ${price.toFixed(2)} ${unit}, variando ${change}; seguir impacto en hedge, spread y origenes.`,
    cerealsTitle: (direction: string, month: string) => `Los cereales entran en ${direction} en la referencia oficial de ${month}`,
    cerealsDetail: (value: number, change: string) =>
      `Subindice FAO de cereales en ${value.toFixed(1)} puntos, con variacion mensual de ${change}; monitorear maiz y trigo en el flujo global.`,
    crossTitle: (label: string, direction: string) => `${label} concentra el ajuste mas sensible de la cesta monitoreada`,
    crossDetail: (label: string, value: number, change: string, month: string) =>
      `${label} cierra ${month} en ${value.toFixed(1)} puntos, con movimiento de ${change}; revisar margen y costo de reposicion.`,
  },
  ru: {
    eyebrow: 'Market Desk',
    title: 'Alerty dnia',
    subtitle: 'Korotkie i deystvennye chteniya po risku, taimingu i klyuchevym dvizheniyam rynka.',
    deskNote: 'Editorial brief assembled from the FAO reference and the monitored commodities basket.',
    loading: 'Sobiraem alerty po poslednim rynochnym dannym...',
    fallback: 'Rabota v rezervnom rezhime',
    lastUpdate: 'Poslednee chtenie',
    faoTag: 'FAO',
    futuresTag: 'Futures',
    riskTag: 'Risk',
    flowTag: 'Flow',
    faoTitle: (direction: string, change: string, month: string) =>
      `FAO: globalnyy indeks prodovolstviya ${direction} na ${change} v ${month}`,
    faoDetail: (value: number, source: string) =>
      `Ofitsialnaya otsenka ${value.toFixed(1)} punkta; konsolidirovannyy signal dlya kontraktov i mezhdunarodnogo perenosa tsen. Istochnik ${source}.`,
    moverTitle: (name: string, direction: string) => `${name} vozglavlyaet dvizheniya dnya i torguetsya ${direction}`,
    moverDetail: (market: string, price: number, unit: string, change: string) =>
      `${market} pokazyvaet ${price.toFixed(2)} ${unit}, izmenenie ${change}; otsenivat hedge, spread i risk proiskhozhdeniya.`,
    cerealsTitle: (direction: string, month: string) => `Zernovye dvigayutsya ${direction} v ofitsialnoy ssylke za ${month}`,
    cerealsDetail: (value: number, change: string) =>
      `Subindeks FAO po zernovym na urovne ${value.toFixed(1)} punkta s mesyachnym izmeneniem ${change}; sledit za kukuruzoy i pshenitsey.`,
    crossTitle: (label: string, direction: string) => `${label} pokazyvaet samuyu chuvstvitelnuyu korrektsiyu v otslezhivaemoy korzine`,
    crossDetail: (label: string, value: number, change: string, month: string) =>
      `${label} zakryvaet ${month} na urovne ${value.toFixed(1)} punkta, dvizhenie ${change}; pereotsenit marzhu i stoimost zameny.`,
  },
  ar: {
    eyebrow: 'مكتب السوق',
    title: 'تنبيهات اليوم',
    subtitle: 'قراءات قصيرة وقابلة للتنفيذ للمخاطر والتوقيت والتحركات الرئيسية في السوق.',
    deskNote: 'ملخص تحريري مبني على مرجع FAO وسلة السلع التي تتم مراقبتها.',
    loading: 'جار بناء التنبيهات من احدث بيانات السوق...',
    fallback: 'يعمل في وضع احتياطي',
    lastUpdate: 'اخر قراءة',
    faoTag: 'FAO',
    futuresTag: 'Futures',
    riskTag: 'مخاطر',
    flowTag: 'تدفق',
    faoTitle: (direction: string, change: string, month: string) =>
      `FAO: مؤشر الغذاء العالمي ${direction} ${change} في ${month}`,
    faoDetail: (value: number, source: string) =>
      `القراءة الرسمية عند ${value.toFixed(1)} نقطة؛ اشارة موحدة للعقود وانتقال الاسعار دوليا. المصدر ${source}.`,
    moverTitle: (name: string, direction: string) => `${name} يقود تحركات اليوم ويتداول ${direction}`,
    moverDetail: (market: string, price: number, unit: string, change: string) =>
      `${market} يسجل ${price.toFixed(2)} ${unit} مع تغير ${change}؛ راقب التحوط والفارق ومخاطر المنشا.`,
    cerealsTitle: (direction: string, month: string) => `الحبوب تتحرك ${direction} في المرجع الرسمي لشهر ${month}`,
    cerealsDetail: (value: number, change: string) =>
      `المؤشر الفرعي للحبوب من FAO عند ${value.toFixed(1)} نقطة مع تغير شهري ${change}؛ راقب الذرة والقمح.`,
    crossTitle: (label: string, direction: string) => `${label} يسجل اكثر تعديل حساسية داخل السلة المراقبة`,
    crossDetail: (label: string, value: number, change: string, month: string) =>
      `${label} يغلق ${month} عند ${value.toFixed(1)} نقطة مع حركة ${change}؛ اعد تقييم الهامش وتكلفة الاحلال.`,
  },
  zh: {
    eyebrow: '市场情报台',
    title: '今日预警',
    subtitle: '围绕风险、时机和关键市场波动的短而可执行的读数。',
    deskNote: '基于 FAO 参考读数和监控商品篮子生成的编辑简报。',
    loading: '正在根据最新市场输入生成预警...',
    fallback: '当前运行在后备模式',
    lastUpdate: '最近读取',
    faoTag: 'FAO',
    futuresTag: 'Futures',
    riskTag: '风险',
    flowTag: '流向',
    faoTitle: (direction: string, change: string, month: string) =>
      `FAO：全球食品价格指数在 ${month} ${direction} ${change}`,
    faoDetail: (value: number, source: string) =>
      `官方读数为 ${value.toFixed(1)} 点；为合约和国际价格传导提供综合信号。来源 ${source}。`,
    moverTitle: (name: string, direction: string) => `${name} 领涨今日监控波动并处于 ${direction}`,
    moverDetail: (market: string, price: number, unit: string, change: string) =>
      `${market} 报 ${price.toFixed(2)} ${unit}，变动 ${change}；需关注对套保、价差和产地风险的影响。`,
    cerealsTitle: (direction: string, month: string) => `谷物在 ${month} 官方参考中呈现 ${direction}`,
    cerealsDetail: (value: number, change: string) =>
      `FAO 谷物子指数为 ${value.toFixed(1)} 点，月度变动 ${change}；应继续跟踪玉米和小麦流向。`,
    crossTitle: (label: string, direction: string) => `${label} 在监控篮子中出现最敏感的 ${direction} 调整`,
    crossDetail: (label: string, value: number, change: string, month: string) =>
      `${label} 在 ${month} 收于 ${value.toFixed(1)} 点，变动 ${change}；需要重新评估利润率和替代成本。`,
  },
} as const;

function formatMagnitude(change: number) {
  return `${Math.abs(change).toFixed(2)}%`;
}

function toneClasses(tone: AlertCard['tone']) {
  switch (tone) {
    case 'emerald':
      return 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200';
    case 'amber':
      return 'border-amber-400/20 bg-amber-500/10 text-amber-200';
    case 'red':
      return 'border-rose-400/20 bg-rose-500/10 text-rose-200';
    default:
      return 'border-sky-400/20 bg-sky-500/10 text-sky-200';
  }
}

export default function MarketAlertsSection() {
  const { t, language } = useTranslation();
  const activeLanguage = (['pt', 'en', 'es', 'ru', 'ar', 'zh'].includes(language) ? language : 'en') as keyof typeof COPY;
  const copy = COPY[activeLanguage];
  const [faoData, setFaoData] = useState<FaoApiResponse | null>(null);
  const [commoditiesSource, setCommoditiesSource] = useState<string>('yahoo-finance');
  const [commoditiesUpdatedAt, setCommoditiesUpdatedAt] = useState<string>('');
  const [commodities, setCommodities] = useState<MarketCommodity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadFeeds() {
      try {
        const [faoResponse, commoditiesResponse] = await Promise.all([
          fetch('/api/fao-food-price-index'),
          fetch('/api/commodities'),
        ]);

        if (!faoResponse.ok || !commoditiesResponse.ok) {
          throw new Error('Unable to fetch one or more market feeds');
        }

        const faoJson = (await faoResponse.json()) as FaoApiResponse;
        const commoditiesJson = (await commoditiesResponse.json()) as CommoditiesApiResponse;

        if (!cancelled) {
          setFaoData(faoJson);
          setCommodities(mapCommodityQuotes(commoditiesJson.quotes));
          setCommoditiesSource(commoditiesJson.source);
          setCommoditiesUpdatedAt(commoditiesJson.updatedAt);
        }
      } catch (error) {
        console.error('Unable to build market alerts:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadFeeds();
    const interval = setInterval(loadFeeds, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const alerts = useMemo(() => {
    if (!faoData || commodities.length === 0) {
      return [] as AlertCard[];
    }

    const latestMonth = formatMonthYear(new Date(`${faoData.latest.date}-01T12:00:00Z`), language as SupportedLanguage);
    const foodChange = ((faoData.latest.food - faoData.previous.food) / faoData.previous.food) * 100;
    const cerealsChange = ((faoData.latest.cereals - faoData.previous.cereals) / faoData.previous.cereals) * 100;
    const oilsChange = ((faoData.latest.oils - faoData.previous.oils) / faoData.previous.oils) * 100;
    const sugarChange = ((faoData.latest.sugar - faoData.previous.sugar) / faoData.previous.sugar) * 100;
    const biggestMover = [...commodities].sort((a, b) => Math.abs(b.change) - Math.abs(a.change))[0];
    const higherFaoMove =
      Math.abs(oilsChange) >= Math.abs(sugarChange)
        ? { label: t('oils_tab'), value: faoData.latest.oils, change: oilsChange }
        : { label: t('sugar_tab'), value: faoData.latest.sugar, change: sugarChange };

    return [
      {
        id: 'fao-food',
        tag: copy.faoTag,
        title: copy.faoTitle(
          foodChange >= 0
            ? activeLanguage === 'pt'
              ? 'subiu'
              : activeLanguage === 'es'
                ? 'subio'
                : activeLanguage === 'ru'
                  ? 'vyros'
                  : activeLanguage === 'ar'
                    ? 'ارتفع'
                    : activeLanguage === 'zh'
                      ? '上涨'
                      : 'rose'
            : activeLanguage === 'pt'
              ? 'caiu'
              : activeLanguage === 'es'
                ? 'cayo'
                : activeLanguage === 'ru'
                  ? 'snizilsya'
                  : activeLanguage === 'ar'
                    ? 'انخفض'
                    : activeLanguage === 'zh'
                      ? '下跌'
                      : 'fell',
          formatMagnitude(foodChange),
          latestMonth
        ),
        detail: copy.faoDetail(faoData.latest.food, 'FAO'),
        tone: Math.abs(foodChange) >= 1 ? 'red' : 'blue',
      },
      {
        id: 'top-mover',
        tag: copy.futuresTag,
        title: copy.moverTitle(
          t(biggestMover.id),
          biggestMover.change >= 0
            ? activeLanguage === 'pt'
              ? 'em alta'
              : activeLanguage === 'es'
                ? 'al alza'
                : activeLanguage === 'ru'
                  ? 'vverkh'
                  : activeLanguage === 'ar'
                    ? 'على ارتفاع'
                    : activeLanguage === 'zh'
                      ? '上行'
                      : 'higher'
            : activeLanguage === 'pt'
              ? 'em baixa'
              : activeLanguage === 'es'
                ? 'a la baja'
                : activeLanguage === 'ru'
                  ? 'vniz'
                  : activeLanguage === 'ar'
                    ? 'على تراجع'
                    : activeLanguage === 'zh'
                      ? '下行'
                      : 'lower'
        ),
        detail: copy.moverDetail(biggestMover.market, biggestMover.price, biggestMover.unit, formatPercent(biggestMover.change)),
        tone: Math.abs(biggestMover.change) >= 2 ? 'amber' : 'blue',
      },
      {
        id: 'cereals',
        tag: copy.flowTag,
        title: copy.cerealsTitle(
          cerealsChange >= 0
            ? activeLanguage === 'pt'
              ? 'alta'
              : activeLanguage === 'es'
                ? 'alza'
                : activeLanguage === 'ru'
                  ? 'rost'
                  : activeLanguage === 'ar'
                    ? 'في ارتفاع'
                    : activeLanguage === 'zh'
                      ? '上行'
                      : 'higher'
            : activeLanguage === 'pt'
              ? 'queda'
              : activeLanguage === 'es'
                ? 'baja'
                : activeLanguage === 'ru'
                  ? 'snizhenie'
                  : activeLanguage === 'ar'
                    ? 'في انخفاض'
                    : activeLanguage === 'zh'
                      ? '下行'
                      : 'lower',
          latestMonth
        ),
        detail: copy.cerealsDetail(faoData.latest.cereals, formatPercent(cerealsChange)),
        tone: cerealsChange >= 0 ? 'emerald' : 'amber',
      },
      {
        id: 'cross-basket',
        tag: copy.riskTag,
        title: copy.crossTitle(
          higherFaoMove.label,
          higherFaoMove.change >= 0
            ? activeLanguage === 'pt'
              ? 'alta'
              : activeLanguage === 'es'
                ? 'alza'
                : activeLanguage === 'ru'
                  ? 'rost'
                  : activeLanguage === 'ar'
                    ? 'ارتفاع'
                    : activeLanguage === 'zh'
                      ? '上行'
                      : 'upside'
            : activeLanguage === 'pt'
              ? 'baixa'
              : activeLanguage === 'es'
                ? 'baja'
                : activeLanguage === 'ru'
                  ? 'snizhenie'
                  : activeLanguage === 'ar'
                    ? 'هبوط'
                    : activeLanguage === 'zh'
                      ? '下行'
                      : 'downside'
        ),
        detail: copy.crossDetail(
          higherFaoMove.label,
          higherFaoMove.value,
          formatPercent(higherFaoMove.change),
          latestMonth
        ),
        tone: Math.abs(higherFaoMove.change) >= 3 ? 'red' : 'amber',
      },
    ] as AlertCard[];
  }, [activeLanguage, commodities, copy, faoData, language, t]);

  return (
    <section id="alertas-mercado" className="relative overflow-hidden bg-slate-950 py-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.10),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.10),_transparent_24%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 mb-4">
              <Radar className="w-3.5 h-3.5" />
              {copy.eyebrow}
            </div>
            <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">{copy.title}</h2>
            <p className="max-w-3xl text-[1.02rem] leading-8 text-slate-300">{copy.subtitle}</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-100">
              <AlertTriangle className="h-3.5 w-3.5" />
              {copy.deskNote}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300 shadow-[0_10px_30px_rgba(2,6,23,0.18)]">
            {copy.lastUpdate}:{' '}
            {commoditiesUpdatedAt
              ? formatDateTime(new Date(commoditiesUpdatedAt), language as SupportedLanguage)
              : formatDateTime(new Date(), language as SupportedLanguage)}
          </div>
        </div>

        {commoditiesSource === 'fallback' && (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm text-amber-200">
            <ShieldAlert className="w-4 h-4" />
            {copy.fallback}
          </div>
        )}

        {loading && alerts.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-slate-300">{copy.loading}</div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {alerts.map((alert, index) => (
              <article
                key={alert.id}
                className={`rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 md:p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07] ${
                  index === 0 ? 'xl:col-span-2 xl:min-h-[320px]' : ''
                }`}
              >
                <div className="mb-6 flex items-start justify-between gap-4">
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${toneClasses(alert.tone)}`}>
                    {alert.tag}
                  </span>
                  <span className="text-slate-500">
                    {alert.tone === 'emerald' ? <ArrowUpRight className="w-5 h-5" /> : alert.tone === 'red' ? <AlertTriangle className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </span>
                </div>
                <h3 className={`mb-3.5 font-semibold text-white leading-tight ${index === 0 ? 'max-w-xl text-[1.7rem]' : 'text-[1.08rem]'}`}>{alert.title}</h3>
                <p className={`text-slate-300 ${index === 0 ? 'max-w-2xl text-[15px] leading-7' : 'text-sm leading-7'}`}>{alert.detail}</p>
                <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5 text-xs text-slate-400">
                  {getSourceLabel(commoditiesSource, language as SupportedLanguage)} / FAO
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-400">
                    0{index + 1}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
