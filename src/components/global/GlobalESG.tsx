import React from 'react';
import { Leaf, Zap, Award, ArrowDown, ArrowUp, Minus } from 'lucide-react';

export const GlobalESG = () => {
  return (
    <section id="sustainability" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-10 flex items-center justify-center gap-3">
          <Leaf className="text-green-600" />
          Painel de Sustentabilidade ESG
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Carbon Footprint */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-slate-700">Pegada de Carbono</h3>
              <Leaf className="text-green-500" />
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-2">2.4 ton CO₂</div>
            <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
              <ArrowDown size={16} />
              <span>12% vs mês anterior</span>
            </div>
          </div>

          {/* Energy Efficiency */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-slate-700">Eficiência Energética</h3>
              <Zap className="text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-2">87%</div>
            <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
              <ArrowUp size={16} />
              <span>5% vs mês anterior</span>
            </div>
          </div>

          {/* ESG Score */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-slate-700">Score ESG Geral</h3>
              <Award className="text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-2">A-</div>
            <div className="flex items-center gap-2 text-sm text-slate-500 font-semibold">
              <Minus size={16} />
              <span>Estável</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
