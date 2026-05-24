import Link from 'next/link';
import { ArrowRight, Radar, Search, ShieldCheck, TrendingUp } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

const COPY = {
  pt: {
    eyebrow: 'FoodPrice Global Intelligence',
    titleLead: 'A mesa global para',
    titleAccent: 'decisao agro em tempo real',
    subtitle:
      'Commodities, macro, logistica e alertas acionaveis para antecipar risco, timing e margem em trading, exportacao, sourcing e hedge.',
    primary: 'Assinar Intelligence',
    secondary: 'Explorar dados ao vivo',
    chips: ['Commodities + macro + frete', 'Leitura executiva diaria', 'Foco em margem, risco e timing'],
    proofLabel: 'Feito para',
    proofItems: ['trading e hedge', 'origination e sourcing', 'exportacao e repasse'],
    quickAction: 'Ver leitura operacional',
  },
  en: {
    eyebrow: 'FoodPrice Global Intelligence',
    titleLead: 'The global desk for',
    titleAccent: 'real-time agribusiness decisions',
    subtitle:
      'Commodities, macro, logistics and actionable alerts to anticipate risk, timing and margins across trading, exports, sourcing and hedging.',
    primary: 'Subscribe to Intelligence',
    secondary: 'Explore live data',
    chips: ['Commodities + macro + freight', 'Daily executive brief', 'Built for margin, risk and timing'],
    proofLabel: 'Built for',
    proofItems: ['trading and hedge', 'origination and sourcing', 'exports and pass-through'],
    quickAction: 'See the operating read',
  },
  es: {
    eyebrow: 'FoodPrice Global Intelligence',
    titleLead: 'La mesa global para',
    titleAccent: 'decisiones agro en tiempo real',
    subtitle:
      'Commodities, macro, logistica y alertas accionables para anticipar riesgo, timing y margen en trading, exportacion, sourcing y hedge.',
    primary: 'Suscribirse a Intelligence',
    secondary: 'Explorar datos en vivo',
    chips: ['Commodities + macro + flete', 'Lectura ejecutiva diaria', 'Foco en margen, riesgo y timing'],
    proofLabel: 'Hecho para',
    proofItems: ['trading y hedge', 'origination y sourcing', 'exportacion y traslado'],
    quickAction: 'Ver lectura operativa',
  },
} as const;

export function Hero() {
  const { language } = useTranslation();
  const activeLanguage = language === 'pt' ? 'pt' : language === 'es' ? 'es' : 'en';
  const copy = COPY[activeLanguage];

  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-slate-900/90 to-slate-800/80"></div>
        <img
          src="/img/hero-bg.svg"
          alt="Agriculture Background"
          className="h-full w-full object-cover opacity-30"
        />
      </div>

      <div className="container relative z-20 mx-auto px-4 text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-100 backdrop-blur-sm">
          <ShieldCheck className="h-4 w-4 text-emerald-300" />
          {copy.eyebrow}
        </div>

        <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-2xl md:text-6xl">
          {copy.titleLead} <br />
          <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
            {copy.titleAccent}
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-slate-200 md:text-xl">
          {copy.subtitle}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="#intelligence"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:from-emerald-600 hover:to-green-700 hover:shadow-emerald-500/30"
          >
            <Radar className="h-5 w-5" /> {copy.primary}
          </Link>

          <Link
            href="#tabela-commodities"
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <Search className="h-5 w-5" /> {copy.secondary}
          </Link>
        </div>

        <div className="mx-auto mt-8 flex max-w-5xl flex-wrap items-center justify-center gap-3">
          {copy.chips.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 backdrop-blur-sm"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-[2rem] border border-white/10 bg-slate-950/35 p-5 text-left shadow-[0_22px_60px_rgba(15,23,42,0.24)] backdrop-blur-md md:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">{copy.proofLabel}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {copy.proofItems.map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-medium text-white">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href="#tendencias"
              className="inline-flex items-center gap-2 self-start rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-900 transition-all hover:-translate-y-0.5"
            >
              <TrendingUp className="h-4 w-4" />
              {copy.quickAction}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-20 h-24 w-full bg-gradient-to-t from-slate-50 to-transparent"></div>
    </section>
  );
}
