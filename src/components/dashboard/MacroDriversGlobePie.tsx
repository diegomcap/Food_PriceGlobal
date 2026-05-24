'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsMap from 'highcharts/highmaps';
import { Globe2 } from 'lucide-react';
import { buildMacroHubPoints } from '@/lib/agroVisualData';
import { formatPercent } from '@/lib/marketOverview';
import type { SupportedLanguage } from '@/lib/marketTime';

const HighchartsReact = dynamic(() => import('highcharts-react-official'), { ssr: false });

type MacroDriver = {
  symbol: string;
  label: string;
  price: number;
  previousClose: number;
  unit: string;
};

type Props = {
  drivers: MacroDriver[];
  language: SupportedLanguage;
};

type Copy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  hint: string;
  totalPressure: string;
  corridor: string;
  topDriver: string;
  tooltipImpact: string;
  tooltipChange: string;
  tooltipPrice: string;
  pieTitle: string;
  note: string;
};

const COPY: Record<SupportedLanguage, Copy> = {
  pt: {
    eyebrow: 'Globe de Pressao',
    title: 'Globe macro por hub exportador',
    subtitle:
      'Versao adaptada do globe com variable pie para mostrar como WTI, Natural Gas, Gold e DXY rebatem nos principais desks do agro.',
    hint: 'Clique em um hub no globe para sincronizar o pie de drivers.',
    totalPressure: 'Pressao total',
    corridor: 'Corredor',
    topDriver: 'Driver dominante',
    tooltipImpact: 'Impacto',
    tooltipChange: 'Variacao',
    tooltipPrice: 'Preco',
    pieTitle: 'Composicao dos drivers',
    note: 'O pie usa impacto relativo por hub; o tamanho responde ao peso local e ao movimento real do driver.',
  },
  en: {
    eyebrow: 'Pressure Globe',
    title: 'Macro globe by export hub',
    subtitle:
      'Adapted globe + variable pie to show how WTI, Natural Gas, Gold and DXY filter into the main agribusiness desks.',
    hint: 'Click a hub on the globe to sync the driver pie.',
    totalPressure: 'Total pressure',
    corridor: 'Corridor',
    topDriver: 'Top driver',
    tooltipImpact: 'Impact',
    tooltipChange: 'Change',
    tooltipPrice: 'Price',
    pieTitle: 'Driver composition',
    note: 'The pie uses relative impact by hub; size reacts to local weight and live driver move.',
  },
  es: {
    eyebrow: 'Globo de Presion',
    title: 'Globo macro por hub exportador',
    subtitle:
      'Adaptacion del globe con variable pie para mostrar como WTI, Natural Gas, Gold y DXY llegan a los principales desks agro.',
    hint: 'Haz clic en un hub del globo para sincronizar el pie de drivers.',
    totalPressure: 'Presion total',
    corridor: 'Corredor',
    topDriver: 'Driver dominante',
    tooltipImpact: 'Impacto',
    tooltipChange: 'Variacion',
    tooltipPrice: 'Precio',
    pieTitle: 'Composicion de drivers',
    note: 'El pie usa impacto relativo por hub; el tamano responde al peso local y al movimiento real del driver.',
  },
  ru: {
    eyebrow: 'Pressure Globe',
    title: 'Macro globe by export hub',
    subtitle: 'Adapted globe + variable pie for WTI, Natural Gas, Gold and DXY.',
    hint: 'Click a hub on the globe to sync the driver pie.',
    totalPressure: 'Total pressure',
    corridor: 'Corridor',
    topDriver: 'Top driver',
    tooltipImpact: 'Impact',
    tooltipChange: 'Change',
    tooltipPrice: 'Price',
    pieTitle: 'Driver composition',
    note: 'The pie uses relative impact by hub.',
  },
  ar: {
    eyebrow: 'كرة الضغط',
    title: 'الكرة الكلية حسب مركز التصدير',
    subtitle:
      'نسخة معدلة من globe مع variable pie لتوضيح كيف تؤثر WTI و Natural Gas و Gold و DXY على مكاتب الاعمال الزراعية.',
    hint: 'اضغط على مركز في الكرة لمزامنة pie الخاصة بالعوامل.',
    totalPressure: 'الضغط الكلي',
    corridor: 'الممر',
    topDriver: 'العامل المهيمن',
    tooltipImpact: 'الاثر',
    tooltipChange: 'التغير',
    tooltipPrice: 'السعر',
    pieTitle: 'تركيب العوامل',
    note: 'الـ pie تستخدم الاثر النسبي حسب كل مركز وتستجيب للوزن المحلي وحركة العامل الحية.',
  },
  zh: {
    eyebrow: '压力地球仪',
    title: '按出口枢纽划分的宏观地球仪',
    subtitle:
      '改造后的 globe + variable pie 展示 WTI、Natural Gas、Gold 和 DXY 如何传导到主要农业交易台。',
    hint: '点击地球仪上的枢纽以同步驱动 pie 图。',
    totalPressure: '总压力',
    corridor: '通道',
    topDriver: '主导驱动',
    tooltipImpact: '影响',
    tooltipChange: '变化',
    tooltipPrice: '价格',
    pieTitle: '驱动构成',
    note: 'pie 图按枢纽使用相对影响，大小同时反映当地权重和实时波动。',
  },
};

function pressureColor(score: number) {
  if (score >= 82) return 'text-emerald-300';
  if (score >= 68) return 'text-amber-300';
  return 'text-sky-300';
}

function driverColor(symbol: string) {
  switch (symbol) {
    case 'CL=F':
      return '#f97316';
    case 'NG=F':
      return '#38bdf8';
    case 'GC=F':
      return '#facc15';
    default:
      return '#22c55e';
  }
}

export default function MacroDriversGlobePie({ drivers, language }: Props) {
  const copy = COPY[language] ?? COPY.en;
  const [worldMap, setWorldMap] = useState<any | null>(null);
  const [selectedCode, setSelectedCode] = useState('BRA');
  const [modulesReady, setModulesReady] = useState(false);
  const hubs = useMemo(() => buildMacroHubPoints(drivers), [drivers]);

  useEffect(() => {
    let cancelled = false;

    async function loadModules() {
      try {
        await Promise.all([
          import('highcharts/highcharts-more'),
          import('highcharts/modules/variable-pie'),
        ]);
        if (!cancelled) {
          setModulesReady(true);
        }
      } catch (error) {
        console.error('Unable to load variable pie modules:', error);
      }
    }

    async function loadMap() {
      try {
        const response = await fetch('https://code.highcharts.com/mapdata/custom/world.topo.json');
        const topology = await response.json();
        if (!cancelled) {
          setWorldMap(topology);
        }
      } catch (error) {
        console.error('Unable to load macro globe topojson:', error);
      }
    }

    loadModules();
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
  const topSlice = selectedHub?.slices.slice().sort((a, b) => b.impact - a.impact)[0] ?? null;

  const globeOptions = useMemo(
    () =>
      ({
        chart: {
          map: worldMap,
          backgroundColor: 'transparent',
          height: 500,
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
            rotation: [20, -18, 0],
          },
        },
        colorAxis: {
          min: 0,
          max: 100,
          stops: [
            [0, '#0f172a'],
            [0.4, '#1d4ed8'],
            [0.7, '#f59e0b'],
            [1, '#22c55e'],
          ],
        },
        tooltip: {
          useHTML: true,
          backgroundColor: 'rgba(2,6,23,0.94)',
          borderColor: '#1e293b',
          shadow: false,
          style: { color: '#e2e8f0' },
          formatter: function (this: Highcharts.Point) {
            const point = this as Highcharts.Point & { options: any };
            if (typeof point.value !== 'number') {
              return false;
            }

            return `
              <div style="min-width:180px">
                <div style="font-size:13px;font-weight:700;margin-bottom:8px">${point.name}</div>
                <div style="font-size:12px;line-height:1.7">
                  <div>${copy.totalPressure}: <b>${point.options.totalPressure}</b></div>
                  <div>${copy.corridor}: <b>${point.options.corridor}</b></div>
                </div>
              </div>
            `;
          },
        },
        plotOptions: {
          map: {
            joinBy: ['iso-a3', 'code3'],
            borderColor: 'rgba(148,163,184,0.35)',
            nullColor: 'rgba(15,23,42,0.18)',
            states: {
              hover: { color: '#86efac' },
              select: { color: '#22c55e' },
            },
            point: {
              events: {
                click: function (this: Highcharts.Point) {
                  const point = this as Highcharts.Point & { options: any };
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
            name: copy.totalPressure,
            data: hubs.map((hub) => ({
              ...hub,
              value: hub.totalPressure,
            })),
          },
          {
            type: 'mappoint',
            data: hubs.map((hub) => ({
              lat: hub.lat,
              lon: hub.lon,
              name: hub.country,
              code3: hub.code3,
            })),
            marker: {
              radius: 5,
              fillColor: '#38bdf8',
              lineColor: '#e0f2fe',
              lineWidth: 1,
            },
            dataLabels: { enabled: false },
          },
        ],
      }) as Highcharts.Options,
    [copy, hubs, worldMap]
  );

  const pieOptions = useMemo(
    () =>
      ({
        chart: {
          type: 'variablepie',
          backgroundColor: 'transparent',
          height: 360,
        },
        title: undefined,
        credits: { enabled: false },
        exporting: { enabled: false },
        tooltip: {
          useHTML: true,
          pointFormatter: function (this: any) {
            return `
              <div style="min-width:180px">
                <div style="font-size:13px;font-weight:700;margin-bottom:8px">${this.name}</div>
                <div style="font-size:12px;line-height:1.7">
                  <div>${copy.tooltipImpact}: <b>${this.y}</b></div>
                  <div>${copy.tooltipChange}: <b>${formatPercent(this.custom.change)}</b></div>
                  <div>${copy.tooltipPrice}: <b>${this.custom.price.toFixed(2)} ${this.custom.unit}</b></div>
                </div>
              </div>
            `;
          },
        },
        plotOptions: {
          variablepie: {
            minPointSize: 24,
            innerSize: '18%',
            borderColor: 'rgba(15,23,42,0.12)',
            borderWidth: 2,
            dataLabels: {
              enabled: true,
              format: '{point.name}',
              style: {
                color: '#e2e8f0',
                textOutline: 'none',
                fontSize: '12px',
              },
            },
          },
        },
        series: [
          {
            type: 'variablepie',
            data: selectedHub?.slices.map((slice) => ({
              name: slice.label,
              y: slice.impact,
              z: slice.z,
              color: driverColor(slice.id),
              custom: {
                change: slice.change,
                price: slice.price,
                unit: slice.unit,
              },
            })) ?? [],
          },
        ],
      }) as Highcharts.Options,
    [copy, selectedHub]
  );

  if (!selectedHub || hubs.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.94)_0%,rgba(2,6,23,0.98)_100%)] p-5 shadow-[0_24px_70px_rgba(2,6,23,0.45)]">
        <div className="mb-4">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
            <Globe2 className="h-3.5 w-3.5" />
            {copy.eyebrow}
          </div>
          <h3 className="text-2xl font-bold text-white">{copy.title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">{copy.subtitle}</p>
          <p className="mt-3 text-sm text-slate-400">{copy.hint}</p>
        </div>

        <div className="overflow-hidden rounded-[1.7rem] border border-white/5 bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.18),_transparent_55%),linear-gradient(180deg,rgba(15,23,42,0.9)_0%,rgba(2,6,23,1)_100%)]">
          {worldMap ? (
            <HighchartsReact highcharts={HighchartsMap} constructorType="mapChart" options={globeOptions} />
          ) : (
            <div className="flex h-[500px] items-center justify-center text-slate-300">Loading globe...</div>
          )}
        </div>
      </div>

      <div className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_16px_40px_rgba(2,6,23,0.22)] backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{copy.pieTitle}</p>
            <h3 className="mt-2 text-2xl font-bold text-white">{selectedHub.country}</h3>
          </div>
          <div className={`text-3xl font-black ${pressureColor(selectedHub.totalPressure)}`}>{selectedHub.totalPressure}</div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900/55 p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{copy.totalPressure}</p>
            <p className="mt-2 text-lg font-semibold text-white">{selectedHub.totalPressure}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/55 p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{copy.topDriver}</p>
            <p className="mt-2 text-lg font-semibold text-white">{topSlice?.label ?? '--'}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/55 p-4 sm:col-span-2">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{copy.corridor}</p>
            <p className="mt-2 text-lg font-semibold text-white">{selectedHub.corridor}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-slate-950/55 p-2">
          {modulesReady ? (
            <HighchartsReact highcharts={Highcharts} options={pieOptions} />
          ) : (
            <div className="flex h-[360px] items-center justify-center text-slate-300">Loading drivers...</div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {selectedHub.slices.map((slice) => (
            <div key={slice.id} className="rounded-2xl border border-white/10 bg-slate-900/55 p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-white">{slice.label}</span>
                <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ backgroundColor: `${driverColor(slice.id)}22`, color: driverColor(slice.id) }}>
                  {slice.id}
                </span>
              </div>
              <div className="text-lg font-bold text-white">{slice.price.toFixed(2)} {slice.unit}</div>
              <div className="mt-1 text-sm text-slate-300">{formatPercent(slice.change)}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 px-4 py-3 text-sm leading-7 text-sky-100">
          {copy.note}
        </div>
      </div>
    </div>
  );
}
