'use client';

import Link from 'next/link';
import { Plane, Ship, Truck, Globe2, PackageCheck, BarChart3, ArrowRight, ShieldCheck } from 'lucide-react';

export default function GlobalTransportPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-blue-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/90 to-blue-800/80"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Link href="/" className="inline-flex items-center text-blue-200 hover:text-white mb-8 transition-colors">
            ← Voltar para Home
          </Link>
          
          <div className="max-w-4xl">
            <div className="inline-block px-4 py-2 bg-blue-800/50 rounded-full border border-blue-700/50 text-blue-200 text-sm font-semibold mb-6">
              Logística Internacional
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Conectando Mercados Globais com Eficiência e Segurança
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mb-10 leading-relaxed">
              Soluções integradas de transporte aéreo, marítimo e terrestre para a indústria alimentícia mundial. Monitoramento em tempo real e compliance internacional.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/global/login" className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg flex items-center gap-2">
                Acessar Portal do Cliente <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="bg-blue-800/50 border border-blue-700 hover:bg-blue-700/50 text-white px-8 py-4 rounded-xl font-bold transition-colors backdrop-blur-sm">
                Falar com Especialista
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-32 relative z-20">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Plane className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Frete Aéreo Express</h3>
            <p className="text-slate-600 leading-relaxed">
              Transporte de perecíveis com controle de temperatura e prioridade de embarque em mais de 120 países.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
              <Ship className="w-7 h-7 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Transporte Marítimo</h3>
            <p className="text-slate-600 leading-relaxed">
              Soluções FCL e LCL para grandes volumes, com containers refrigerados de última geração.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
              <Truck className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Malha Terrestre</h3>
            <p className="text-slate-600 leading-relaxed">
              Frota conectada para distribuição last-mile e conexões intermodais eficientes.
            </p>
          </div>
        </div>

        <div className="mt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Por que escolher a FoodPrice Global?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Tecnologia e expertise unidas para garantir a integridade da sua carga.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl hover:bg-white hover:shadow-lg transition-all">
              <Globe2 className="w-10 h-10 text-blue-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2">Cobertura Global</h4>
              <p className="text-sm text-slate-600">Presença em todos os continentes com parceiros locais certificados.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl hover:bg-white hover:shadow-lg transition-all">
              <PackageCheck className="w-10 h-10 text-blue-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2">Rastreabilidade Total</h4>
              <p className="text-sm text-slate-600">Monitoramento 24/7 da localização e condições da carga.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl hover:bg-white hover:shadow-lg transition-all">
              <ShieldCheck className="w-10 h-10 text-blue-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2">Seguro Integrado</h4>
              <p className="text-sm text-slate-600">Proteção completa contra riscos e avarias durante todo o trajeto.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl hover:bg-white hover:shadow-lg transition-all">
              <BarChart3 className="w-10 h-10 text-blue-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2">Analytics</h4>
              <p className="text-sm text-slate-600">Relatórios detalhados de performance e custos logísticos.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
