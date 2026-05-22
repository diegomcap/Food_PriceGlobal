'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Building2, ArrowRight, CheckCircle2, MapPin, Mail } from 'lucide-react';
import { brazilStates } from '@/data/locations';

export default function BrasilLoginPage() {
  const [loading, setLoading] = useState(false);
  const [cnpj, setCnpj] = useState('');

  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 18);
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCnpj(formatCNPJ(e.target.value));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login delay
    setTimeout(() => {
      window.location.href = '/brasil/dashboard';
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-yellow-500">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-green-500/20 mb-4">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Brasil Food Transport</h1>
          <p className="text-green-100">Portal Logístico Nacional</p>
        </div>

        <div className="flex justify-center gap-3 mb-8">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 border border-green-400/30 text-xs text-green-100 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            SSL Seguro
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs text-blue-100 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Gov.br Integrado
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-green-50 mb-2">Estado/Região</label>
            <div className="relative">
              <select
                required
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-green-200/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all appearance-none [&>option]:text-black"
              >
                <option value="">Selecione seu estado</option>
                {brazilStates.map((state) => (
                  <option key={state.value} value={state.value}>{state.label}</option>
                ))}
              </select>
              <MapPin className="w-5 h-5 text-green-200/50 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-50 mb-2">CNPJ da Empresa</label>
            <div className="relative">
              <input
                type="text"
                value={cnpj}
                onChange={handleCnpjChange}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-green-200/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                placeholder="00.000.000/0000-00"
                maxLength={18}
                required
              />
              <Building2 className="w-5 h-5 text-green-200/50 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-50 mb-2">E-mail Corporativo</label>
            <div className="relative">
              <input
                type="email"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-green-200/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                placeholder="seunome@empresa.com.br"
                required
              />
              <Mail className="w-5 h-5 text-green-200/50 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-50 mb-2">Senha de Acesso</label>
            <div className="relative">
              <input
                type="password"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-green-200/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
              <Lock className="w-5 h-5 text-green-200/50 absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-green-900 font-bold rounded-xl shadow-lg shadow-yellow-500/20 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Autenticando...</span>
            ) : (
              <>
                Acessar Portal Nacional
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-green-200/60 text-xs">ou continue com</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>
          
          <div className="flex gap-4 mt-4">
            <button className="flex-1 py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
              🏛️ Gov.br
            </button>
            <button className="flex-1 py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
              📋 ANVISA
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-green-100/80 mb-4">Ainda não possui cadastro?</p>
          <Link 
            href="/brasil"
            className="text-white hover:text-yellow-300 font-medium text-sm transition-colors border-b border-transparent hover:border-yellow-300"
          >
            Cadastre sua empresa
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-green-200/60">
          &copy; 2024 Brasil Food Transport. Sistema Homologado ANVISA e MAPA.
        </div>
      </div>
    </div>
  );
}
