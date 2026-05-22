'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowUp, ArrowDown, Wheat, Milk, Beef, TrendingUp } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

type FaoRecord = {
  date: string;
  food: number;
  meat: number;
  dairy: number;
  cereals: number;
  oils: number;
  sugar: number;
};

type FaoApiResponse = {
  latest: FaoRecord;
  previous: FaoRecord;
};

export function IndicesGrid() {
  const { t } = useTranslation();
  const [faoData, setFaoData] = useState<FaoApiResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadIndices() {
      try {
        const response = await fetch('/api/fao-food-price-index');
        if (!response.ok) {
          throw new Error(`Failed to fetch FAO data (${response.status})`);
        }

        const data = (await response.json()) as FaoApiResponse;
        if (!cancelled) {
          setFaoData({
            latest: data.latest,
            previous: data.previous,
          });
        }
      } catch (error) {
        console.error('Unable to refresh grid indices:', error);
      }
    }

    loadIndices();
    return () => {
      cancelled = true;
    };
  }, []);

  const indices = useMemo(() => {
    const latest = faoData?.latest;
    const previous = faoData?.previous;

    const getChange = (current?: number, prior?: number) => {
      if (!current || !prior) {
        return { value: '0.0', change: '+0.0%', isPositive: true };
      }

      const changePct = ((current - prior) / prior) * 100;
      return {
        value: current.toFixed(1),
        change: `${changePct >= 0 ? '+' : ''}${changePct.toFixed(1)}%`,
        isPositive: changePct >= 0,
      };
    };

    return [
      {
        id: 1,
        title: t('grain_index_title'),
        ...getChange(latest?.cereals, previous?.cereals),
        icon: Wheat,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        source: t('grain_index_source')
      },
      {
        id: 2,
        title: t('dairy_index_title'),
        ...getChange(latest?.dairy, previous?.dairy),
        icon: Milk,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        source: t('dairy_index_source')
      },
      {
        id: 3,
        title: t('meat_index_title'),
        ...getChange(latest?.meat, previous?.meat),
        icon: Beef,
        color: 'text-red-600',
        bg: 'bg-red-50',
        source: t('meat_index_source')
      },
      {
        id: 4,
        title: t('food_price_index_title'),
        ...getChange(latest?.food, previous?.food),
        icon: TrendingUp,
        color: 'text-green-600',
        bg: 'bg-green-50',
        source: t('fao_source')
      }
    ];
  }, [faoData, t]);

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
