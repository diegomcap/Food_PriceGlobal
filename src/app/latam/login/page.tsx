'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Globe2, Lock, ArrowRight, Building, CheckCircle2, MapPin, Mail } from 'lucide-react';
import { latamCountries } from '@/data/locations';

export default function LatamLoginPage() {
  const [loading, setLoading] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      window.location.href = '/latam/dashboard';
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-orange-700">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
      
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-orange-500/20 mb-4">
            <Globe2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">LATAM Export</h1>
          <p className="text-blue-100">Portal de Comércio Regional</p>
        </div>

        <div className="flex justify-center gap-3 mb-8">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs text-blue-100 font-medium">
            <Globe2 className="w-3.5 h-3.5" />
            Multi-Region
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 text-xs text-orange-100 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Export
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-blue-50 mb-2">País / Región</label>
            <div className="relative">
              <select
                required
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all appearance-none [&>option]:text-black"
              >
                <option value="">Seleccione su país</option>
                {latamCountries.map((country) => (
                  <option key={country.value} value={country.value}>{country.label}</option>
                ))}
              </select>
              <MapPin className="w-5 h-5 text-blue-200/50 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-50 mb-2">ID Exportador / RUC</label>
            <div className="relative">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                placeholder="EX-12345678"
                required
              />
              <Building className="w-5 h-5 text-blue-200/50 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-50 mb-2">Correo Electrónico</label>
            <div className="relative">
              <input
                type="email"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                placeholder="empresa@email.com"
                required
              />
              <Mail className="w-5 h-5 text-blue-200/50 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-50 mb-2">Contraseña</label>
            <div className="relative">
              <input
                type="password"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
              <Lock className="w-5 h-5 text-blue-200/50 absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Autenticando...</span>
            ) : (
              <>
                Iniciar Sesión
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-blue-200/60 text-xs">o continúe con</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>
          
          <div className="flex gap-4 mt-4">
            <button className="flex-1 py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
              🤝 MERCOSUR
            </button>
            <button className="flex-1 py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
              🏛️ ALADI
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-blue-100/80 mb-4">¿Nuevo en LATAM Export?</p>
          <Link 
            href="/latam"
            className="text-white hover:text-orange-300 font-medium text-sm transition-colors border-b border-transparent hover:border-orange-300"
          >
            Regístrese para comercio internacional
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-blue-200/60">
          &copy; {currentYear} LATAM Export. Conectando Américas.
        </div>
      </div>
    </div>
  );
}
