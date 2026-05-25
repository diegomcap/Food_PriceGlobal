'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Radar, ShieldAlert } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { formatDateTime, formatMonthYear, type SupportedLanguage } from '@/lib/marketTime';
import AgroExportRichMap from '@/components/dashboard/AgroExportRichMap';
import {
  formatPercent,
  getSourceLabel,
  mapCommodityQuotes,
  type CommoditiesApiResponse,
  type FaoApiResponse,
  type MarketCommodity,
} from '@/lib/marketOverview';

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

type AlertCard = {
  id: string;
  tag: string;
  title: string;
  detail: string;
  rule: string;
  action: string;
  tone: 'emerald' | 'amber' | 'red' | 'blue';
};

const COPY = {
  pt: {
    eyebrow: 'Mesa de Inteligencia',
    title: 'Alertas do Dia',
    subtitle: 'Leituras curtas e acionaveis para risco, timing e movimentos-chave do mercado.',
    deskNote: 'Alertas acionados por regras que combinam FAO, futuros e drivers macro para margem, hedge e fluxo.',
    loading: 'Montando alertas com base nos dados mais recentes...',
    fallback: 'Operando em leitura de contingencia',
    lastUpdate: 'Ultima leitura',
    ruleLabel: 'Regra',
    actionLabel: 'Acao recomendada',
    faoTag: 'FAO',
    futuresTag: 'Futuros',
    riskTag: 'Risco',
    flowTag: 'Fluxo',
  },
  en: {
    eyebrow: 'Market Desk',
    title: 'Today Alerts',
    subtitle: 'Short and actionable reads for risk, timing and key market moves.',
    deskNote: 'Alerts are triggered by rules combining FAO, futures and macro drivers for margin, hedging and flow.',
    loading: 'Building alerts from the latest market inputs...',
    fallback: 'Running on contingency snapshot',
    lastUpdate: 'Last reading',
    ruleLabel: 'Rule',
    actionLabel: 'Recommended action',
    faoTag: 'FAO',
    futuresTag: 'Futures',
    riskTag: 'Risk',
    flowTag: 'Flow',
  },
  es: {
    eyebrow: 'Mesa de Inteligencia',
    title: 'Alertas del Dia',
    subtitle: 'Lecturas cortas y accionables para riesgo, timing y movimientos clave del mercado.',
    deskNote: 'Alertas activadas por reglas que combinan FAO, futuros y drivers macro para margen, hedge y flujo.',
    loading: 'Armando alertas con base en los datos mas recientes...',
    fallback: 'Operando en modo de contingencia',
    lastUpdate: 'Ultima lectura',
    ruleLabel: 'Regla',
    actionLabel: 'Accion recomendada',
    faoTag: 'FAO',
    futuresTag: 'Futuros',
    riskTag: 'Riesgo',
    flowTag: 'Flujo',
  },
  ar: {
    eyebrow: 'مكتب الذكاء',
    title: 'تنبيهات اليوم',
    subtitle: 'قراءات قصيرة وقابلة للتنفيذ للمخاطر والتوقيت والتحركات الرئيسية في السوق.',
    deskNote: 'يتم تشغيل التنبيهات عبر قواعد تجمع بين FAO والعقود المستقبلية والعوامل الكلية من اجل الهامش والتحوط والتدفق.',
    loading: 'جار بناء التنبيهات من احدث مدخلات السوق...',
    fallback: 'العمل على لقطة طوارئ',
    lastUpdate: 'اخر قراءة',
    ruleLabel: 'القاعدة',
    actionLabel: 'الاجراء الموصى به',
    faoTag: 'FAO',
    futuresTag: 'العقود المستقبلية',
    riskTag: 'مخاطر',
    flowTag: 'تدفق',
  },
  zh: {
    eyebrow: '情报交易台',
    title: '今日预警',
    subtitle: '围绕风险、时机和关键市场变化的短篇可执行解读。',
    deskNote: '预警由规则触发，综合 FAO、期货与宏观驱动，用于利润、套保和流向判断。',
    loading: '正在根据最新市场输入生成预警...',
    fallback: '当前使用应急快照',
    lastUpdate: '最近读取',
    ruleLabel: '规则',
    actionLabel: '建议动作',
    faoTag: 'FAO',
    futuresTag: '期货',
    riskTag: '风险',
    flowTag: '流向',
  },
} as const;

function formatMagnitude(change: number) {
  return `${Math.abs(change).toFixed(2)}%`;
}

function getCopyLanguage(language: string) {
  if (language === 'pt' || language === 'es' || language === 'ar' || language === 'zh') {
    return language;
  }

  return 'en';
}

function toneClasses(tone: AlertCard['tone']) {
  switch (tone) {
    case 'emerald':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    case 'amber':
      return 'border-amber-200 bg-amber-50 text-amber-700';
    case 'red':
      return 'border-rose-200 bg-rose-50 text-rose-700';
    default:
      return 'border-sky-200 bg-sky-50 text-sky-700';
  }
}

function getChange(price: number, previousClose: number) {
  if (!previousClose) {
    return 0;
  }

  return ((price - previousClose) / previousClose) * 100;
}

function getDriverChange(drivers: MacroDriver[], symbol: string) {
  const driver = drivers.find((item) => item.symbol === symbol);
  return driver ? getChange(driver.price, driver.previousClose) : 0;
}

function getCommodityBySymbol(commodities: MarketCommodity[], symbol: string) {
  return commodities.find((item) => item.symbol === symbol) ?? null;
}

function buildSourcesLabel(
  commoditiesSource: string,
  macroSource: string,
  language: SupportedLanguage
) {
  return Array.from(new Set([getSourceLabel(commoditiesSource, language), getSourceLabel(macroSource, language), 'FAO'])).join(
    ' / '
  );
}

export default function MarketAlertsSection() {
  const { t, language } = useTranslation();
  const activeLanguage = getCopyLanguage(language);
  const copy = COPY[activeLanguage];
  const [faoData, setFaoData] = useState<FaoApiResponse | null>(null);
  const [commoditiesSource, setCommoditiesSource] = useState<string>('yahoo-finance');
  const [commoditiesUpdatedAt, setCommoditiesUpdatedAt] = useState<string>('');
  const [commodities, setCommodities] = useState<MarketCommodity[]>([]);
  const [macroDrivers, setMacroDrivers] = useState<MacroDriver[]>([]);
  const [macroSource, setMacroSource] = useState<string>('yahoo-finance-macro');
  const [macroUpdatedAt, setMacroUpdatedAt] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadFeeds() {
      try {
        const [faoResponse, commoditiesResponse, macroResponse] = await Promise.all([
          fetch('/api/fao-food-price-index'),
          fetch('/api/commodities'),
          fetch('/api/macro-drivers'),
        ]);

        if (!faoResponse.ok || !commoditiesResponse.ok || !macroResponse.ok) {
          throw new Error('Unable to fetch one or more market feeds');
        }

        const faoJson = (await faoResponse.json()) as FaoApiResponse;
        const commoditiesJson = (await commoditiesResponse.json()) as CommoditiesApiResponse;
        const macroJson = (await macroResponse.json()) as MacroApiResponse;

        if (!cancelled) {
          setFaoData(faoJson);
          setCommodities(mapCommodityQuotes(commoditiesJson.quotes));
          setCommoditiesSource(commoditiesJson.source);
          setCommoditiesUpdatedAt(commoditiesJson.updatedAt);
          setMacroDrivers(macroJson.drivers);
          setMacroSource(macroJson.source);
          setMacroUpdatedAt(macroJson.updatedAt);
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
    if (!faoData || commodities.length === 0 || macroDrivers.length === 0) {
      return [] as AlertCard[];
    }

    const latestMonth = formatMonthYear(new Date(`${faoData.latest.date}-01T12:00:00Z`), language as SupportedLanguage);
    const cerealsChange = ((faoData.latest.cereals - faoData.previous.cereals) / faoData.previous.cereals) * 100;
    const oilsChange = ((faoData.latest.oils - faoData.previous.oils) / faoData.previous.oils) * 100;
    const sugarChange = ((faoData.latest.sugar - faoData.previous.sugar) / faoData.previous.sugar) * 100;
    const biggestMover = [...commodities].sort((a, b) => Math.abs(b.change) - Math.abs(a.change))[0];
    const higherFaoMove =
      Math.abs(oilsChange) >= Math.abs(sugarChange)
        ? { label: t('oils_tab'), value: faoData.latest.oils, change: oilsChange, symbol: 'ZL=F' }
        : { label: t('sugar_tab'), value: faoData.latest.sugar, change: sugarChange, symbol: 'SB=F' };
    const correlatedContract = getCommodityBySymbol(commodities, higherFaoMove.symbol);
    const corn = getCommodityBySymbol(commodities, 'ZC=F');
    const wheat = getCommodityBySymbol(commodities, 'ZW=F');
    const grainComplexChange = ((corn?.change ?? 0) + (wheat?.change ?? 0)) / 2;
    const dollarChange = getDriverChange(macroDrivers, 'DX=F');
    const crudeChange = getDriverChange(macroDrivers, 'CL=F');
    const dieselChange = getDriverChange(macroDrivers, 'HO=F');
    const freightChange = getDriverChange(macroDrivers, 'BDI');
    const goldChange = getDriverChange(macroDrivers, 'GC=F');
    const macroStress = dollarChange > 0.25 && (dieselChange > 1 || freightChange > 1 || crudeChange > 1);
    const macroRelief = dollarChange < -0.2 && dieselChange < 0 && freightChange < 0;
    const cerealsConfirmedUp = cerealsChange > 0 && grainComplexChange > 0;
    const cerealsConfirmedDown = cerealsChange < 0 && grainComplexChange < 0;
    const replacementStress = higherFaoMove.change > 2 || (correlatedContract?.change ?? 0) > 1 || goldChange > 0.4;

    if (activeLanguage === 'pt') {
      return [
        {
          id: 'macro-pressure',
          tag: copy.riskTag,
          title: macroStress
            ? 'Dolar, diesel e frete comprimem a margem exportadora'
            : macroRelief
              ? 'Dolar e logistica aliviam o custo de escoamento'
              : 'Pressao macro logistica segue em observacao taticamente',
          detail: `DXY ${formatPercent(dollarChange)}, ULSD Diesel ${formatPercent(dieselChange)}, Baltic Dry ${formatPercent(freightChange)} e WTI ${formatPercent(crudeChange)}. O conjunto ${macroStress ? 'aumenta' : macroRelief ? 'devolve folego ao' : 'mantem em monitoramento o'} custo de hedge, frete e repasse internacional.`,
          rule: 'DXY acima de +0.25% junto com diesel, frete ou WTI acima de +1.00%.',
          action: macroStress
            ? 'Revisar hedge cambial, frete e politica de repasse nas pontas exportadoras.'
            : macroRelief
              ? 'Avaliar janela para aliviar trava curta e recompor margem logistica.'
              : 'Manter acompanhamento cruzado entre cambio, diesel e frete antes de reposicionar hedge.',
          tone: macroStress ? 'red' : macroRelief ? 'emerald' : 'amber',
        },
        {
          id: 'contract-breakout',
          tag: copy.futuresTag,
          title:
            Math.abs(biggestMover.change) >= 2
              ? `${t(biggestMover.id)} rompe faixa e acelera a volatilidade`
              : `${t(biggestMover.id)} lidera o deslocamento tatico do dia`,
          detail: `${biggestMover.market} marca ${biggestMover.price.toFixed(2)} ${biggestMover.unit}, com variacao de ${formatPercent(biggestMover.change)}. O contrato concentra o maior deslocamento intradiario da cesta monitorada.`,
          rule: 'Maior contrato monitorado com deslocamento absoluto a partir de 2.00% no dia.',
          action:
            Math.abs(biggestMover.change) >= 2
              ? 'Reavaliar hedge, spread e origem do ativo antes de ampliar exposicao.'
              : 'Monitorar continuidade do movimento antes de ajustar travas ou compras.',
          tone: Math.abs(biggestMover.change) >= 2.5 ? 'red' : Math.abs(biggestMover.change) >= 1.25 ? 'amber' : 'blue',
        },
        {
          id: 'cereals-confirmation',
          tag: copy.flowTag,
          title: cerealsConfirmedUp
            ? `FAO e futuros confirmam aperto em cereais em ${latestMonth}`
            : cerealsConfirmedDown
              ? `FAO e futuros sinalizam alivio em cereais em ${latestMonth}`
              : `Cereais ainda pedem confirmacao adicional em ${latestMonth}`,
          detail: `FAO Cereais ${formatPercent(cerealsChange)}, Milho ${formatPercent(corn?.change ?? 0)} e Trigo ${formatPercent(wheat?.change ?? 0)}. A leitura cruza referencia oficial e futuros para basis, racao e fluxo global.`,
          rule: 'FAO Cereais e a media de milho e trigo precisam apontar na mesma direcao.',
          action: cerealsConfirmedUp
            ? 'Monitorar compra, basis e repasse em milho e trigo para proteger margem.'
            : cerealsConfirmedDown
              ? 'Avaliar compras escalonadas e cobertura mais leve se o alivio persistir.'
              : 'Esperar confirmacao do complexo de graos antes de mexer no plano de cobertura.',
          tone: cerealsConfirmedUp ? 'red' : cerealsConfirmedDown ? 'emerald' : 'blue',
        },
        {
          id: 'replacement-cost',
          tag: copy.faoTag,
          title: replacementStress
            ? `${higherFaoMove.label} entra em pressao de reposicao`
            : `${higherFaoMove.label} segue sem gatilho forte de reposicao`,
          detail: `${higherFaoMove.label} fecha ${latestMonth} em ${higherFaoMove.value.toFixed(1)} pontos com ${formatPercent(higherFaoMove.change)}. ${correlatedContract ? `${t(correlatedContract.id)} em ${formatPercent(correlatedContract.change)}.` : ''} Ouro em ${formatPercent(goldChange)} como termometro defensivo.`,
          rule: 'Subindice FAO dominante acima de 2.00% ou confirmado pelo contrato correlato e pelo ouro.',
          action: replacementStress
            ? 'Revisar repasse, estoque curto e cobertura de insumos ou derivados correlatos.'
            : 'Seguir monitorando custo de reposicao sem antecipar ajuste comercial forte.',
          tone: replacementStress ? 'amber' : 'blue',
        },
      ] as AlertCard[];
    }

    if (activeLanguage === 'es') {
      return [
        {
          id: 'macro-pressure',
          tag: copy.riskTag,
          title: macroStress
            ? 'Dolar, diesel y flete comprimen el margen exportador'
            : macroRelief
              ? 'Dolar y logistica alivian el costo de salida'
              : 'La presion macro logistica sigue bajo observacion tactica',
          detail: `DXY ${formatPercent(dollarChange)}, ULSD Diesel ${formatPercent(dieselChange)}, Baltic Dry ${formatPercent(freightChange)} y WTI ${formatPercent(crudeChange)}. La mezcla ${macroStress ? 'eleva' : macroRelief ? 'alivia' : 'mantiene en vigilancia'} costo de hedge, flete y traslado internacional.`,
          rule: 'DXY por encima de +0.25% junto con diesel, flete o WTI por encima de +1.00%.',
          action: macroStress
            ? 'Revisar hedge cambiario, flete y politica de traslado en las puntas exportadoras.'
            : macroRelief
              ? 'Evaluar ventana para aliviar coberturas cortas y recomponer margen logistico.'
              : 'Mantener observacion cruzada entre FX, diesel y flete antes de mover coberturas.',
          tone: macroStress ? 'red' : macroRelief ? 'emerald' : 'amber',
        },
        {
          id: 'contract-breakout',
          tag: copy.futuresTag,
          title:
            Math.abs(biggestMover.change) >= 2
              ? `${t(biggestMover.id)} rompe rango y acelera la volatilidad`
              : `${t(biggestMover.id)} lidera el movimiento tactico del dia`,
          detail: `${biggestMover.market} marca ${biggestMover.price.toFixed(2)} ${biggestMover.unit}, con variacion de ${formatPercent(biggestMover.change)}. El contrato concentra el mayor desplazamiento intradiario de la cesta monitoreada.`,
          rule: 'Mayor contrato monitoreado con desplazamiento absoluto desde 2.00% en el dia.',
          action:
            Math.abs(biggestMover.change) >= 2
              ? 'Reevaluar hedge, spread y origen del activo antes de ampliar exposicion.'
              : 'Monitorear continuidad del movimiento antes de ajustar coberturas o compras.',
          tone: Math.abs(biggestMover.change) >= 2.5 ? 'red' : Math.abs(biggestMover.change) >= 1.25 ? 'amber' : 'blue',
        },
        {
          id: 'cereals-confirmation',
          tag: copy.flowTag,
          title: cerealsConfirmedUp
            ? `FAO y futuros confirman tension en cereales en ${latestMonth}`
            : cerealsConfirmedDown
              ? `FAO y futuros muestran alivio en cereales en ${latestMonth}`
              : `Cereales aun piden confirmacion adicional en ${latestMonth}`,
          detail: `FAO Cereales ${formatPercent(cerealsChange)}, Maiz ${formatPercent(corn?.change ?? 0)} y Trigo ${formatPercent(wheat?.change ?? 0)}. La lectura cruza referencia oficial y futuros para basis, alimento balanceado y flujo global.`,
          rule: 'FAO Cereales y el promedio de maiz y trigo deben apuntar en la misma direccion.',
          action: cerealsConfirmedUp
            ? 'Monitorear compras, basis y traslado en maiz y trigo para proteger margen.'
            : cerealsConfirmedDown
              ? 'Evaluar compras escalonadas y coberturas mas livianas si el alivio persiste.'
              : 'Esperar confirmacion del complejo de granos antes de mover el plan de cobertura.',
          tone: cerealsConfirmedUp ? 'red' : cerealsConfirmedDown ? 'emerald' : 'blue',
        },
        {
          id: 'replacement-cost',
          tag: copy.faoTag,
          title: replacementStress
            ? `${higherFaoMove.label} entra en presion de reposicion`
            : `${higherFaoMove.label} sigue sin gatillo fuerte de reposicion`,
          detail: `${higherFaoMove.label} cierra ${latestMonth} en ${higherFaoMove.value.toFixed(1)} puntos con ${formatPercent(higherFaoMove.change)}. ${correlatedContract ? `${t(correlatedContract.id)} en ${formatPercent(correlatedContract.change)}.` : ''} Oro en ${formatPercent(goldChange)} como termometro defensivo.`,
          rule: 'Subindice FAO dominante por encima de 2.00% o confirmado por contrato correlato y oro.',
          action: replacementStress
            ? 'Revisar traslado, inventario corto y cobertura de insumos o derivados correlatos.'
            : 'Seguir monitoreando costo de reposicion sin adelantar un ajuste comercial fuerte.',
          tone: replacementStress ? 'amber' : 'blue',
        },
      ] as AlertCard[];
    }

    if (activeLanguage === 'ar') {
      return [
        {
          id: 'macro-pressure',
          tag: copy.riskTag,
          title: macroStress
            ? 'الدولار والديزل والشحن يضغطون على هوامش التصدير'
            : macroRelief
              ? 'الدولار واللوجستيات يخففان تكلفة الخروج'
              : 'الضغط الكلي اللوجستي ما زال تحت المراقبة التكتيكية',
          detail: `DXY ${formatPercent(dollarChange)} و ULSD Diesel ${formatPercent(dieselChange)} و Baltic Dry ${formatPercent(freightChange)} و WTI ${formatPercent(crudeChange)}. هذا المزيج ${macroStress ? 'يرفع' : macroRelief ? 'يخفف' : 'يبقي تحت المراقبة'} تكلفة التحوط والشحن والتمرير الدولي.`,
          rule: 'ارتفاع DXY فوق +0.25% مع ارتفاع الديزل او الشحن او WTI فوق +1.00%.',
          action: macroStress
            ? 'راجع تحوط العملات وتغطية الشحن وسياسة التمرير في مسارات التصدير.'
            : macroRelief
              ? 'قيّم مساحة تخفيف التحوطات القصيرة واعادة بناء الهامش اللوجستي.'
              : 'استمر في مراقبة العملات والديزل والشحن قبل تعديل التحوطات.',
          tone: macroStress ? 'red' : macroRelief ? 'emerald' : 'amber',
        },
        {
          id: 'contract-breakout',
          tag: copy.futuresTag,
          title:
            Math.abs(biggestMover.change) >= 2
              ? `${t(biggestMover.id)} يكسر النطاق ويزيد التقلب`
              : `${t(biggestMover.id)} يقود الحركة التكتيكية اليوم`,
          detail: `${biggestMover.market} يسجل ${biggestMover.price.toFixed(2)} ${biggestMover.unit} مع تغير ${formatPercent(biggestMover.change)}. هذا العقد يملك اكبر تحرك نسبي داخل السلة المراقبة.`,
          rule: 'اكبر عقد مراقب يتحرك بمقدار مطلق لا يقل عن 2.00% خلال اليوم.',
          action:
            Math.abs(biggestMover.change) >= 2
              ? 'اعد تقييم التحوطات والفوارق والتعرض لمصدر الاصل قبل زيادة المخاطر.'
              : 'راقب استمرارية الحركة قبل تعديل التغطيات او المشتريات.',
          tone: Math.abs(biggestMover.change) >= 2.5 ? 'red' : Math.abs(biggestMover.change) >= 1.25 ? 'amber' : 'blue',
        },
        {
          id: 'cereals-confirmation',
          tag: copy.flowTag,
          title: cerealsConfirmedUp
            ? `FAO والعقود المستقبلية يؤكدان ضغط الحبوب في ${latestMonth}`
            : cerealsConfirmedDown
              ? `FAO والعقود المستقبلية يشيران الى هدوء في الحبوب خلال ${latestMonth}`
              : `الحبوب ما زالت تحتاج الى تأكيد اضافي في ${latestMonth}`,
          detail: `FAO Cereals ${formatPercent(cerealsChange)} والذرة ${formatPercent(corn?.change ?? 0)} والقمح ${formatPercent(wheat?.change ?? 0)}. هذه القراءة تجمع بين المرجع الرسمي والعقود المستقبلية لفهم الـ basis والاعلاف والتدفق العالمي.`,
          rule: 'يجب ان يتحرك FAO Cereals ومتوسط الذرة والقمح في الاتجاه نفسه.',
          action: cerealsConfirmedUp
            ? 'راقب المشتريات والـ basis والتمرير في الذرة والقمح لحماية الهامش.'
            : cerealsConfirmedDown
              ? 'قيّم الشراء المتدرج وتغطية اخف اذا استمر الهدوء.'
              : 'انتظر تأكيد مجمع الحبوب قبل تغيير خطة التحوط.',
          tone: cerealsConfirmedUp ? 'red' : cerealsConfirmedDown ? 'emerald' : 'blue',
        },
        {
          id: 'replacement-cost',
          tag: copy.faoTag,
          title: replacementStress
            ? `${higherFaoMove.label} يدخل في ضغط تكلفة الاستبدال`
            : `${higherFaoMove.label} ما زال بلا محفز قوي للاستبدال`,
          detail: `${higherFaoMove.label} يغلق ${latestMonth} عند ${higherFaoMove.value.toFixed(1)} نقطة مع ${formatPercent(higherFaoMove.change)}. ${correlatedContract ? `${t(correlatedContract.id)} عند ${formatPercent(correlatedContract.change)}.` : ''} والذهب عند ${formatPercent(goldChange)} كمقياس دفاعي.`,
          rule: 'صعود المؤشر الفرعي القيادي في FAO فوق 2.00% او تأكيده بواسطة العقد المرتبط والذهب.',
          action: replacementStress
            ? 'راجع التمرير والمخزون القصير وتغطية المدخلات او المشتقات المرتبطة.'
            : 'استمر في مراقبة تكلفة الاستبدال دون فرض تعديل تجاري قوي.',
          tone: replacementStress ? 'amber' : 'blue',
        },
      ] as AlertCard[];
    }

    if (activeLanguage === 'zh') {
      return [
        {
          id: 'macro-pressure',
          tag: copy.riskTag,
          title: macroStress
            ? '美元、柴油与运费正在压缩出口利润'
            : macroRelief
              ? '美元与物流正在缓解外运成本'
              : '宏观物流压力仍处于战术观察中',
          detail: `DXY ${formatPercent(dollarChange)}、ULSD Diesel ${formatPercent(dieselChange)}、Baltic Dry ${formatPercent(freightChange)} 和 WTI ${formatPercent(crudeChange)}。这一组合${macroStress ? '正在抬高' : macroRelief ? '正在缓解' : '继续维持观察'}套保、运费与价格传导成本。`,
          rule: '当 DXY 高于 +0.25%，且柴油、运费或 WTI 中任一项高于 +1.00% 时触发。',
          action: macroStress
            ? '检查外汇套保、运费覆盖和出口链路上的价格传导策略。'
            : macroRelief
              ? '评估减轻短期套保并重建物流利润空间的窗口。'
              : '在重新布局套保前继续交叉监控汇率、柴油和运费。',
          tone: macroStress ? 'red' : macroRelief ? 'emerald' : 'amber',
        },
        {
          id: 'contract-breakout',
          tag: copy.futuresTag,
          title:
            Math.abs(biggestMover.change) >= 2
              ? `${t(biggestMover.id)} 突破区间并加剧波动`
              : `${t(biggestMover.id)} 领涨今日战术性波动`,
          detail: `${biggestMover.market} 报 ${biggestMover.price.toFixed(2)} ${biggestMover.unit}，变动 ${formatPercent(biggestMover.change)}。该合约是当前监控篮子中日内位移最大的品种。`,
          rule: '当日监控合约中绝对涨跌幅达到 2.00% 及以上时触发。',
          action:
            Math.abs(biggestMover.change) >= 2
              ? '在扩大风险敞口前重新评估套保、价差和原产地暴露。'
              : '在调整覆盖或采购前先观察走势是否延续。',
          tone: Math.abs(biggestMover.change) >= 2.5 ? 'red' : Math.abs(biggestMover.change) >= 1.25 ? 'amber' : 'blue',
        },
        {
          id: 'cereals-confirmation',
          tag: copy.flowTag,
          title: cerealsConfirmedUp
            ? `FAO 与期货在 ${latestMonth} 确认谷物压力`
            : cerealsConfirmedDown
              ? `FAO 与期货在 ${latestMonth} 指向谷物缓和`
              : `${latestMonth} 的谷物信号仍需更多确认`,
          detail: `FAO Cereals ${formatPercent(cerealsChange)}、Corn ${formatPercent(corn?.change ?? 0)}、Wheat ${formatPercent(wheat?.change ?? 0)}。该读数把官方参考与期货结合，用于判断 basis、饲料与全球流向。`,
          rule: 'FAO Cereals 与玉米、小麦平均值必须指向同一方向。',
          action: cerealsConfirmedUp
            ? '关注玉米和小麦的采购、basis 与价格传导，以保护利润。'
            : cerealsConfirmedDown
              ? '若缓和延续，可评估分批采购和更轻的覆盖策略。'
              : '在谷物复合体确认之前，不要急于调整套保计划。',
          tone: cerealsConfirmedUp ? 'red' : cerealsConfirmedDown ? 'emerald' : 'blue',
        },
        {
          id: 'replacement-cost',
          tag: copy.faoTag,
          title: replacementStress
            ? `${higherFaoMove.label} 进入替代成本压力区`
            : `${higherFaoMove.label} 仍缺少强替代触发`,
          detail: `${higherFaoMove.label} 在 ${latestMonth} 收于 ${higherFaoMove.value.toFixed(1)} 点，变动 ${formatPercent(higherFaoMove.change)}。${correlatedContract ? `${t(correlatedContract.id)} 变动 ${formatPercent(correlatedContract.change)}。` : ''}黄金 ${formatPercent(goldChange)}，作为防御情绪温度计。`,
          rule: '当领先的 FAO 子指数高于 2.00%，或被相关合约与黄金共同确认时触发。',
          action: replacementStress
            ? '检查价格传导、短库存以及相关投入品或衍生品的覆盖。'
            : '继续监控替代成本，无需强行做出激进商业调整。',
          tone: replacementStress ? 'amber' : 'blue',
        },
      ] as AlertCard[];
    }

    return [
      {
        id: 'macro-pressure',
        tag: copy.riskTag,
        title: macroStress
          ? 'Dollar, diesel and freight are compressing export margins'
          : macroRelief
            ? 'Dollar and logistics are easing outbound costs'
            : 'Macro logistics pressure remains on tactical watch',
        detail: `DXY ${formatPercent(dollarChange)}, ULSD Diesel ${formatPercent(dieselChange)}, Baltic Dry ${formatPercent(freightChange)} and WTI ${formatPercent(crudeChange)}. The mix ${macroStress ? 'raises' : macroRelief ? 'eases' : 'keeps under watch'} hedging, freight and pass-through costs.`,
        rule: 'DXY above +0.25% together with diesel, freight or WTI above +1.00%.',
        action: macroStress
          ? 'Review FX hedges, freight cover and pass-through policy on export lanes.'
          : macroRelief
            ? 'Assess room to lighten short hedges and rebuild logistics margin.'
            : 'Keep monitoring FX, diesel and freight before repositioning hedges.',
        tone: macroStress ? 'red' : macroRelief ? 'emerald' : 'amber',
      },
      {
        id: 'contract-breakout',
        tag: copy.futuresTag,
        title:
          Math.abs(biggestMover.change) >= 2
            ? `${t(biggestMover.id)} breaks range and accelerates volatility`
            : `${t(biggestMover.id)} leads the tactical move of the session`,
        detail: `${biggestMover.market} prints ${biggestMover.price.toFixed(2)} ${biggestMover.unit}, moving ${formatPercent(biggestMover.change)}. The contract holds the sharpest intraday displacement in the monitored basket.`,
        rule: 'Largest monitored contract moving by an absolute 2.00% or more on the day.',
        action:
          Math.abs(biggestMover.change) >= 2
            ? 'Reassess hedges, spreads and origin exposure before adding risk.'
            : 'Monitor follow-through before adjusting covers or purchases.',
        tone: Math.abs(biggestMover.change) >= 2.5 ? 'red' : Math.abs(biggestMover.change) >= 1.25 ? 'amber' : 'blue',
      },
      {
        id: 'cereals-confirmation',
        tag: copy.flowTag,
        title: cerealsConfirmedUp
          ? `FAO and futures confirm cereals stress in ${latestMonth}`
          : cerealsConfirmedDown
            ? `FAO and futures point to cereals relief in ${latestMonth}`
            : `Cereals still need extra confirmation in ${latestMonth}`,
        detail: `FAO Cereals ${formatPercent(cerealsChange)}, Corn ${formatPercent(corn?.change ?? 0)} and Wheat ${formatPercent(wheat?.change ?? 0)}. The read combines official reference and futures for basis, feed and global flow.`,
        rule: 'FAO Cereals and the average of corn and wheat need to point in the same direction.',
        action: cerealsConfirmedUp
          ? 'Monitor purchases, basis and pass-through in corn and wheat to protect margin.'
          : cerealsConfirmedDown
            ? 'Assess staggered buying and lighter cover if relief persists.'
            : 'Wait for confirmation from the grain complex before changing the hedge plan.',
        tone: cerealsConfirmedUp ? 'red' : cerealsConfirmedDown ? 'emerald' : 'blue',
      },
      {
        id: 'replacement-cost',
        tag: copy.faoTag,
        title: replacementStress
          ? `${higherFaoMove.label} moves into replacement-cost pressure`
          : `${higherFaoMove.label} still lacks a strong replacement trigger`,
        detail: `${higherFaoMove.label} closes ${latestMonth} at ${higherFaoMove.value.toFixed(1)} points with ${formatPercent(higherFaoMove.change)}. ${correlatedContract ? `${t(correlatedContract.id)} at ${formatPercent(correlatedContract.change)}.` : ''} Gold at ${formatPercent(goldChange)} as the defensive thermometer.`,
        rule: 'Leading FAO sub-index above 2.00% or confirmed by the correlated contract and gold.',
        action: replacementStress
          ? 'Review pass-through, short inventory and cover on correlated inputs or derivatives.'
          : 'Keep monitoring replacement costs without forcing an aggressive commercial adjustment.',
        tone: replacementStress ? 'amber' : 'blue',
      },
    ] as AlertCard[];
  }, [activeLanguage, commodities, copy, faoData, language, macroDrivers, t]);

  const deskUpdatedAt = useMemo(() => {
    const timestamps = [commoditiesUpdatedAt, macroUpdatedAt, faoData?.updatedAt].filter(Boolean) as string[];
    if (timestamps.length === 0) {
      return new Date().toISOString();
    }

    return timestamps.sort().reverse()[0];
  }, [commoditiesUpdatedAt, faoData?.updatedAt, macroUpdatedAt]);

  const sourcesLabel = useMemo(
    () => buildSourcesLabel(commoditiesSource, macroSource, language as SupportedLanguage),
    [commoditiesSource, language, macroSource]
  );

  return (
    <section id="alertas-mercado" className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] py-24 text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.08),_transparent_24%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm">
              <Radar className="w-3.5 h-3.5" />
              {copy.eyebrow}
            </div>
            <h2 className="mb-3 text-3xl font-bold tracking-[-0.02em] text-slate-900 md:text-4xl">{copy.title}</h2>
            <p className="max-w-3xl text-[1.02rem] leading-8 text-slate-600">{copy.subtitle}</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
              <AlertTriangle className="h-3.5 w-3.5" />
              {copy.deskNote}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
            {copy.lastUpdate}:{' '}
            {formatDateTime(new Date(deskUpdatedAt), language as SupportedLanguage)}
          </div>
        </div>

        {(commoditiesSource === 'fallback' || macroSource === 'fallback') && (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700">
            <ShieldAlert className="w-4 h-4" />
            {copy.fallback}
          </div>
        )}

        {loading && alerts.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">{copy.loading}</div>
        ) : (
          <div className="space-y-5">
            {alerts[0] && (
              <article className="flex min-h-[320px] flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_10px_35px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_20px_45px_rgba(15,23,42,0.08)] md:p-7">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${toneClasses(alerts[0].tone)}`}>
                    {alerts[0].tag}
                  </span>
                  <span className="text-slate-400">
                    {alerts[0].tone === 'emerald' ? <ArrowUpRight className="w-5 h-5" /> : alerts[0].tone === 'red' ? <AlertTriangle className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </span>
                </div>
                <div className="flex flex-1 flex-col">
                  <h3 className="mb-3.5 max-w-xl text-[1.7rem] font-semibold leading-tight text-slate-900">
                    {alerts[0].title}
                  </h3>
                  <p className="max-w-2xl text-[15px] leading-7 text-slate-600">
                    {alerts[0].detail}
                  </p>
                  <div className="mt-6 grid gap-4 border-t border-slate-200 pt-5 md:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{copy.ruleLabel}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{alerts[0].rule}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{copy.actionLabel}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-900">{alerts[0].action}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-200 pt-5 text-xs text-slate-500">
                  {sourcesLabel}
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-500">
                    01
                  </span>
                </div>
              </article>
            )}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {alerts.slice(1).map((alert, index) => (
                <article
                  key={alert.id}
                  className="flex min-h-[320px] h-full flex-col rounded-[2rem] border border-slate-200 bg-white p-6 md:p-7 shadow-[0_10px_35px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_20px_45px_rgba(15,23,42,0.08)]"
                >
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${toneClasses(alert.tone)}`}>
                      {alert.tag}
                    </span>
                    <span className="text-slate-400">
                      {alert.tone === 'emerald' ? <ArrowUpRight className="w-5 h-5" /> : alert.tone === 'red' ? <AlertTriangle className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <h3 className="mb-3.5 min-h-[4.75rem] text-[1.08rem] font-semibold leading-tight text-slate-900">
                      {alert.title}
                    </h3>
                    <p className="text-sm leading-7 text-slate-600">
                      {alert.detail}
                    </p>
                    <div className="mt-5 space-y-4 border-t border-slate-200 pt-5">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{copy.ruleLabel}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{alert.rule}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{copy.actionLabel}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-900">{alert.action}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-200 pt-5 text-xs text-slate-500">
                    {sourcesLabel}
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-500">
                      0{index + 2}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            {commodities.length > 0 && (
              <AgroExportRichMap
                commodities={commodities}
                faoData={faoData}
                language={language as SupportedLanguage}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
