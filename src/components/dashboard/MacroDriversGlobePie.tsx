'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import HighchartsMap from 'highcharts/highmaps';
import { buildMacroHubPoints } from '@/lib/agroVisualData';
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
  totalPressure: string;
  topDriver: string;
  corridor: string;
  description: string;
  pieTitle: string;
  pieSubtitle: string;
  dominantLabel: string;
  totalLabel: string;
};

const COPY: Record<SupportedLanguage, Copy> = {
  pt: {
    title: '2026 Top hubs macro por pressao composta',
    subtitle: 'Em pontos compostos usando DXY, WTI, Natural Gas e Gold.',
    totalPressure: 'Pressao total',
    topDriver: 'Driver dominante',
    corridor: 'Corredor',
    description:
      'Variable pie interativo mostrando os principais hubs macro do agronegocio. A altura da fatia acompanha a pressao por driver dominante. Clique em uma fatia para girar o globe ate o hub correspondente.',
    pieTitle: '2026 Top hubs macro por pressao composta',
    pieSubtitle: 'Em pontos compostos por hub agro.',
    dominantLabel: 'Pressao dominante',
    totalLabel: 'Pressao combinada',
  },
  en: {
    title: '2026 Top macro hubs by composite pressure',
    subtitle: 'In composite points using DXY, WTI, Natural Gas and Gold.',
    totalPressure: 'Total pressure',
    topDriver: 'Top driver',
    corridor: 'Corridor',
    description:
      'Interactive variable pie showing the leading agribusiness macro hubs. Slice height follows dominant-driver pressure. Click a slice to rotate the globe to the corresponding hub.',
    pieTitle: '2026 Top macro hubs by composite pressure',
    pieSubtitle: 'In composite points by agribusiness hub.',
    dominantLabel: 'Dominant pressure',
    totalLabel: 'Combined pressure',
  },
  es: {
    title: '2026 Top hubs macro por presion compuesta',
    subtitle: 'En puntos compuestos usando DXY, WTI, Natural Gas y Gold.',
    totalPressure: 'Presion total',
    topDriver: 'Driver dominante',
    corridor: 'Corredor',
    description:
      'Variable pie interactivo que muestra los principales hubs macro del agronegocio. La altura de la porcion sigue la presion del driver dominante. Haz clic en una porcion para girar el globo al hub correspondiente.',
    pieTitle: '2026 Top hubs macro por presion compuesta',
    pieSubtitle: 'En puntos compuestos por hub agro.',
    dominantLabel: 'Presion dominante',
    totalLabel: 'Presion combinada',
  },
  ru: {
    title: '2026 Top macro hubs by composite pressure',
    subtitle: 'In composite points using DXY, WTI, Natural Gas and Gold.',
    totalPressure: 'Total pressure',
    topDriver: 'Top driver',
    corridor: 'Corridor',
    description:
      'Interactive variable pie showing the leading agribusiness macro hubs. Click a slice to rotate the globe to the corresponding hub.',
    pieTitle: '2026 Top macro hubs by composite pressure',
    pieSubtitle: 'In composite points by agribusiness hub.',
    dominantLabel: 'Dominant pressure',
    totalLabel: 'Combined pressure',
  },
  ar: {
    title: 'ابرز المراكز الكلية حسب الضغط المركب 2026',
    subtitle: 'بنقاط مركبة باستخدام DXY وWTI وNatural Gas وGold.',
    totalPressure: 'الضغط الكلي',
    topDriver: 'العامل المهيمن',
    corridor: 'الممر',
    description:
      'Variable pie تفاعلي يعرض ابرز المراكز الكلية في الاعمال الزراعية. ارتفاع الشريحة يعكس ضغط العامل المهيمن. اضغط على الشريحة لتدوير الكرة نحو المركز المقابل.',
    pieTitle: 'ابرز المراكز الكلية حسب الضغط المركب 2026',
    pieSubtitle: 'بنقاط مركبة لكل مركز زراعي.',
    dominantLabel: 'الضغط المهيمن',
    totalLabel: 'الضغط المركب',
  },
  zh: {
    title: '2026 宏观压力最高农业枢纽',
    subtitle: '基于 DXY、WTI、Natural Gas 与 Gold 的综合点数。',
    totalPressure: '总压力',
    topDriver: '主导驱动',
    corridor: '通道',
    description:
      '交互式 variable pie 展示农业主要宏观枢纽。扇区高度跟随主导驱动压力。点击任意扇区可将地球仪旋转到对应枢纽。',
    pieTitle: '2026 宏观压力最高农业枢纽',
    pieSubtitle: '按农业枢纽的综合点数计算。',
    dominantLabel: '主导压力',
    totalLabel: '综合压力',
  },
};

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
    <div className="rounded-[2rem] bg-white p-6 text-slate-900 shadow-[0_18px_50px_rgba(15,23,42,0.18)] md:p-8">
      <div className="grid items-center gap-8 xl:grid-cols-[1fr_1fr]">
        <div className="overflow-hidden">
          {worldMap ? (
            <HighchartsReact highcharts={HighchartsMap} constructorType="mapChart" options={globeOptions} />
          ) : (
            <div className="flex h-[540px] items-center justify-center text-slate-500">Loading globe...</div>
          )}
        </div>

        <div className="overflow-hidden">
          <MacroDriversVariablePie
            title={copy.pieTitle}
            subtitle={copy.pieSubtitle}
            measureLabel={copy.dominantLabel}
            reserveLabel={copy.totalLabel}
            hubs={hubs}
            selectedCode={selectedHub.code3}
            onSelect={setSelectedCode}
          />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-600">
        <p>{copy.description}</p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
          <span>{selectedHub.code3}</span>
          <span>
            {copy.totalPressure}: {selectedHub.totalPressure}
          </span>
          <span>
            {copy.topDriver}: {topSlice?.label ?? '--'}
          </span>
          <span>
            {copy.corridor}: {selectedHub.corridor}
          </span>
        </div>
      </div>
    </div>
  );
}
