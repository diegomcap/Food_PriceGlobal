import Link from 'next/link';
import { Activity, ArrowRight, Database, Globe2, Newspaper, Radar, ShieldCheck, TrendingUp } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

const COPY = {
  pt: {
    eyebrow: 'Global Food Market Intelligence',
    kicker: 'Dados operacionais em producao',
    titleLead: 'Dados reais para',
    titleAccent: 'decidir melhor',
    titleTail: 'no mercado global de alimentos',
    subtitle:
      'Acompanhe commodities, indice FAO, drivers macro e alertas editoriais em uma unica leitura operacional para proteger margem, antecipar risco e agir no timing certo.',
    primary: 'Ver alertas do dia',
    secondary: 'Abrir mercados',
    overview: 'Explorar a visao completa',
    chips: ['FAO oficial', 'Futuros multi-source', 'Drivers macro', 'Noticias editoriais', 'Monitoramento continuo'],
    bullets: [
      'Serving persistido com continuidade entre fonte live, snapshot e fallback controlado.',
      'Leitura pronta para trading, exportacao, compras, sourcing e cobertura de risco.',
      'Mais contexto entre preco, energia, dolar, ouro e fluxo editorial.',
    ],
    panelEyebrow: 'Painel ao vivo',
    panelTitle: 'Camadas de sinal que ajudam a decidir mais cedo.',
    panelBody:
      'Unimos dados oficiais, futuros e observabilidade operacional em um fluxo unico, pensado para uso diario e nao para prototipos.',
    signalCards: [
      { icon: Database, label: 'Base', value: 'FAO + mercado', note: 'indices oficiais e futuros monitorados' },
      { icon: Activity, label: 'Leitura', value: 'Macro + risco', note: 'energia, ouro, dolar e sentimento' },
      { icon: Newspaper, label: 'Contexto', value: 'Editorial', note: 'alertas curtos com foco comercial' },
    ],
    bottomStats: [
      { label: 'Cobertura', value: '6 cadeias', note: 'graos, proteina, softs e oleos' },
      { label: 'Operacao', value: 'Dados reais', note: 'sem copy de tracker antigo ou prototipo' },
      { label: 'Foco', value: 'Acao diaria', note: 'leitura rapida para timing comercial' },
    ],
  },
  en: {
    eyebrow: 'Global Food Market Intelligence',
    kicker: 'Production-ready market data',
    titleLead: 'Real data for',
    titleAccent: 'better decisions',
    titleTail: 'across global food markets',
    subtitle:
      'Track commodities, the FAO index, macro drivers and editorial alerts in one operating view built to protect margin, anticipate risk and improve commercial timing.',
    primary: 'View today alerts',
    secondary: 'Open markets',
    overview: 'Explore the full view',
    chips: ['Official FAO', 'Multi-source futures', 'Macro drivers', 'Editorial alerts', 'Continuity monitoring'],
    bullets: [
      'Persisted serving with continuity across live feeds, snapshots and controlled fallback.',
      'Built for trading, exports, procurement, sourcing and hedge timing.',
      'More context between price, energy, dollar, gold and editorial flow.',
    ],
    panelEyebrow: 'Live panel',
    panelTitle: 'Signal layers built for earlier decisions.',
    panelBody:
      'We combine official data, futures and operational observability in one flow designed for daily decisions, not for prototype copy.',
    signalCards: [
      { icon: Database, label: 'Base', value: 'FAO + market', note: 'official indices and futures coverage' },
      { icon: Activity, label: 'Read', value: 'Macro + risk', note: 'energy, gold, dollar and sentiment' },
      { icon: Newspaper, label: 'Context', value: 'Editorial', note: 'short alerts with commercial focus' },
    ],
    bottomStats: [
      { label: 'Coverage', value: '6 chains', note: 'grains, protein, softs and oils' },
      { label: 'Operation', value: 'Real data', note: 'no leftover tracker or prototype copy' },
      { label: 'Focus', value: 'Daily action', note: 'fast read for commercial timing' },
    ],
  },
  es: {
    eyebrow: 'Global Food Market Intelligence',
    kicker: 'Datos operativos en produccion',
    titleLead: 'Datos reales para',
    titleAccent: 'decidir mejor',
    titleTail: 'en los mercados globales de alimentos',
    subtitle:
      'Siga commodities, indice FAO, drivers macro y alertas editoriales en una sola lectura operativa pensada para proteger margen, anticipar riesgo y mejorar el timing comercial.',
    primary: 'Ver alertas del dia',
    secondary: 'Abrir mercados',
    overview: 'Explorar la vision completa',
    chips: ['FAO oficial', 'Futuros multi-source', 'Drivers macro', 'Alertas editoriales', 'Monitoreo continuo'],
    bullets: [
      'Serving persistido con continuidad entre feed live, snapshot y fallback controlado.',
      'Pensado para trading, exportacion, compras, sourcing y cobertura de riesgo.',
      'Mas contexto entre precio, energia, dolar, oro y flujo editorial.',
    ],
    panelEyebrow: 'Panel en vivo',
    panelTitle: 'Capas de senal para decidir antes.',
    panelBody:
      'Unimos datos oficiales, futuros y observabilidad operativa en un solo flujo pensado para uso diario y no para textos de prototipo.',
    signalCards: [
      { icon: Database, label: 'Base', value: 'FAO + mercado', note: 'indices oficiales y futuros monitoreados' },
      { icon: Activity, label: 'Lectura', value: 'Macro + riesgo', note: 'energia, oro, dolar y sentimiento' },
      { icon: Newspaper, label: 'Contexto', value: 'Editorial', note: 'alertas cortas con foco comercial' },
    ],
    bottomStats: [
      { label: 'Cobertura', value: '6 cadenas', note: 'granos, proteina, softs y aceites' },
      { label: 'Operacion', value: 'Datos reales', note: 'sin restos de tracker antiguo o prototipo' },
      { label: 'Foco', value: 'Accion diaria', note: 'lectura rapida para timing comercial' },
    ],
  },
  ru: {
    eyebrow: 'Global Food Market Intelligence',
    kicker: 'Production market data',
    titleLead: 'Real data for',
    titleAccent: 'better decisions',
    titleTail: 'across food markets',
    subtitle:
      'Track commodities, the FAO index, macro drivers and editorial alerts in one operating view built for margin, risk and timing decisions.',
    primary: 'View today alerts',
    secondary: 'Open markets',
    overview: 'Explore full view',
    chips: ['Official FAO', 'Multi-source futures', 'Macro drivers', 'Editorial alerts', 'Continuity monitoring'],
    bullets: [
      'Persisted serving across live feeds, snapshots and controlled fallback.',
      'Built for trading, exports, sourcing and hedge timing.',
      'More context between price, energy, dollar, gold and editorial flow.',
    ],
    panelEyebrow: 'Live panel',
    panelTitle: 'Signal layers for earlier decisions.',
    panelBody: 'Official data, futures and observability connected in one daily operating flow.',
    signalCards: [
      { icon: Database, label: 'Base', value: 'FAO + market', note: 'official indices and futures' },
      { icon: Activity, label: 'Read', value: 'Macro + risk', note: 'energy, gold, dollar and sentiment' },
      { icon: Newspaper, label: 'Context', value: 'Editorial', note: 'short alerts for commercial use' },
    ],
    bottomStats: [
      { label: 'Coverage', value: '6 chains', note: 'grains, protein, softs and oils' },
      { label: 'Operation', value: 'Real data', note: 'cleaner product positioning' },
      { label: 'Focus', value: 'Daily action', note: 'fast commercial read' },
    ],
  },
  ar: {
    eyebrow: 'Global Food Market Intelligence',
    kicker: 'بيانات سوقية جاهزة للتشغيل',
    titleLead: 'بيانات حقيقية من اجل',
    titleAccent: 'قرارات افضل',
    titleTail: 'في اسواق الغذاء العالمية',
    subtitle:
      'تابع السلع ومؤشر FAO والعوامل الكلية والتنبيهات التحريرية في قراءة تشغيلية واحدة تساعد على حماية الهامش واستباق المخاطر وتحسين التوقيت التجاري.',
    primary: 'عرض تنبيهات اليوم',
    secondary: 'فتح الاسواق',
    overview: 'استكشاف الرؤية الكاملة',
    chips: ['FAO رسمي', 'عقود متعددة المصادر', 'عوامل كلية', 'تنبيهات تحريرية', 'مراقبة الاستمرارية'],
    bullets: [
      'استمرارية تشغيل بين المصدر الحي واللقطة المحفوظة ووضع الطوارئ المنضبط.',
      'مصمم للتداول والتصدير والمشتريات والتوريد وتوقيت التحوط.',
      'سياق اوسع بين السعر والطاقة والدولار والذهب والتدفق التحريري.',
    ],
    panelEyebrow: 'لوحة حية',
    panelTitle: 'طبقات اشارات تساعد على القرار المبكر.',
    panelBody: 'نجمع البيانات الرسمية والعقود المستقبلية ومراقبة التشغيل في تدفق واحد للاستخدام اليومي.',
    signalCards: [
      { icon: Database, label: 'الاساس', value: 'FAO + السوق', note: 'مؤشرات رسمية وعقود مستقبلية' },
      { icon: Activity, label: 'القراءة', value: 'ماكرو + مخاطر', note: 'طاقة وذهب ودولار ومعنويات' },
      { icon: Newspaper, label: 'السياق', value: 'تحريري', note: 'تنبيهات قصيرة بتركيز تجاري' },
    ],
    bottomStats: [
      { label: 'التغطية', value: '6 سلاسل', note: 'حبوب وبروتين وسلع لينة وزيوت' },
      { label: 'التشغيل', value: 'بيانات حقيقية', note: 'تموضع اوضح للمنتج' },
      { label: 'التركيز', value: 'قرار يومي', note: 'قراءة سريعة للتوقيت التجاري' },
    ],
  },
  zh: {
    eyebrow: 'Global Food Market Intelligence',
    kicker: '面向生产环境的市场数据',
    titleLead: '用真实数据支持',
    titleAccent: '更快决策',
    titleTail: '覆盖全球食品市场',
    subtitle:
      '把大宗商品、FAO 指数、宏观驱动和编辑预警放进同一个操作视图，帮助保护利润、识别风险并提升商业判断时机。',
    primary: '查看今日预警',
    secondary: '打开市场视图',
    overview: '探索完整视图',
    chips: ['官方 FAO', '多源期货', '宏观驱动', '编辑预警', '连续性监控'],
    bullets: [
      '在实时源、持久化快照和受控 fallback 之间保持连续性。',
      '面向交易、出口、采购、sourcing 与套保节奏。',
      '把价格、能源、美元、黄金与编辑流放进同一上下文。',
    ],
    panelEyebrow: '实时面板',
    panelTitle: '为更早决策设计的信号层。',
    panelBody: '把官方数据、期货与运行可观测性组合成适合日常使用的统一流程。',
    signalCards: [
      { icon: Database, label: '基础', value: 'FAO + 市场', note: '官方指数与期货覆盖' },
      { icon: Activity, label: '读取', value: '宏观 + 风险', note: '能源、黄金、美元与情绪' },
      { icon: Newspaper, label: '上下文', value: '编辑', note: '偏商业决策的短预警' },
    ],
    bottomStats: [
      { label: '覆盖', value: '6 条链路', note: '谷物、蛋白、软商品和油脂' },
      { label: '运行', value: '真实数据', note: '更干净的产品定位' },
      { label: '重点', value: '日常动作', note: '更快把握商业时机' },
    ],
  },
} as const;

export function Hero() {
  const { language } = useTranslation();
  const activeLanguage = (['pt', 'en', 'es', 'ru', 'ar', 'zh'].includes(language) ? language : 'en') as keyof typeof COPY;
  const copy = COPY[activeLanguage];

  return (
    <section className="relative overflow-hidden bg-slate-950 pt-32 pb-20 lg:pt-44 lg:pb-28">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.20),_transparent_28%),radial-gradient(circle_at_85%_20%,_rgba(59,130,246,0.18),_transparent_24%),linear-gradient(135deg,_rgba(15,23,42,0.96),_rgba(2,6,23,0.96))]" />
        <img src="/img/hero-bg.svg" alt="Agriculture Background" className="h-full w-full object-cover opacity-10 mix-blend-screen" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
              <Radar className="h-4 w-4" />
              {copy.eyebrow}
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
              <Globe2 className="h-4 w-4" />
              {copy.kicker}
            </div>
          </div>

          <div className="grid items-center gap-12 xl:grid-cols-[1.08fr_0.92fr]">
            <div>
              <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
                {copy.titleLead}{' '}
                <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-cyan-300 bg-clip-text text-transparent">
                  {copy.titleAccent}
                </span>{' '}
                {copy.titleTail}
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">
                {copy.subtitle}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {copy.chips.map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur-sm"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="mt-8 space-y-4">
                {copy.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-start gap-3 text-slate-200">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                    <span className="leading-7">{bullet}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="#alertas-mercado"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-950/40 transition-all hover:-translate-y-0.5 hover:from-emerald-400 hover:to-green-500"
                >
                  <Radar className="h-5 w-5" />
                  {copy.primary}
                </Link>

                <Link
                  href="#watchlist-critica"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/14"
                >
                  <TrendingUp className="h-5 w-5" />
                  {copy.secondary}
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-emerald-500/15 via-cyan-400/10 to-transparent blur-2xl" />
              <div className="relative rounded-[2rem] border border-white/10 bg-white/8 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">{copy.panelEyebrow}</p>
                    <h2 className="mt-3 text-2xl font-bold text-white">{copy.panelTitle}</h2>
                  </div>
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-emerald-200">
                    <Radar className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-300">{copy.panelBody}</p>

                <div className="mt-6 grid gap-4">
                  {copy.signalCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={`${card.label}-${card.value}`}
                        className="rounded-3xl border border-white/10 bg-slate-950/35 p-5"
                      >
                        <div className="flex items-start gap-4">
                          <div className="rounded-2xl bg-white/10 p-3 text-emerald-200">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{card.label}</p>
                            <p className="mt-2 text-xl font-bold text-white">{card.value}</p>
                            <p className="mt-2 text-sm leading-6 text-slate-300">{card.note}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {copy.bottomStats.map((stat) => (
                    <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                      <p className="mt-3 text-2xl font-black text-white">{stat.value}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{stat.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <Link href="#mercados" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-200 transition-colors hover:text-white">
              {copy.overview}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-50 to-transparent" />
    </section>
  );
}
