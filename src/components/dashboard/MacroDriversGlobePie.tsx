'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import HighchartsMap from 'highcharts/highmaps';
import { buildMacroHubPoints, MACRO_CORE_TOP10_CODES } from '@/lib/agroVisualData';
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
  title: string;
  subtitle: string;
  description: string;
  clickHint: string;
  loading: string;
  filterLabel: string;
  top10: string;
  top30: string;
  top100: string;
  all: string;
  totalLabel: string;
  dominantLabel: string;
};

const COPY: Record<SupportedLanguage, Copy> = {
  pt: {
    title: '2026 Top hubs macro por pressao composta',
    subtitle: 'Em pontos compostos usando DXY, WTI, Natural Gas, Gold, ULSD Diesel e Baltic Dry.',
    description:
      'Variable pie interativo indicando os principais hubs macro do agronegocio. O score combina cambio, energia, diesel e frete maritimo e e recalculado a cada atualizacao periodica do feed macro.',
    clickHint: 'Clique em uma fatia para girar o globe ate o pais correspondente.',
    loading: 'Carregando globe...',
    filterLabel: 'Filtro',
    top10: 'Top 10',
    top30: 'Top 30',
    top100: 'Top 100',
    all: 'All',
    totalLabel: 'Pressao combinada',
    dominantLabel: 'Pressao dominante',
  },
  en: {
    title: '2026 Top macro hubs by composite pressure',
    subtitle: 'In composite points using DXY, WTI, Natural Gas, Gold, ULSD Diesel and Baltic Dry.',
    description:
      'Interactive variable pie showing the leading agribusiness macro hubs. The score combines FX, energy, diesel and ocean freight on every periodic macro-feed refresh.',
    clickHint: 'Click a slice to rotate the globe to the corresponding country.',
    loading: 'Loading globe...',
    filterLabel: 'Filter',
    top10: 'Top 10',
    top30: 'Top 30',
    top100: 'Top 100',
    all: 'All',
    totalLabel: 'Combined pressure',
    dominantLabel: 'Dominant pressure',
  },
  es: {
    title: '2026 Top hubs macro por presion compuesta',
    subtitle: 'En puntos compuestos usando DXY, WTI, Natural Gas, Gold, ULSD Diesel y Baltic Dry.',
    description:
      'Variable pie interactivo que muestra los principales hubs macro del agronegocio. El score combina FX, energia, diesel y flete maritimo en cada actualizacion periodica del feed macro.',
    clickHint: 'Haz clic en una porcion para girar el globo al pais correspondiente.',
    loading: 'Cargando globo...',
    filterLabel: 'Filtro',
    top10: 'Top 10',
    top30: 'Top 30',
    top100: 'Top 100',
    all: 'All',
    totalLabel: 'Presion combinada',
    dominantLabel: 'Presion dominante',
  },
  ru: {
    title: '2026 Top macro hubs by composite pressure',
    subtitle: 'In composite points using DXY, WTI, Natural Gas, Gold, ULSD Diesel and Baltic Dry.',
    description:
      'Interactive variable pie showing the leading agribusiness macro hubs. The score combines FX, energy, diesel and ocean freight on every periodic macro-feed refresh.',
    clickHint: 'Click a slice to rotate the globe to the corresponding country.',
    loading: 'Loading globe...',
    filterLabel: 'Filter',
    top10: 'Top 10',
    top30: 'Top 30',
    top100: 'Top 100',
    all: 'All',
    totalLabel: 'Combined pressure',
    dominantLabel: 'Dominant pressure',
  },
  ar: {
    title: 'ابرز المراكز الكلية في 2026 حسب الضغط المركب',
    subtitle: 'بنقاط مركبة تستخدم DXY و WTI و Natural Gas و Gold و ULSD Diesel و Baltic Dry.',
    description:
      'مخطط variable pie تفاعلي يوضح ابرز المراكز الكلية في الاعمال الزراعية. الدرجة تجمع بين العملات والطاقة والديزل والشحن البحري مع كل تحديث دوري للتغذية الكلية.',
    clickHint: 'اضغط على شريحة لتدوير الكرة نحو الدولة المقابلة.',
    loading: 'جار تحميل الكرة...',
    filterLabel: 'الفلتر',
    top10: 'Top 10',
    top30: 'Top 30',
    top100: 'Top 100',
    all: 'الكل',
    totalLabel: 'الضغط المركب',
    dominantLabel: 'الضغط المهيمن',
  },
  zh: {
    title: '2026 年按综合压力排序的宏观枢纽',
    subtitle: '采用 DXY、WTI、Natural Gas、Gold、ULSD Diesel 和 Baltic Dry 的综合评分。',
    description:
      '交互式 variable pie 展示农业业务中的主要宏观枢纽。评分结合外汇、能源、柴油和海运费，并随宏观数据流的周期性更新而重算。',
    clickHint: '点击任一扇区即可将地球仪旋转到对应国家。',
    loading: '正在加载地球仪...',
    filterLabel: '筛选',
    top10: 'Top 10',
    top30: 'Top 30',
    top100: 'Top 100',
    all: '全部',
    totalLabel: '综合压力',
    dominantLabel: '主导压力',
  },
};

type TopFilter = 10 | 30 | 100 | 'all';

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

function getCountryCenters(topology: any) {
  const centers = new Map<string, { lat: number; lon: number; name: string }>();
  const geometries = topology?.objects?.default?.geometries;

  if (!Array.isArray(geometries)) {
    return centers;
  }

  for (const geometry of geometries) {
    const properties = geometry?.properties;
    const code3 = properties?.['iso-a3'];
    const lat = properties?.['hc-middle-lat'];
    const lon = properties?.['hc-middle-lon'];
    const name = properties?.name;

    if (typeof code3 === 'string' && typeof lat === 'number' && typeof lon === 'number') {
      centers.set(code3, { lat, lon, name: typeof name === 'string' ? name : code3 });
    }
  }

  return centers;
}

function pieColor(index: number) {
  const colors = ['#2caffe', '#544fc5', '#00e272', '#fe6a35', '#6b8abc', '#d568fb', '#2ee0ca', '#fa4b42', '#feb56a', '#91e8e1'];
  return colors[index % colors.length];
}

export default function MacroDriversGlobePie({ drivers, language }: Props) {
  const copy = COPY[language] ?? COPY.en;
  const [worldMap, setWorldMap] = useState<any | null>(null);
  const [modulesReady, setModulesReady] = useState(false);
  const [selectedCode, setSelectedCode] = useState('BRA');
  const [topFilter, setTopFilter] = useState<TopFilter>(10);
  const hubs = useMemo(() => buildMacroHubPoints(drivers), [drivers]);
  const graticule = useMemo(() => getGraticule(), []);
  const countryCenters = useMemo(() => getCountryCenters(worldMap), [worldMap]);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      try {
        await import('highcharts/highcharts-more');
        await import('highcharts/modules/variable-pie');
        const response = await fetch('https://code.highcharts.com/mapdata/custom/world.topo.json');
        const topology = await response.json();
        if (!cancelled) {
          setModulesReady(true);
          setWorldMap(topology);
        }
      } catch (error) {
        console.error('Unable to load macro globe topojson:', error);
      }
    }

    setup();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleHubs = useMemo(() => {
    if (topFilter === 'all') {
      return hubs;
    }
    if (topFilter === 10) {
      const coreTopTen = new Set<string>(MACRO_CORE_TOP10_CODES);
      return hubs.filter((hub) => coreTopTen.has(hub.code3)).slice(0, 10);
    }
    return hubs.slice(0, topFilter);
  }, [hubs, topFilter]);

  useEffect(() => {
    if (!visibleHubs.some((hub) => hub.code3 === selectedCode) && visibleHubs[0]) {
      setSelectedCode(visibleHubs[0].code3);
    }
  }, [selectedCode, visibleHubs]);

  const centeredVisibleHubs = useMemo(
    () =>
      visibleHubs.map((hub) => {
        const center = countryCenters.get(hub.code3);

        return {
          ...hub,
          lat: center?.lat ?? hub.lat,
          lon: center?.lon ?? hub.lon,
          country: center?.name ?? hub.country,
        };
      }),
    [countryCenters, visibleHubs]
  );
  const centeredSelectedHub =
    centeredVisibleHubs.find((hub) => hub.code3 === selectedCode) ?? centeredVisibleHubs[0] ?? null;
  const rotation = centeredSelectedHub ? getRotationForHub(centeredSelectedHub.lon, centeredSelectedHub.lat) : [20, -18, 0];

  const mapData = useMemo(
    () =>
      centeredVisibleHubs.map((hub, index) => {
        const topSlice = hub.slices.slice().sort((a, b) => b.impact - a.impact)[0];

        return {
          name: hub.country,
          code3: hub.code3,
          value: hub.totalPressure,
          totalPressure: hub.totalPressure,
          dominantPressure: topSlice?.impact ?? hub.totalPressure,
          lat: hub.lat,
          lon: hub.lon,
          color: pieColor(index),
        };
      }),
    [centeredVisibleHubs]
  );

  const pieData = useMemo(
    () =>
      mapData.map((hub) => ({
        name: hub.name,
        y: hub.totalPressure,
        z: hub.dominantPressure,
        color: hub.color,
        sliced: hub.code3 === selectedCode,
        selected: hub.code3 === selectedCode,
        custom: {
          code3: hub.code3,
          lat: hub.lat,
          lon: hub.lon,
          totalPressure: hub.totalPressure,
          dominantPressure: hub.dominantPressure,
        },
      })),
    [mapData, selectedCode]
  );

  const chartOptions = useMemo(
    () =>
      ({
        chart: {
          map: worldMap,
          backgroundColor: 'transparent',
          height: 730,
          spacingTop: 28,
          spacingRight: 56,
          spacingBottom: 8,
          spacingLeft: 24,
          style: {
            fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
          },
        },
        title: {
          text: copy.title,
          align: 'left',
          margin: 18,
          style: {
            color: '#111827',
            fontSize: '32px',
            fontWeight: '700',
          },
        },
        subtitle: {
          text: copy.subtitle,
          align: 'left',
          style: {
            color: '#6b7280',
            fontSize: '14px',
          },
        },
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
          headerFormat: '',
          pointFormatter: function (this: any) {
            if (typeof this.z === 'number') {
              return `${copy.totalLabel}: <b>${this.y}</b><br/>${copy.dominantLabel}: <b>${this.z}</b>`;
            }

            if (typeof this.value === 'number') {
              return `${this.name}<br/>${copy.totalLabel}: <b>${this.value}</b>`;
            }

            return false;
          },
        },
        plotOptions: {
          series: {
            animation: false,
            clip: false,
            states: {
              inactive: {
                opacity: 1,
              },
            },
          },
          map: {
            joinBy: ['iso-a3', 'code3'],
            borderColor: '#d6d6d6',
            nullColor: '#f1f1f1',
            states: {
              hover: { color: '#9be7b0' },
              select: { color: '#9be7b0' },
            },
            point: {
              events: {
                click: function (this: any) {
                  if (this.options?.code3) {
                    setSelectedCode(this.options.code3);
                  }
                },
              },
            },
          },
          variablepie: {
            minPointSize: 34,
            innerSize: '18%',
            zMin: 0,
            borderRadius: 4,
            borderWidth: 1,
            dataLabels: {
              connectorWidth: 0,
              distance: 26,
              format: '{point.custom.code3}',
              style: {
                color: '#374151',
                fontSize: '11px',
                fontWeight: '700',
                textOutline: 'none',
              },
            },
            point: {
              events: {
                click: function (this: any) {
                  if (this.custom?.code3) {
                    setSelectedCode(this.custom.code3);
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
            color: '#d4d4d4',
            lineWidth: 0.8,
          },
          {
            type: 'map',
            mapData: worldMap,
            data: mapData.map((point) => ({
              ...point,
              selected: point.code3 === selectedCode,
            })),
            borderColor: '#d0d0d0',
            nullColor: '#ededed',
          },
          {
            type: 'variablepie',
            size: '39%',
            center: ['83%', '50%'],
            data: pieData,
          },
        ],
      }) as any,
    [copy, graticule, mapData, pieData, rotation, selectedCode, worldMap]
  );

  if (!centeredSelectedHub || visibleHubs.length === 0) {
    return null;
  }

  return (
    <figure className='rounded-[2rem] bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.18)] md:p-6'>
      <div className='mb-4 flex flex-wrap items-center justify-between gap-3 px-3 pt-1'>
        <div className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>{copy.filterLabel}</div>
        <div className='inline-flex rounded-full border border-slate-200 bg-slate-50 p-1'>
          {[
            { value: 10 as TopFilter, label: copy.top10 },
            { value: 30 as TopFilter, label: copy.top30 },
            { value: 100 as TopFilter, label: copy.top100 },
            { value: 'all' as TopFilter, label: copy.all },
          ].map((option) => {
            const active = topFilter === option.value;
            return (
              <button
                key={String(option.value)}
                type='button'
                onClick={() => setTopFilter(option.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      {worldMap && modulesReady ? (
        <HighchartsReact highcharts={HighchartsMap} constructorType='mapChart' options={chartOptions} />
      ) : (
        <div className='flex h-[730px] items-center justify-center text-slate-500'>{copy.loading}</div>
      )}
      <figcaption className='px-3 pb-1 pt-0 text-sm leading-7 text-slate-600'>
        <p>{copy.description}</p>
        <p className='mt-2 font-medium text-slate-500'>{copy.clickHint}</p>
      </figcaption>
    </figure>
  );
}
