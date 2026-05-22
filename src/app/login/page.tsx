'use client';

import Link from 'next/link';
import { Building2, Globe2, Shield, Plane, ArrowRight } from 'lucide-react';

export default function LoginPortalPage() {
  const platforms = [
    {
      id: 'global',
      name: 'Global Markets & Logistics',
      description: 'Logística internacional, trading global e gestão de supply chain.',
      icon: Plane,
      color: 'bg-blue-600',
      gradient: 'from-blue-600 to-cyan-500',
      href: '/global/login',
      shadow: 'shadow-blue-500/30'
    },
    {
      id: 'brasil',
      name: 'Brasil Commodities & Logistics',
      description: 'Exportação de commodities, gestão logística nacional e distribuição interna.',
      icon: Building2,
      color: 'bg-green-600',
      gradient: 'from-green-600 to-yellow-500',
      href: '/brasil/login',
      shadow: 'shadow-green-500/30'
    },
    {
      id: 'latam',
      name: 'LATAM Export',
      description: 'Integração comercial América do Sul e Caribe.',
      icon: Globe2,
      color: 'bg-orange-600',
      gradient: 'from-orange-600 to-red-500',
      href: '/latam/login',
      shadow: 'shadow-orange-500/30'
    },
    {
      id: 'military',
      name: 'MFD Military',
      description: 'Acesso restrito para operações táticas e governamentais.',
      icon: Shield,
      color: 'bg-slate-800',
      gradient: 'from-slate-800 to-red-900',
      href: '/military/login',
      shadow: 'shadow-red-900/30'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-900/40"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Portal de Acesso <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Unificado</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Selecione a plataforma desejada para acessar seu painel de controle e ferramentas de gestão.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((platform) => (
            <Link 
              key={platform.id} 
              href={platform.href}
              className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${platform.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
              
              <div className={`w-16 h-16 rounded-xl ${platform.color} flex items-center justify-center mb-6 shadow-lg ${platform.shadow} group-hover:scale-110 transition-transform duration-300`}>
                <platform.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                {platform.name}
              </h3>
              
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                {platform.description}
              </p>

              <div className="flex items-center text-sm font-semibold text-white/70 group-hover:text-white transition-colors">
                Acessar Sistema <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm">
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
