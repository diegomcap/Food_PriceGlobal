'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import HighchartsMap from 'highcharts/highmaps';
import { Globe2 } from 'lucide-react';
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
  eyebrow: string;
  title: string;
  subtitle: string;
  hint: string;
  interactionHint: string;
  totalPressure: string;
  corridor: string;
  topDriver: string;
  pieTitle: string;
  globeTitle: string;
  rankingTitle: string;
  selectedHub: string;
  note: string;
};

const COPY: Record<SupportedLanguage, Copy> = {
  pt: {
    eyebrow: 'Macro & Energy Radar',
    title: 'Drivers macro em modelo globe + variable pie',
    subtitle:
      'Leitura inspirada no demo globe-in-variable-pie: o globe mostra os hubs do agro e o variable pie ranqueia cada desk pela pressao combinada de DXY, WTI, Natural Gas e Gold.',
    hint: 'Clique em um hub no globe ou na lista para atualizar a leitura.',
    interactionHint: 'Clique em uma fatia do variable pie para focar o desk correspondente no globe.',
    totalPressure: 'Pressao total',
    corridor: 'Corredor',
    topDriver: 'Driver dominante',
    pieTitle: 'Ranking macro em variable pie',
    globeTitle: 'Globe dos hubs macro',
    rankingTitle: 'Top desks por pressao composta',
    selectedHub: 'Hub selecionado',
    note: 'Cada fatia representa um hub. O tamanho reflete a pressao total combinada e a altura responde ao driver dominante naquele desk.',
  },
  en: {
    eyebrow: 'Macro & Energy Radar',
    title: 'Macro drivers in globe + variable pie mode',
    subtitle:
      'A reading inspired by the globe-in-variable-pie demo: the globe shows agribusiness hubs while the variable pie ranks each desk by combined DXY, WTI, Natural Gas and Gold pressure.',
    hint: 'Click a hub on the globe or in the list to update the read.',
    interactionHint: 'Click a variable pie slice to focus the corresponding desk on the globe.',
    totalPressure: 'Total pressure',
    corridor: 'Corridor',
    topDriver: 'Top driver',
    pieTitle: 'Variable pie macro ranking',
    globeTitle: 'Macro hubs globe',
    rankingTitle: 'Top desks by composite pressure',
    selectedHub: 'Selected hub',
    note: 'Each slice represents one hub. Size reflects total combined pressure and slice height follows the dominant driver at that desk.',
  },
  es: {
    eyebrow: 'Macro & Energy Radar',
    title: 'Drivers macro en modo globe + variable pie',
    subtitle:
      'Lectura inspirada en el demo globe-in-variable-pie: el globo muestra hubs agro y el variable pie ordena cada desk por la presion combinada de DXY, WTI, Natural Gas y Gold.',
    hint: 'Haz clic en un hub del globo o de la lista para actualizar la lectura.',
    interactionHint: 'Haz clic en una porcion del variable pie para enfocar el desk correspondiente en el globo.',
    totalPressure: 'Presion total',
    corridor: 'Corredor',
    topDriver: 'Driver dominante',
    pieTitle: 'Ranking macro en variable pie',
    globeTitle: 'Globo de hubs macro',
    rankingTitle: 'Top desks por presion compuesta',
    selectedHub: 'Hub seleccionado',
    note: 'Cada porcion representa un hub. El tamano refleja la presion combinada y la altura responde al driver dominante de ese desk.',
  },
  ru: {
    eyebrow: 'Macro & Energy Radar',
    title: 'Macro drivers in globe + variable pie mode',
    subtitle: 'Globe-in-variable-pie reading for WTI, Natural Gas, Gold and DXY.',
    hint: 'Click a hub on the globe or in the list to update the read.',
    interactionHint: 'Click a variable pie slice to focus the corresponding desk on the globe.',
    totalPressure: 'Total pressure',
    corridor: 'Corridor',
    topDriver: 'Top driver',
    pieTitle: 'Variable pie macro ranking',
    globeTitle: 'Macro hubs globe',
    rankingTitle: 'Top desks by composite pressure',
    selectedHub: 'Selected hub',
    note: 'Each slice represents one hub.',
  },
  ar: {
    eyebrow: 'Macro & Energy Radar',
    title: 'محركات الاقتصاد الكلي بنمط globe + variable pie',
    subtitle:
      'قراءة مستوحاة من demo globe-in-variable-pie: الكرة تعرض مراكز الاعمال الزراعية بينما يقوم variable pie بترتيب كل desk حسب الضغط المجمع من DXY و WTI و Natural Gas و Gold.',
    hint: 'اضغط على مركز في الكرة او في القائمة لتحديث القراءة.',
    interactionHint: 'اضغط على شريحة في variable pie للتركيز على desk المقابل في الكرة.',
    totalPressure: 'الضغط الكلي',
    corridor: 'الممر',
    topDriver: 'العامل المهيمن',
    pieTitle: 'ترتيب ماكرو بنمط variable pie',
    globeTitle: 'كرة المراكز الكلية',
    rankingTitle: 'اعلى المكاتب حسب الضغط المركب',
    selectedHub: 'المركز المحدد',
    note: 'كل شريحة تمثل مركزا واحدا. الحجم يعكس الضغط الكلي والارتفاع يتبع العامل المهيمن في ذلك desk.',
  },
  zh: {
    eyebrow: 'Macro & Energy Radar',
    title: '宏观驱动的 globe + variable pie 模式',
    subtitle:
      '该读数参考 globe-in-variable-pie demo: 地球仪展示农业交易枢纽，variable pie 按 DXY、WTI、Natural Gas 和 Gold 的综合压力对各 desk 排名。',
    hint: '点击地球仪或列表中的枢纽以更新读数。',
    interactionHint: '点击 variable pie 扇区可聚焦地球仪中的对应交易 desk。',
    totalPressure: '总压力',
    corridor: '通道',
    topDriver: '主导驱动',
    pieTitle: '变量饼图宏观排名',
    globeTitle: '宏观枢纽地球仪',
    rankingTitle: '按综合压力排序的交易 desk',
    selectedHub: '当前枢纽',
    note: '每个扇区代表一个枢纽。大小反映综合压力，高度跟随该 desk 的主导驱动。',
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
  const hubs = useMemo(() => buildMacroHubPoints(drivers), [drivers]);

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

  const globeOptions = useMemo(
    () =>
      ({
        chart: {
          map: worldMap,
          backgroundColor: 'transparent',
          height: 420,
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
          formatter: function (this: any) {
            const point = this as any;
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

  if (!selectedHub || hubs.length === 0) {
    return null;
  }

  return (
    <div className="rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_100%)] p-6 shadow-[0_30px_80px_rgba(2,6,23,0.24)] md:p-7">
      <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-100">
            <Globe2 className="h-3.5 w-3.5" />
            {copy.eyebrow}
          </div>
          <h3 className="text-3xl font-bold tracking-[-0.03em] text-white">{copy.title}</h3>
          <p className="mt-3 text-[1rem] leading-8 text-slate-200">{copy.subtitle}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm leading-7 text-slate-300">
          <div>{copy.hint}</div>
          <div className="text-slate-400">{copy.interactionHint}</div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-5">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/45 p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{copy.globeTitle}</p>
                <h4 className="mt-2 text-2xl font-bold text-white">{selectedHub.country}</h4>
              </div>
              <div className={`text-3xl font-black ${pressureColor(selectedHub.totalPressure)}`}>{selectedHub.totalPressure}</div>
            </div>

            <div className="overflow-hidden rounded-[1.7rem] border border-white/5 bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.18),_transparent_55%),linear-gradient(180deg,rgba(15,23,42,0.9)_0%,rgba(2,6,23,1)_100%)]">
              {worldMap ? (
                <HighchartsReact highcharts={HighchartsMap} constructorType="mapChart" options={globeOptions} />
              ) : (
                <div className="flex h-[420px] items-center justify-center text-slate-300">Loading globe...</div>
              )}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{copy.selectedHub}</p>
                <p className="mt-2 text-base font-semibold text-white">{selectedHub.code3}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{copy.topDriver}</p>
                <p className="mt-2 text-base font-semibold text-white">{topSlice?.label ?? '--'}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{copy.corridor}</p>
                <p className="mt-2 text-base font-semibold text-white">{selectedHub.corridor}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{copy.rankingTitle}</p>
              <span className="rounded-full border border-white/10 bg-slate-950/35 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300">
                {copy.totalPressure}
              </span>
            </div>

            <div className="space-y-3">
              {hubs.map((hub, index) => (
                <button
                  key={hub.code3}
                  type="button"
                  onClick={() => setSelectedCode(hub.code3)}
                  className={`flex w-full items-center justify-between gap-4 rounded-[1.35rem] border px-4 py-3 text-left transition-all ${
                    hub.code3 === selectedHub.code3
                      ? 'border-sky-300/40 bg-sky-300/10'
                      : 'border-white/10 bg-slate-950/35 hover:border-white/20 hover:bg-slate-950/55'
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[11px] font-bold text-slate-200">
                      0{index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">{hub.country}</p>
                      <p className="truncate text-xs uppercase tracking-[0.18em] text-slate-400">{hub.code3}</p>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${pressureColor(hub.totalPressure)}`}>{hub.totalPressure}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[2rem] border border-white/10 bg-slate-50 p-5 text-slate-900">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{copy.pieTitle}</p>
                <h4 className="mt-2 text-2xl font-bold text-slate-900">{selectedHub.country}</h4>
              </div>
              <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                {selectedHub.code3}
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15),_transparent_42%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-2">
              <MacroDriversVariablePie
                titlePressure={copy.totalPressure}
                titleTopDriver={copy.topDriver}
                titleCorridor={copy.corridor}
                hubs={hubs}
                selectedCode={selectedHub.code3}
                onSelect={setSelectedCode}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {selectedHub.slices.map((slice) => (
              <div key={slice.id} className="rounded-[1.7rem] border border-white/10 bg-white/5 p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-white">{slice.label}</span>
                  <span
                    className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
                    style={{ backgroundColor: `${driverColor(slice.id)}22`, color: driverColor(slice.id) }}
                  >
                    {slice.id}
                  </span>
                </div>
                <div className="text-xl font-black text-white">{slice.price.toFixed(2)}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{slice.unit}</div>
                <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-300">{copy.totalPressure}</span>
                  <span className="font-semibold text-white">{slice.impact}</span>
                </div>
                <div className="mt-1 text-sm text-slate-300">{formatPercent(slice.change)}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm leading-7 text-amber-100">
            {copy.note}
          </div>
        </div>
      </div>
    </div>
  );
}
