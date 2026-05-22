'use client';

import { ExternalLink } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import Image from 'next/image';

export default function CommodityLinks() {
  const { t } = useTranslation();

  const links = [
    { name: t('link_usda'), url: 'https://www.usda.gov', logo: '/img/logos/usda.svg' },
    { name: t('link_fao'), url: 'https://www.fao.org', logo: '/img/logos/fao.svg' },
    { name: t('link_worldbank'), url: 'https://www.worldbank.org/en/research/commodity-markets', logo: '/img/logos/worldbank.svg' },
    { name: t('link_imf'), url: 'https://www.imf.org/en/Research/commodity-prices', logo: '/img/logos/imf.svg' },
    { name: t('link_bloomberg'), url: 'https://www.bloomberg.com/markets/commodities', logo: '/img/logos/bloomberg.svg' },
    { name: t('link_investing'), url: 'https://www.investing.com/commodities', logo: '/img/logos/investing.png' },
    { name: t('link_index_mundi'), url: 'https://www.indexmundi.com/commodities/', logo: '/img/logos/indexmundi.png' },
    { name: t('link_trading_economics'), url: 'https://tradingeconomics.com/commodity/food', logo: '/img/logos/trading_economics_manual.png' },
    { name: t('link_precios_mundi'), url: 'https://pt.preciosmundi.com/', logo: '/img/logos/preciosmundi.png' },
    { name: t('link_cme'), url: 'https://www.cmegroup.com/markets/agriculture.html', logo: '/img/logos/cme.png' },
    { name: t('link_nasdaq'), url: 'https://www.nasdaq.com/market-activity/commodities', logo: '/img/logos/nasdaq.svg' },
    { name: t('link_reuters'), url: 'https://www.reuters.com/business/commodities/', logo: '/img/logos/reuters.png' },
    { name: t('link_cbot'), url: 'https://www.cmegroup.com/company/cbot.html', logo: '/img/logos/cme.png' },
    { name: t('link_ice'), url: 'https://www.theice.com/products/Futures-Options/Agriculture', logo: '/img/logos/ice.svg' },
    { name: t('link_conab'), url: 'https://www.conab.gov.br/', logo: '/img/logos/conab.png' },
    { name: t('link_embrapa'), url: 'https://www.embrapa.br/agropensa', logo: '/img/logos/embrapa_official.svg' },
  ];

  return (
    <section id="commodity-links" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-12 flex items-center justify-center gap-3">
          <ExternalLink className="text-blue-600" size={32} /> {t('commodity_links_title')}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {links.map((link, index) => (
            <a 
              key={index} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 group"
            >
              <div className="relative w-full h-24 mb-6 flex items-center justify-center">
                <Image 
                  src={link.logo} 
                  alt={link.name} 
                  fill
                  className="object-contain p-2 filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="flex items-center gap-2 text-slate-600 font-semibold group-hover:text-blue-700 transition-colors text-center">
                <span>{link.name}</span>
                <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
