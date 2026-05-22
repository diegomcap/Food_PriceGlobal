'use client';

import { useEffect, useMemo, useState } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { formatMonthYear, getLocale, type SupportedLanguage } from '@/lib/marketTime';
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

type CategoryKey = 'cereals' | 'oils' | 'meat' | 'dairy' | 'sugar';

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
};

const CATEGORY_TABS: CategoryKey[] = ['cereals', 'oils', 'meat', 'dairy', 'sugar'];

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

export function TrendsSection() {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState<CategoryKey>('cereals');
  const [faoData, setFaoData] = useState<FaoApiResponse | null>(null);

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
        console.error('Falling back to local trend data:', error);
        if (!cancelled) {
          setFaoData({
            latest: fallbackSeries[fallbackSeries.length - 1],
            previous: fallbackSeries[fallbackSeries.length - 2],
            series: fallbackSeries,
          });
        }
      }
    }

    loadFoodPriceIndex();
    return () => {
      cancelled = true;
    };
  }, []);

  const series = faoData?.series ?? fallbackSeries;
  const chartSeries = useMemo(() => series.slice(-6), [series]);
  const latest = faoData?.latest ?? series[series.length - 1];
  const previous = faoData?.previous ?? series[series.length - 2];
  const sixMonthsAgo = series[Math.max(0, series.length - 6)];
  const activeLanguage = language as SupportedLanguage;

  function getValue(record: FaoRecord, category: CategoryKey) {
    return record[category];
  }

  function getTabLabel(category: CategoryKey) {
    switch (category) {
      case 'cereals':
        return t('cereals_tab');
      case 'oils':
        return t('oils_tab');
      case 'meat':
        return t('meat_tab');
      case 'dairy':
        return t('dairy_tab');
      case 'sugar':
        return t('sugar_tab');
    }
  }

  function getTrendTitle(category: CategoryKey) {
    switch (category) {
      case 'cereals':
        return t('cereals_trend_title');
      case 'oils':
        return t('oils_trend_title');
      case 'meat':
        return t('meat_trend_title');
      case 'dairy':
        return t('dairy_trend_title');
      case 'sugar':
        return t('sugar_trend_title');
    }
  }

  function buildTrendDescription(category: CategoryKey) {
    const latestValue = getValue(latest, category);
    const previousValue = getValue(previous, category);
    const sixMonthValue = getValue(sixMonthsAgo, category);
    const monthlyChange = previousValue === 0 ? 0 : ((latestValue - previousValue) / previousValue) * 100;
    const sixMonthChange = sixMonthValue === 0 ? 0 : ((latestValue - sixMonthValue) / sixMonthValue) * 100;
    const latestMonth = formatMonthYear(parseRecordDate(latest.date), activeLanguage);
    const label = getTabLabel(category);
    const monthlyVerbPt = monthlyChange >= 0 ? 'subiu' : 'caiu';
    const sixMonthPt = sixMonthChange >= 0 ? 'acima do patamar de seis meses atrás' : 'abaixo do patamar de seis meses atrás';

    switch (activeLanguage) {
      case 'pt':
        return `O índice de ${label.toLowerCase()} ${monthlyVerbPt} ${Math.abs(monthlyChange).toFixed(1)}% em ${latestMonth}, marcando ${latestValue.toFixed(1)} pontos e permanecendo ${sixMonthPt}.`;
      case 'es':
        return `El índice de ${label.toLowerCase()} ${monthlyChange >= 0 ? 'subió' : 'cayó'} ${Math.abs(monthlyChange).toFixed(1)}% en ${latestMonth}, hasta ${latestValue.toFixed(1)} puntos, ${sixMonthChange >= 0 ? 'por encima' : 'por debajo'} del nivel de hace seis meses.`;
      case 'ru':
        return `Индекс ${label.toLowerCase()} ${monthlyChange >= 0 ? 'вырос' : 'снизился'} на ${Math.abs(monthlyChange).toFixed(1)}% в ${latestMonth}, достигнув ${latestValue.toFixed(1)} пункта и оставаясь ${sixMonthChange >= 0 ? 'выше' : 'ниже'} уровня шестимесячной давности.`;
      case 'ar':
        return `مؤشر ${label} ${monthlyChange >= 0 ? 'ارتفع' : 'انخفض'} ${Math.abs(monthlyChange).toFixed(1)}% في ${latestMonth} إلى ${latestValue.toFixed(1)} نقطة، وهو ${sixMonthChange >= 0 ? 'أعلى' : 'أدنى'} من مستوى قبل ستة أشهر.`;
      case 'zh':
        return `${latestMonth}${label}指数${monthlyChange >= 0 ? '上涨' : '下跌'}${Math.abs(monthlyChange).toFixed(1)}%，至 ${latestValue.toFixed(1)} 点，处于${sixMonthChange >= 0 ? '高于' : '低于'}六个月前的水平。`;
      default:
        return `The ${label.toLowerCase()} index ${monthlyChange >= 0 ? 'rose' : 'fell'} ${Math.abs(monthlyChange).toFixed(1)}% in ${latestMonth}, reaching ${latestValue.toFixed(1)} points and staying ${sixMonthChange >= 0 ? 'above' : 'below'} the level seen six months ago.`;
    }
  }

  const getChartData = (category: CategoryKey) => {
    const labels = chartSeries.map((record) =>
      new Intl.DateTimeFormat(getLocale(activeLanguage), {
        month: 'short',
      }).format(parseRecordDate(record.date))
    );
    let dataPoints: number[] = [];
    let color = '';
    let label = '';

    switch (category) {
      case 'cereals':
        dataPoints = chartSeries.map((record) => record.cereals);
        color = '#ef4444'; // Red for down
        label = t('cereals_tab');
        break;
      case 'oils':
        dataPoints = chartSeries.map((record) => record.oils);
        color = '#10b981'; // Green for up
        label = t('oils_tab');
        break;
      case 'meat':
        dataPoints = chartSeries.map((record) => record.meat);
        color = '#10b981';
        label = t('meat_tab');
        break;
      case 'dairy':
        dataPoints = chartSeries.map((record) => record.dairy);
        color = '#10b981';
        label = t('dairy_tab');
        break;
      case 'sugar':
        dataPoints = chartSeries.map((record) => record.sugar);
        color = '#ef4444';
        label = t('sugar_tab');
        break;
      default:
        dataPoints = [100, 100, 100, 100, 100, 100];
        color = '#94a3b8';
        label = t('trend_data_default');
    }

    return {
      labels,
      datasets: [
        {
          fill: true,
          label,
          data: dataPoints,
          borderColor: color,
          backgroundColor: color === '#10b981' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: color,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
        },
      ],
    };
  };

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
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: '#f1f5f9',
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  const currentData = getChartData(activeTab);
  const currentLatest = getValue(latest, activeTab);
  const currentPrevious = getValue(previous, activeTab);
  const isPositive = currentLatest - currentPrevious >= 0;

  return (
    <div id="tendencias" className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 mb-12 scroll-mt-24">
      <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-100 pb-4">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              activeTab === tab 
                ? 'bg-slate-800 text-white shadow-lg shadow-slate-200' 
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab === 'cereals' && t('cereals_tab')}
            {tab === 'oils' && t('oils_tab')}
            {tab === 'meat' && t('meat_tab')}
            {tab === 'dairy' && t('dairy_tab')}
            {tab === 'sugar' && t('sugar_tab')}
          </button>
        ))}
      </div>

      <div className="bg-slate-50 rounded-2xl p-8">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="lg:w-1/3">
             <div className="flex items-start gap-4 mb-6">
                <div className={`p-4 rounded-2xl ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {isPositive ? <TrendingUp className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">
                    {getTrendTitle(activeTab)}
                  </h4>
                  <p className="text-slate-600 text-lg">
                    {buildTrendDescription(activeTab)}
                  </p>
                </div>
              </div>
          </div>
          
          <div className="lg:w-2/3 h-[300px] w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <Line options={options} data={currentData} />
          </div>
        </div>
      </div>
    </div>
  );
}
