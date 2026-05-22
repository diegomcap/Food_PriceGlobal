'use client';

import { useState } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
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

export function TrendsSection() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('cereals');

  const getChartData = (category: string) => {
    const labels = [t('month_jan'), t('month_feb'), t('month_mar'), t('month_apr'), t('month_may'), t('month_jun')];
    let dataPoints = [];
    let color = '';
    let label = '';

    switch (category) {
      case 'cereals':
        dataPoints = [115, 114, 112, 110, 108, 106.5];
        color = '#ef4444'; // Red for down
        label = t('cereals_tab');
        break;
      case 'oils':
        dataPoints = [130, 132, 135, 134, 136, 139];
        color = '#10b981'; // Green for up
        label = t('oils_tab');
        break;
      case 'meat':
        dataPoints = [110, 111, 112, 114, 115, 117.5];
        color = '#10b981';
        label = t('meat_tab');
        break;
      case 'dairy':
        dataPoints = [120, 120, 121, 120, 121, 121.6];
        color = '#10b981';
        label = t('dairy_tab');
        break;
      case 'sugar':
        dataPoints = [140, 138, 135, 130, 128, 121.5];
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
  const isPositive = activeTab === 'oils' || activeTab === 'meat' || activeTab === 'dairy';

  return (
    <div id="tendencias" className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 mb-12 scroll-mt-24">
      <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-100 pb-4">
        {['cereals', 'oils', 'meat', 'dairy', 'sugar'].map((tab) => (
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
                    {
                      activeTab === 'cereals' ? t('cereals_trend_title') :
                      activeTab === 'oils' ? t('oils_trend_title') :
                      activeTab === 'meat' ? t('meat_trend_title') :
                      activeTab === 'dairy' ? t('dairy_trend_title') : t('sugar_trend_title')
                    }
                  </h4>
                  <p className="text-slate-600 text-lg">
                    {activeTab === 'cereals' && t('cereals_trend_description')}
                    {activeTab === 'oils' && t('oils_trend_description')}
                    {activeTab === 'meat' && t('meat_trend_description')}
                    {activeTab === 'dairy' && t('dairy_trend_description')}
                    {activeTab === 'sugar' && t('sugar_trend_description')}
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
