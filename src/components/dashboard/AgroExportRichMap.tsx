'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import HighchartsMap from 'highcharts/highmaps';
import { BarChart3, Globe2, ShipWheel, Wheat } from 'lucide-react';
import type { FaoApiResponse, MarketCommodity } from '@/lib/marketOverview';
import { buildExportHubPoints } from '@/lib/agroVisualData';
import type { SupportedLanguage } from '@/lib/marketTime';
import { formatPercent } from '@/lib/marketOverview';

const HighchartsReact = dynamic(() => import('highcharts-react-official'), { ssr: false });

type Props = {
  commodities: MarketCommodity[];
  faoData: FaoApiResponse | null;
  language: SupportedLanguage;
};

type Copy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  loading: string;
  score: string;
  demand: string;
  logistics: string;
  route: string;
  destination: string;
  exportValue: string;
  mixTitle: string;
  mapHint: string;
  tooltipScore: string;
  tooltipExports: string;
  tooltipCommodity: string;
  panelTitle: string;
  note: string;
};

const COPY: Record<SupportedLanguage, Copy> = {
  pt: {
    eyebrow: 'Mapa de Exportacao',
    title: 'Heatmap de hubs do agronegocio',
    subtitle:
      'Leitura rica por pais para exportacao agro: score comercial, pulso de demanda, pressao logistica e mix da cesta exportadora.',
    loading: 'Carregando mapa...',
    score: 'Score exportador',
    demand: 'Pulso de demanda',
    logistics: 'Pressao logistica',
    route: 'Corredor',
    destination: 'Destino',
    exportValue: 'Exportacao agro',
    mixTitle: 'Mix da pauta exportadora',
    mapHint: 'Clique em um pais para abrir a leitura detalhada de exportacao.',
    tooltipScore: 'Score',
    tooltipExports: 'Exportacao',
    tooltipCommodity: 'Commodity foco',
    panelTitle: 'Leitura de exportacao',
    note: 'Score combina tamanho exportador, variacao da commodity foco, FAO e friccao logistica.',
  },
  en: {
    eyebrow: 'Export Map',
    title: 'Agri-trade export hubs',
    subtitle:
      'Rich country-by-country export read for agribusiness: trade score, demand pulse, logistics pressure and export basket mix.',
    loading: 'Loading map...',
    score: 'Export score',
    demand: 'Demand pulse',
    logistics: 'Logistics pressure',
    route: 'Corridor',
    destination: 'Destination',
    exportValue: 'Agro exports',
    mixTitle: 'Export basket mix',
    mapHint: 'Click a country to open the detailed export read.',
    tooltipScore: 'Score',
    tooltipExports: 'Exports',
    tooltipCommodity: 'Focus commodity',
    panelTitle: 'Export read',
    note: 'Score blends export scale, focus commodity move, FAO pulse and logistics friction.',
  },
  es: {
    eyebrow: 'Mapa de Exportacion',
    title: 'Hubs de exportacion agro',
    subtitle:
      'Lectura rica por pais para exportacion agro: score comercial, pulso de demanda, presion logistica y mix exportador.',
    loading: 'Cargando mapa...',
    score: 'Score exportador',
    demand: 'Pulso de demanda',
    logistics: 'Presion logistica',
    route: 'Corredor',
    destination: 'Destino',
    exportValue: 'Exportacion agro',
    mixTitle: 'Mix exportador',
    mapHint: 'Haz clic en un pais para abrir la lectura detallada de exportacion.',
    tooltipScore: 'Score',
    tooltipExports: 'Exportacion',
    tooltipCommodity: 'Commodity foco',
    panelTitle: 'Lectura de exportacion',
    note: 'El score combina escala exportadora, variacion de la commodity foco, FAO y friccion logistica.',
  },
  ru: {
    eyebrow: 'Karta eksporta',
    title: 'Agro eksport hubs',
    subtitle: 'Rich country-by-country export read for agribusiness.',
    loading: 'Loading map...',
    score: 'Export score',
    demand: 'Demand pulse',
    logistics: 'Logistics pressure',
    route: 'Corridor',
    destination: 'Destination',
    exportValue: 'Agro exports',
    mixTitle: 'Export basket mix',
    mapHint: 'Click a country to open the detailed export read.',
    tooltipScore: 'Score',
    tooltipExports: 'Exports',
    tooltipCommodity: 'Focus commodity',
    panelTitle: 'Export read',
    note: 'Score blends export scale, focus commodity move, FAO pulse and logistics friction.',
  },
  ar: {
    eyebrow: 'خريطة التصدير',
    title: 'مراكز تصدير الاعمال الزراعية',
    subtitle:
      'قراءة غنية لكل دولة للصادرات الزراعية: درجة تجارية ونبض الطلب وضغط لوجستي ومزيج السلة التصديرية.',
    loading: 'جار تحميل الخريطة...',
    score: 'الدرجة التصديرية',
    demand: 'نبض الطلب',
    logistics: 'الضغط اللوجستي',
    route: 'الممر',
    destination: 'الوجهة',
    exportValue: 'الصادرات الزراعية',
    mixTitle: 'مزيج السلة التصديرية',
    mapHint: 'اضغط على دولة لفتح القراءة التفصيلية للصادرات.',
    tooltipScore: 'الدرجة',
    tooltipExports: 'الصادرات',
    tooltipCommodity: 'السلعة المحورية',
    panelTitle: 'قراءة التصدير',
    note: 'الدرجة تجمع حجم التصدير وحركة السلعة المحورية ونبض FAO والاحتكاك اللوجستي.',
  },
  zh: {
    eyebrow: '出口地图',
    title: '农业出口枢纽',
    subtitle:
      '按国家提供农业出口的丰富读数: 贸易评分、需求脉冲、物流压力和出口篮子结构。',
    loading: '正在加载地图...',
    score: '出口评分',
    demand: '需求脉冲',
    logistics: '物流压力',
    route: '通道',
    destination: '目的地',
    exportValue: '农业出口',
    mixTitle: '出口篮子结构',
    mapHint: '点击国家以打开详细出口读数。',
    tooltipScore: '评分',
    tooltipExports: '出口',
    tooltipCommodity: '核心商品',
    panelTitle: '出口读数',
    note: '评分综合出口规模、核心商品波动、FAO 脉冲和物流摩擦。',
  },
};

function scoreColor(score: number) {
  if (score >= 78) return 'text-emerald-600';
  if (score >= 64) return 'text-amber-600';
  return 'text-sky-600';
}

export default function AgroExportRichMap({ commodities, faoData, language }: Props) {
  const copy = COPY[language] ?? COPY.en;
  const [worldMap, setWorldMap] = useState<any | null>(null);
  const [selectedCode, setSelectedCode] = useState('BRA');
  const hubs = useMemo(() => buildExportHubPoints(commodities, faoData), [commodities, faoData]);

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
        console.error('Unable to load world topojson for agro export map:', error);
      }
    }

    loadMap();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hubs.some((hub) => hub.code3 === selectedCode) && hubs[0]) {
      setSelectedCode(hubs[0].code3);
    }
  }, [hubs, selectedCode]);

  const selectedHub = hubs.find((hub) => hub.code3 === selectedCode) ?? hubs[0] ?? null;

  const mapOptions = useMemo(
    () =>
      ({
        chart: {
          map: worldMap,
          backgroundColor: 'transparent',
          height: 460,
          spacing: [0, 0, 0, 0],
        },
        title: undefined,
        credits: { enabled: false },
        legend: { enabled: false },
        exporting: { enabled: false },
        mapNavigation: {
          enabled: true,
          enableMouseWheelZoom: false,
          buttonOptions: {
            align: 'left',
            verticalAlign: 'bottom',
          },
        },
        colorAxis: {
          min: 0,
          max: 100,
          stops: [
            [0, '#dbeafe'],
            [0.45, '#7dd3fc'],
            [0.7, '#f59e0b'],
            [1, '#16a34a'],
          ],
        },
        tooltip: {
          useHTML: true,
          backgroundColor: 'rgba(255,255,255,0.96)',
          borderColor: '#cbd5e1',
          shadow: false,
          formatter: function (this: any) {
            const point = this as any;
            if (typeof point.value !== 'number') {
              return false;
            }

            return `
              <div style="min-width:190px;color:#0f172a">
                <div style="font-size:13px;font-weight:700;margin-bottom:8px">${point.name}</div>
                <div style="font-size:12px;line-height:1.7">
                  <div>${copy.tooltipScore}: <b>${point.options.exportScore}</b></div>
                  <div>${copy.tooltipExports}: <b>US$ ${point.options.exportValueBn} bn</b></div>
                  <div>${copy.tooltipCommodity}: <b>${point.options.mix?.[0]?.label ?? '--'}</b></div>
                </div>
              </div>
            `;
          },
        },
        plotOptions: {
          series: {
            animation: { duration: 350 },
          },
          map: {
            joinBy: ['iso-a3', 'code3'],
            borderColor: '#94a3b8',
            nullColor: '#eef2ff',
            states: {
              hover: { color: '#86efac' },
              select: { color: '#22c55e' },
            },
            point: {
              events: {
                click: function (this: any) {
                  const point = this as any;
                  if (point.options.code3) {
                    setSelectedCode(point.options.code3);
                  }
                },
              },
            },
          },
        },
        series: [
          {
            type: 'map',
            name: copy.score,
            data: hubs.map((hub) => ({
              ...hub,
              value: hub.exportScore,
            })),
            dataLabels: { enabled: false },
          },
          {
            type: 'mapbubble',
            name: copy.exportValue,
            data: hubs.map((hub) => ({
              lat: hub.lat,
              lon: hub.lon,
              z: hub.exportValueBn,
              name: hub.country,
              code3: hub.code3,
              exportScore: hub.exportScore,
              exportValueBn: hub.exportValueBn,
              mix: hub.mix,
            })),
            minSize: 8,
            maxSize: '11%',
            color: 'rgba(14,165,233,0.35)',
            borderColor: 'rgba(2,132,199,0.95)',
          },
        ],
      }) as Highcharts.Options,
    [copy, hubs, worldMap]
  );

  const mixOptions = useMemo(
    () =>
      ({
        chart: {
          type: 'bar',
          backgroundColor: 'transparent',
          height: 260,
          spacing: [10, 0, 0, 0],
        },
        title: undefined,
        credits: { enabled: false },
        exporting: { enabled: false },
        legend: { enabled: false },
        xAxis: {
          categories: selectedHub?.mix.map((item) => item.label) ?? [],
          labels: { style: { color: '#475569', fontSize: '12px' } },
          lineColor: '#e2e8f0',
          tickColor: '#e2e8f0',
        },
        yAxis: {
          title: undefined,
          max: 40,
          gridLineColor: '#e2e8f0',
          labels: { style: { color: '#64748b', fontSize: '11px' } },
        },
        tooltip: {
          pointFormat: '<b>{point.y}%</b>',
        },
        plotOptions: {
          series: {
            borderRadius: 8,
            dataLabels: {
              enabled: true,
              format: '{y}%',
              style: { textOutline: 'none', color: '#0f172a', fontSize: '11px' },
            },
          },
        },
        series: [
          {
            type: 'bar',
            data: selectedHub?.mix.map((item) => item.share) ?? [],
            colorByPoint: true,
            colors: ['#16a34a', '#0ea5e9', '#f59e0b', '#8b5cf6', '#f97316', '#ef4444'],
          },
        ],
      }) as Highcharts.Options,
    [selectedHub]
  );

  if (!selectedHub || hubs.length === 0) {
    return null;
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_10px_35px_rgba(15,23,42,0.05)] md:p-7">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
            <Globe2 className="h-3.5 w-3.5" />
            {copy.eyebrow}
          </div>
          <h3 className="text-2xl font-bold tracking-[-0.02em] text-slate-900">{copy.title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{copy.subtitle}</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
          <Wheat className="h-3.5 w-3.5" />
          {copy.note}
        </div>
      </div>

      <div className="mb-5 text-sm text-slate-500">{copy.mapHint}</div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#eff6ff_100%)] p-3">
          {worldMap ? (
            <HighchartsReact highcharts={HighchartsMap} constructorType="mapChart" options={mapOptions} />
          ) : (
            <div className="flex h-[460px] items-center justify-center text-slate-500">{copy.loading}</div>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{copy.panelTitle}</p>
                <h4 className="mt-2 text-2xl font-bold text-slate-900">{selectedHub.country}</h4>
              </div>
              <div className={`text-3xl font-black ${scoreColor(selectedHub.exportScore)}`}>{selectedHub.exportScore}</div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{copy.score}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{selectedHub.exportScore}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{copy.exportValue}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">US$ {selectedHub.exportValueBn} bn</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{copy.demand}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{selectedHub.demandPulse}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{copy.logistics}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{selectedHub.logisticsPressure}</p>
              </div>
            </div>

            <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <ShipWheel className="h-4 w-4 text-slate-500" />
                <span className="font-semibold text-slate-900">{copy.route}:</span> {selectedHub.route}
              </div>
              <div>
                <span className="font-semibold text-slate-900">{copy.destination}:</span> {selectedHub.destination}
              </div>
              <div>
                <span className="font-semibold text-slate-900">{copy.demand}:</span> {selectedHub.faoPulse} | {formatPercent(selectedHub.commodityChange)}
              </div>
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-5">
            <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              <BarChart3 className="h-3.5 w-3.5" />
              {copy.mixTitle}
            </div>
            <HighchartsReact highcharts={HighchartsMap} options={mixOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
