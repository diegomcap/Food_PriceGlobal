import React from 'react';
import { Sprout, Tractor, Truck, Package, ArrowRight, Navigation, Bell, Map } from 'lucide-react';

export const BrasilTraceability = () => {
  return (
    <section id="rastreamento" className="py-20 bg-gradient-to-br from-slate-50 to-green-50/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-16 flex items-center justify-center gap-3">
          <Navigation className="w-8 h-8" />
          Rastreabilidade Completa
        </h2>

        {/* Pipeline Visualization */}
        <div className="relative mb-20">
          {/* Desktop Connector Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {/* Stage 1: Produção */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <Sprout size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Produção</h3>
              <div className="text-2xl font-bold text-green-600 mb-2">2,456</div>
              <p className="text-sm text-slate-500 mb-3">fazendas</p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Monitorando
              </span>
            </div>

            {/* Stage 2: Colheita */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4 text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                <Tractor size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Colheita</h3>
              <div className="text-2xl font-bold text-green-600 mb-2">847</div>
              <p className="text-sm text-slate-500 mb-3">lotes</p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Em andamento
              </span>
            </div>

            {/* Stage 3: Transporte */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Truck size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Transporte</h3>
              <div className="text-2xl font-bold text-green-600 mb-2">1,234</div>
              <p className="text-sm text-slate-500 mb-3">veículos</p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                GPS Ativo
              </span>
            </div>

            {/* Stage 4: Entrega */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Package size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Entrega</h3>
              <div className="text-2xl font-bold text-green-600 mb-2">567</div>
              <p className="text-sm text-slate-500 mb-3">entregas</p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                Concluídas hoje
              </span>
            </div>
          </div>
        </div>

        {/* GPS Monitoring Stats */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Map size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Monitoramento GPS em Tempo Real</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Veículos Ativos</h4>
              <div className="text-3xl font-bold text-slate-800 mb-2">1,234</div>
              <div className="text-sm text-green-600 flex items-center gap-1">
                <Navigation size={14} /> Transmitindo localização
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Alertas Automáticos</h4>
              <div className="text-3xl font-bold text-slate-800 mb-2">23</div>
              <div className="text-sm text-orange-600 flex items-center gap-1">
                <Bell size={14} /> Últimas 24h
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Precisão Média</h4>
              <div className="text-3xl font-bold text-slate-800 mb-2">2.3m</div>
              <div className="text-sm text-blue-600 flex items-center gap-1">
                <Map size={14} /> Margem de erro
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
