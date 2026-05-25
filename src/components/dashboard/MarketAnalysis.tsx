'use client';

import { FileText, Activity, Calendar, Share2, ArrowRight, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/context/TranslationContext';

export default function MarketAnalysis() {
  const { t, language } = useTranslation();

  const reliabilityCopy = {
    pt: {
      title: 'Confiabilidade dos Dados',
      description:
        'Atualizacao, frequencia e continuidade em um resumo publico.',
      action: 'Ver confiabilidade',
    },
    en: {
      title: 'Data Reliability',
      description:
        'Freshness, cadence and continuity in one public summary.',
      action: 'View reliability',
    },
    es: {
      title: 'Confiabilidad de los Datos',
      description:
        'Actualizacion, frecuencia y continuidad en un solo resumen publico.',
      action: 'Ver confiabilidad',
    },
    ru: {
      title: 'Nadezhnost dannykh',
      description:
        'Aktualnost, chastota i nepreryvnost v odnom publichnom obzore.',
      action: 'Smotret nadezhnost',
    },
    ar: {
      title: 'موثوقية البيانات',
      description:
        'ملخص عام يجمع الحداثة والتحديث والاستمرارية.',
      action: 'عرض الموثوقية',
    },
    zh: {
      title: '数据可靠性',
      description:
        '把新鲜度、频率和连续性压缩为公开摘要。',
      action: '查看可靠性',
    },
  } as const;

  const activeLanguage = (['pt', 'en', 'es', 'ru', 'ar', 'zh'].includes(language) ? language : 'en') as keyof typeof reliabilityCopy;
  const reliability = reliabilityCopy[activeLanguage];

  const analysisCards = [
    {
      title: t('market_reports_title'),
      description: t('market_reports_description'),
      icon: FileText,
      iconTone: 'bg-blue-50 text-blue-600',
      actionTone: 'text-blue-600 hover:text-blue-700',
      action: t('view_reports_button'),
      href: '/market-analysis/reports'
    },
    {
      title: t('technical_indicators_title'),
      description: t('technical_indicators_description'),
      icon: Activity,
      iconTone: 'bg-indigo-50 text-indigo-600',
      actionTone: 'text-indigo-600 hover:text-indigo-700',
      action: t('view_indicators_button'),
      href: '/market-analysis/indicators'
    },
    {
      title: t('agricultural_calendar_title'),
      description: t('agricultural_calendar_description'),
      icon: Calendar,
      iconTone: 'bg-emerald-50 text-emerald-600',
      actionTone: 'text-emerald-600 hover:text-emerald-700',
      action: t('view_calendar_button'),
      href: '/market-analysis/calendar'
    },
    {
      title: t('market_correlations_title'),
      description: t('market_correlations_description'),
      icon: Share2,
      iconTone: 'bg-violet-50 text-violet-600',
      actionTone: 'text-violet-600 hover:text-violet-700',
      action: t('view_correlations_button'),
      href: '/market-analysis/correlations'
    },
    {
      title: reliability.title,
      description: reliability.description,
      icon: ShieldAlert,
      iconTone: 'bg-amber-50 text-amber-600',
      actionTone: 'text-amber-600 hover:text-amber-700',
      action: reliability.action,
      href: '/market-analysis/pipeline-status'
    }
  ];

  return (
    <section id="analise-mercado" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-6 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-green-500 after:rounded-full">
          {t('market_analysis_title')}
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
          {analysisCards.map((card, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 group flex flex-col hover:-translate-y-1">
              <div className="mb-4 flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 ${card.iconTone}`}>
                  <card.icon size={24} />
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  0{index + 1}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-3">{card.title}</h3>
              <p className="text-slate-600 mb-5 leading-6 text-sm flex-grow">
                {card.description}
              </p>
              
              <Link href={card.href} className={`flex items-center gap-2 font-semibold text-sm hover:gap-3 transition-all mt-auto ${card.actionTone}`}>
                {card.action} <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
