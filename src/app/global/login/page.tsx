'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plane, Lock, Globe2, ArrowRight, MapPin, Building, Mail } from 'lucide-react';
import { globalRegions } from '@/data/locations';

export default function GlobalLoginPage() {
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      window.location.href = '/global/dashboard';
    }, 1500);
  };

  const getCompanyIdLabel = () => {
    if (selectedCountry === 'BR') return 'CNPJ (Brazil)';
    if (selectedCountry === 'US') return 'EIN / Tax ID (USA)';
    if (selectedCountry === 'CN') return 'USCI (China)';
    if (selectedCountry === 'EU') return 'VAT Number (EU)';
    return 'Company ID / Registration';
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl mb-6 shadow-lg shadow-blue-500/30 transform rotate-3 hover:rotate-6 transition-transform">
              <Plane className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Global Access</h1>
            <p className="text-blue-200">Entre com suas credenciais corporativas</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-100 ml-1">Country / Region</label>
              <div className="relative">
                <Globe2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                <select 
                  required
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full bg-blue-950/30 border border-blue-400/30 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all appearance-none [&>optgroup]:text-black [&>option]:text-black"
                >
                  <option value="">Select your country</option>
                  {globalRegions.map((region) => (
                    <optgroup key={region.label} label={region.label}>
                      {region.countries.map((country) => (
                        <option key={country.value} value={country.value}>{country.label}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-100 ml-1">{getCompanyIdLabel()}</label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input 
                  type="text" 
                  required
                  className="w-full bg-blue-950/30 border border-blue-400/30 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all"
                  placeholder="Enter registration ID"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-100 ml-1">Corporate Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input 
                  type="email" 
                  required
                  className="w-full bg-blue-950/30 border border-blue-400/30 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all"
                  placeholder="user@foodprice.global"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-100 ml-1">Access Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input 
                  type="password" 
                  required
                  className="w-full bg-blue-950/30 border border-blue-400/30 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-blue-200 cursor-pointer hover:text-white">
                <input type="checkbox" className="w-4 h-4 rounded border-blue-400/30 bg-blue-950/30 checked:bg-blue-500" />
                Remember device
              </label>
              <a href="#" className="text-cyan-300 hover:text-cyan-200 transition-colors">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transform active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Access System <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-blue-200/60 text-sm">
              Acesso protegido por criptografia de ponta a ponta.
              <br />
              <span className="text-blue-200/40 text-xs">FoodPrice Global Security System v2.4</span>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/global" className="text-blue-200 hover:text-white transition-colors text-sm flex items-center justify-center gap-2">
            ← Voltar para o site público
          </Link>
        </div>
      </div>
    </div>
  );
}
