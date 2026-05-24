'use client';

import Link from 'next/link';
import { useTranslation } from '@/context/TranslationContext';

export function DivisionsSection() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-slate-900 py-20 text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t('divisions_title')}</h2>
          <p className="mx-auto max-w-2xl text-xl text-slate-300">{t('divisions_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/global" className="group">
            <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-2 hover:border-blue-500/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="mb-6 text-5xl transition-transform duration-300 group-hover:scale-110">🌍</div>
              <h3 className="mb-3 text-2xl font-bold text-white">{t('div_global_title')}</h3>
              <p className="text-sm leading-relaxed text-slate-300">{t('div_global_desc')}</p>
              <span className="mt-6 inline-block font-semibold text-blue-400 transition-transform group-hover:translate-x-2">
                {t('div_access_button')}
              </span>
            </div>
          </Link>

          <Link href="/brasil" className="group">
            <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-2 hover:border-green-500/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-green-500/20">
              <div className="mb-6 text-5xl transition-transform duration-300 group-hover:scale-110">🇧🇷</div>
              <h3 className="mb-3 text-2xl font-bold text-white">{t('div_brasil_title')}</h3>
              <p className="text-sm leading-relaxed text-slate-300">{t('div_brasil_desc')}</p>
              <span className="mt-6 inline-block font-semibold text-green-400 transition-transform group-hover:translate-x-2">
                {t('div_access_button')}
              </span>
            </div>
          </Link>

          <Link href="/latam" className="group">
            <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-2 hover:border-orange-500/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-orange-500/20">
              <div className="mb-6 text-5xl transition-transform duration-300 group-hover:scale-110">🌎</div>
              <h3 className="mb-3 text-2xl font-bold text-white">{t('div_latam_title')}</h3>
              <p className="text-sm leading-relaxed text-slate-300">{t('div_latam_desc')}</p>
              <span className="mt-6 inline-block font-semibold text-orange-400 transition-transform group-hover:translate-x-2">
                {t('div_access_button')}
              </span>
            </div>
          </Link>

          <Link href="/military" className="group">
            <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-2 hover:border-red-500/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-red-500/20">
              <div className="mb-6 text-5xl transition-transform duration-300 group-hover:scale-110">🛡️</div>
              <h3 className="mb-3 text-2xl font-bold text-white">{t('div_mfd_title')}</h3>
              <p className="text-sm leading-relaxed text-slate-300">{t('div_mfd_desc')}</p>
              <span className="mt-6 inline-block font-semibold text-red-400 transition-transform group-hover:translate-x-2">
                {t('div_access_button')}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
