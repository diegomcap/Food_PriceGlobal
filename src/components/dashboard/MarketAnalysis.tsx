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
        'Resumo publico de freshness, frequencia de atualizacao e monitoramento continuo das camadas de dados exibidas no produto.',
      action: 'Ver confiabilidade',
    },
    en: {
      title: 'Data Reliability',
      description:
        'Public summary of freshness, update cadence and continuity monitoring for the market datasets shown in the product.',
      action: 'View reliability',
    },
    es: {
      title: 'Confiabilidad de los Datos',
      description:
        'Resumen publico de freshness, frecuencia de actualizacion y monitoreo continuo de las capas de datos mostradas en el producto.',
      action: 'Ver confiabilidad',
    },
    ru: {
      title: 'Nadezhnost Dannykh',
      description:
        'Publichnoye rezume po freshness, chastote obnovleniya i nepreryvnomu monitoringu naborov rynochnykh dannykh produkta.',
      action: 'Smotret nadezhnost',
    },
    ar: {
      title: 'موثوقية البيانات',
      description:
        'ملخص عام عن حداثة البيانات وتيرة التحديث ومراقبة الاستمرارية لمجموعات البيانات المعروضة في المنتج.',
      action: 'عرض الموثوقية',
    },
    zh: {
      title: '数据可靠性',
      description:
        '面向公开页面的数据新鲜度、更新频率与连续性监控摘要，覆盖产品中的核心市场数据集。',
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
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-green-500 after:rounded-full">
          {t('market_analysis_title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {analysisCards.map((card, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 group flex flex-col hover:-translate-y-1">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${card.iconTone}`}>
                <card.icon size={28} />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-4">{card.title}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed text-sm flex-grow">
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
