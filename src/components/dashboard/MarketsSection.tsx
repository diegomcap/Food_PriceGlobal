'use client';

import { useTranslation } from '@/context/TranslationContext';
import { FoodPriceIndex } from './FoodPriceIndex';
import { IndicesGrid } from './IndicesGrid';
import { TrendsSection } from './TrendsSection';
import { DataSources } from './DataSources';

export function MarketsSection() {
  const { t } = useTranslation();

  return (
    <section id="mercados" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 relative z-30">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 relative inline-block pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-green-500 after:rounded-full">
            {t('markets_title')}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mt-4">
            {t('markets_description')}
          </p>
        </div>

        <FoodPriceIndex />
        
        <div className="mt-12">
          <IndicesGrid />
        </div>

        <TrendsSection />

        <DataSources />
      </div>
    </section>
  );
}
