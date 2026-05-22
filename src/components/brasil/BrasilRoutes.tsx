import React from 'react';
import { Route, Truck, Train, TrafficCone, Gauge, Zap, Timer, TrendingUp } from 'lucide-react';

export const BrasilRoutes = () => {
  return (
    <section id="rotas" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-16 flex items-center justify-center gap-3">
          <Route className="w-8 h-8" />
          Otimização de Rotas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Roteamento Inteligente */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Roteamento Inteligente</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Rotas Otimizadas</span>
                <span className="text-2xl font-bold text-purple-600">2,456</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Economia Combustível</span>
                <span className="text-xl font-bold text-green-600 flex items-center gap-1">
                  <TrendingUp size={16} /> 23.4%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Tempo Reduzido</span>
                <span className="text-xl font-bold text-blue-600 flex items-center gap-1">
                  <Timer size={16} /> 18.7%
                </span>
              </div>
            </div>
          </div>

          {/* Modais de Transporte */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                <Truck size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Modais de Transporte</h3>
            </div>

            <div className="space-y-6">
              {/* Rodoviário */}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <Truck size={20} className="text-blue-500" />
                    Rodoviário
                  </div>
                  <span className="text-blue-600 font-bold">78.5%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '78.5%' }}></div>
                </div>
              </div>

              {/* Ferroviário */}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <Train size={20} className="text-orange-500" />
                    Ferroviário
                  </div>
                  <span className="text-orange-600 font-bold">21.5%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '21.5%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Condições de Tráfego */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-full text-green-600">
                <TrafficCone size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Condições de Tráfego</h3>
            </div>

            <div className="flex flex-col items-center justify-center py-4 mb-6">
              <div className="w-24 h-24 rounded-full border-8 border-green-100 border-t-green-500 flex items-center justify-center animate-spin-slow mb-4">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <span className="text-lg font-bold text-green-600">Condições Normais</span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Velocidade média</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Gauge size={14} /> 67 km/h
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Congestionamentos</span>
                <span className="font-bold text-orange-600 flex items-center gap-1">
                  <TrafficCone size={14} /> 3 ativos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
