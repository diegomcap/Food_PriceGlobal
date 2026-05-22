import React from 'react';
import { Sprout, Tractor, Truck, Globe, AlertTriangle, PackageCheck, Clock } from 'lucide-react';

export const LatamTraceability = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-blue-900 flex items-center justify-center gap-3 mb-4">
            <Globe className="w-8 h-8 text-green-600" />
            Trazabilidade Transfronteiriça
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Seguimento completo de Produção → Colheita → Transporte → Exportação com monitoramento GPS e alertas de cruce fronterizo.
          </p>
        </div>

        {/* Pipeline */}
        <div className="relative mb-20">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 hidden md:block z-0"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {/* Stage 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-500 text-center transform transition-transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 border-4 border-white shadow-sm">
                <Sprout size={32} />
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">Produção</h3>
              <div className="text-2xl font-bold text-green-600 mb-1">2,456</div>
              <p className="text-sm text-slate-500">Fazendas monitoradas</p>
            </div>

            {/* Stage 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-500 text-center transform transition-transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 border-4 border-white shadow-sm">
                <Tractor size={32} />
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">Colheita</h3>
              <div className="text-2xl font-bold text-green-600 mb-1">1,890</div>
              <p className="text-sm text-slate-500">Lotes em colheita</p>
            </div>

            {/* Stage 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-orange-500 text-center transform transition-transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600 border-4 border-white shadow-sm">
                <Truck size={32} />
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">Transporte</h3>
              <div className="text-2xl font-bold text-orange-600 mb-1">1,234</div>
              <p className="text-sm text-slate-500">Veículos em trânsito</p>
            </div>

            {/* Stage 4 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-blue-500 text-center transform transition-transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 border-4 border-white shadow-sm">
                <Globe size={32} />
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">Exportação</h3>
              <div className="text-2xl font-bold text-blue-600 mb-1">890</div>
              <p className="text-sm text-slate-500">Cargas exportadas</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <AlertTriangle className="text-orange-500" />
            Alertas de Fronteira em Tempo Real
          </h3>
          <div className="space-y-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-4">
              <div className="bg-red-100 p-2 rounded-full text-red-600 shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="font-bold text-red-800">Atraso na Fronteira Brasil-Argentina</h4>
                <p className="text-red-600 text-sm">Fila de espera superior a 4 horas no posto de Uruguaiana.</p>
                <span className="text-xs text-red-500 mt-1 block">Há 15 minutos</span>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg flex items-start gap-4">
              <div className="bg-green-100 p-2 rounded-full text-green-600 shrink-0">
                <PackageCheck size={20} />
              </div>
              <div>
                <h4 className="font-bold text-green-800">Carga Aprovada - México-EUA</h4>
                <p className="text-green-600 text-sm">Lote #4589 liberado pela alfândega de Laredo.</p>
                <span className="text-xs text-green-500 mt-1 block">Há 32 minutos</span>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg flex items-start gap-4">
              <div className="bg-yellow-100 p-2 rounded-full text-yellow-600 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="font-bold text-yellow-800">Documentação Pendente - Chile-Peru</h4>
                <p className="text-yellow-600 text-sm">Certificado fitossanitário pendente para Lote #7821.</p>
                <span className="text-xs text-yellow-500 mt-1 block">Há 1 hora</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
