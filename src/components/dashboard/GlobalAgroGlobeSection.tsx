'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import Highcharts from 'highcharts/highmaps';
import {
  Activity,
  ArrowUpRight,
  CloudSun,
  DatabaseZap,
  Globe2,
  Leaf,
  Ship,
  TimerReset,
} from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { getFreshnessLabel, getFreshnessTone, type FreshnessStatus } from '@/lib/dataFreshness';
import { formatDateTime, type SupportedLanguage } from '@/lib/marketTime';
import { getSourceLabel } from '@/lib/marketOverview';

const HighchartsReact = dynamic(() => import('highcharts-react-official'), { ssr: false });

type CommodityKey = 'all' | 'soybeans' | 'corn' | 'wheat' | 'coffee' | 'sugar';
type OverallStatus = 'healthy' | 'warning' | 'critical';

type CountryPoint = {
  code3: string;
  country: string;
  score: number;
  tradePower: number;
  supplyStress: number;
  climateRisk: number;
  logisticsRisk: number;
  focus: string;
};

type GlobeSignal = {
  commodityChange: number;
  faoChange: number;
  energyPressure: number;
  dollarPressure: number;
  riskOffPressure: number;
};

type DataSourceInfo = {
  source: string;
  updatedAt: string;
  freshnessStatus: FreshnessStatus;
  liveMode?: 'primary' | 'secondary' | 'tertiary' | 'backup';
};

type AgroGlobeResponse = {
  generatedAt: string;
  overallStatus: OverallStatus;
  baskets: Record<CommodityKey, CountryPoint[]>;
  signals: Record<CommodityKey, GlobeSignal>;
  dataSources: {
    commodities: DataSourceInfo;
    macro: DataSourceInfo;
    fao: DataSourceInfo;
  };
};

type Copy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  scoreLabel: string;
  countriesLabel: string;
  tooltipScore: string;
  tooltipTrade: string;
  tooltipSupply: string;
  tooltipClimate: string;
  tooltipLogistics: string;
  loading: string;
  error: string;
  dragHint: string;
  topListTitle: string;
  detailTitle: string;
  exposureTitle: string;
  tradePower: string;
  supplyStress: string;
  climateRisk: string;
  logisticsRisk: string;
  basketLabel: string;
  focusLabel: string;
  deskNote: string;
  summary: string;
  leaderLabel: string;
  coverageLabel: string;
  averageLabel: string;
  empty: string;
  scoreBadge: string;
  pipelineBadge: string;
  pipelineHealthy: string;
  pipelineWarning: string;
  pipelineCritical: string;
  signalTitle: string;
  sourcesTitle: string;
  sourceLabel: string;
  freshnessLabel: string;
  updatedLabel: string;
  commodityPulse: string;
  faoPulse: string;
  energyPulse: string;
  dollarPulse: string;
  riskPulse: string;
  liveModeLabel: string;
  commoditiesLabel: string;
  macroLabel: string;
  faoLabel: string;
  commodities: Record<CommodityKey, string>;
};

const COPY_MAP: Record<SupportedLanguage, Copy> = {
  pt: {
    eyebrow: 'Global Agro Pulse',
    title: 'Globe Agro com Motor Real da Pipeline',
    subtitle:
      'O mapa usa sinais reais de commodities, macro e FAO para recalibrar a pressao por cesta. A camada geografica continua estrategica, mas o motor de leitura agora vem da pipeline live.',
    scoreLabel: 'Score composto',
    countriesLabel: 'paises monitorados',
    tooltipScore: 'Score',
    tooltipTrade: 'Forca exportadora',
    tooltipSupply: 'Estresse de oferta',
    tooltipClimate: 'Risco climatico',
    tooltipLogistics: 'Risco logistico',
    loading: 'Carregando globe agro...',
    error: 'Nao foi possivel carregar o globe agro agora.',
    dragHint: 'Arraste o globe para girar e clique em um pais para abrir a leitura lateral.',
    topListTitle: 'Paises lideres nesta leitura',
    detailTitle: 'Leitura executiva do pais',
    exposureTitle: 'Exposicao do score',
    tradePower: 'Forca exportadora',
    supplyStress: 'Estresse de oferta',
    climateRisk: 'Risco climatico',
    logisticsRisk: 'Risco logistico',
    basketLabel: 'Cesta',
    focusLabel: 'Foco',
    deskNote:
      'Camada geografica parametrizada + sinais reais da pipeline de commodities, macro e FAO. O proximo passo natural e trocar a exposicao estatica por datasets geograficos proprietarios.',
    summary: 'Score combina poder de comercio com pressao real de futuros, FAO, energia, dolar e risco defensivo.',
    leaderLabel: 'Lider',
    coverageLabel: 'Cobertura',
    averageLabel: 'Media',
    empty: 'Nenhum pais disponivel para esta cesta.',
    scoreBadge: 'Score composto',
    pipelineBadge: 'Pipeline real',
    pipelineHealthy: 'Pipeline saudavel',
    pipelineWarning: 'Pipeline em atencao',
    pipelineCritical: 'Pipeline degradada',
    signalTitle: 'Sinais reais da cesta',
    sourcesTitle: 'Motor de dados',
    sourceLabel: 'Fonte',
    freshnessLabel: 'Status',
    updatedLabel: 'Atualizacao',
    commodityPulse: 'Pulso da commodity',
    faoPulse: 'Pulso do FAO',
    energyPulse: 'Pressao de energia',
    dollarPulse: 'Pressao do dolar',
    riskPulse: 'Pressao defensiva',
    liveModeLabel: 'Modo',
    commoditiesLabel: 'Commodities',
    macroLabel: 'Macro',
    faoLabel: 'FAO',
    commodities: {
      all: 'Cesta global',
      soybeans: 'Soja',
      corn: 'Milho',
      wheat: 'Trigo',
      coffee: 'Cafe',
      sugar: 'Acucar',
    },
  },
  en: {
    eyebrow: 'Global Agro Pulse',
    title: 'Agro Globe Powered by Live Pipeline',
    subtitle:
      'The map now uses real commodity, macro and FAO signals to recalibrate pressure by basket. Geography remains strategic, but the reading engine is now powered by the live pipeline.',
    scoreLabel: 'Composite score',
    countriesLabel: 'countries monitored',
    tooltipScore: 'Score',
    tooltipTrade: 'Trade power',
    tooltipSupply: 'Supply stress',
    tooltipClimate: 'Climate risk',
    tooltipLogistics: 'Logistics risk',
    loading: 'Loading agro globe...',
    error: 'Unable to load the agro globe right now.',
    dragHint: 'Drag the globe to rotate and click a country to open the side briefing.',
    topListTitle: 'Leading countries in this read',
    detailTitle: 'Country executive read',
    exposureTitle: 'Score exposure',
    tradePower: 'Trade power',
    supplyStress: 'Supply stress',
    climateRisk: 'Climate risk',
    logisticsRisk: 'Logistics risk',
    basketLabel: 'Basket',
    focusLabel: 'Focus',
    deskNote:
      'Parameterized geography + real pipeline signals from commodities, macro and FAO. The natural next step is replacing the static exposure layer with proprietary geographic datasets.',
    summary: 'Score blends trade power with live futures pressure, FAO, energy, dollar and defensive risk.',
    leaderLabel: 'Leader',
    coverageLabel: 'Coverage',
    averageLabel: 'Average',
    empty: 'No countries available for this basket.',
    scoreBadge: 'Composite score',
    pipelineBadge: 'Live pipeline',
    pipelineHealthy: 'Pipeline healthy',
    pipelineWarning: 'Pipeline warning',
    pipelineCritical: 'Pipeline degraded',
    signalTitle: 'Live basket signals',
    sourcesTitle: 'Data engine',
    sourceLabel: 'Source',
    freshnessLabel: 'Status',
    updatedLabel: 'Updated',
    commodityPulse: 'Commodity pulse',
    faoPulse: 'FAO pulse',
    energyPulse: 'Energy pressure',
    dollarPulse: 'Dollar pressure',
    riskPulse: 'Defensive pressure',
    liveModeLabel: 'Mode',
    commoditiesLabel: 'Commodities',
    macroLabel: 'Macro',
    faoLabel: 'FAO',
    commodities: {
      all: 'Global basket',
      soybeans: 'Soybeans',
      corn: 'Corn',
      wheat: 'Wheat',
      coffee: 'Coffee',
      sugar: 'Sugar',
    },
  },
  es: {
    eyebrow: 'Global Agro Pulse',
    title: 'Globo Agro con Motor Real de la Pipeline',
    subtitle:
      'El mapa ahora usa senales reales de commodities, macro y FAO para recalibrar la presion por canasta. La capa geografica sigue siendo estrategica, pero el motor de lectura ya viene de la pipeline live.',
    scoreLabel: 'Score compuesto',
    countriesLabel: 'paises monitorizados',
    tooltipScore: 'Score',
    tooltipTrade: 'Fuerza exportadora',
    tooltipSupply: 'Tension de oferta',
    tooltipClimate: 'Riesgo climatico',
    tooltipLogistics: 'Riesgo logistico',
    loading: 'Cargando globo agro...',
    error: 'No fue posible cargar el globo agro ahora.',
    dragHint: 'Arrastra el globo para girarlo y haz clic en un pais para abrir la lectura lateral.',
    topListTitle: 'Paises lideres en esta lectura',
    detailTitle: 'Lectura ejecutiva del pais',
    exposureTitle: 'Exposicion del score',
    tradePower: 'Fuerza exportadora',
    supplyStress: 'Tension de oferta',
    climateRisk: 'Riesgo climatico',
    logisticsRisk: 'Riesgo logistico',
    basketLabel: 'Canasta',
    focusLabel: 'Foco',
    deskNote:
      'Geografia parametrizada + senales reales de la pipeline de commodities, macro y FAO. El siguiente paso natural es cambiar la exposicion estatica por datasets geograficos propios.',
    summary: 'El score combina poder comercial con presion real de futuros, FAO, energia, dolar y riesgo defensivo.',
    leaderLabel: 'Lider',
    coverageLabel: 'Cobertura',
    averageLabel: 'Media',
    empty: 'No hay paises disponibles para esta canasta.',
    scoreBadge: 'Score compuesto',
    pipelineBadge: 'Pipeline real',
    pipelineHealthy: 'Pipeline saludable',
    pipelineWarning: 'Pipeline en atencion',
    pipelineCritical: 'Pipeline degradada',
    signalTitle: 'Senales reales de la canasta',
    sourcesTitle: 'Motor de datos',
    sourceLabel: 'Fuente',
    freshnessLabel: 'Estado',
    updatedLabel: 'Actualizacion',
    commodityPulse: 'Pulso de la commodity',
    faoPulse: 'Pulso del FAO',
    energyPulse: 'Presion de energia',
    dollarPulse: 'Presion del dolar',
    riskPulse: 'Presion defensiva',
    liveModeLabel: 'Modo',
    commoditiesLabel: 'Commodities',
    macroLabel: 'Macro',
    faoLabel: 'FAO',
    commodities: {
      all: 'Canasta global',
      soybeans: 'Soja',
      corn: 'Maiz',
      wheat: 'Trigo',
      coffee: 'Cafe',
      sugar: 'Azucar',
    },
  },
  ru: {
    eyebrow: 'Global Agro Pulse',
    title: 'Agro Globe Powered by Live Pipeline',
    subtitle:
      'The map now uses real commodity, macro and FAO signals to recalibrate pressure by basket.',
    scoreLabel: 'Composite score',
    countriesLabel: 'countries monitored',
    tooltipScore: 'Score',
    tooltipTrade: 'Trade power',
    tooltipSupply: 'Supply stress',
    tooltipClimate: 'Climate risk',
    tooltipLogistics: 'Logistics risk',
    loading: 'Loading agro globe...',
    error: 'Unable to load the agro globe right now.',
    dragHint: 'Drag the globe to rotate and click a country to open the side briefing.',
    topListTitle: 'Leading countries in this read',
    detailTitle: 'Country executive read',
    exposureTitle: 'Score exposure',
    tradePower: 'Trade power',
    supplyStress: 'Supply stress',
    climateRisk: 'Climate risk',
    logisticsRisk: 'Logistics risk',
    basketLabel: 'Basket',
    focusLabel: 'Focus',
    deskNote: 'Parameterized geography + real pipeline signals from commodities, macro and FAO.',
    summary: 'Score blends trade power with live futures pressure, FAO, energy, dollar and defensive risk.',
    leaderLabel: 'Leader',
    coverageLabel: 'Coverage',
    averageLabel: 'Average',
    empty: 'No countries available for this basket.',
    scoreBadge: 'Composite score',
    pipelineBadge: 'Live pipeline',
    pipelineHealthy: 'Pipeline healthy',
    pipelineWarning: 'Pipeline warning',
    pipelineCritical: 'Pipeline degraded',
    signalTitle: 'Live basket signals',
    sourcesTitle: 'Data engine',
    sourceLabel: 'Source',
    freshnessLabel: 'Status',
    updatedLabel: 'Updated',
    commodityPulse: 'Commodity pulse',
    faoPulse: 'FAO pulse',
    energyPulse: 'Energy pressure',
    dollarPulse: 'Dollar pressure',
    riskPulse: 'Defensive pressure',
    liveModeLabel: 'Mode',
    commoditiesLabel: 'Commodities',
    macroLabel: 'Macro',
    faoLabel: 'FAO',
    commodities: {
      all: 'Global basket',
      soybeans: 'Soybeans',
      corn: 'Corn',
      wheat: 'Wheat',
      coffee: 'Coffee',
      sugar: 'Sugar',
    },
  },
  ar: {
    eyebrow: 'نبض الزراعة العالمي',
    title: 'الكرة الزراعية بمحرك حقيقي من الـ pipeline',
    subtitle:
      'الخريطة تستخدم الان اشارات حقيقية من السلع والعوامل الكلية و FAO لاعادة معايرة الضغط حسب السلة. الجغرافيا ما زالت استراتيجية لكن محرك القراءة اصبح من الـ pipeline الحية.',
    scoreLabel: 'الدرجة المركبة',
    countriesLabel: 'دولة مراقبة',
    tooltipScore: 'الدرجة',
    tooltipTrade: 'القوة التصديرية',
    tooltipSupply: 'ضغط العرض',
    tooltipClimate: 'المخاطر المناخية',
    tooltipLogistics: 'المخاطر اللوجستية',
    loading: 'جار تحميل الكرة الزراعية...',
    error: 'تعذر تحميل الكرة الزراعية حاليا.',
    dragHint: 'اسحب الكرة لتدويرها واضغط على الدولة لفتح القراءة الجانبية.',
    topListTitle: 'الدول القيادية في هذه القراءة',
    detailTitle: 'قراءة تنفيذية للدولة',
    exposureTitle: 'توزيع الدرجة',
    tradePower: 'القوة التصديرية',
    supplyStress: 'ضغط العرض',
    climateRisk: 'المخاطر المناخية',
    logisticsRisk: 'المخاطر اللوجستية',
    basketLabel: 'السلة',
    focusLabel: 'التركيز',
    deskNote:
      'طبقة جغرافية معيارية + اشارات حقيقية من pipeline السلع والعوامل الكلية و FAO. الخطوة التالية الطبيعية هي استبدال طبقة التعرض الثابتة ببيانات جغرافية خاصة.',
    summary: 'الدرجة تجمع القوة التجارية مع ضغط العقود الحية و FAO والطاقة والدولار والمخاطر الدفاعية.',
    leaderLabel: 'المتصدر',
    coverageLabel: 'التغطية',
    averageLabel: 'المتوسط',
    empty: 'لا توجد دول متاحة لهذه السلة.',
    scoreBadge: 'الدرجة المركبة',
    pipelineBadge: 'تدفق حي',
    pipelineHealthy: 'التدفق سليم',
    pipelineWarning: 'التدفق تحت المراقبة',
    pipelineCritical: 'التدفق متدهور',
    signalTitle: 'اشارات السلة الحية',
    sourcesTitle: 'محرك البيانات',
    sourceLabel: 'المصدر',
    freshnessLabel: 'الحالة',
    updatedLabel: 'التحديث',
    commodityPulse: 'نبض السلعة',
    faoPulse: 'نبض FAO',
    energyPulse: 'ضغط الطاقة',
    dollarPulse: 'ضغط الدولار',
    riskPulse: 'الضغط الدفاعي',
    liveModeLabel: 'الوضع',
    commoditiesLabel: 'السلع',
    macroLabel: 'العوامل الكلية',
    faoLabel: 'FAO',
    commodities: {
      all: 'السلة العالمية',
      soybeans: 'فول الصويا',
      corn: 'الذرة',
      wheat: 'القمح',
      coffee: 'القهوة',
      sugar: 'السكر',
    },
  },
  zh: {
    eyebrow: '全球农业脉冲',
    title: '由实时 pipeline 驱动的农业地球仪',
    subtitle:
      '该地图现在使用真实的商品、宏观和 FAO 信号来重新校准每个篮子的压力。地理层仍是战略参数，但读取引擎已经来自实时 pipeline。',
    scoreLabel: '综合评分',
    countriesLabel: '个监控国家',
    tooltipScore: '评分',
    tooltipTrade: '出口力量',
    tooltipSupply: '供应压力',
    tooltipClimate: '气候风险',
    tooltipLogistics: '物流风险',
    loading: '正在加载农业地球仪...',
    error: '暂时无法加载农业地球仪。',
    dragHint: '拖动地球仪可旋转，点击国家可打开侧边简报。',
    topListTitle: '本次读数的领先国家',
    detailTitle: '国家执行摘要',
    exposureTitle: '评分暴露',
    tradePower: '出口力量',
    supplyStress: '供应压力',
    climateRisk: '气候风险',
    logisticsRisk: '物流风险',
    basketLabel: '篮子',
    focusLabel: '焦点',
    deskNote:
      '参数化地理层 + 来自商品、宏观和 FAO 的真实 pipeline 信号。下一步自然是用专有地理数据替换静态暴露层。',
    summary: '评分结合了贸易力量以及来自期货、FAO、能源、美元和避险情绪的真实压力。',
    leaderLabel: '领先者',
    coverageLabel: '覆盖',
    averageLabel: '平均值',
    empty: '该篮子没有可用国家。',
    scoreBadge: '综合评分',
    pipelineBadge: '实时数据流',
    pipelineHealthy: '数据流健康',
    pipelineWarning: '数据流需关注',
    pipelineCritical: '数据流已降级',
    signalTitle: '篮子实时信号',
    sourcesTitle: '数据引擎',
    sourceLabel: '来源',
    freshnessLabel: '状态',
    updatedLabel: '更新时间',
    commodityPulse: '商品脉冲',
    faoPulse: 'FAO 脉冲',
    energyPulse: '能源压力',
    dollarPulse: '美元压力',
    riskPulse: '防御压力',
    liveModeLabel: '模式',
    commoditiesLabel: '大宗商品',
    macroLabel: '宏观',
    faoLabel: 'FAO',
    commodities: {
      all: '全球篮子',
      soybeans: '大豆',
      corn: '玉米',
      wheat: '小麦',
      coffee: '咖啡',
      sugar: '糖',
    },
  },
};

const COMMODITY_ORDER: CommodityKey[] = ['all', 'soybeans', 'corn', 'wheat', 'coffee', 'sugar'];

function scoreTone(score: number) {
  if (score >= 85) return 'text-emerald-400';
  if (score >= 70) return 'text-amber-300';
  return 'text-sky-300';
}

function signalTone(value: number) {
  if (value >= 70) return 'text-emerald-300';
  if (value >= 55) return 'text-amber-300';
  return 'text-slate-300';
}

function formatSignedPercent(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

function getOverallStatusLabel(copy: Copy, status: OverallStatus) {
  switch (status) {
    case 'healthy':
      return copy.pipelineHealthy;
    case 'warning':
      return copy.pipelineWarning;
    default:
      return copy.pipelineCritical;
  }
}

function getOverallStatusClasses(status: OverallStatus) {
  switch (status) {
    case 'healthy':
      return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200';
    case 'warning':
      return 'border-amber-400/30 bg-amber-400/10 text-amber-200';
    default:
      return 'border-red-400/30 bg-red-400/10 text-red-200';
  }
}

function getSummary(language: SupportedLanguage, copy: Copy, commodityLabel: string, country: CountryPoint, signal: GlobeSignal) {
  if (language === 'ar') {
    return `${country.country} يسجل ${copy.scoreLabel} عند ${country.score} ضمن ${commodityLabel}، مع ${formatSignedPercent(signal.commodityChange)} في السلعة و${formatSignedPercent(signal.faoChange)} في FAO وضغط لوجستي حالي داخل السلة.`;
  }

  if (language === 'zh') {
    return `${country.country} 在 ${commodityLabel} 中的${copy.scoreLabel}为 ${country.score}，同时商品变动为 ${formatSignedPercent(signal.commodityChange)}，FAO 变动为 ${formatSignedPercent(signal.faoChange)}，并承受该篮子的当前物流压力。`;
  }

  if (language === 'es') {
    return `${country.country} concentra ${copy.scoreLabel.toLowerCase()} ${country.score} en ${commodityLabel.toLowerCase()}, combinado con ${formatSignedPercent(signal.commodityChange)} en la commodity, ${formatSignedPercent(signal.faoChange)} en el FAO y la presion logistica actual de la canasta.`;
  }

  if (language === 'en' || language === 'ru') {
    return `${country.country} posts a ${copy.scoreLabel.toLowerCase()} of ${country.score} in ${commodityLabel.toLowerCase()}, combined with ${formatSignedPercent(signal.commodityChange)} in the commodity, ${formatSignedPercent(signal.faoChange)} in FAO and the basket's current logistics pressure.`;
  }

  return `${country.country} concentra ${copy.scoreLabel.toLowerCase()} ${country.score} em ${commodityLabel.toLowerCase()}, combinado a ${formatSignedPercent(signal.commodityChange)} na commodity, ${formatSignedPercent(signal.faoChange)} no FAO e pressao logistica atual da cesta.`;
}

export function GlobalAgroGlobeSection() {
  const { language } = useTranslation();
  const activeLanguage = (['pt', 'en', 'es', 'ru', 'ar', 'zh'].includes(language) ? language : 'en') as SupportedLanguage;
  const copy = COPY_MAP[activeLanguage];
  const [activeCommodity, setActiveCommodity] = useState<CommodityKey>('all');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('BRA');
  const [worldMap, setWorldMap] = useState<any | null>(null);
  const [payload, setPayload] = useState<AgroGlobeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadMap() {
      try {
        const response = await fetch('https://code.highcharts.com/mapdata/custom/world.topo.json');
        const topology = await response.json();
        if (!cancelled) {
          setWorldMap(topology);
        }
      } catch (error) {
        console.error('Unable to load world topojson:', error);
      }
    }

    loadMap();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadGlobeData() {
      try {
        const response = await fetch('/api/agro-globe');
        if (!response.ok) {
          throw new Error(`Unable to fetch agro globe payload (${response.status})`);
        }

        const data = (await response.json()) as AgroGlobeResponse;
        if (!cancelled) {
          setPayload(data);
          setLoadError(false);
        }
      } catch (error) {
        console.error('Unable to load agro globe payload:', error);
        if (!cancelled) {
          setLoadError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadGlobeData();
    const interval = setInterval(loadGlobeData, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const dataset = useMemo(() => payload?.baskets[activeCommodity] ?? [], [payload, activeCommodity]);
  const signal = payload?.signals[activeCommodity] ?? null;

  useEffect(() => {
    if (!dataset.some((item) => item.code3 === selectedCountryCode) && dataset[0]) {
      setSelectedCountryCode(dataset[0].code3);
    }
  }, [dataset, selectedCountryCode]);

  const selectedCountry = dataset.find((item) => item.code3 === selectedCountryCode) ?? dataset[0] ?? null;
  const averageScore = dataset.length ? Math.round(dataset.reduce((sum, item) => sum + item.score, 0) / dataset.length) : 0;
  const commodityLabel = copy.commodities[activeCommodity];

  const chartOptions = useMemo(
    () =>
      ({
        chart: {
          map: worldMap,
          backgroundColor: 'transparent',
          height: 560,
          spacing: [0, 0, 0, 0],
        },
        title: undefined,
        subtitle: undefined,
        legend: { enabled: false },
        credits: { enabled: false },
        exporting: { enabled: false },
        mapNavigation: {
          enabled: true,
          enableMouseWheelZoom: false,
          buttonOptions: {
            align: 'left',
            verticalAlign: 'bottom',
            theme: {
              fill: '#0f172a',
              stroke: '#1e293b',
              style: { color: '#e2e8f0' },
            },
          },
        },
        mapView: {
          projection: {
            name: 'Orthographic',
            rotation: [20, -20, 0],
          },
          padding: [0, 0, 0, 0],
        },
        colorAxis: {
          min: 0,
          max: 100,
          stops: [
            [0, '#0f172a'],
            [0.35, '#1d4ed8'],
            [0.6, '#0ea5e9'],
            [0.82, '#f59e0b'],
            [1, '#22c55e'],
          ],
        },
        tooltip: {
          useHTML: true,
          backgroundColor: 'rgba(2,6,23,0.92)',
          borderColor: '#1e293b',
          borderRadius: 16,
          shadow: false,
          style: { color: '#e2e8f0' },
          formatter: function (this: Highcharts.Point) {
            const point = this as Highcharts.Point & { options: CountryPoint };
            if (typeof point.value !== 'number') {
              return false;
            }

            return `
              <div style="min-width:200px">
                <div style="font-size:13px;font-weight:700;margin-bottom:8px">${point.name}</div>
                <div style="font-size:12px;line-height:1.7">
                  <div>${copy.tooltipScore}: <b>${point.value}</b></div>
                  <div>${copy.tooltipTrade}: <b>${point.options.tradePower}</b></div>
                  <div>${copy.tooltipSupply}: <b>${point.options.supplyStress}</b></div>
                  <div>${copy.tooltipClimate}: <b>${point.options.climateRisk}</b></div>
                  <div>${copy.tooltipLogistics}: <b>${point.options.logisticsRisk}</b></div>
                </div>
              </div>
            `;
          },
        },
        plotOptions: {
          series: {
            animation: { duration: 450 },
          },
          map: {
            joinBy: ['iso-a3', 'code3'],
            dataLabels: { enabled: false },
            borderColor: 'rgba(148,163,184,0.35)',
            nullColor: 'rgba(15,23,42,0.18)',
            states: {
              hover: { color: '#86efac' },
              select: { color: '#22c55e' },
            },
            point: {
              events: {
                click: function (this: Highcharts.Point) {
                  const point = this as Highcharts.Point & { options: CountryPoint };
                  if (point.options.code3) {
                    setSelectedCountryCode(point.options.code3);
                  }
                },
              },
            },
          },
        },
        series: [
          {
            type: 'map',
            name: copy.scoreLabel,
            data: dataset.map((item) => ({
              ...item,
              value: item.score,
            })),
          },
        ],
      }) as Highcharts.Options,
    [copy, dataset, worldMap]
  );

  return (
    <section id="global-agro-globe" className="relative overflow-hidden bg-slate-950 py-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.16),_transparent_26%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200 backdrop-blur">
              <Globe2 className="h-3.5 w-3.5" />
              {copy.eyebrow}
            </div>
            <h2 className="text-3xl font-bold tracking-[-0.02em] text-white md:text-4xl">{copy.title}</h2>
            <p className="mt-4 max-w-3xl text-[1.02rem] leading-8 text-slate-300">{copy.subtitle}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
              <Activity className="h-3.5 w-3.5" />
              {copy.scoreBadge}
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200">
              <DatabaseZap className="h-3.5 w-3.5" />
              {copy.pipelineBadge}
            </div>
            {payload && (
              <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${getOverallStatusClasses(payload.overallStatus)}`}>
                <TimerReset className="h-3.5 w-3.5" />
                {getOverallStatusLabel(copy, payload.overallStatus)}
              </div>
            )}
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {COMMODITY_ORDER.map((commodity) => (
            <button
              key={commodity}
              type="button"
              onClick={() => setActiveCommodity(commodity)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                activeCommodity === commodity
                  ? 'border-emerald-400 bg-emerald-400 text-slate-950 shadow-[0_12px_30px_rgba(16,185,129,0.25)]'
                  : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              {copy.commodities[commodity]}
            </button>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.94)_0%,rgba(2,6,23,0.98)_100%)] p-4 shadow-[0_24px_70px_rgba(2,6,23,0.45)] md:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-2">
                <div className="text-sm text-slate-300">{copy.dragHint}</div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-300">
                  {commodityLabel}
                </div>
              </div>

              <div className="overflow-hidden rounded-[1.6rem] border border-white/5 bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.18),_transparent_55%),linear-gradient(180deg,rgba(15,23,42,0.9)_0%,rgba(2,6,23,1)_100%)]">
                {loading || !worldMap ? (
                  <div className="flex h-[560px] items-center justify-center text-slate-300">{copy.loading}</div>
                ) : loadError || !payload ? (
                  <div className="flex h-[560px] items-center justify-center px-6 text-center text-slate-300">{copy.error}</div>
                ) : (
                  <HighchartsReact highcharts={Highcharts} constructorType="mapChart" options={chartOptions} />
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_16px_40px_rgba(2,6,23,0.22)] backdrop-blur">
              <div className="mb-5">
                <h3 className="text-xl font-bold text-white">{copy.topListTitle}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">{copy.summary}</p>
              </div>

              <div className="mb-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-slate-900/55 p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{copy.leaderLabel}</p>
                  <p className="mt-2 text-base font-semibold text-white">{dataset[0]?.country ?? '--'}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/55 p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{copy.coverageLabel}</p>
                  <p className="mt-2 text-base font-semibold text-white">{dataset.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/55 p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{copy.averageLabel}</p>
                  <p className="mt-2 text-base font-semibold text-white">{averageScore}</p>
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                {dataset.slice(0, 6).map((item, index) => (
                  <button
                    key={item.code3}
                    type="button"
                    onClick={() => setSelectedCountryCode(item.code3)}
                    className={`flex w-full items-center justify-between gap-4 rounded-[1.35rem] border px-4 py-4 text-left transition-all ${
                      item.code3 === selectedCountry?.code3
                        ? 'border-emerald-400/40 bg-emerald-400/10'
                        : 'border-white/10 bg-slate-900/50 hover:border-white/20 hover:bg-slate-900/70'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-slate-200">
                        0{index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">{item.country}</p>
                        <p className="truncate text-xs uppercase tracking-[0.18em] text-slate-400">{item.focus}</p>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${scoreTone(item.score)}`}>{item.score}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_16px_40px_rgba(2,6,23,0.22)] backdrop-blur">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{copy.detailTitle}</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">
                    {selectedCountry ? selectedCountry.country : copy.empty}
                  </h3>
                </div>
                {selectedCountry && (
                  <div className={`text-3xl font-bold tracking-[-0.03em] ${scoreTone(selectedCountry.score)}`}>
                    {selectedCountry.score}
                  </div>
                )}
              </div>

              {selectedCountry && signal && (
                <>
                  <p className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm leading-7 text-slate-300">
                    {getSummary(activeLanguage, copy, commodityLabel, selectedCountry, signal)}
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-slate-900/55 p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{copy.basketLabel}</p>
                      <p className="mt-2 text-lg font-semibold text-white">{commodityLabel}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-900/55 p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{copy.focusLabel}</p>
                      <p className="mt-2 text-lg font-semibold text-white">{selectedCountry.focus}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                      <ArrowUpRight className="h-4 w-4 text-emerald-300" />
                      {copy.exposureTitle}
                    </div>
                    <div className="space-y-4">
                      {[
                        { label: copy.tradePower, value: selectedCountry.tradePower, icon: <Ship className="h-4 w-4 text-sky-300" /> },
                        { label: copy.supplyStress, value: selectedCountry.supplyStress, icon: <Leaf className="h-4 w-4 text-emerald-300" /> },
                        { label: copy.climateRisk, value: selectedCountry.climateRisk, icon: <CloudSun className="h-4 w-4 text-amber-300" /> },
                        { label: copy.logisticsRisk, value: selectedCountry.logisticsRisk, icon: <Globe2 className="h-4 w-4 text-violet-300" /> },
                      ].map((metric) => (
                        <div key={metric.label}>
                          <div className="mb-2 flex items-center justify-between gap-4 text-sm text-slate-300">
                            <span className="inline-flex items-center gap-2">
                              {metric.icon}
                              {metric.label}
                            </span>
                            <span className="font-semibold text-white">{metric.value}</span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-[linear-gradient(90deg,#22c55e_0%,#38bdf8_50%,#f59e0b_100%)]"
                              style={{ width: `${metric.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_16px_40px_rgba(2,6,23,0.22)] backdrop-blur">
              {signal && (
                <div className="rounded-2xl border border-white/10 bg-slate-900/55 p-4">
                  <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{copy.signalTitle}</div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs text-slate-400">{copy.commodityPulse}</p>
                      <p className="mt-1 text-lg font-semibold text-white">{formatSignedPercent(signal.commodityChange)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs text-slate-400">{copy.faoPulse}</p>
                      <p className="mt-1 text-lg font-semibold text-white">{formatSignedPercent(signal.faoChange)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs text-slate-400">{copy.energyPulse}</p>
                      <p className={`mt-1 text-lg font-semibold ${signalTone(signal.energyPressure)}`}>{signal.energyPressure}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs text-slate-400">{copy.dollarPulse}</p>
                      <p className={`mt-1 text-lg font-semibold ${signalTone(signal.dollarPressure)}`}>{signal.dollarPressure}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:col-span-2">
                      <p className="text-xs text-slate-400">{copy.riskPulse}</p>
                      <p className={`mt-1 text-lg font-semibold ${signalTone(signal.riskOffPressure)}`}>{signal.riskOffPressure}</p>
                    </div>
                  </div>
                </div>
              )}

              {payload && (
                <div className="mt-6 rounded-2xl border border-sky-400/20 bg-sky-400/10 p-4">
                  <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-100">
                    <DatabaseZap className="h-3.5 w-3.5" />
                    {copy.sourcesTitle}
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: copy.commoditiesLabel, data: payload.dataSources.commodities },
                      { label: copy.macroLabel, data: payload.dataSources.macro },
                      { label: copy.faoLabel, data: payload.dataSources.fao },
                    ].map((row) => (
                      <div key={row.label} className="rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-sm text-slate-200">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="font-semibold text-white">{row.label}</span>
                          <span className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] ${getFreshnessTone(row.data.freshnessStatus)}`}>
                            {getFreshnessLabel(row.data.freshnessStatus, activeLanguage)}
                          </span>
                        </div>
                        <div className="space-y-1 text-xs text-slate-300">
                          <div>{copy.sourceLabel}: {getSourceLabel(row.data.source, activeLanguage)}</div>
                          {row.data.liveMode && <div>{copy.liveModeLabel}: {row.data.liveMode}</div>}
                          <div>{copy.updatedLabel}: {formatDateTime(new Date(row.data.updatedAt), activeLanguage)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 rounded-2xl border border-sky-400/20 bg-sky-400/10 px-4 py-3 text-sm leading-7 text-sky-100">
                {copy.deskNote}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
