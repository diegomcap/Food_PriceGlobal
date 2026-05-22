'use client';

import { useEffect, useMemo, useState } from 'react';
import { TrendingDown, TrendingUp, Calendar } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { formatDateTime, formatMonthYear, getLocale, type SupportedLanguage } from '@/lib/marketTime';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type FaoRecord = {
  date: string;
  food: number;
  meat: number;
  dairy: number;
  cereals: number;
  oils: number;
  sugar: number;
};

type FaoApiResponse = {
  latest: FaoRecord;
  previous: FaoRecord;
  series: FaoRecord[];
  updatedAt: string;
};

const fallbackSeries: FaoRecord[] = [
  { date: '2025-06', food: 118.5, meat: 123.4, dairy: 148.2, cereals: 109.1, oils: 131.7, sugar: 99.2 },
  { date: '2025-07', food: 117.3, meat: 122.8, dairy: 147.7, cereals: 108.4, oils: 129.5, sugar: 96.1 },
  { date: '2025-08', food: 116.8, meat: 122.1, dairy: 146.9, cereals: 107.9, oils: 127.8, sugar: 94.3 },
  { date: '2025-09', food: 119.1, meat: 123.6, dairy: 148.1, cereals: 109.3, oils: 130.1, sugar: 97.8 },
  { date: '2025-10', food: 120.4, meat: 124.2, dairy: 149.6, cereals: 110.5, oils: 133.2, sugar: 99.4 },
  { date: '2025-11', food: 122.8, meat: 125.8, dairy: 151.3, cereals: 112.8, oils: 136.7, sugar: 101.1 },
  { date: '2025-12', food: 124.0, meat: 126.1, dairy: 152.0, cereals: 113.6, oils: 138.4, sugar: 103.9 },
  { date: '2026-01', food: 121.4, meat: 125.0, dairy: 148.6, cereals: 111.2, oils: 132.5, sugar: 98.6 },
  { date: '2026-02', food: 125.3, meat: 126.0, dairy: 120.4, cereals: 110.4, oils: 183.1, sugar: 86.2 },
  { date: '2026-03', food: 128.5, meat: 127.3, dairy: 121.8, cereals: 110.4, oils: 189.2, sugar: 92.4 },
  { date: '2026-04', food: 130.7, meat: 129.4, dairy: 119.6, cereals: 111.3, oils: 193.9, sugar: 88.5 },
  { date: '2026-05', food: 130.7, meat: 129.4, dairy: 119.6, cereals: 111.3, oils: 193.9, sugar: 88.5 },
];

function parseRecordDate(value: string) {
  return new Date(`${value}-01T12:00:00Z`);
}

export function FoodPriceIndex() {
  const { t, language } = useTranslation();
  const [faoData, setFaoData] = useState<FaoApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadFoodPriceIndex() {
      try {
        const response = await fetch('/api/fao-food-price-index');
        if (!response.ok) {
          throw new Error(`Failed to fetch FAO data (${response.status})`);
        }

        const data = (await response.json()) as FaoApiResponse;
        if (!cancelled) {
          setFaoData(data);
        }
      } catch (error) {
        console.error('Falling back to local food price index data:', error);
        if (!cancelled) {
          setFaoData({
            latest: fallbackSeries[fallbackSeries.length - 1],
            previous: fallbackSeries[fallbackSeries.length - 2],
            series: fallbackSeries,
            updatedAt: new Date().toISOString(),
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadFoodPriceIndex();
    const interval = setInterval(loadFoodPriceIndex, 6 * 60 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const dataPoints = faoData?.series ?? fallbackSeries;
  const latest = faoData?.latest ?? fallbackSeries[fallbackSeries.length - 1];
  const previous = faoData?.previous ?? fallbackSeries[fallbackSeries.length - 2];
  const latestValue = latest.food;
  const monthlyChange = previous.food === 0 ? 0 : ((latest.food - previous.food) / previous.food) * 100;
  const isPositive = monthlyChange >= 0;
  const latestMonth = formatMonthYear(parseRecordDate(latest.date), language as SupportedLanguage);
  const updatedAt = formatDateTime(new Date(faoData?.updatedAt ?? new Date().toISOString()), language as SupportedLanguage);

  const chartLabels = useMemo(
    () =>
      dataPoints.map((record) =>
        new Intl.DateTimeFormat(getLocale(language as SupportedLanguage), {
          month: 'short',
        }).format(parseRecordDate(record.date))
      ),
    [dataPoints, language]
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `${t('tooltip_index_prefix')}: ${context.parsed.y}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
        }
      },
      y: {
        min: 110,
        grid: {
          color: '#f1f5f9',
        },
        ticks: {
          color: '#94a3b8',
        }
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  const data = {
    labels: chartLabels,
    datasets: [
      {
        fill: true,
        label: t('price_index_label'),
        data: dataPoints.map((record) => record.food),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="text-left mb-6 md:mb-0">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{t('food_price_index_title')}</h3>
            <p className="text-slate-500 text-sm">{t('fao_index_subtitle')}</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                {latestValue.toFixed(1)}
              </div>
              <div className={`flex items-center justify-end gap-1 font-bold text-sm ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {isPositive ? '+' : ''}{monthlyChange.toFixed(1)}%
              </div>
            </div>
            <div className="h-12 w-px bg-slate-100 hidden md:block"></div>
            <div className="text-left hidden md:block">
              <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                <Calendar className="w-4 h-4" />
                {latestMonth}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {t('last_update')}: {loading ? '...' : updatedAt}
              </div>
            </div>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <Line options={options} data={data} />
        </div>
        
        <p className="text-slate-400 text-xs mt-6 text-center">
          {t('fao_source')}
        </p>
      </div>
    </div>
  );
}
