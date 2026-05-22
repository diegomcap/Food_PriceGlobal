'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Database } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

export function DataSources() {
  const { t } = useTranslation();

  const sources = [
    { name: t('ds_trading_economics'), url: 'https://pt.tradingeconomics.com/world/food-price-index', logo: '/img/logos/trading_economics_manual.png' },
    { name: t('ds_investing'), url: 'https://br.investing.com/commodities/real-time-futures', logo: '/img/logos/investing.png' },
    { name: t('ds_fao'), url: 'https://www.fao.org/worldfoodsituation/foodpricesindex/en/', logo: '/img/logos/fao.svg' },
    { name: t('ds_world_bank'), url: 'https://www.worldbank.org/en/research/commodity-markets', logo: '/img/logos/worldbank.svg' },
    { name: t('ds_imf'), url: 'https://legacydata.imf.org/?sk=2cddccb8-0b59-43e9-b6a0-59210d5605d2&sid=1390030341854', logo: '/img/logos/imf.svg' },
    { name: t('ds_business_insider'), url: 'https://markets.businessinsider.com/commodities', logo: '/img/logos/business_insider.png' },
    { name: t('ds_mitrade'), url: 'https://www.mitrade.com/pt/insights/markets/commodities', logo: '/img/logos/mitrade.png' },
    { name: t('ds_precios_mundi'), url: 'https://pt.preciosmundi.com/', logo: '/img/logos/preciosmundi.png' },
  ];

  return (
    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
      <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Database className="w-5 h-5 text-emerald-600" />
        {t('data_sources_connected')}
      </h4>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {sources.map((source, index) => (
          <Link 
            key={index}
            href={source.url}
            target="_blank"
            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-200 transition-all group h-32 relative"
          >
            <div className="relative w-full h-12 flex items-center justify-center mb-2">
              <Image
                src={source.logo}
                alt={source.name}
                fill
                className="object-contain p-1 filter grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
            <span className="font-medium text-slate-700 text-xs text-center line-clamp-2">{source.name}</span>
            <ExternalLink className="absolute top-2 right-2 w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  );
}
