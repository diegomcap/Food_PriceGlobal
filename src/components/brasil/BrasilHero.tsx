'use client';

import Link from 'next/link';
import { ArrowRight, LayoutDashboard } from 'lucide-react';

export function BrasilHero() {
  const previousYear = new Date().getFullYear() - 1;

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-green-600">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/70 to-green-800/50 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
          alt="Agriculture Brasil" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 relative z-20 text-center text-white pt-20">
        <div className="inline-block p-2 px-4 rounded-full bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 font-bold mb-6 backdrop-blur-sm animate-fade-in-up">
          🇧🇷 Líder Mundial em Agronegócio
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
          Brasil Export
        </h1>
        
        <p className="text-xl md:text-2xl text-green-50 max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow-md">
          Conectando os produtos agrícolas brasileiros ao mundo com excelência, sustentabilidade e garantia de origem.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link href="/brasil/login" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-yellow-400 text-green-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transform hover:-translate-y-1 transition-all shadow-lg shadow-yellow-500/20">
            Acessar Portal
            <LayoutDashboard className="w-5 h-5" />
          </Link>
          <Link href="/brasil/welcome" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/20 transform hover:-translate-y-1 transition-all">
            Saiba Mais
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Hero Stats */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all transform hover:-translate-y-1">
            <span className="block text-4xl font-bold mb-2 text-yellow-400">US$ 166,5 bi</span>
            <span className="text-sm text-green-100 uppercase tracking-wide font-semibold">Exportações em {previousYear}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all transform hover:-translate-y-1">
            <span className="block text-4xl font-bold mb-2 text-yellow-400">+10%</span>
            <span className="text-sm text-green-100 uppercase tracking-wide font-semibold">Crescimento Anual</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all transform hover:-translate-y-1">
            <span className="block text-4xl font-bold mb-2 text-yellow-400">1º</span>
            <span className="text-sm text-green-100 uppercase tracking-wide font-semibold">Exportador Mundial</span>
          </div>
        </div>
      </div>
    </section>
  );
}
