'use client';

import Link from 'next/link';
import { ArrowRight, Globe2 } from 'lucide-react';

export function LatamHero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-orange-600">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/70 to-orange-800/50 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80" 
          alt="Latam Landscape" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 relative z-20 text-center text-white pt-20">
        <div className="inline-block p-2 px-4 rounded-full bg-orange-500/30 border border-orange-400/30 text-orange-200 font-bold mb-6 backdrop-blur-sm animate-fade-in-up">
          🌎 América Latina & Caribe
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
          LATAM Export
        </h1>
        
        <p className="text-xl md:text-2xl text-orange-50 max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow-md">
          Integração logística e comercial para os mercados da América do Sul e Central, fortalecendo a segurança alimentar regional.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link href="/latam/login" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transform hover:-translate-y-1 transition-all shadow-lg shadow-orange-500/20">
            Acceso Regional
            <Globe2 className="w-5 h-5" />
          </Link>
          <Link href="/latam/welcome" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/20 transform hover:-translate-y-1 transition-all">
            Ver Soluciones
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Hero Stats */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all transform hover:-translate-y-1">
            <span className="block text-4xl font-bold mb-2 text-orange-400">33</span>
            <span className="text-sm text-orange-100 uppercase tracking-wide font-semibold">Países Conectados</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all transform hover:-translate-y-1">
            <span className="block text-4xl font-bold mb-2 text-orange-400">650M+</span>
            <span className="text-sm text-orange-100 uppercase tracking-wide font-semibold">Consumidores</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all transform hover:-translate-y-1">
            <span className="block text-4xl font-bold mb-2 text-orange-400">24h</span>
            <span className="text-sm text-orange-100 uppercase tracking-wide font-semibold">Logística Expressa</span>
          </div>
        </div>
      </div>
    </section>
  );
}
