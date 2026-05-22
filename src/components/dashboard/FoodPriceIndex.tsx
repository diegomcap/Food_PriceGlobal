'use client';

import { TrendingUp, Calendar } from 'lucide-react';
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

export function FoodPriceIndex() {
  const { t } = useTranslation();

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
    labels: [
      t('month_jan'), t('month_feb'), t('month_mar'), t('month_apr'), 
      t('month_may'), t('month_jun'), t('month_jul'), t('month_aug'), 
      t('month_sep'), t('month_oct'), t('month_nov'), t('month_dec')
    ],
    datasets: [
      {
        fill: true,
        label: t('price_index_label'),
        data: [118.5, 117.3, 116.8, 119.1, 120.4, 122.8, 124.0, 121.4, 121.5, 120.6, 125.4, 128.0],
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
                128.0
              </div>
              <div className="flex items-center justify-end gap-1 text-green-600 font-bold text-sm">
                <TrendingUp className="w-4 h-4" />
                +0.5%
              </div>
            </div>
            <div className="h-12 w-px bg-slate-100 hidden md:block"></div>
            <div className="text-left hidden md:block">
              <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                <Calendar className="w-4 h-4" />
                {t('month_dec_full')}
              </div>
              <div className="text-xs text-slate-400 mt-1">{t('last_update')}</div>
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
