'use client';

import { ArrowUp, ArrowDown, Wheat, Milk, Beef, Apple } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

export function IndicesGrid() {
  const { t } = useTranslation();

  const indices = [
    {
      id: 1,
      title: t('grain_index_title'),
      value: '107.4',
      change: '-1.5%',
      isPositive: false,
      icon: Wheat,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      source: t('grain_index_source')
    },
    {
      id: 2,
      title: t('dairy_index_title'),
      value: '154.4',
      change: '+0.5%',
      isPositive: true,
      icon: Milk,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      source: t('dairy_index_source')
    },
    {
      id: 3,
      title: t('meat_index_title'),
      value: '126.0',
      change: '+2.1%',
      isPositive: true,
      icon: Beef,
      color: 'text-red-600',
      bg: 'bg-red-50',
      source: t('meat_index_source')
    },
    {
      id: 4,
      title: t('fruit_index_title'),
      value: '118.5',
      change: '+1.4%',
      isPositive: true,
      icon: Apple,
      color: 'text-green-600',
      bg: 'bg-green-50',
      source: t('fruit_index_source')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {indices.map((index) => (
        <div key={index.id} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow group">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-xl ${index.bg} ${index.color} group-hover:scale-110 transition-transform`}>
              <index.icon className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-700">{index.title}</h4>
          </div>
          
          <div className="text-4xl font-bold text-slate-800 mb-3">{index.value}</div>
          
          <div className={`flex items-center gap-1 font-semibold mb-4 ${index.isPositive ? 'text-green-600' : 'text-red-500'}`}>
            {index.isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            {index.change}
          </div>
          
          <p className="text-xs text-slate-400 border-t border-slate-50 pt-3">
            {index.source}
          </p>
        </div>
      ))}
    </div>
  );
}
