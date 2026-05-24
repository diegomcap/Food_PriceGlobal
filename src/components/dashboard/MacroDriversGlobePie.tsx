'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import HighchartsMap from 'highcharts/highmaps';
import { buildMacroHubPoints } from '@/lib/agroVisualData';
import { formatPercent } from '@/lib/marketOverview';
import type { SupportedLanguage } from '@/lib/marketTime';

const HighchartsReact = dynamic(() => import('highcharts-react-official'), { ssr: false });
const MacroDriversVariablePie = dynamic(
  () => import('@/components/dashboard/MacroDriversVariablePie'),
  { ssr: false }
);

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
  title: string;
  subtitle: string;
  measureLabel: string;
  reserveLabel: string;
  detailTitle: string;
  totalPressure: string;
  topDriver: string;
  corridor: string;
  clickHint: string;
};

const COPY: Record<SupportedLanguage, Copy> = {
  pt: {
    title: 'Top hubs macro do agronegocio',
    subtitle:
      'Variable pie com os principais desks do agro. Clique em uma fatia para girar o globe ate o hub correspondente.',
    measureLabel: 'Pressao por driver dominante',
    reserveLabel: 'Pressao total combinada',
    detailTitle: 'Leitura do hub selecionado',
    totalPressure: 'Pressao total',
    topDriver: 'Driver dominante',
    corridor: 'Corredor',
    clickHint: 'Clique em uma fatia ou no globe',
  },
  en: {
    title: 'Top agribusiness macro hubs',
    subtitle:
      'Variable pie of the main agribusiness desks. Click a slice to rotate the globe to the corresponding hub.',
    measureLabel: 'Dominant-driver pressure',
    reserveLabel: 'Combined total pressure',
    detailTitle: 'Selected hub read',
    totalPressure: 'Total pressure',
    topDriver: 'Top driver',
    corridor: 'Corridor',
    clickHint: 'Click a slice or the globe',
  },
  es: {
    title: 'Top hubs macro del agronegocio',
    subtitle:
      'Variable pie con los principales desks del agro. Haz clic en una porcion para girar el globo al hub correspondiente.',
    measureLabel: 'Presion por driver dominante',
    reserveLabel: 'Presion total combinada',
    detailTitle: 'Lectura del hub seleccionado',
    totalPressure: 'Presion total',
    topDriver: 'Driver dominante',
    corridor: 'Corredor',
    clickHint: 'Haz clic en una porcion o en el globo',
  },
  ru: {
    title: 'Top agribusiness macro hubs',
    subtitle: 'Variable pie of the main agribusiness desks.',
    measureLabel: 'Dominant-driver pressure',
    reserveLabel: 'Combined total pressure',
    detailTitle: 'Selected hub read',
    totalPressure: 'Total pressure',
    topDriver: 'Top driver',
    corridor: 'Corridor',
    clickHint: 'Click a slice or the globe',
  },
  ar: {
    title: 'اهم المراكز الكلية للاعمال الزراعية',
    subtitle:
      'Variable pie لاهم desks الزراعية. اضغط على شريحة لتدوير الكرة نحو المركز المقابل.',
    measureLabel: 'ضغط العامل المهيمن',
    reserveLabel: 'الضغط الكلي المجمع',
    detailTitle: 'قراءة المركز المحدد',
    totalPressure: 'الضغط الكلي',
    topDriver: 'العامل المهيمن',
    corridor: 'الممر',
    clickHint: 'اضغط على الشريحة او الكرة',
  },
  zh: {
    title: '农业宏观枢纽排行',
    subtitle:
      '以 variable pie 展示主要农业交易 desk。点击任意扇区可将地球仪旋转到对应枢纽。',
    measureLabel: '主导驱动压力',
    reserveLabel: '综合总压力',
    detailTitle: '当前枢纽读数',
    totalPressure: '总压力',
    topDriver: '主导驱动',
    corridor: '通道',
    clickHint: '点击扇区或地球仪',
  },
};

function pressureTextColor(score: number) {
  if (score >= 82) return 'text-emerald-600';
  if (score >= 68) return 'text-amber-600';
  return 'text-sky-600';
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

function getRotationForHub(lon: number, lat: number): [number, number, number] {
  return [-lon, -lat, 0];
}

function getGraticule() {
  const data = [];

  for (let x = -180; x <= 180; x += 15) {
    data.push({
      geometry: {
        type: 'LineString',
        coordinates: [
          [x, -80],
          [x, 80],
        ],
      },
    });
  }

  for (let y = -75; y <= 75; y += 15) {
    data.push({
      geometry: {
        type: 'LineString',
        coordinates: [
          [-180, y],
          [180, y],
        ],
      },
    });
  }

  return data;
}

export default function MacroDriversGlobePie({ drivers, language }: Props) {
  const copy = COPY[language] ?? COPY.en;
  const [worldMap, setWorldMap] = useState<any | null>(null);
  const [selectedCode, setSelectedCode] = useState('BRA');
  const hubs = useMemo(() => buildMacroHubPoints(drivers), [drivers]);
  const graticule = useMemo(() => getGraticule(), []);

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
        console.error('Unable to load macro globe topojson:', error);
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
  const topSlice = selectedHub?.slices.slice().sort((a, b) => b.impact - a.impact)[0] ?? null;
  const rotation = selectedHub ? getRotationForHub(selectedHub.lon, selectedHub.lat) : [20, -18, 0];

  const globeOptions = useMemo(
    () =>
      ({
        chart: {
          map: worldMap,
          backgroundColor: 'transparent',
          height: 540,
          spacing: [0, 0, 0, 0],
        },
        title: undefined,
        credits: { enabled: false },
        legend: { enabled: false },
        exporting: { enabled: false },
        mapNavigation: { enabled: false },
        mapView: {
          projection: {
            name: 'Orthographic',
            rotation,
          },
        },
        tooltip: {
          useHTML: true,
          backgroundColor: 'rgba(255,255,255,0.96)',
          borderColor: '#cbd5e1',
          shadow: false,
          style: { color: '#0f172a' },
          formatter: function (this: any) {
            const point = this as any;
            if (!point.options?.code3) {
              return false;
            }

            return `
              <div style="min-width:190px">
                <div style="font-size:13px;font-weight:700;margin-bottom:8px">${point.name}</div>
                <div style="font-size:12px;line-height:1.7">
                  <div>${copy.totalPressure}: <b>${point.options.totalPressure}</b></div>
                  <div>${copy.topDriver}: <b>${point.options.topDriver}</b></div>
                  <div>${copy.corridor}: <b>${point.options.corridor}</b></div>
                </div>
              </div>
            `;
          },
        },
        plotOptions: {
          map: {
            joinBy: ['iso-a3', 'code3'],
            borderColor: '#d7e0ea',
            nullColor: '#eef2f7',
            states: {
              hover: { color: '#dbeafe' },
              select: { color: '#dbeafe' },
            },
          },
          mappoint: {
            point: {
              events: {
                click: function (this: any) {
                  if (this.options.code3) {
                    setSelectedCode(this.options.code3);
                  }
                },
              },
            },
          },
        },
        series: [
          {
            type: 'mapline',
            data: graticule,
            enableMouseTracking: false,
            color: 'rgba(148,163,184,0.35)',
            lineWidth: 1,
          },
          {
            type: 'map',
            data: [],
            enableMouseTracking: false,
            nullColor: '#eef2f7',
            borderColor: '#d7e0ea',
          },
          {
            type: 'mappoint',
            name: copy.totalPressure,
            cursor: 'pointer',
            data: hubs.map((hub) => {
              const dominant = hub.slices.slice().sort((a, b) => b.impact - a.impact)[0];
              return {
                lat: hub.lat,
                lon: hub.lon,
                name: hub.country,
                code3: hub.code3,
                totalPressure: hub.totalPressure,
                corridor: hub.corridor,
                topDriver: dominant?.label ?? '--',
              };
            }),
            marker: {
              radius: 5,
              fillColor: '#0f172a',
              lineColor: '#ffffff',
              lineWidth: 1,
            },
            dataLabels: {
              enabled: true,
              format: '{point.code3}',
              allowOverlap: true,
              style: {
                fontSize: '10px',
                fontWeight: '700',
                textOutline: 'none',
                color: '#334155',
              },
              y: -10,
            },
          },
          {
            type: 'mappoint',
            data: [
              {
                lat: selectedHub.lat,
                lon: selectedHub.lon,
                name: selectedHub.country,
              },
            ],
            enableMouseTracking: false,
            marker: {
              radius: 10,
              fillColor: 'rgba(59,130,246,0.18)',
              lineColor: '#2563eb',
              lineWidth: 2,
            },
            dataLabels: { enabled: false },
          },
        ],
      }) as Highcharts.Options,
    [copy, graticule, hubs, rotation, selectedHub, worldMap]
  );

  if (!selectedHub || hubs.length === 0) {
    return null;
  }

  return (
    <div className="rounded-[2rem] bg-white p-5 text-slate-900 shadow-[0_18px_50px_rgba(15,23,42,0.18)] md:p-8">
      <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-[radial-gradient(circle_at_center,_rgba(148,163,184,0.12),_transparent_62%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-2">
          {worldMap ? (
            <HighchartsReact highcharts={HighchartsMap} constructorType="mapChart" options={globeOptions} />
          ) : (
            <div className="flex h-[540px] items-center justify-center text-slate-500">Loading globe...</div>
          )}
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-2">
          <MacroDriversVariablePie
            title={copy.title}
            subtitle={copy.subtitle}
            measureLabel={copy.measureLabel}
            reserveLabel={copy.reserveLabel}
            hubs={hubs}
            selectedCode={selectedHub.code3}
            onSelect={setSelectedCode}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{copy.detailTitle}</h4>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {copy.clickHint}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{copy.totalPressure}</p>
              <p className={`mt-2 text-2xl font-black ${pressureTextColor(selectedHub.totalPressure)}`}>{selectedHub.totalPressure}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{copy.topDriver}</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{topSlice?.label ?? '--'}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:col-span-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{copy.corridor}</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{selectedHub.corridor}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {selectedHub.slices.map((slice) => (
            <div key={slice.id} className="rounded-[1.4rem] border border-slate-200 bg-white p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-900">{slice.label}</span>
                <span
                  className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
                  style={{ backgroundColor: `${driverColor(slice.id)}22`, color: driverColor(slice.id) }}
                >
                  {slice.id}
                </span>
              </div>
              <div className="text-xl font-black text-slate-900">{slice.price.toFixed(2)}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{slice.unit}</div>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-500">{copy.totalPressure}</span>
                <span className="font-semibold text-slate-900">{slice.impact}</span>
              </div>
              <div className="mt-1 text-sm text-slate-600">{formatPercent(slice.change)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
