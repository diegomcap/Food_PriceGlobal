'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/context/TranslationContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { 
  Calendar as CalendarIcon, 
  Filter, 
  MapPin, 
  Sprout, 
  Tractor 
} from 'lucide-react';

interface CalendarEvent {
  id: number;
  crop: string;
  region: string;
  planting: number[]; // Months (1-12)
  harvest: number[]; // Months (1-12)
}

const CALENDAR_DATA: CalendarEvent[] = [
  // Soybean
  { id: 1, crop: 'soybean', region: 'brazil', planting: [10, 11, 12], harvest: [1, 2, 3, 4] },
  { id: 2, crop: 'soybean', region: 'usa', planting: [5, 6], harvest: [9, 10, 11] },
  { id: 3, crop: 'soybean', region: 'argentina', planting: [10, 11, 12, 1], harvest: [3, 4, 5] },
  
  // Corn
  { id: 4, crop: 'corn', region: 'brazil', planting: [9, 10, 11, 12], harvest: [2, 3, 4, 5] }, // 1st Crop
  { id: 5, crop: 'corn', region: 'usa', planting: [4, 5], harvest: [9, 10, 11] },
  { id: 6, crop: 'corn', region: 'argentina', planting: [9, 10, 11], harvest: [3, 4, 5] },
  { id: 7, crop: 'corn', region: 'ukraine', planting: [4, 5], harvest: [9, 10] }, // Black Sea
  
  // Wheat
  { id: 8, crop: 'wheat', region: 'usa', planting: [9, 10], harvest: [6, 7] }, // Winter Wheat
  { id: 9, crop: 'wheat', region: 'europe', planting: [9, 10, 11], harvest: [7, 8] },
  { id: 10, crop: 'wheat', region: 'russia', planting: [8, 9, 10], harvest: [7, 8] }, // Black Sea
  { id: 11, crop: 'wheat', region: 'argentina', planting: [5, 6, 7], harvest: [11, 12] },
  
  // Sugar
  { id: 12, crop: 'sugar', region: 'brazil', planting: [1, 2, 3], harvest: [4, 5, 6, 7, 8, 9, 10, 11] }, // Center-South
  { id: 13, crop: 'sugar', region: 'india', planting: [10, 11, 2, 3], harvest: [10, 11, 12, 1, 2, 3] },
  
  // Coffee
  { id: 14, crop: 'coffee', region: 'brazil', planting: [10, 11, 12, 1], harvest: [5, 6, 7, 8] },
  { id: 15, crop: 'coffee', region: 'vietnam', planting: [5, 6], harvest: [11, 12, 1] },
];

const MONTHS = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun', 
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
];

export default function AgriculturalCalendarPage() {
  const { t } = useTranslation();
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState('all');

  const currentMonth = new Date().getMonth() + 1; // 1-12

  const filteredData = CALENDAR_DATA.filter(item => {
    const matchRegion = selectedRegion === 'all' || item.region === selectedRegion;
    const matchCrop = selectedCrop === 'all' || item.crop === selectedCrop;
    return matchRegion && matchCrop;
  });

  const getRegionLabel = (region: string) => {
    switch (region) {
      case 'brazil': return t('calendar_brazil');
      case 'usa': return t('calendar_usa');
      case 'argentina': return t('calendar_argentina');
      case 'europe': return t('calendar_europe');
      case 'russia': 
      case 'ukraine': return t('calendar_black_sea');
      case 'india': return 'India'; // Fallback if no key
      case 'vietnam': return 'Vietnam'; // Fallback
      default: return region;
    }
  };

  const getCropLabel = (crop: string) => {
    switch (crop) {
      case 'soybean': return t('calendar_soybean');
      case 'corn': return t('calendar_corn');
      case 'wheat': return t('calendar_wheat');
      case 'sugar': return t('calendar_sugar');
      case 'coffee': return t('calendar_coffee');
      case 'cotton': return t('calendar_cotton');
      default: return crop;
    }
  };

  // Check if a month index (1-12) is in the array
  const isMonthActive = (monthIdx: number, months: number[]) => {
    return months.includes(monthIdx);
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
          <h1 className="text-4xl font-bold text-slate-900">{t('calendar_page_title')}</h1>
          <p className="mt-4 text-xl text-slate-600 max-w-3xl">
            {t('calendar_page_desc')}
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Region Filter */}
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-slate-400" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="block w-full sm:w-48 rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-slate-700"
              >
                <option value="all">{t('calendar_filter_region')}</option>
                <option value="brazil">{t('calendar_brazil')}</option>
                <option value="usa">{t('calendar_usa')}</option>
                <option value="argentina">{t('calendar_argentina')}</option>
                <option value="europe">{t('calendar_europe')}</option>
              </select>
            </div>

            {/* Crop Filter */}
            <div className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-slate-400" />
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="block w-full sm:w-48 rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-slate-700"
              >
                <option value="all">{t('calendar_filter_crop')}</option>
                <option value="soybean">{t('calendar_soybean')}</option>
                <option value="corn">{t('calendar_corn')}</option>
                <option value="wheat">{t('calendar_wheat')}</option>
                <option value="sugar">{t('calendar_sugar')}</option>
                <option value="coffee">{t('calendar_coffee')}</option>
              </select>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-emerald-500"></div>
              <span className="text-slate-600">{t('calendar_planting')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-400"></div>
              <span className="text-slate-600">{t('calendar_harvest')}</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              {/* Header Row (Months) */}
              <div className="grid grid-cols-[200px_1fr] border-b border-slate-200 bg-slate-50">
                <div className="p-4 font-semibold text-slate-700 flex items-center">
                  {t('calendar_legend')}
                </div>
                <div className="grid grid-cols-12 divide-x divide-slate-200">
                  {MONTHS.map((month, idx) => (
                    <div 
                      key={month} 
                      className={`p-3 text-center text-sm font-medium uppercase ${
                        (idx + 1) === currentMonth ? 'bg-blue-50 text-blue-700' : 'text-slate-500'
                      }`}
                    >
                      {t(`month_${month}`)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Rows */}
              <div className="divide-y divide-slate-100">
                {filteredData.map((item) => (
                  <div key={item.id} className="grid grid-cols-[200px_1fr] hover:bg-slate-50/50 transition-colors">
                    <div className="p-4 flex flex-col justify-center border-r border-slate-100">
                      <span className="font-semibold text-slate-900">{getCropLabel(item.crop)}</span>
                      <span className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {getRegionLabel(item.region)}
                      </span>
                    </div>
                    <div className="grid grid-cols-12 divide-x divide-slate-100 relative">
                      {/* Current Month Indicator Line */}
                      <div 
                        className="absolute top-0 bottom-0 border-l-2 border-blue-400 border-dashed z-10 pointer-events-none"
                        style={{ left: `${((currentMonth - 1) / 12) * 100}%` }}
                      ></div>

                      {MONTHS.map((_, idx) => {
                        const monthNum = idx + 1;
                        const isPlanting = isMonthActive(monthNum, item.planting);
                        const isHarvest = isMonthActive(monthNum, item.harvest);
                        
                        return (
                          <div key={idx} className="h-20 p-1 relative flex flex-col justify-center gap-1">
                            {isPlanting && (
                              <div 
                                className="h-6 w-full bg-emerald-500 rounded-sm shadow-sm flex items-center justify-center group cursor-help"
                                title={`${t('calendar_planting')}: ${getCropLabel(item.crop)} (${getRegionLabel(item.region)})`}
                              >
                                <Sprout className="w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            )}
                            {isHarvest && (
                              <div 
                                className="h-6 w-full bg-amber-400 rounded-sm shadow-sm flex items-center justify-center group cursor-help"
                                title={`${t('calendar_harvest')}: ${getCropLabel(item.crop)} (${getRegionLabel(item.region)})`}
                              >
                                <Tractor className="w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">
          * {t('calendar_page_desc')}
        </div>
      </div>
      <Footer />
    </div>
  );
}
