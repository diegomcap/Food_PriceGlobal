'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/context/TranslationContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  RefreshCw, 
  ArrowUp, 
  ArrowDown, 
  Gauge 
} from 'lucide-react';

// Mock Data Types
type Signal = 'buy' | 'sell' | 'neutral' | 'strong_buy' | 'strong_sell';

interface IndicatorData {
  name: string;
  value: number;
  action: Signal;
}

interface MAData {
  period: string;
  simple: number;
  simpleAction: Signal;
  exponential: number;
  exponentialAction: Signal;
}

interface PivotData {
  level: string;
  s3: number;
  s2: number;
  s1: number;
  pivot: number;
  r1: number;
  r2: number;
  r3: number;
}

// Mock Data Generator
const generateMockData = (asset: string) => {
  // Base price based on asset
  let basePrice = 0;
  switch (asset) {
    case 'soybean': basePrice = 1250; break;
    case 'corn': basePrice = 480; break;
    case 'wheat': basePrice = 600; break;
    case 'sugar': basePrice = 22; break;
    default: basePrice = 1000;
  }

  const randomVariation = () => (Math.random() - 0.5) * (basePrice * 0.05);
  
  const oscillators: IndicatorData[] = [
    { name: 'RSI (14)', value: 45 + Math.random() * 30, action: Math.random() > 0.5 ? 'buy' : 'neutral' },
    { name: 'Stochastic %K (14, 3, 3)', value: 30 + Math.random() * 50, action: 'neutral' },
    { name: 'CCI (20)', value: -50 + Math.random() * 100, action: 'sell' },
    { name: 'MACD (12, 26)', value: basePrice * 0.01, action: 'buy' },
    { name: 'Momentum (10)', value: basePrice * 0.02, action: 'buy' },
  ];

  const movingAverages: MAData[] = [
    { period: 'MA5', simple: basePrice + randomVariation(), simpleAction: 'buy', exponential: basePrice + randomVariation(), exponentialAction: 'strong_buy' },
    { period: 'MA10', simple: basePrice + randomVariation(), simpleAction: 'buy', exponential: basePrice + randomVariation(), exponentialAction: 'buy' },
    { period: 'MA20', simple: basePrice + randomVariation(), simpleAction: 'neutral', exponential: basePrice + randomVariation(), exponentialAction: 'buy' },
    { period: 'MA50', simple: basePrice + randomVariation(), simpleAction: 'sell', exponential: basePrice + randomVariation(), exponentialAction: 'sell' },
    { period: 'MA100', simple: basePrice + randomVariation(), simpleAction: 'sell', exponential: basePrice + randomVariation(), exponentialAction: 'sell' },
    { period: 'MA200', simple: basePrice + randomVariation(), simpleAction: 'strong_sell', exponential: basePrice + randomVariation(), exponentialAction: 'strong_sell' },
  ];

  const pivots: PivotData = {
    level: 'Classic',
    s3: basePrice * 0.85,
    s2: basePrice * 0.90,
    s1: basePrice * 0.95,
    pivot: basePrice,
    r1: basePrice * 1.05,
    r2: basePrice * 1.10,
    r3: basePrice * 1.15,
  };

  return { oscillators, movingAverages, pivots };
};

export default function IndicatorsPage() {
  const { t } = useTranslation();
  const [selectedAsset, setSelectedAsset] = useState('soybean');
  const [data, setData] = useState(generateMockData('soybean'));

  const handleAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const asset = e.target.value;
    setSelectedAsset(asset);
    setData(generateMockData(asset));
  };

  const getSignalColor = (signal: Signal) => {
    switch (signal) {
      case 'strong_buy': return 'text-emerald-600 bg-emerald-50';
      case 'buy': return 'text-emerald-500 bg-emerald-50/50';
      case 'strong_sell': return 'text-red-600 bg-red-50';
      case 'sell': return 'text-red-500 bg-red-50/50';
      case 'neutral': return 'text-slate-500 bg-slate-50';
      default: return 'text-slate-500';
    }
  };

  const getSignalText = (signal: Signal) => {
    switch (signal) {
      case 'strong_buy': return t('signal_strong_buy');
      case 'buy': return t('indicators_buy'); // Using existing keys for consistency where possible, or new ones
      case 'strong_sell': return t('signal_strong_sell');
      case 'sell': return t('indicators_sell');
      case 'neutral': return t('indicators_neutral');
      default: return signal;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-24 pb-12 px-4 container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/#analise-mercado" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Voltar
          </Link>
          <h1 className="text-4xl font-bold text-slate-900">{t('indicators_page_title')}</h1>
          <p className="mt-4 text-xl text-slate-600 max-w-3xl">
            {t('indicators_page_desc')}
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <label className="text-sm font-medium text-slate-700 whitespace-nowrap">
              {t('indicators_asset_label')}:
            </label>
            <select
              value={selectedAsset}
              onChange={handleAssetChange}
              className="block w-full sm:w-64 rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-slate-700"
            >
              <option value="soybean">{t('commodity_soybean')}</option>
              <option value="corn">{t('commodity_corn')}</option>
              <option value="wheat">{t('commodity_wheat')}</option>
              <option value="sugar">{t('commodity_sugar')}</option>
              <option value="coffee">{t('commodity_coffee_arabica')}</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Data
            </span>
          </div>
        </div>

        {/* Summary Gauge (Simplified Visual) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8 text-center">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center justify-center gap-2">
            <Gauge className="w-5 h-5 text-emerald-600" />
            {t('indicators_summary')}
          </h2>
          <div className="flex items-center justify-center gap-1 mb-4">
            <div className="h-4 w-16 bg-red-600 rounded-l-full opacity-20"></div>
            <div className="h-4 w-16 bg-red-400 opacity-20"></div>
            <div className="h-4 w-16 bg-slate-300 opacity-20"></div>
            <div className="h-4 w-16 bg-emerald-400"></div> {/* Active state mock */}
            <div className="h-4 w-16 bg-emerald-600 rounded-r-full opacity-20"></div>
          </div>
          <div className="text-3xl font-bold text-emerald-600">
            {t('indicators_buy')}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Oscillators */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                {t('indicators_oscillators')}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-3">{t('table_commodity')}</th>
                    <th className="px-6 py-3 text-right">{t('indicator_value')}</th>
                    <th className="px-6 py-3 text-right">{t('indicator_action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.oscillators.map((osc, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{osc.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 text-right">{osc.value.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSignalColor(osc.action)}`}>
                          {getSignalText(osc.action)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Moving Averages */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                {t('indicators_moving_averages')}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-3">{t('indicator_period')}</th>
                    <th className="px-6 py-3 text-right">{t('indicator_simple')}</th>
                    <th className="px-6 py-3 text-right">{t('indicator_exponential')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.movingAverages.map((ma, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{ma.period}</td>
                      <td className="px-6 py-4 text-sm text-right">
                        <div className="text-slate-900">{ma.simple.toFixed(2)}</div>
                        <span className={`text-xs ${getSignalColor(ma.simpleAction).split(' ')[0]}`}>
                          {getSignalText(ma.simpleAction)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <div className="text-slate-900">{ma.exponential.toFixed(2)}</div>
                        <span className={`text-xs ${getSignalColor(ma.exponentialAction).split(' ')[0]}`}>
                          {getSignalText(ma.exponentialAction)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pivot Points (Full Width) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden lg:col-span-2">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Minus className="w-5 h-5 text-blue-600" />
                {t('indicators_pivots')}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-3 text-left">{t('pivot_classic')}</th>
                    <th className="px-6 py-3">S3</th>
                    <th className="px-6 py-3">S2</th>
                    <th className="px-6 py-3">S1</th>
                    <th className="px-6 py-3 text-slate-900 font-bold">PIVOT</th>
                    <th className="px-6 py-3">R1</th>
                    <th className="px-6 py-3">R2</th>
                    <th className="px-6 py-3">R3</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50 transition-colors text-center">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 text-left">{t('pivot_classic')}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{data.pivots.s3.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{data.pivots.s2.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{data.pivots.s1.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{data.pivots.pivot.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{data.pivots.r1.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{data.pivots.r2.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{data.pivots.r3.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
