'use client';

import { Sprout, Coffee, Droplets, Beef, Wheat, Sun } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

export function ProductGrid() {
  const { t } = useTranslation();

  const products = [
    {
      name: t('pg_soy_name'),
      description: t('pg_soy_desc'),
      stats: t('pg_soy_stats'),
      icon: Sprout,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      name: t('pg_coffee_name'),
      description: t('pg_coffee_desc'),
      stats: t('pg_coffee_stats'),
      icon: Coffee,
      color: 'text-amber-700',
      bg: 'bg-amber-100'
    },
    {
      name: t('pg_corn_name'),
      description: t('pg_corn_desc'),
      stats: t('pg_corn_stats'),
      icon: Wheat,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100'
    },
    {
      name: t('pg_protein_name'),
      description: t('pg_protein_desc'),
      stats: t('pg_protein_stats'),
      icon: Beef,
      color: 'text-red-600',
      bg: 'bg-red-100'
    },
    {
      name: t('pg_sugar_name'),
      description: t('pg_sugar_desc'),
      stats: t('pg_sugar_stats'),
      icon: Sun,
      color: 'text-orange-500',
      bg: 'bg-orange-100'
    },
    {
      name: t('pg_juice_name'),
      description: t('pg_juice_desc'),
      stats: t('pg_juice_stats'),
      icon: Droplets,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">{t('pg_title')}</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-yellow-400 mx-auto rounded-full"></div>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            {t('pg_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-b-4 border-transparent hover:border-green-500 group"
            >
              <div className={`w-14 h-14 rounded-full ${product.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <product.icon className={`w-8 h-8 ${product.color}`} />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-green-600 transition-colors">
                {product.name}
              </h3>
              
              <p className="text-slate-600 mb-6 leading-relaxed">
                {product.description}
              </p>
              
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm text-slate-400 font-medium uppercase tracking-wider">{t('pg_vol_annual')}</span>
                <span className={`font-bold ${product.color}`}>{product.stats}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
