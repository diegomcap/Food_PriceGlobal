import Link from 'next/link';
import { ArrowRight, Radar, ShieldAlert, TrendingUp } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

const COPY = {
  pt: {
    eyebrow: 'Global Food Market Intelligence',
    title: 'Decida com mais velocidade em mercados globais de alimentos.',
    subtitle:
      'Cruze dados oficiais, sinais de futuros, alertas editoriais e drivers macro para proteger margem, antecipar risco e melhorar timing comercial.',
    primary: 'Ver Alertas do Dia',
    secondary: 'Monitorar Mercados',
    overview: 'Ver panorama completo',
    bullets: [
      'Risco e margem em uma leitura unica',
      'FAO, futuros e intelligence editorial no mesmo fluxo',
      'Mais contexto para trading, exportacao e sourcing',
    ],
    stats: [
      { label: 'Cobertura', value: '6 cadeias', note: 'graos, proteina, softs e oleos' },
      { label: 'Drivers', value: 'Macro + fisico', note: 'FAO, futuros, energia e FX' },
      { label: 'Foco', value: 'Timing', note: 'leitura rapida para decisao diaria' },
    ],
  },
  en: {
    eyebrow: 'Global Food Market Intelligence',
    title: 'Make faster decisions across global food markets.',
    subtitle:
      'Combine official data, futures signals, editorial alerts and macro drivers to protect margin, anticipate risk and improve commercial timing.',
    primary: 'View Today Alerts',
    secondary: 'Monitor Markets',
    overview: 'View full overview',
    bullets: [
      'Risk and margin in one operating view',
      'FAO, futures and editorial intelligence in the same flow',
      'More context for trading, exports and sourcing',
    ],
    stats: [
      { label: 'Coverage', value: '6 chains', note: 'grains, protein, softs and oils' },
      { label: 'Drivers', value: 'Macro + physical', note: 'FAO, futures, energy and FX' },
      { label: 'Focus', value: 'Timing', note: 'fast read for daily decisions' },
    ],
  },
  es: {
    eyebrow: 'Global Food Market Intelligence',
    title: 'Tome decisiones mas rapidas en los mercados globales de alimentos.',
    subtitle:
      'Cruce datos oficiales, senales de futuros, alertas editoriales y drivers macro para proteger margen, anticipar riesgo y mejorar el timing comercial.',
    primary: 'Ver Alertas del Dia',
    secondary: 'Monitorear Mercados',
    overview: 'Ver panorama completo',
    bullets: [
      'Riesgo y margen en una sola lectura operativa',
      'FAO, futuros e inteligencia editorial en el mismo flujo',
      'Mas contexto para trading, exportacion y abastecimiento',
    ],
    stats: [
      { label: 'Cobertura', value: '6 cadenas', note: 'granos, proteina, softs y aceites' },
      { label: 'Drivers', value: 'Macro + fisico', note: 'FAO, futuros, energia y FX' },
      { label: 'Foco', value: 'Timing', note: 'lectura rapida para la decision diaria' },
    ],
  },
  ru: {
    eyebrow: 'Global Food Market Intelligence',
    title: 'Prinimaite resheniya bystree na globalnykh prodovolstvennykh rynkakh.',
    subtitle:
      'Sovmeshchaite ofitsialnye dannye, signaly fuchersov, redaktsionnye alerty i makro-draivery, chtoby zashchishchat marzhu i uluchshat timing sdelok.',
    primary: 'Smotret alerty dnya',
    secondary: 'Sledit za rynkami',
    overview: 'Smotret polnuyu kartinu',
    bullets: [
      'Risk i marzha v odnom operatsionnom vide',
      'FAO, fuchersy i redaktsionnaya analitika v odnom potoke',
      'Bolshe konteksta dlya treidinga, eksporta i sourcinga',
    ],
    stats: [
      { label: 'Pokrytie', value: '6 tsepochek', note: 'zerno, protein, softs i masla' },
      { label: 'Draivery', value: 'Macro + physical', note: 'FAO, fuchersy, energiya i FX' },
      { label: 'Fokus', value: 'Timing', note: 'bystraya ezhednevnaya operativnaya otsenka' },
    ],
  },
  ar: {
    eyebrow: 'Global Food Market Intelligence',
    title: 'اتخذ قرارات اسرع في اسواق الغذاء العالمية.',
    subtitle:
      'اجمع بين البيانات الرسمية واشارات العقود المستقبلية والتنبيهات التحريرية والعوامل الكلية لحماية الهامش واستباق المخاطر وتحسين توقيت القرار التجاري.',
    primary: 'عرض تنبيهات اليوم',
    secondary: 'مراقبة الاسواق',
    overview: 'عرض النظرة الكاملة',
    bullets: [
      'المخاطر والهامش في قراءة تشغيلية واحدة',
      'FAO والعقود المستقبلية والتحليل التحريري في تدفق واحد',
      'سياق اوسع للتداول والتصدير والتوريد',
    ],
    stats: [
      { label: 'التغطية', value: '6 سلاسل', note: 'حبوب وبروتين وسلع لينة وزيوت' },
      { label: 'المحركات', value: 'Macro + Physical', note: 'FAO والعقود والطاقة والعملات' },
      { label: 'التركيز', value: 'Timing', note: 'قراءة سريعة للقرار اليومي' },
    ],
  },
  zh: {
    eyebrow: 'Global Food Market Intelligence',
    title: '在全球食品市场中更快做出决策。',
    subtitle:
      '整合官方数据、期货信号、编辑预警和宏观驱动因素，以保护利润、提前识别风险并提升商业判断时机。',
    primary: '查看今日预警',
    secondary: '监控市场',
    overview: '查看完整概览',
    bullets: [
      '在一个操作视图中同时看到风险与利润空间',
      '将 FAO、期货和编辑情报放在同一流程中',
      '为交易、出口和采购提供更多上下文',
    ],
    stats: [
      { label: '覆盖范围', value: '6 条链路', note: '谷物、蛋白、软商品和油脂' },
      { label: '驱动因素', value: '宏观 + 现货', note: 'FAO、期货、能源和外汇' },
      { label: '重点', value: '时机', note: '面向日常决策的快速读数' },
    ],
  },
} as const;

export function Hero() {
  const { language } = useTranslation();
  const activeLanguage = (['pt', 'en', 'es', 'ru', 'ar', 'zh'].includes(language) ? language : 'en') as keyof typeof COPY;
  const copy = COPY[activeLanguage];

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

      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300 mb-6">
            <Radar className="w-4 h-4" />
            {copy.eyebrow}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
                {copy.title.split(' ').slice(0, 5).join(' ')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                  {copy.title.split(' ').slice(5).join(' ')}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-3xl leading-relaxed">
                {copy.subtitle}
              </p>

              <div className="space-y-3 mb-10">
                {copy.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-start gap-3 text-slate-200">
                    <ShieldAlert className="w-5 h-5 mt-0.5 text-emerald-300 shrink-0" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Link
                  href="#alertas-mercado"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-1 flex items-center gap-2"
                >
                  <Radar className="w-5 h-5" /> {copy.primary}
                </Link>

                <Link
                  href="#watchlist-critica"
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-bold rounded-full transition-all flex items-center gap-2"
                >
                  <TrendingUp className="w-5 h-5" /> {copy.secondary}
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {copy.stats.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-md p-6 shadow-xl">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-300 mb-2">{stat.label}</div>
                  <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-slate-300">{stat.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Link 
            href="#mercados" 
            className="text-sm font-semibold text-slate-200 hover:text-white inline-flex items-center gap-2"
          >
            {copy.overview} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50 to-transparent z-20"></div>
    </section>
  );
}
