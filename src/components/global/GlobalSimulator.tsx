'use client';

import React, { useState } from 'react';
import { RotateCw, Clock, DollarSign, Leaf } from 'lucide-react';

export const GlobalSimulator = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { time: string; cost: string; carbon: string }>(null);

  const handleSimulate = () => {
    setLoading(true);
    // Simulate calculation delay
    setTimeout(() => {
      setResult({
        time: '14 dias',
        cost: '$ 4,500',
        carbon: '1.2 ton CO₂'
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <section id="route-simulator" className="py-20 bg-slate-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 flex items-center justify-center gap-3">
          <RotateCw className="text-blue-400" />
          Simulador de Rota Inteligente
        </h2>

        <div className="max-w-4xl mx-auto bg-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Origem:</label>
              <select className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="sao-paulo">São Paulo, Brasil</option>
                <option value="new-york">Nova York, EUA</option>
                <option value="hamburg">Hamburgo, Alemanha</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Destino:</label>
              <select className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="tokyo">Tóquio, Japão</option>
                <option value="london">Londres, Reino Unido</option>
                <option value="sydney">Sydney, Austrália</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Prioridade:</label>
              <select className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="time">⏱️ Menor Tempo</option>
                <option value="cost">💰 Menor Custo</option>
                <option value="eco">🌱 Menor Impacto Ambiental</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleSimulate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <RotateCw className="animate-spin" />
            ) : (
              'Simular Rotas'
            )}
          </button>

          {result && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-slate-700 p-4 rounded-xl border border-slate-600">
                <div className="flex items-center gap-2 text-blue-400 mb-1">
                  <Clock size={18} />
                  <span className="text-sm font-semibold">Tempo Estimado</span>
                </div>
                <div className="text-2xl font-bold">{result.time}</div>
              </div>
              
              <div className="bg-slate-700 p-4 rounded-xl border border-slate-600">
                <div className="flex items-center gap-2 text-green-400 mb-1">
                  <DollarSign size={18} />
                  <span className="text-sm font-semibold">Custo Estimado</span>
                </div>
                <div className="text-2xl font-bold">{result.cost}</div>
              </div>

              <div className="bg-slate-700 p-4 rounded-xl border border-slate-600">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <Leaf size={18} />
                  <span className="text-sm font-semibold">Impacto CO₂</span>
                </div>
                <div className="text-2xl font-bold">{result.carbon}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
