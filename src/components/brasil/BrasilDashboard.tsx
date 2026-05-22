import React, { useState, useEffect } from 'react';
import { Building2, ShieldCheck, RefreshCw, Apple, Award, Microscope, FileCheck, AlertCircle, XCircle, MapPin, TrendingUp, Truck } from 'lucide-react';
import { formatDate, shiftDate } from '@/lib/marketTime';

export const BrasilDashboard = () => {
  // State for real-time simulation
  const [metrics, setMetrics] = useState({
    totalEmpresas: 24567,
    gpsTracking: 2500,
    apiLatency: 247
  });

  const [regionalData] = useState({
    'Sudeste': { percentage: 45.2, volume: 1130000, performance: 12.3 },
    'Sul': { percentage: 28.7, volume: 717500, performance: 8.7 },
    'Centro-Oeste': { percentage: 18.4, volume: 460000, performance: 15.2 },
    'Nordeste': { percentage: 6.1, volume: 152500, performance: 5.4 },
    'Norte': { percentage: 1.6, volume: 40000, performance: 3.1 }
  });
  const lastAuditDate = formatDate(shiftDate(new Date(), -15), 'pt');

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        totalEmpresas: prev.totalEmpresas + (Math.random() > 0.7 ? 1 : 0),
        gpsTracking: Math.floor(Math.random() * 500) + 2500,
        apiLatency: Math.floor(Math.random() * 50) + 200
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-20 py-16">
      {/* 1. Dashboard Cadastro Nacional de Empresas */}
      <section id="dashboard" className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-10 flex items-center justify-center gap-3">
          <Building2 className="w-8 h-8" />
          Dashboard Cadastro Nacional de Empresas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Empresas Cadastradas */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-green-600 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-full text-green-600">
                <Building2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-green-700">Empresas Cadastradas</h3>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-4">{metrics.totalEmpresas.toLocaleString('pt-BR')}</div>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Produtores:</span>
                <span className="font-semibold">12,456</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Transportadores:</span>
                <span className="font-semibold">8,234</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Compradores:</span>
                <span className="font-semibold">3,877</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-100 px-2.5 py-1 rounded-full w-fit">
                <ShieldCheck size={14} />
                CNPJ Validado
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full w-fit">
                <RefreshCw size={14} />
                Receita Federal Sync
              </span>
            </div>
          </div>

          {/* Rastreamento em Tempo Real (New from V1) */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-blue-600 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                <Truck size={24} />
              </div>
              <h3 className="text-xl font-bold text-blue-700">Rastreamento Ativo</h3>
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-4">{metrics.gpsTracking.toLocaleString('pt-BR')}</div>
            <div className="mb-6">
               <p className="text-slate-600 text-sm mb-2">Veículos monitorados em tempo real via satélite.</p>
               <div className="flex items-center gap-2 text-xs text-green-600">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  Sinal GPS Estável
               </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <MapPin size={14} />
              Cobertura Nacional
            </div>
          </div>

          {/* Integração Receita Federal */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-green-600 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-full text-green-600">
                <RefreshCw size={24} />
              </div>
              <h3 className="text-xl font-bold text-green-700">Integração Receita</h3>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-4">Online</div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-slate-600">API Ativa - {metrics.apiLatency}ms</span>
            </div>
          </div>
        </div>

        {/* Regional Data Section (New from V1) */}
        <div className="mt-12 bg-slate-50 rounded-2xl p-8 border border-slate-200">
           <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
             <MapPin className="w-6 h-6" /> Desempenho Regional
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
             {Object.entries(regionalData).map(([region, data]) => (
               <div key={region} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                 <h4 className="font-bold text-slate-700 mb-2">{region}</h4>
                 <div className="space-y-2">
                   <div className="flex justify-between text-sm">
                     <span className="text-slate-500">Volume:</span>
                     <span className="font-medium">{data.percentage}%</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-slate-500">Cargas:</span>
                     <span className="font-medium">{(data.volume / 1000).toFixed(1)}k</span>
                   </div>
                   <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
                     <TrendingUp size={12} />
                     +{data.performance}% vs mês anterior
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-8 justify-center">
          <button className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2">
            <Building2 size={18} />
            Nova Empresa
          </button>
          <button className="px-6 py-2.5 bg-white border border-green-200 hover:bg-green-50 text-green-700 font-semibold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2">
            <RefreshCw size={18} />
            Validar CNPJs
          </button>
          <button className="px-6 py-2.5 bg-white border border-green-200 hover:bg-green-50 text-green-700 font-semibold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2">
            <FileCheck size={18} />
            Exportar Dados
          </button>
        </div>
      </section>

      {/* 2. Classificação de Produtos */}
      <section id="produtos" className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-10 flex items-center justify-center gap-3">
          <Apple className="w-8 h-8" />
          Classificação de Produtos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Produtos Registrados */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-yellow-500 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                <Apple size={24} />
              </div>
              <h3 className="text-xl font-bold text-green-700">Produtos Registrados</h3>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-6">15,234</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg text-center">
                <span className="block text-sm text-slate-500">Frutas</span>
                <span className="font-bold text-slate-800">4,567</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg text-center">
                <span className="block text-sm text-slate-500">Grãos</span>
                <span className="font-bold text-slate-800">3,890</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg text-center">
                <span className="block text-sm text-slate-500">Carnes</span>
                <span className="font-bold text-slate-800">2,456</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg text-center">
                <span className="block text-sm text-slate-500">Laticínios</span>
                <span className="font-bold text-slate-800">1,789</span>
              </div>
            </div>
          </div>

          {/* Certificações ANVISA */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-yellow-500 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-bold text-green-700">Certificações ANVISA</h3>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-6">97.3%</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                <span className="flex items-center gap-2 text-green-700 font-medium">
                  <FileCheck size={16} /> Aprovados
                </span>
                <span className="font-bold text-green-700">14,823</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                <span className="flex items-center gap-2 text-yellow-700 font-medium">
                  <AlertCircle size={16} /> Pendentes
                </span>
                <span className="font-bold text-yellow-700">287</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                <span className="flex items-center gap-2 text-red-700 font-medium">
                  <XCircle size={16} /> Rejeitados
                </span>
                <span className="font-bold text-red-700">124</span>
              </div>
            </div>
          </div>

          {/* Conformidade Sanitária */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-yellow-500 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                <Microscope size={24} />
              </div>
              <h3 className="text-xl font-bold text-green-700">Conformidade Sanitária</h3>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-4">99.1%</div>
            <div className="mb-6">
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '99.1%' }}></div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <FileCheck size={14} />
              Última auditoria: {lastAuditDate}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
