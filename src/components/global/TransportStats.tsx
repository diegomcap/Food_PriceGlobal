'use client';

import { Globe, Package, TrendingUp, Clock } from 'lucide-react';

export function TransportStats() {
  const stats = [
    {
      icon: Globe,
      value: '190+',
      label: 'Países Atendidos',
      color: 'text-blue-600',
      borderColor: 'border-blue-600'
    },
    {
      icon: Package,
      value: '11B',
      label: 'Toneladas Transportadas/Ano',
      color: 'text-emerald-600',
      borderColor: 'border-emerald-600'
    },
    {
      icon: TrendingUp,
      value: '2.1%',
      label: 'Crescimento Anual Médio',
      color: 'text-purple-600',
      borderColor: 'border-purple-600'
    },
    {
      icon: Clock,
      value: '24/7',
      label: 'Monitoramento em Tempo Real',
      color: 'text-orange-600',
      borderColor: 'border-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className={`bg-white rounded-2xl p-8 text-center shadow-lg border-t-4 ${stat.borderColor} hover:-translate-y-2 transition-transform duration-300 group`}
        >
          <div className={`inline-flex p-4 rounded-full bg-slate-50 mb-6 ${stat.color} group-hover:scale-110 transition-transform`}>
            <stat.icon size={32} />
          </div>
          <div className={`text-4xl font-bold mb-3 ${stat.color} relative inline-block`}>
            {stat.value}
            <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-1 bg-current opacity-50`}></div>
          </div>
          <div className="text-slate-600 font-medium mt-2">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
