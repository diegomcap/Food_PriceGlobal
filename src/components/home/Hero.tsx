import Link from 'next/link';
import { Search, TrendingUp } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

export function Hero() {
  const { t } = useTranslation();

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
        <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-2xl md:text-6xl">
          {t('hero_title').split(' ').slice(0, 3).join(' ')} <br />
          <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
            {t('hero_title').split(' ').slice(3).join(' ')}
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-slate-200 md:text-xl">
          {t('hero_subtitle')}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="#tabela-commodities"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:from-emerald-600 hover:to-green-700 hover:shadow-emerald-500/30"
          >
            <Search className="h-5 w-5" /> {t('hero_button')}
          </Link>

          <Link
            href="#tendencias"
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <TrendingUp className="h-5 w-5" /> {t('hero_trends_button')}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-20 h-24 w-full bg-gradient-to-t from-slate-50 to-transparent"></div>
    </section>
  );
}
