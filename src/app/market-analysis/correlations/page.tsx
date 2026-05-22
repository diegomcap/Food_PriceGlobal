'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/context/TranslationContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { 
  ArrowRightLeft, 
  Info, 
  TrendingUp, 
  TrendingDown, 
  Minus 
} from 'lucide-react';

// Assets included in the matrix
const ASSETS = [
  'asset_soybean',
  'asset_corn',
  'asset_wheat',
  'asset_sugar',
  'asset_coffee',
  'asset_brent_oil',
  'asset_usd_brl',
  'asset_dxy'
];

// Mock Correlation Matrix (8x8)
// Values based on typical market behavior (simplified)
// Rows/Cols match ASSETS order
const CORRELATION_MATRIX = [
  // Soy, Corn, Wht, Sug, Cof, Oil, BRL, DXY
  [ 1.00,  0.85,  0.60,  0.30,  0.25,  0.45, -0.40, -0.65], // Soybean
  [ 0.85,  1.00,  0.65,  0.35,  0.20,  0.55, -0.35, -0.60], // Corn
  [ 0.60,  0.65,  1.00,  0.25,  0.15,  0.40, -0.30, -0.55], // Wheat
  [ 0.30,  0.35,  0.25,  1.00,  0.40,  0.65, -0.25, -0.45], // Sugar (Ethanol link to Oil)
  [ 0.25,  0.20,  0.15,  0.40,  1.00,  0.10, -0.50, -0.30], // Coffee
  [ 0.45,  0.55,  0.40,  0.65,  0.10,  1.00, -0.20, -0.50], // Brent Oil
  [-0.40, -0.35, -0.30, -0.25, -0.50, -0.20,  1.00,  0.80], // USD/BRL (moves with DXY often)
  [-0.65, -0.60, -0.55, -0.45, -0.30, -0.50,  0.80,  1.00], // DXY
];

export default function MarketCorrelationsPage() {
  const { t } = useTranslation();
  const [hoveredCell, setHoveredCell] = useState<{row: number, col: number} | null>(null);

  // Helper to get color based on correlation value
  const getCellColor = (value: number) => {
    if (value === 1) return 'bg-slate-100 text-slate-400'; // Self correlation
    
    // Positive Scale (Green)
    if (value >= 0.8) return 'bg-emerald-600 text-white';
    if (value >= 0.6) return 'bg-emerald-500 text-white';
    if (value >= 0.4) return 'bg-emerald-400 text-emerald-900';
    if (value >= 0.2) return 'bg-emerald-200 text-emerald-900';
    if (value >= 0)   return 'bg-emerald-50 text-emerald-900';
    
    // Negative Scale (Red)
    if (value <= -0.8) return 'bg-red-600 text-white';
    if (value <= -0.6) return 'bg-red-500 text-white';
    if (value <= -0.4) return 'bg-red-400 text-red-900';
    if (value <= -0.2) return 'bg-red-200 text-red-900';
    if (value < 0)     return 'bg-red-50 text-red-900';
    
    return 'bg-slate-50';
  };

  const getCorrelationDescription = (value: number) => {
    if (value >= 0.7) return t('correlation_high_positive');
    if (value >= 0.3) return t('correlation_moderate_positive');
    if (value > -0.3) return t('correlation_neutral');
    if (value > -0.7) return t('correlation_moderate_negative');
    return t('correlation_high_negative');
  };

  const getIconForValue = (value: number) => {
    if (value >= 0.3) return <TrendingUp className="w-5 h-5 text-emerald-600" />;
    if (value <= -0.3) return <TrendingDown className="w-5 h-5 text-red-600" />;
    return <Minus className="w-5 h-5 text-slate-400" />;
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
          <h1 className="text-4xl font-bold text-slate-900">{t('correlations_page_title')}</h1>
          <p className="mt-4 text-xl text-slate-600 max-w-3xl">
            {t('correlations_page_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Matrix Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">{t('correlations_matrix_title')}</h2>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Info className="w-4 h-4" />
                  {t('correlations_explanation').split('.')[0] + '.'}
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider sticky left-0 bg-slate-50 z-10">
                            {/* Empty corner */}
                          </th>
                          {ASSETS.map((asset, idx) => (
                            <th key={idx} scope="col" className="px-2 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider w-20">
                              {t(asset).split(' ')[0]} {/* Shorten name */}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {ASSETS.map((rowAsset, rowIdx) => (
                          <tr key={rowIdx}>
                            <th scope="row" className="px-3 py-3 text-left text-xs font-medium text-slate-900 uppercase tracking-wider sticky left-0 bg-white z-10 border-r border-slate-100">
                              {t(rowAsset)}
                            </th>
                            {CORRELATION_MATRIX[rowIdx].map((value, colIdx) => (
                              <td 
                                key={colIdx}
                                onMouseEnter={() => setHoveredCell({row: rowIdx, col: colIdx})}
                                onMouseLeave={() => setHoveredCell(null)}
                                className={`px-2 py-3 text-center text-xs font-medium cursor-pointer transition-transform hover:scale-110 ${getCellColor(value)}`}
                                title={`${t(rowAsset)} x ${t(ASSETS[colIdx])}: ${value}`}
                              >
                                {value > 0 ? '+' : ''}{value.toFixed(2)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-4 bg-emerald-600 rounded"></div>
                  <span>{t('correlation_high_positive')} (+0.8 ~ +1.0)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-4 bg-emerald-300 rounded"></div>
                  <span>{t('correlation_moderate_positive')} (+0.3 ~ +0.7)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-4 bg-slate-100 border border-slate-200 rounded"></div>
                  <span>{t('correlation_neutral')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-4 bg-red-300 rounded"></div>
                  <span>{t('correlation_moderate_negative')} (-0.3 ~ -0.7)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-4 bg-red-600 rounded"></div>
                  <span>{t('correlation_high_negative')} (-0.8 ~ -1.0)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-blue-600" />
                {t('indicators_summary')}
              </h3>

              {hoveredCell ? (
                <div className="animate-in fade-in duration-200">
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 mb-6">
                    <div className="text-sm text-slate-500 mb-1">{t('indicators_asset_label')} A</div>
                    <div className="text-xl font-bold text-slate-900 mb-4">{t(ASSETS[hoveredCell.row])}</div>
                    
                    <div className="flex justify-center my-2">
                      <div className="p-2 bg-white rounded-full shadow-sm">
                        <ArrowRightLeft className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="text-sm text-slate-500 mb-1">{t('indicators_asset_label')} B</div>
                    <div className="text-xl font-bold text-slate-900">{t(ASSETS[hoveredCell.col])}</div>
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-slate-800 mb-2">
                      {CORRELATION_MATRIX[hoveredCell.row][hoveredCell.col] > 0 ? '+' : ''}
                      {CORRELATION_MATRIX[hoveredCell.row][hoveredCell.col].toFixed(2)}
                    </div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      CORRELATION_MATRIX[hoveredCell.row][hoveredCell.col] > 0 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : CORRELATION_MATRIX[hoveredCell.row][hoveredCell.col] < 0 
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-100 text-slate-800'
                    }`}>
                      {getIconForValue(CORRELATION_MATRIX[hoveredCell.row][hoveredCell.col])}
                      {getCorrelationDescription(CORRELATION_MATRIX[hoveredCell.row][hoveredCell.col])}
                    </div>
                  </div>

                  <div className="text-sm text-slate-600 leading-relaxed">
                    <p>
                      {t('correlations_explanation')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-center p-4">
                  <div className="p-4 bg-slate-50 rounded-full mb-4">
                    <Info className="w-8 h-8" />
                  </div>
                  <p>{t('correlations_explanation')}</p>
                  <p className="text-sm mt-2">Passe o mouse sobre a matriz para ver detalhes.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
