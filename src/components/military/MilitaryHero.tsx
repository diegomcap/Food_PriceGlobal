'use client';

import Link from 'next/link';
import { Shield, Lock, Award, Crosshair, ChevronRight, FileKey } from 'lucide-react';

export function MilitaryHero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 to-red-950/40 z-10"></div>
        <div className="absolute inset-0 bg-[url('/img/tactical-pattern.svg')] opacity-10 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80" 
          alt="Military Operation" 
          className="w-full h-full object-cover grayscale contrast-125"
        />
      </div>

      <div className="container mx-auto px-4 relative z-20 text-center text-white pt-20">
        <div className="inline-flex items-center gap-2 p-2 px-4 rounded-full bg-red-900/40 border border-red-500/50 text-red-400 font-mono text-sm mb-8 backdrop-blur-sm animate-pulse">
          <Lock size={14} /> ACESSO RESTRITO // NÍVEL 5
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter drop-shadow-2xl uppercase glitch-effect">
          MFD <span className="text-red-600">Military</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10 font-light tracking-wide">
          Desenvolvimento de soluções alimentares táticas para operações de alta complexidade e segurança nacional.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link href="/military/login" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-900/80 border border-red-600 text-red-100 rounded-sm font-bold text-lg tracking-widest hover:bg-red-800 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] uppercase">
            Secure Login
            <FileKey className="w-5 h-5" />
          </Link>
          <Link href="/military/welcome" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-gray-600 text-gray-300 rounded-sm font-bold text-lg tracking-widest hover:border-gray-400 hover:text-white transition-all uppercase">
            Capabilities
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Hero Badges */}

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center gap-3 px-6 py-3 bg-red-950/30 border border-red-500/30 rounded-full backdrop-blur-sm hover:bg-red-900/40 transition-colors cursor-crosshair group">
            <Shield className="text-red-500 group-hover:text-red-400" size={20} />
            <span className="text-sm font-bold tracking-wider text-red-100">CERTIFIED SECURITY</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-red-950/30 border border-red-500/30 rounded-full backdrop-blur-sm hover:bg-red-900/40 transition-colors cursor-crosshair group">
            <Award className="text-red-500 group-hover:text-red-400" size={20} />
            <span className="text-sm font-bold tracking-wider text-red-100">NATO STANDARDS</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-red-950/30 border border-red-500/30 rounded-full backdrop-blur-sm hover:bg-red-900/40 transition-colors cursor-crosshair group">
            <Crosshair className="text-red-500 group-hover:text-red-400" size={20} />
            <span className="text-sm font-bold tracking-wider text-red-100">TACTICAL GRADE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
