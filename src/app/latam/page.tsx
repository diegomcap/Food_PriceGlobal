'use client';

import React from 'react';
import Link from 'next/link';
import { Globe2, Ship, Coins, FileCheck, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

const COPY = {
  pt: {
    brand: 'LATAM Export',
    login: 'Login',
    register: 'Registrar',
    title: 'Conectando mercados latino-americanos',
    accent: 'Latino-americanos',
    subtitle:
      'Plataforma unificada para comercio exterior, logistica integrada e gestao aduaneira em toda a America Latina.',
    primary: 'Comecar agora',
    secondary: 'Explorar solucoes',
    sectionTitle: 'Solucoes integrais de exportacao',
    sectionSubtitle:
      'Simplificamos o comercio internacional com ferramentas desenhadas para o mercado latino-americano.',
    footer: 'Todos os direitos reservados.',
    cards: [
      ['Logistica multimodal', 'Gestao de transporte maritimo, aereo e terrestre com acompanhamento em tempo real.'],
      ['Gestao de divisas', 'Conversao e cobertura de moedas locais para transacoes internacionais mais seguras.'],
      ['Tramites aduaneiros', 'Automacao de documentacao e compliance regulatorio para 18 paises.'],
    ],
  },
  en: {
    brand: 'LATAM Export',
    login: 'Login',
    register: 'Register',
    title: 'Connecting Latin American markets',
    accent: 'Latin American',
    subtitle:
      'Unified platform for foreign trade, integrated logistics and customs management across Latin America.',
    primary: 'Start now',
    secondary: 'Explore solutions',
    sectionTitle: 'Integrated export solutions',
    sectionSubtitle:
      'We simplify international trade with tools designed for the Latin American market.',
    footer: 'All rights reserved.',
    cards: [
      ['Multimodal logistics', 'Management of ocean, air and road transport with real-time tracking.'],
      ['FX management', 'Conversion and hedging of local currencies for safer international transactions.'],
      ['Customs workflows', 'Automated documentation and regulatory compliance for 18 countries.'],
    ],
  },
  es: {
    brand: 'LATAM Export',
    login: 'Login',
    register: 'Registrar',
    title: 'Conectando mercados latinoamericanos',
    accent: 'Latinoamericanos',
    subtitle:
      'Plataforma unificada para comercio exterior, logistica integrada y gestion aduanera en toda America Latina.',
    primary: 'Comenzar ahora',
    secondary: 'Explorar soluciones',
    sectionTitle: 'Soluciones integrales de exportacion',
    sectionSubtitle:
      'Simplificamos el comercio internacional con herramientas disenadas para el mercado latinoamericano.',
    footer: 'Todos los derechos reservados.',
    cards: [
      ['Logistica multimodal', 'Gestion de transporte maritimo, aereo y terrestre con seguimiento en tiempo real.'],
      ['Gestion de divisas', 'Conversion y cobertura de monedas locales para transacciones internacionales seguras.'],
      ['Tramites aduaneros', 'Automatizacion de documentacion y cumplimiento normativo para 18 paises.'],
    ],
  },
} as const;

export default function LatamWelcomePage() {
  const currentYear = new Date().getFullYear();
  const { language } = useTranslation();
  const copy = COPY[language];

  return (
    <div className="min-h-screen bg-blue-50 font-sans">
      {/* Navbar */}
      <nav className="bg-blue-900 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Globe2 className="text-orange-400" />
            {copy.brand}
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher className="bg-blue-950/60" />
            <Link href="/latam/login" className="px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
              {copy.login}
            </Link>
            <Link href="/latam/login" className="px-4 py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors">
              {copy.register}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {copy.title.split(' ').slice(0, 2).join(' ')} <br/>
            <span className="text-orange-400">{copy.accent}</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            {copy.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/latam/login" className="px-8 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transform hover:-translate-y-1 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2">
              {copy.primary}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#features" className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all">
              {copy.secondary}
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">{copy.sectionTitle}</h2>
            <p className="text-blue-700 max-w-2xl mx-auto">
              {copy.sectionSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Ship className="w-8 h-8 text-blue-600" />}
              title={copy.cards[0][0]}
              description={copy.cards[0][1]}
            />
            <FeatureCard 
              icon={<Coins className="w-8 h-8 text-blue-600" />}
              title={copy.cards[1][0]}
              description={copy.cards[1][1]}
            />
            <FeatureCard 
              icon={<FileCheck className="w-8 h-8 text-blue-600" />}
              title={copy.cards[2][0]}
              description={copy.cards[2][1]}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-blue-400 py-8 px-4 text-center text-sm">
        <div className="container mx-auto">
          <p>&copy; {currentYear} {copy.brand}. {copy.footer}</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow group hover:-translate-y-2 duration-300">
      <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-blue-900 mb-3">{title}</h3>
      <p className="text-blue-700 leading-relaxed">{description}</p>
    </div>
  );
}
