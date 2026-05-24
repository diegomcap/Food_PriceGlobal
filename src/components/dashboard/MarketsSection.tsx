'use client';

import { useMemo } from 'react';
import { useTranslation } from '@/context/TranslationContext';
import { FoodPriceIndex } from './FoodPriceIndex';
import { IndicesGrid } from './IndicesGrid';
import { TrendsSection } from './TrendsSection';
import { DataSources } from './DataSources';

export function MarketsSection() {
  const { language } = useTranslation();
  const copy = useMemo(() => {
    const texts = {
      pt: {
        title: 'Mercados e Referencias',
        subtitle:
          'Uma leitura unica para combinar indice oficial FAO, curvas de commodities, tendencias setoriais e as fontes monitoradas pela plataforma.',
      },
      en: {
        title: 'Markets and Reference Layers',
        subtitle:
          'One operating view combining the official FAO index, commodity curves, sector trends and the monitored sources used by the platform.',
      },
      es: {
        title: 'Mercados y Capas de Referencia',
        subtitle:
          'Una sola lectura para combinar el indice oficial FAO, curvas de commodities, tendencias sectoriales y las fuentes monitoreadas por la plataforma.',
      },
      ru: {
        title: 'Markets and Reference Layers',
        subtitle:
          'One view combining the official FAO index, commodity curves, sector trends and the monitored sources used by the platform.',
      },
      ar: {
        title: 'الاسواق وطبقات المرجع',
        subtitle:
          'قراءة تشغيلية واحدة تجمع مؤشر FAO الرسمي ومنحنيات السلع واتجاهات القطاعات والمصادر التي تراقبها المنصة.',
      },
      zh: {
        title: '市场与参考层',
        subtitle:
          '在一个视图中结合官方 FAO 指数、大宗商品曲线、分项趋势以及平台持续监控的数据来源。',
      },
    } as const;

    const activeLanguage = (['pt', 'en', 'es', 'ru', 'ar', 'zh'].includes(language) ? language : 'en') as keyof typeof texts;
    return texts[activeLanguage];
  }, [language]);

  return (
    <section id="mercados" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 relative z-30">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 relative inline-block pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-green-500 after:rounded-full">
            {copy.title}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mt-4">
            {copy.subtitle}
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
