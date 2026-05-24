'use client';

import Link from 'next/link';
import { ArrowUpRight, Globe2, Landmark, Route, Shield } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

export function DivisionsSection() {
  const { language } = useTranslation();
  const activeLanguage = language === 'pt' ? 'pt' : language === 'es' ? 'es' : 'en';

  const COPY = {
    pt: {
      eyebrow: 'Cobertura operacional',
      title: 'Frentes do produto para leitura global, regional e institucional.',
      subtitle:
        'As rotas abaixo organizam a navegacao por escopo geografico e por mesa de atuacao, sem o tom antigo de “divisoes corporativas”.',
      cta: 'Abrir frente',
      items: [
        {
          href: '/global',
          title: 'Global desk',
          description: 'Visao internacional para fluxos de commodities, referencia FAO e leitura cross-market.',
          accent: 'border-sky-400/30 bg-sky-500/10 text-sky-200',
          icon: Globe2,
        },
        {
          href: '/brasil',
          title: 'Brazil export',
          description: 'Foco em soja, milho, proteinas e dinamica de origens conectadas ao Brasil.',
          accent: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
          icon: Landmark,
        },
        {
          href: '/latam',
          title: 'LatAm flows',
          description: 'Leitura regional para cadeias latino-americanas, arbitragem e monitoramento de oferta.',
          accent: 'border-orange-400/30 bg-orange-500/10 text-orange-200',
          icon: Route,
        },
        {
          href: '/military',
          title: 'Institutional resilience',
          description: 'Frente institucional para continuidade, suprimento sensivel e leitura de cenarios criticos.',
          accent: 'border-rose-400/30 bg-rose-500/10 text-rose-200',
          icon: Shield,
        },
      ],
    },
    en: {
      eyebrow: 'Operational coverage',
      title: 'Product fronts for global, regional and institutional reading.',
      subtitle:
        'The routes below organize navigation by geography and desk scope, without the old “corporate divisions” tone.',
      cta: 'Open front',
      items: [
        {
          href: '/global',
          title: 'Global desk',
          description: 'International view for commodity flows, FAO reference and cross-market reading.',
          accent: 'border-sky-400/30 bg-sky-500/10 text-sky-200',
          icon: Globe2,
        },
        {
          href: '/brasil',
          title: 'Brazil export',
          description: 'Focus on soybeans, corn, proteins and origin dynamics connected to Brazil.',
          accent: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
          icon: Landmark,
        },
        {
          href: '/latam',
          title: 'LatAm flows',
          description: 'Regional read for Latin American chains, arbitrage and supply monitoring.',
          accent: 'border-orange-400/30 bg-orange-500/10 text-orange-200',
          icon: Route,
        },
        {
          href: '/military',
          title: 'Institutional resilience',
          description: 'Institutional front for continuity, sensitive supply and critical-scenario reading.',
          accent: 'border-rose-400/30 bg-rose-500/10 text-rose-200',
          icon: Shield,
        },
      ],
    },
    es: {
      eyebrow: 'Cobertura operativa',
      title: 'Frentes del producto para lectura global, regional e institucional.',
      subtitle:
        'Las rutas de abajo organizan la navegacion por geografia y por mesa de actuacion, sin el tono antiguo de “divisiones corporativas”.',
      cta: 'Abrir frente',
      items: [
        {
          href: '/global',
          title: 'Global desk',
          description: 'Vision internacional para flujos de commodities, referencia FAO y lectura cross-market.',
          accent: 'border-sky-400/30 bg-sky-500/10 text-sky-200',
          icon: Globe2,
        },
        {
          href: '/brasil',
          title: 'Brazil export',
          description: 'Foco en soja, maiz, proteinas y dinamica de origenes conectadas con Brasil.',
          accent: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
          icon: Landmark,
        },
        {
          href: '/latam',
          title: 'LatAm flows',
          description: 'Lectura regional para cadenas latinoamericanas, arbitraje y monitoreo de oferta.',
          accent: 'border-orange-400/30 bg-orange-500/10 text-orange-200',
          icon: Route,
        },
        {
          href: '/military',
          title: 'Institutional resilience',
          description: 'Frente institucional para continuidad, suministro sensible y lectura de escenarios criticos.',
          accent: 'border-rose-400/30 bg-rose-500/10 text-rose-200',
          icon: Shield,
        },
      ],
    },
  } as const;

  const copy = COPY[activeLanguage];

  return (
    <section className="relative overflow-hidden bg-slate-900 py-24 text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
            <Route className="h-4 w-4" />
            {copy.eyebrow}
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-[-0.02em] md:text-4xl">{copy.title}</h2>
          <p className="mx-auto max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
            {copy.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {copy.items.map((item) => {
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href} className="group">
                <div className="h-full rounded-[1.8rem] border border-white/10 bg-white/5 p-8 md:p-9 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-white/20 hover:bg-white/[0.08] hover:shadow-2xl">
                  <div className={`mb-6 inline-flex rounded-2xl border px-4 py-4 ${item.accent}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-[1.65rem] font-bold tracking-[-0.02em] text-white">{item.title}</h3>
                  <p className="text-sm leading-7 text-slate-300/95">{item.description}</p>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-transform group-hover:translate-x-1">
                    {copy.cta}
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
