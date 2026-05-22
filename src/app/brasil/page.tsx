'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, BarChart3, Globe2, ArrowRight, Check } from 'lucide-react';

export default function BrasilWelcomePage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-green-50 font-sans">
      {/* Navbar */}
      <nav className="bg-green-800 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-2xl">🇧🇷</span>
            Brasil Food Transport
          </div>
          <div className="flex gap-4">
            <Link href="/brasil/login" className="px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Login
            </Link>
            <Link href="/brasil/login" className="px-4 py-2 bg-yellow-400 text-green-900 rounded-lg font-bold hover:bg-yellow-300 transition-colors">
              Cadastrar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-br from-green-800 to-green-600 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            O Futuro da Logística <br/>
            <span className="text-yellow-400">Agroalimentar Brasileira</span>
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Conectamos produtores, transportadores e exportadores em uma única plataforma integrada com compliance total ANVISA e MAPA.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/brasil/login" className="px-8 py-4 bg-yellow-400 text-green-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transform hover:-translate-y-1 transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2">
              Acessar Plataforma
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#features" className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all">
              Saiba Mais
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-green-900 mb-4">Por que escolher o Brasil Food Transport?</h2>
            <p className="text-green-700 max-w-2xl mx-auto">
              Nossa plataforma oferece ferramentas exclusivas para otimizar sua operação logística e garantir a qualidade dos alimentos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Truck className="w-8 h-8 text-green-600" />}
              title="Gestão de Frota"
              description="Monitoramento em tempo real de veículos e cargas com integração direta aos sistemas de rastreamento."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8 text-green-600" />}
              title="Certificação Digital"
              description="Emissão e validação automática de certificados sanitários e documentos fiscais."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-8 h-8 text-green-600" />}
              title="Analytics Avançado"
              description="Painéis de controle com indicadores de performance, custos e eficiência logística."
            />
            <FeatureCard 
              icon={<Globe2 className="w-8 h-8 text-green-600" />}
              title="Conexão Global"
              description="Integração nativa com os portais LATAM Export e MFD Military para expansão internacional."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-900 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para revolucionar sua logística?</h2>
          <p className="text-green-200 mb-8 max-w-2xl mx-auto">
            Junte-se a mais de 24.000 empresas que já utilizam o Brasil Food Transport para gerenciar suas operações.
          </p>
          <Link href="/brasil/login" className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-green-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all shadow-lg">
            Começar Agora
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-950 text-green-400 py-8 px-4 text-center text-sm">
        <div className="container mx-auto">
          <p>&copy; {currentYear} Brasil Food Transport. Todos os direitos reservados.</p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-shadow">
      <div className="bg-green-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-green-900 mb-3">{title}</h3>
      <p className="text-green-700 leading-relaxed">{description}</p>
    </div>
  );
}
