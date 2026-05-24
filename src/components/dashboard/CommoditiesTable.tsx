'use client';

import { useState, useEffect } from 'react';
import { Search, ArrowUp, ArrowDown, Loader2, RefreshCw } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { type SupportedLanguage } from '@/lib/marketTime';
import DataFreshnessBadge from '@/components/dashboard/DataFreshnessBadge';
import PipelineSourceAlert from '@/components/dashboard/PipelineSourceAlert';

interface CommodityData {
  id: string;
  price: number;
  change: number;
  trend: 'up' | 'down';
  category: string;
}

interface CommodityQuote {
  symbol: string;
  price: number;
  previousClose: number;
}

interface CommoditiesApiResponse {
  quotes: CommodityQuote[];
  source: string;
  updatedAt: string;
}

const SYMBOL_MAP: Record<string, { id: string; category: string }> = {
  'ZW=F': { id: 'commodity_wheat', category: 'grains' },
  'ZC=F': { id: 'commodity_corn', category: 'grains' },
  'ZS=F': { id: 'commodity_soybean', category: 'grains' },
  'ZR=F': { id: 'commodity_rice', category: 'grains' },
  'SB=F': { id: 'commodity_sugar', category: 'sugar' },
  'KC=F': { id: 'commodity_coffee_arabica', category: 'other' },
  'CC=F': { id: 'commodity_cocoa', category: 'other' },
  'CT=F': { id: 'commodity_cotton', category: 'other' },
  'LE=F': { id: 'commodity_cattle', category: 'meat' },
  'HE=F': { id: 'commodity_pork', category: 'meat' },
  'DC=F': { id: 'commodity_milk_powder', category: 'dairy' },
  'ZL=F': { id: 'commodity_soy_oil', category: 'oils' },
  'OJ=F': { id: 'commodity_orange', category: 'fruits' },
};

export default function CommoditiesTable() {
  const { t, language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [commodities, setCommodities] = useState<CommodityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [dataSource, setDataSource] = useState<string>('market-data');

  const fetchCommodityData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/commodities');
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      
      const data = await response.json() as CommoditiesApiResponse;
      const results = data.quotes || [];

      if (results.length === 0) {
        throw new Error('Commodities API returned no results');
      }
      
      const newCommodities: CommodityData[] = results.map((item: any) => {
          const symbol = item.symbol;
          // Case-insensitive lookup
          const mapData = SYMBOL_MAP[symbol] || Object.entries(SYMBOL_MAP).find(([key]) => key.toLowerCase() === symbol.toLowerCase())?.[1];
          
          if (!mapData) return null;
          
          const price = item.price;
          const prevClose = item.previousClose;
          const change = ((price - prevClose) / prevClose) * 100;
          
          return {
            id: mapData.id,
            price,
            change,
            trend: change >= 0 ? 'up' : 'down',
            category: mapData.category
          };
        }).filter(Boolean) as CommodityData[];
        
        if (newCommodities.length === 0 && results.length > 0) {
           throw new Error('Failed to parse commodity data');
        }

        setCommodities(newCommodities);
        setLastUpdate(new Date(data.updatedAt || Date.now()));
        setDataSource(data.source || 'market-data');
    } catch (error) {
      console.error('Failed to fetch commodity data:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommodityData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchCommodityData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredData = commodities.filter(item => {
    const name = t(item.id);
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="tabela-commodities" className="py-20 bg-white scroll-mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-green-500 after:rounded-full">
          {t('commodities_table_title')}
        </h2>

        <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder={t('search_commodities')}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4">
                {lastUpdate && (
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <RefreshCw size={12} />
                    {lastUpdate.toLocaleTimeString()}
                  </div>
                )}
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                  {[
                    { id: 'all', label: t('filter_all') },
                    { id: 'grains', label: t('filter_grains') },
                    { id: 'dairy', label: t('filter_dairy') },
                    { id: 'meat', label: t('filter_meat') },
                    { id: 'fruits', label: t('filter_fruits') },
                    { id: 'oils', label: t('filter_oils') },
                    { id: 'other', label: t('filter_other') },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setCategoryFilter(filter.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        categoryFilter === filter.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <DataFreshnessBadge
                dataset="commodities"
                updatedAt={lastUpdate?.toISOString()}
                source={dataSource}
                language={language as SupportedLanguage}
              />
              <PipelineSourceAlert
                dataset="commodities"
                source={dataSource}
                language={language as SupportedLanguage}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="flex items-center gap-2 p-2 text-xs text-slate-500 justify-end border-b border-slate-100 bg-slate-50/30">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {t('realtime_updates')}
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-20 text-slate-400">
                <Loader2 className="animate-spin mr-2" />
                {t('loading_data')}
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">
                <p className="font-bold mb-2">Error loading market data</p>
                <p className="text-sm mb-4">{error}</p>
                <button 
                  onClick={fetchCommodityData}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                >
                  Tentar Novamente
                </button>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 font-semibold text-slate-600">{t('table_commodity')}</th>
                    <th className="px-6 py-4 font-semibold text-slate-600">{t('table_price')}</th>
                    <th className="px-6 py-4 font-semibold text-slate-600">{t('table_variation')}</th>
                    <th className="px-6 py-4 font-semibold text-slate-600">{t('table_trend')}</th>
                    <th className="px-6 py-4 font-semibold text-slate-600">{t('table_category')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{t(item.id)}</td>
                      <td className="px-6 py-4 text-slate-700 font-mono">${item.price.toFixed(2)}</td>
                      <td className={`px-6 py-4 font-semibold ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4">
                        {item.trend === 'up' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                            <ArrowUp size={12} /> {t('trend_high')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                            <ArrowDown size={12} /> {t('trend_low')}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500 capitalize">{item.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            
            {!loading && !error && filteredData.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                {t('no_commodities_found')}
              </div>
            )}
            <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500 text-right italic">
              {t('commodities_table_source')}
              {dataSource === 'fallback' ? ' | fallback snapshot active' : ''}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
