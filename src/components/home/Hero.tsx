import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Database, Globe2, Radar, ShieldCheck, Workflow } from 'lucide-react';
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
    deckEyebrow: 'Mesa de decisao',
    deckTitle: 'Um cockpit editorial para sinais de mercado.',
    deckBody:
      'Menos homepage de template e mais painel de leitura: sinais oficiais, mercado monitorado e contexto comercial no mesmo enquadramento.',
    deckBlocks: [
      { label: 'Base', value: 'FAO + futuros', note: 'estrutura de preco e contratos monitorados' },
      { label: 'Risco', value: 'Macro + energia', note: 'dolar, ouro, crude e leitura cross-market' },
      { label: 'Acao', value: 'Fluxo editorial', note: 'alertas curtos para decisao comercial' },
    ],
    railStats: [
      { label: 'Cobertura', value: '6 cadeias' },
      { label: 'Operacao', value: 'Dados reais' },
      { label: 'Foco', value: 'Timing diario' },
    ],
    useCasesLabel: 'Casos de uso',
    railLabel: 'Trilho de sinais',
    pulseLabel: 'Pulso',
    pulseItems: ['Continuidade do feed', 'Contexto cross-market', 'Timing editorial'],
    useCases: ['trading', 'exportacao', 'origination', 'sourcing'],
    footnote: 'Leitura desenhada para margem, repasse e timing. Nao para parecer igual a qualquer site de dashboard.',
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
    deckEyebrow: 'Decision desk',
    deckTitle: 'An editorial cockpit for market signals.',
    deckBody:
      'Less template homepage and more market-reading surface: official references, monitored market feeds and commercial context in one frame.',
    deckBlocks: [
      { label: 'Base', value: 'FAO + futures', note: 'price structure and monitored contracts' },
      { label: 'Risk', value: 'Macro + energy', note: 'dollar, gold, crude and cross-market read' },
      { label: 'Action', value: 'Editorial flow', note: 'short alerts for commercial decisions' },
    ],
    railStats: [
      { label: 'Coverage', value: '6 chains' },
      { label: 'Operation', value: 'Real data' },
      { label: 'Focus', value: 'Daily timing' },
    ],
    useCasesLabel: 'Use cases',
    railLabel: 'Signal rail',
    pulseLabel: 'Pulse',
    pulseItems: ['Feed continuity', 'Cross-market context', 'Editorial timing'],
    useCases: ['trading', 'exports', 'origination', 'sourcing'],
    footnote: 'Built for margin, pass-through and timing decisions. Not to look like every other dashboard site.',
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
    deckEyebrow: 'Mesa de decision',
    deckTitle: 'Un cockpit editorial para senales de mercado.',
    deckBody:
      'Menos homepage de plantilla y mas superficie de lectura: referencias oficiales, mercado monitoreado y contexto comercial en un mismo cuadro.',
    deckBlocks: [
      { label: 'Base', value: 'FAO + futuros', note: 'estructura de precios y contratos monitoreados' },
      { label: 'Riesgo', value: 'Macro + energia', note: 'dolar, oro, crude y lectura cross-market' },
      { label: 'Accion', value: 'Flujo editorial', note: 'alertas cortas para decisiones comerciales' },
    ],
    railStats: [
      { label: 'Cobertura', value: '6 cadenas' },
      { label: 'Operacion', value: 'Datos reales' },
      { label: 'Foco', value: 'Timing diario' },
    ],
    useCasesLabel: 'Casos de uso',
    railLabel: 'Carril de senales',
    pulseLabel: 'Pulso',
    pulseItems: ['Continuidad del feed', 'Contexto cross-market', 'Timing editorial'],
    useCases: ['trading', 'exportacion', 'origination', 'sourcing'],
    footnote: 'Pensado para margen, traslado de precios y timing. No para verse como cualquier dashboard comun.',
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
    deckEyebrow: 'Decision desk',
    deckTitle: 'An editorial cockpit for market signals.',
    deckBody: 'Official references, monitored feeds and commercial context arranged as one operating surface.',
    deckBlocks: [
      { label: 'Base', value: 'FAO + futures', note: 'price structure and monitored contracts' },
      { label: 'Risk', value: 'Macro + energy', note: 'dollar, gold, crude and cross-market read' },
      { label: 'Action', value: 'Editorial flow', note: 'short alerts for decisions' },
    ],
    railStats: [
      { label: 'Coverage', value: '6 chains' },
      { label: 'Operation', value: 'Real data' },
      { label: 'Focus', value: 'Daily timing' },
    ],
    useCasesLabel: 'Use cases',
    railLabel: 'Signal rail',
    pulseLabel: 'Pulse',
    pulseItems: ['Feed continuity', 'Cross-market context', 'Editorial timing'],
    useCases: ['trading', 'exports', 'origination', 'sourcing'],
    footnote: 'Built for margin and timing decisions, not generic dashboard aesthetics.',
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
    deckEyebrow: 'مكتب القرار',
    deckTitle: 'مقصورة تحريرية لاشارات السوق.',
    deckBody: 'ترتيب مختلف يجمع المرجع الرسمي والمصادر المراقبة والسياق التجاري في سطح واحد للقراءة اليومية.',
    deckBlocks: [
      { label: 'الاساس', value: 'FAO + العقود', note: 'بنية السعر والعقود المراقبة' },
      { label: 'المخاطر', value: 'ماكرو + طاقة', note: 'دولار وذهب ونفط وقراءة مترابطة' },
      { label: 'الفعل', value: 'تدفق تحريري', note: 'تنبيهات قصيرة لقرار تجاري' },
    ],
    railStats: [
      { label: 'التغطية', value: '6 سلاسل' },
      { label: 'التشغيل', value: 'بيانات حقيقية' },
      { label: 'التركيز', value: 'توقيت يومي' },
    ],
    useCasesLabel: 'حالات الاستخدام',
    railLabel: 'مسار الاشارات',
    pulseLabel: 'النبض',
    pulseItems: ['استمرارية المصدر', 'سياق مترابط', 'توقيت تحريري'],
    useCases: ['trading', 'exports', 'origination', 'sourcing'],
    footnote: 'مصمم للهامش والتوقيت ونقل السعر. ليس نسخة من شكل داشبورد شائع.',
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
    deckEyebrow: '决策台',
    deckTitle: '一个更像市场编辑台的信号驾驶舱。',
    deckBody: '把官方参考、持续监控的数据源与商业上下文放进同一个阅读界面，而不是常见模板化首页。',
    deckBlocks: [
      { label: '基础', value: 'FAO + 期货', note: '价格结构与监控合约' },
      { label: '风险', value: '宏观 + 能源', note: '美元、黄金、原油与联动读取' },
      { label: '动作', value: '编辑流', note: '面向商业决策的短预警' },
    ],
    railStats: [
      { label: '覆盖', value: '6 条链路' },
      { label: '运行', value: '真实数据' },
      { label: '重点', value: '日常时机' },
    ],
    useCasesLabel: '使用场景',
    railLabel: '信号轨道',
    pulseLabel: '脉冲',
    pulseItems: ['数据连续性', '跨市场上下文', '编辑时机'],
    useCases: ['trading', 'exports', 'origination', 'sourcing'],
    footnote: '为利润、传导与时机判断而设计，不做千篇一律的 dashboard 首页。',
  },
} as const;

export function Hero() {
  const { language } = useTranslation();
  const activeLanguage = (['pt', 'en', 'es', 'ru', 'ar', 'zh'].includes(language) ? language : 'en') as keyof typeof COPY;
  const copy = COPY[activeLanguage];

  return (
    <section className="relative overflow-hidden bg-slate-950 pt-32 pb-20 lg:pt-44 lg:pb-28">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,_rgba(16,185,129,0.22),_transparent_22%),radial-gradient(circle_at_82%_14%,_rgba(14,165,233,0.18),_transparent_20%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(2,6,23,0.98))]" />
        <img src="/img/hero-bg.svg" alt="Agriculture Background" className="h-full w-full object-cover opacity-10 mix-blend-screen" />
        <div className="absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="absolute left-[8%] top-28 h-24 w-24 rounded-full bg-emerald-400/10 blur-2xl motion-safe:animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute right-[12%] top-36 h-28 w-28 rounded-full bg-cyan-400/10 blur-2xl motion-safe:animate-[pulse_12s_ease-in-out_infinite]" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-200">
              <Radar className="h-4 w-4" />
              {copy.eyebrow}
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-300">
              <Globe2 className="h-4 w-4" />
              {copy.kicker}
            </div>
          </div>

          <div className="grid gap-10 xl:grid-cols-[1.04fr_0.96fr]">
            <div className="relative">
              <div className="absolute -left-4 top-2 hidden h-28 w-px bg-gradient-to-b from-emerald-300/0 via-emerald-300/70 to-emerald-300/0 xl:block" />
              <div className="pl-0 xl:pl-8">
                <h1 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-[-0.03em] text-white md:text-6xl xl:text-[5.2rem]">
                  {copy.titleLead}
                  <br />
                  <span className="bg-gradient-to-r from-emerald-300 via-lime-200 to-cyan-300 bg-clip-text text-transparent">
                    {copy.titleAccent}
                  </span>
                  <br />
                  <span className="text-slate-200">{copy.titleTail}</span>
                </h1>

                <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                  {copy.subtitle}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {copy.chips.map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-3">
                  {copy.bullets.map((bullet, index) => (
                    <div key={bullet} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/20 hover:bg-white/[0.06]">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-200">
                        0{index + 1}
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-200">{bullet}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Link
                    href="#mercados"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/14"
                  >
                    <Workflow className="h-5 w-5" />
                    {copy.secondary}
                  </Link>
                  <Link
                    href="#alertas-mercado"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-4 text-base font-bold text-slate-950 shadow-[0_18px_60px_rgba(16,185,129,0.22)] transition-all hover:-translate-y-0.5 hover:from-emerald-400 hover:to-cyan-400"
                  >
                    <ArrowUpRight className="h-5 w-5" />
                    {copy.primary}
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[2.4rem] bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_35%)] blur-2xl" />
              <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-xl transition-transform duration-500 hover:-translate-y-1">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.12]" />
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.05] to-transparent" />
                <div className="relative grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[1.8rem] border border-white/10 bg-slate-950/55 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-200">{copy.deckEyebrow}</p>
                        <h2 className="mt-3 max-w-md text-2xl font-bold leading-tight text-white">{copy.deckTitle}</h2>
                      </div>
                      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-emerald-200">
                        <Radar className="h-5 w-5" />
                      </div>
                    </div>

                    <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300">{copy.deckBody}</p>

                    <div className="mt-6 space-y-3">
                      {copy.deckBlocks.map((block) => (
                        <div key={block.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07]">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{block.label}</p>
                              <p className="mt-2 text-lg font-semibold text-white">{block.value}</p>
                              <p className="mt-2 text-sm leading-6 text-slate-300">{block.note}</p>
                            </div>
                            <Database className="mt-1 h-4 w-4 text-slate-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.05] p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">{copy.useCasesLabel}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {copy.useCases.map((item) => (
                          <span key={item} className="rounded-full border border-white/10 bg-slate-950/50 px-3 py-2 text-xs font-medium text-slate-200 transition-colors duration-300 hover:border-emerald-300/30 hover:text-white">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.8rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">{copy.railLabel}</p>
                      <div className="mt-5 space-y-4">
                        {copy.railStats.map((stat) => (
                          <div key={stat.label} className="flex items-end justify-between gap-4 border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{stat.label}</p>
                            <p className="text-right text-2xl font-black text-white">{stat.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.8rem] border border-white/10 bg-slate-950/50 p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">{copy.pulseLabel}</p>
                      <div className="mt-4 space-y-3">
                        {copy.pulseItems.map((item, index) => (
                          <div key={item}>
                            <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
                              <span>{item}</span>
                              <span>0{index + 1}</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-lime-300 to-cyan-300 motion-safe:animate-[pulse_6s_ease-in-out_infinite]"
                                style={{ width: `${78 - index * 11}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.8rem] border border-emerald-400/15 bg-emerald-400/10 p-5 text-emerald-50">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-200" />
                        <p className="text-sm leading-7">{copy.footnote}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative mt-5 flex justify-end">
                  <Link href="#mercados" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-200 transition-colors hover:text-white">
                    {copy.overview}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center xl:hidden">
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="#alertas-mercado"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-4 text-base font-bold text-slate-950 shadow-[0_18px_60px_rgba(16,185,129,0.22)] transition-all hover:-translate-y-0.5 hover:from-emerald-400 hover:to-cyan-400"
                >
                  <ArrowUpRight className="h-5 w-5" />
                  {copy.primary}
                </Link>
                <Link
                  href="#mercados"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/14"
                >
                  <Workflow className="h-5 w-5" />
                  {copy.secondary}
                </Link>
              </div>
            </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-50 to-transparent" />
    </section>
  );
}
