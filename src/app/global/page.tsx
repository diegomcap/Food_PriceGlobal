'use client';

import Link from 'next/link';
import { Plane, Ship, Truck, Globe2, PackageCheck, BarChart3, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

const COPY = {
  pt: {
    back: 'Voltar para Home',
    badge: 'Logistica Internacional',
    title: 'Conectando mercados globais com eficiencia e seguranca',
    subtitle:
      'Solucoes integradas de transporte aereo, maritimo e terrestre para a industria alimenticia mundial, com monitoramento em tempo real e compliance internacional.',
    primary: 'Acessar portal do cliente',
    secondary: 'Falar com especialista',
    whyTitle: 'Por que escolher a FoodPrice Global?',
    whySubtitle: 'Tecnologia e expertise unidas para garantir a integridade da sua carga.',
    cards: [
      {
        title: 'Frete aereo express',
        description: 'Transporte de pereciveis com controle de temperatura e prioridade de embarque em mais de 120 paises.',
      },
      {
        title: 'Transporte maritimo',
        description: 'Solucoes FCL e LCL para grandes volumes, com containers refrigerados de ultima geracao.',
      },
      {
        title: 'Malha terrestre',
        description: 'Frota conectada para distribuicao last-mile e conexoes intermodais eficientes.',
      },
    ],
    highlights: [
      {
        title: 'Cobertura global',
        description: 'Presenca em todos os continentes com parceiros locais certificados.',
      },
      {
        title: 'Rastreabilidade total',
        description: 'Monitoramento 24/7 da localizacao e das condicoes da carga.',
      },
      {
        title: 'Seguro integrado',
        description: 'Protecao completa contra riscos e avarias durante todo o trajeto.',
      },
      {
        title: 'Analytics',
        description: 'Relatorios detalhados de performance e custos logisticos.',
      },
    ],
  },
  en: {
    back: 'Back to Home',
    badge: 'International Logistics',
    title: 'Connecting global markets with efficiency and security',
    subtitle:
      'Integrated air, ocean and road transport solutions for the global food industry, with real-time monitoring and international compliance.',
    primary: 'Access client portal',
    secondary: 'Talk to a specialist',
    whyTitle: 'Why choose FoodPrice Global?',
    whySubtitle: 'Technology and expertise working together to protect the integrity of your cargo.',
    cards: [
      {
        title: 'Express air freight',
        description: 'Perishable transport with temperature control and priority boarding in more than 120 countries.',
      },
      {
        title: 'Ocean shipping',
        description: 'FCL and LCL solutions for large volumes with next-generation refrigerated containers.',
      },
      {
        title: 'Road network',
        description: 'Connected fleet for last-mile distribution and efficient intermodal links.',
      },
    ],
    highlights: [
      {
        title: 'Global coverage',
        description: 'Presence across every continent with certified local partners.',
      },
      {
        title: 'Full traceability',
        description: '24/7 monitoring of cargo location and shipping conditions.',
      },
      {
        title: 'Integrated insurance',
        description: 'Complete protection against risk and damage throughout the journey.',
      },
      {
        title: 'Analytics',
        description: 'Detailed reports on performance and logistics costs.',
      },
    ],
  },
  es: {
    back: 'Volver al Inicio',
    badge: 'Logistica Internacional',
    title: 'Conectando mercados globales con eficiencia y seguridad',
    subtitle:
      'Soluciones integradas de transporte aereo, maritimo y terrestre para la industria alimentaria mundial, con monitoreo en tiempo real y compliance internacional.',
    primary: 'Acceder al portal del cliente',
    secondary: 'Hablar con un especialista',
    whyTitle: 'Por que elegir FoodPrice Global?',
    whySubtitle: 'Tecnologia y experiencia unidas para proteger la integridad de su carga.',
    cards: [
      {
        title: 'Flete aereo express',
        description: 'Transporte de perecederos con control de temperatura y prioridad de embarque en mas de 120 paises.',
      },
      {
        title: 'Transporte maritimo',
        description: 'Soluciones FCL y LCL para grandes volumenes con contenedores refrigerados de ultima generacion.',
      },
      {
        title: 'Red terrestre',
        description: 'Flota conectada para distribucion last-mile y conexiones intermodales eficientes.',
      },
    ],
    highlights: [
      {
        title: 'Cobertura global',
        description: 'Presencia en todos los continentes con socios locales certificados.',
      },
      {
        title: 'Trazabilidad total',
        description: 'Monitoreo 24/7 de la ubicacion y condiciones de la carga.',
      },
      {
        title: 'Seguro integrado',
        description: 'Proteccion completa contra riesgos y danos durante todo el trayecto.',
      },
      {
        title: 'Analytics',
        description: 'Reportes detallados de desempeno y costos logisticos.',
      },
    ],
  },
} as const;

export default function GlobalTransportPage() {
  const { language } = useTranslation();
  const copy = COPY[language];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
            ← {copy.back}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-blue-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/90 to-blue-800/80"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-block px-4 py-2 bg-blue-800/50 rounded-full border border-blue-700/50 text-blue-200 text-sm font-semibold mb-6">
              {copy.badge}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {copy.title}
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mb-10 leading-relaxed">
              {copy.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/global/login" className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg flex items-center gap-2">
                {copy.primary} <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="bg-blue-800/50 border border-blue-700 hover:bg-blue-700/50 text-white px-8 py-4 rounded-xl font-bold transition-colors backdrop-blur-sm">
                {copy.secondary}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-32 relative z-20">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Plane className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{copy.cards[0].title}</h3>
            <p className="text-slate-600 leading-relaxed">
              {copy.cards[0].description}
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
              <Ship className="w-7 h-7 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{copy.cards[1].title}</h3>
            <p className="text-slate-600 leading-relaxed">
              {copy.cards[1].description}
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
              <Truck className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{copy.cards[2].title}</h3>
            <p className="text-slate-600 leading-relaxed">
              {copy.cards[2].description}
            </p>
          </div>
        </div>

        <div className="mt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{copy.whyTitle}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">{copy.whySubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl hover:bg-white hover:shadow-lg transition-all">
              <Globe2 className="w-10 h-10 text-blue-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2">{copy.highlights[0].title}</h4>
              <p className="text-sm text-slate-600">{copy.highlights[0].description}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl hover:bg-white hover:shadow-lg transition-all">
              <PackageCheck className="w-10 h-10 text-blue-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2">{copy.highlights[1].title}</h4>
              <p className="text-sm text-slate-600">{copy.highlights[1].description}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl hover:bg-white hover:shadow-lg transition-all">
              <ShieldCheck className="w-10 h-10 text-blue-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2">{copy.highlights[2].title}</h4>
              <p className="text-sm text-slate-600">{copy.highlights[2].description}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl hover:bg-white hover:shadow-lg transition-all">
              <BarChart3 className="w-10 h-10 text-blue-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2">{copy.highlights[3].title}</h4>
              <p className="text-sm text-slate-600">{copy.highlights[3].description}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
