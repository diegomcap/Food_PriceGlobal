'use client';

import { useState } from 'react';
import { fundsData } from '@/data/funds';
import { Landmark, Search, Filter, ExternalLink } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import NextImage from 'next/image';

export default function FundsSection() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [focusFilter, setFocusFilter] = useState('all');

  const filteredFunds = fundsData.filter(fund => {
    const matchesSearch = fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t(fund.country).toLowerCase().includes(searchTerm.toLowerCase()) ||
                          fund.tags.some(tag => t(tag).toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRegion = regionFilter === 'all' || fund.region === regionFilter;
    const matchesFocus = focusFilter === 'all' || fund.tags.some(tag => tag.includes(focusFilter));
    
    return matchesSearch && matchesRegion && matchesFocus;
  });

  return (
    <section id="fundos-estatais" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
            <Landmark className="text-blue-600" size={32} />
            {t('funds_title')}
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-slate-600">
            {t('funds_description')}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder={t('search_placeholder')}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0">
              <div className="relative min-w-[200px]">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <select
                  className="w-full pl-10 pr-8 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                >
                  <option value="all">{t('all_regions')}</option>
                  <option value="mena">{t('region_mena')}</option>
                  <option value="asia">{t('region_asia')}</option>
                  <option value="europe">{t('region_europe')}</option>
                  <option value="americas">{t('region_americas')}</option>
                </select>
              </div>

              <div className="relative min-w-[200px]">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <select
                  className="w-full pl-10 pr-8 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
                  value={focusFilter}
                  onChange={(e) => setFocusFilter(e.target.value)}
                >
                  <option value="all">{t('all_focus_areas')}</option>
                  <option value="infrastructure">{t('focus_infrastructure')}</option>
                  <option value="agriculture">{t('focus_agriculture')}</option>
                  <option value="health">{t('focus_health')}</option>
                  <option value="education">{t('focus_education')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Grid */}
        {filteredFunds.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredFunds.map((fund, index) => (
              <a
                key={index}
                href={fund.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 group h-full relative"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <ExternalLink size={16} className="text-blue-500" />
                </div>
                
                <div className="relative w-full h-32 mb-6 flex items-center justify-center bg-slate-50 rounded-lg p-4 group-hover:bg-blue-50/30 transition-colors">
                  {fund.logo ? (
                    <NextImage 
                      src={fund.logo} 
                      alt={fund.name} 
                      fill
                      className="object-contain p-2 mix-blend-multiply filter transition-all duration-300"
                    />
                  ) : (
                    <Landmark size={48} className="text-slate-300" />
                  )}
                </div>
                
                <div className="text-center flex-grow flex flex-col justify-between w-full">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {fund.name}
                    </h3>
                    <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-medium">
                      {t(fund.country)}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-1 mt-2">
                    {fund.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                        {t(tag)}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-100">
            <Search className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">{t('no_results_found')}</h3>
            <p className="text-slate-500">{t('try_adjusting_search')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
