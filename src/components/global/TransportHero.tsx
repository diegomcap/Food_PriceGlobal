'use client';

import Link from 'next/link';
import { ArrowRight, Globe2 } from 'lucide-react';

export function TransportHero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-900/40 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1502920514313-52581002a659?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80" 
          alt="Container Ship" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 relative z-20 text-center text-white pt-20">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
          Global Food Transport
        </h1>
        <p className="text-xl md:text-2xl text-slate-100 max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow-md">
          Conectando produtores e consumidores ao redor do mundo com tecnologia e sustentabilidade.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link href="/global/login" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-500 transform hover:-translate-y-1 transition-all shadow-lg shadow-blue-600/30">
            Acessar Portal
            <Globe2 className="w-5 h-5" />
          </Link>
          <Link href="/global/welcome" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/20 transform hover:-translate-y-1 transition-all">
            Saiba Mais
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Hero Stats */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
            <span className="block text-4xl font-bold mb-2">80%</span>
            <span className="text-sm text-slate-200 uppercase tracking-wide">do comércio mundial transportado por navios</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
            <span className="block text-4xl font-bold mb-2">11B</span>
            <span className="text-sm text-slate-200 uppercase tracking-wide">toneladas transportadas anualmente</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
            <span className="block text-4xl font-bold mb-2">2050</span>
            <span className="text-sm text-slate-200 uppercase tracking-wide">meta para emissões zero no transporte</span>
          </div>
        </div>
      </div>
    </section>
  );
}
