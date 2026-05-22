import React, { useState, useEffect } from 'react';
import { Building2, FileText, Globe2, CheckCircle2, ShieldCheck, FileCheck, Clock, Award, DollarSign, TrendingUp } from 'lucide-react';

export const LatamDashboard = () => {
  const [metrics, setMetrics] = useState({
    empresas: 18456,
    productores: 8234,
    exportadores: 5678,
    importadores: 4544
  });

  const [countryData] = useState({
    'Brasil': { count: 4567, flag: '🇧🇷', currency: 'BRL', rate: 5.2 },
    'México': { count: 3234, flag: '🇲🇽', currency: 'MXN', rate: 18.5 },
    'Argentina': { count: 2890, flag: '🇦🇷', currency: 'ARS', rate: 350.0 },
    'Chile': { count: 2456, flag: '🇨🇱', currency: 'CLP', rate: 850.0 },
    'Colombia': { count: 2225, flag: '🇨🇴', currency: 'COP', rate: 4200.0 },
    'Perú': { count: 1100, flag: '🇵🇪', currency: 'PEN', rate: 3.7 }
  });

  const [exchangeRates, setExchangeRates] = useState(countryData);

  useEffect(() => {
    // Simulate real-time updates for metrics and exchange rates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        empresas: prev.empresas + (Math.random() > 0.8 ? 1 : 0)
      }));

      // Simulate slight currency fluctuations
      setExchangeRates(prev => {
        const newRates = { ...prev };
        Object.keys(newRates).forEach(key => {
           // @ts-ignore
           const current = newRates[key];
           const fluctuation = (Math.random() - 0.5) * (current.rate * 0.001);
           // @ts-ignore
           newRates[key] = { ...current, rate: current.rate + fluctuation };
        });
        return newRates;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-20 py-16 bg-white">
      {/* 1. Registro Regional de Empresas */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-10 flex items-center justify-center gap-3">
          <Building2 className="w-8 h-8 text-orange-500" />
          Registro Regional de Empresas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-blue-600 hover:-translate-y-1 transition-transform">
            <h3 className="text-lg font-semibold text-slate-600 mb-2">Empresas Registradas</h3>
            <div className="text-3xl font-bold text-blue-900 mb-1">{metrics.empresas.toLocaleString()}</div>
            <p className="text-sm text-slate-400">Total en la región LATAM</p>
          </div>

          {/* Productores */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-green-500 hover:-translate-y-1 transition-transform">
            <h3 className="text-lg font-semibold text-slate-600 mb-2">Productores</h3>
            <div className="text-3xl font-bold text-blue-900 mb-1">{metrics.productores.toLocaleString()}</div>
            <p className="text-sm text-slate-400">Empresas productoras activas</p>
          </div>

          {/* Exportadores */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-orange-500 hover:-translate-y-1 transition-transform">
            <h3 className="text-lg font-semibold text-slate-600 mb-2">Exportadores</h3>
            <div className="text-3xl font-bold text-blue-900 mb-1">{metrics.exportadores.toLocaleString()}</div>
            <p className="text-sm text-slate-400">Empresas exportadoras certificadas</p>
          </div>

          {/* Importadores */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-purple-500 hover:-translate-y-1 transition-transform">
            <h3 className="text-lg font-semibold text-slate-600 mb-2">Importadores</h3>
            <div className="text-3xl font-bold text-blue-900 mb-1">{metrics.importadores.toLocaleString()}</div>
            <p className="text-sm text-slate-400">Empresas importadoras registradas</p>
          </div>
        </div>

        {/* Registro por País & Câmbio */}
        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
          <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
            <Globe2 className="w-6 h-6 text-blue-500" /> Registro por País & Tasas de Cambio (USD)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(exchangeRates).map(([country, data]) => (
              <div key={country} className="flex flex-col gap-2 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2">
                   <span className="text-2xl">{data.flag}</span>
                   <span className="font-bold text-slate-700">{country}</span>
                </div>
                <div>
                   <span className="text-xs text-slate-500 block">Registros</span>
                   <span className="text-lg font-semibold text-blue-900">{data.count.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-100">
                   <span className="text-xs text-slate-500 flex items-center gap-1">
                     <DollarSign size={10} /> {data.currency}/USD
                   </span>
                   <span className="text-sm font-mono text-green-600 flex items-center gap-1">
                     {data.rate.toFixed(2)}
                     <TrendingUp size={10} />
                   </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 2. Classificação Internacional */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-10 flex items-center justify-center gap-3">
          <FileText className="w-8 h-8 text-orange-500" />
          Classificação Internacional
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-blue-100">Produtos Classificados</h3>
              <FileText className="text-blue-300" />
            </div>
            <div className="text-3xl font-bold mb-2">12,890</div>
            <p className="text-xs text-blue-200">Com certificação internacional</p>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-orange-500 text-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-orange-100">Certificações Ativas</h3>
              <Award className="text-orange-200" />
            </div>
            <div className="text-3xl font-bold mb-2">8,456</div>
            <p className="text-xs text-orange-100">Certificados de qualidade válidos</p>
          </div>

          <div className="bg-gradient-to-br from-green-700 to-green-600 text-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-green-100">Códigos HS</h3>
              <FileCheck className="text-green-300" />
            </div>
            <div className="text-3xl font-bold mb-2">1,234</div>
            <p className="text-xs text-green-200">Códigos harmonizados registrados</p>
          </div>

          <div className="bg-gradient-to-br from-purple-700 to-purple-600 text-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-purple-100">Países Aprovados</h3>
              <Globe2 className="text-purple-300" />
            </div>
            <div className="text-3xl font-bold mb-2">18</div>
            <p className="text-xs text-purple-200">Territórios com cumprimento</p>
          </div>
        </div>

        {/* Categorias */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow border border-slate-100 flex items-center gap-3">
            <span className="text-2xl">🍎</span>
            <div>
              <span className="block font-bold text-slate-700">Frutas Frescas</span>
              <span className="text-sm text-slate-500">3,456</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border border-slate-100 flex items-center gap-3">
            <span className="text-2xl">🌾</span>
            <div>
              <span className="block font-bold text-slate-700">Grãos e Cereais</span>
              <span className="text-sm text-slate-500">2,890</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border border-slate-100 flex items-center gap-3">
            <span className="text-2xl">🥩</span>
            <div>
              <span className="block font-bold text-slate-700">Carnes</span>
              <span className="text-sm text-slate-500">2,234</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border border-slate-100 flex items-center gap-3">
            <span className="text-2xl">🧀</span>
            <div>
              <span className="block font-bold text-slate-700">Laticínios</span>
              <span className="text-sm text-slate-500">1,567</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Integração Aduanera */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-10 flex items-center justify-center gap-3">
          <ShieldCheck className="w-8 h-8 text-orange-500" />
          Integração Aduanera
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-slate-600 mb-2">Documentos Processados</h3>
            <div className="text-3xl font-bold text-blue-900 mb-1">15,678</div>
            <p className="text-sm text-slate-400">Automáticos</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-orange-500">
            <h3 className="text-lg font-semibold text-slate-600 mb-2">Trâmites Ativos</h3>
            <div className="text-3xl font-bold text-blue-900 mb-1">2,456</div>
            <p className="text-sm text-slate-400">Em processo</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-slate-600 mb-2">Conformidade MERCOSUR</h3>
            <div className="text-3xl font-bold text-blue-900 mb-1">98.7%</div>
            <p className="text-sm text-slate-400">Taxa de cumprimento</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold text-slate-600 mb-2">Tempo Médio</h3>
            <div className="text-3xl font-bold text-blue-900 mb-1">4.2h</div>
            <p className="text-sm text-slate-400">Processamento</p>
          </div>
        </div>
      </section>
    </div>
  );
};
