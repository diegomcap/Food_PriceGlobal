'use client';

import { FileText, Activity, Calendar, Share2, ArrowRight, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/context/TranslationContext';

export default function MarketAnalysis() {
  const { t } = useTranslation();

  const analysisCards = [
    {
      title: t('market_reports_title'),
      description: t('market_reports_description'),
      icon: FileText,
      color: 'blue',
      action: t('view_reports_button'),
      href: '/market-analysis/reports'
    },
    {
      title: t('technical_indicators_title'),
      description: t('technical_indicators_description'),
      icon: Activity,
      color: 'indigo',
      action: t('view_indicators_button'),
      href: '/market-analysis/indicators'
    },
    {
      title: t('agricultural_calendar_title'),
      description: t('agricultural_calendar_description'),
      icon: Calendar,
      color: 'green',
      action: t('view_calendar_button'),
      href: '/market-analysis/calendar'
    },
    {
      title: t('market_correlations_title'),
      description: t('market_correlations_description'),
      icon: Share2,
      color: 'purple',
      action: t('view_correlations_button'),
      href: '/market-analysis/correlations'
    },
    {
      title: 'Pipeline Status',
      description: 'Observability for ingestion runs, current source tier, freshness and degraded-source alerts.',
      icon: ShieldAlert,
      color: 'amber',
      action: 'View status',
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
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 group flex flex-col">
              <div className={`w-14 h-14 rounded-2xl bg-${card.color}-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className={`text-${card.color}-600`} size={28} />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-4">{card.title}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed text-sm flex-grow">
                {card.description}
              </p>
              
              <Link href={card.href} className={`flex items-center gap-2 text-${card.color}-600 font-semibold text-sm hover:gap-3 transition-all group-hover:text-${card.color}-700 mt-auto`}>
                {card.action} <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
