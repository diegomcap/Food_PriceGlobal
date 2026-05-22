import Link from 'next/link';
import { ArrowRight, Search, TrendingUp } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-slate-800/80 z-10"></div>
        <img 
          src="/img/hero-bg.svg" 
          alt="Agriculture Background" 
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      <div className="container mx-auto px-4 relative z-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
          {t('hero_title').split(' ').slice(0, 3).join(' ')} <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
            {t('hero_title').split(' ').slice(3).join(' ')}
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-3xl mx-auto leading-relaxed">
          {t('hero_subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="#tabela-commodities" 
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-1 flex items-center gap-2"
          >
            <Search className="w-5 h-5" /> {t('hero_button')}
          </Link>
          
          <Link 
            href="#tendencias" 
            className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-bold rounded-full transition-all flex items-center gap-2"
          >
            <TrendingUp className="w-5 h-5" /> {t('hero_trends_button')}
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50 to-transparent z-20"></div>
    </section>
  );
}
