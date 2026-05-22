'use client';

import Link from 'next/link';
import { useTranslation } from '@/context/TranslationContext';

export function DivisionsSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('divisions_title')}</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            {t('divisions_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Global Card */}
          <Link href="/global" className="group">
            <div className="bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 rounded-2xl p-8 h-full border border-white/10 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 group-hover:-translate-y-2">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🌍</div>
              <h3 className="text-2xl font-bold text-white mb-3">{t('div_global_title')}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {t('div_global_desc')}
              </p>
              <span className="inline-block mt-6 text-blue-400 font-semibold group-hover:translate-x-2 transition-transform">{t('div_access_button')}</span>
            </div>
          </Link>

          {/* Brasil Card */}
          <Link href="/brasil" className="group">
            <div className="bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 rounded-2xl p-8 h-full border border-white/10 hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/20 group-hover:-translate-y-2">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🇧🇷</div>
              <h3 className="text-2xl font-bold text-white mb-3">{t('div_brasil_title')}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {t('div_brasil_desc')}
              </p>
              <span className="inline-block mt-6 text-green-400 font-semibold group-hover:translate-x-2 transition-transform">{t('div_access_button')}</span>
            </div>
          </Link>

          {/* LATAM Card */}
          <Link href="/latam" className="group">
            <div className="bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 rounded-2xl p-8 h-full border border-white/10 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/20 group-hover:-translate-y-2">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🌎</div>
              <h3 className="text-2xl font-bold text-white mb-3">{t('div_latam_title')}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {t('div_latam_desc')}
              </p>
              <span className="inline-block mt-6 text-orange-400 font-semibold group-hover:translate-x-2 transition-transform">{t('div_access_button')}</span>
            </div>
          </Link>

          {/* Military Card */}
          <Link href="/military" className="group">
            <div className="bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 rounded-2xl p-8 h-full border border-white/10 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/20 group-hover:-translate-y-2">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🛡️</div>
              <h3 className="text-2xl font-bold text-white mb-3">{t('div_mfd_title')}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {t('div_mfd_desc')}
              </p>
              <span className="inline-block mt-6 text-red-400 font-semibold group-hover:translate-x-2 transition-transform">{t('div_access_button')}</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
