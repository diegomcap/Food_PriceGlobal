import React from 'react';
import { CloudRain, Sun, Wind, CloudFog } from 'lucide-react';

export const GlobalWeather = () => {
  const regions = [
    { name: 'Atlântico Norte', icon: CloudRain, temp: '14°C', cond: 'Chuva Forte', status: 'bad' },
    { name: 'Pacífico Sul', icon: Sun, temp: '28°C', cond: 'Céu Limpo', status: 'good' },
    { name: 'Índico', icon: Wind, temp: '24°C', cond: 'Ventos Fortes', status: 'warning' },
    { name: 'Mediterrâneo', icon: CloudFog, temp: '18°C', cond: 'Neblina', status: 'warning' },
  ];

  return (
    <section id="weather" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-10 flex items-center justify-center gap-3">
          <CloudRain className="text-blue-500" />
          Condições Climáticas por Rota
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {regions.map((region, idx) => (
            <div key={idx} className={`bg-white p-6 rounded-2xl shadow-lg border-b-4 ${
              region.status === 'good' ? 'border-green-500' :
              region.status === 'warning' ? 'border-yellow-500' : 'border-red-500'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-700">{region.name}</h3>
                <region.icon className={`
                  ${region.status === 'good' ? 'text-green-500' :
                    region.status === 'warning' ? 'text-yellow-500' : 'text-red-500'}
                `} />
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">{region.temp}</div>
              <p className="text-slate-500 text-sm">{region.cond}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
