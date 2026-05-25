'use client';

import Link from 'next/link';
import { ArrowRight, BadgeDollarSign, BellRing, BriefcaseBusiness, LineChart, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

const COPY = {
  pt: {
    eyebrow: 'Assine a Intelligence',
    title: 'Uma trilha premium para margem, timing e risco no agro.',
    subtitle:
      'Este MVP comercial organiza a proposta do produto para trading, exportacao, origination e hedge com leitura executiva, cobertura priorizada e contato direto com a mesa.',
    primary: 'Solicitar acesso premium',
    secondary: 'Falar com a mesa',
    audienceLabel: 'Para quem',
    audienceItems: ['trading e hedge', 'origination e sourcing', 'exportacao e repasse'],
    pillars: [
      {
        title: 'Leitura executiva diaria',
        body: 'Resumo claro dos sinais que mexem em margem, fluxo, energia, cambio e frete.',
        icon: LineChart,
      },
      {
        title: 'Alertas acionaveis',
        body: 'Entrada priorizada para alertas por ativo, regra, ruptura de faixa e stress de mercado.',
        icon: BellRing,
      },
      {
        title: 'Cobertura comercial',
        body: 'Trilha inicial para conversar sobre produto, cobertura, demonstracao e acesso premium.',
        icon: BriefcaseBusiness,
      },
    ],
    valueTitle: 'Proposta comercial',
    valueBody:
      'Menos ruido, mais decisao. O produto conecta mercado fisico, futuros, macro e logistica em uma leitura unica para operacao agro.',
  },
  en: {
    eyebrow: 'Subscribe to Intelligence',
    title: 'A premium path for agribusiness margin, timing and risk.',
    subtitle:
      'This commercial MVP packages the product for trading, exports, origination and hedging with executive reading, prioritized coverage and direct access to the desk.',
    primary: 'Request premium access',
    secondary: 'Talk to the desk',
    audienceLabel: 'Built for',
    audienceItems: ['trading and hedge', 'origination and sourcing', 'exports and pass-through'],
    pillars: [
      {
        title: 'Daily executive reading',
        body: 'A clear summary of the signals moving margins, flows, energy, FX and freight.',
        icon: LineChart,
      },
      {
        title: 'Actionable alerts',
        body: 'Priority path for alerts by asset, rule, price range breaks and market stress.',
        icon: BellRing,
      },
      {
        title: 'Commercial coverage',
        body: 'An initial path to discuss product access, coverage, demos and premium onboarding.',
        icon: BriefcaseBusiness,
      },
    ],
    valueTitle: 'Commercial proposition',
    valueBody:
      'Less noise, more decision. The product connects physical markets, futures, macro and logistics into one operating view for agribusiness.',
  },
  es: {
    eyebrow: 'Suscribirse a Intelligence',
    title: 'Una ruta premium para margen, timing y riesgo en agro.',
    subtitle:
      'Este MVP comercial organiza el producto para trading, exportacion, origination y hedge con lectura ejecutiva, cobertura priorizada y acceso directo a la mesa.',
    primary: 'Solicitar acceso premium',
    secondary: 'Hablar con la mesa',
    audienceLabel: 'Hecho para',
    audienceItems: ['trading y hedge', 'origination y sourcing', 'exportacion y traslado'],
    pillars: [
      {
        title: 'Lectura ejecutiva diaria',
        body: 'Resumen claro de las senales que mueven margen, flujo, energia, FX y flete.',
        icon: LineChart,
      },
      {
        title: 'Alertas accionables',
        body: 'Camino prioritario para alertas por activo, regla, ruptura de rango y stress de mercado.',
        icon: BellRing,
      },
      {
        title: 'Cobertura comercial',
        body: 'Ruta inicial para hablar sobre acceso al producto, cobertura, demos y onboarding premium.',
        icon: BriefcaseBusiness,
      },
    ],
    valueTitle: 'Propuesta comercial',
    valueBody:
      'Menos ruido, mas decision. El producto conecta mercado fisico, futuros, macro y logistica en una sola lectura para la operacion agro.',
  },
  ar: {
    eyebrow: 'الاشتراك في Intelligence',
    title: 'مسار متميز لهامش افضل وتوقيت ادق ومخاطر اوضح في القطاع الزراعي.',
    subtitle:
      'هذا الاصدار التجاري ينظم عرض المنتج للتداول والتصدير والتوريد والتحوط عبر قراءة تنفيذية وتغطية ذات اولوية ووصول مباشر الى المكتب.',
    primary: 'طلب وصول مميز',
    secondary: 'التحدث مع المكتب',
    audienceLabel: 'مصمم لـ',
    audienceItems: ['التداول والتحوط', 'المنشأ والتوريد', 'التصدير والتمرير السعري'],
    pillars: [
      {
        title: 'قراءة تنفيذية يومية',
        body: 'ملخص واضح للاشارات التي تحرك الهوامش والتدفقات والطاقة والعملات والشحن.',
        icon: LineChart,
      },
      {
        title: 'تنبيهات قابلة للتنفيذ',
        body: 'مسار اولوية للتنبيهات حسب الاصل والقاعدة وكسر النطاق وضغط السوق.',
        icon: BellRing,
      },
      {
        title: 'تغطية تجارية',
        body: 'مسار اولي للحديث عن الوصول الى المنتج والتغطية والعروض التوضيحية والانضمام المميز.',
        icon: BriefcaseBusiness,
      },
    ],
    valueTitle: 'القيمة التجارية',
    valueBody:
      'ضجيج اقل وقرار اكثر. المنتج يربط السوق الفعلي والعقود المستقبلية والعوامل الكلية واللوجستيات في قراءة تشغيلية واحدة للقطاع الزراعي.',
  },
  zh: {
    eyebrow: '订阅 Intelligence',
    title: '为农业业务提供更高利润率、更准时机和更清晰风险的高级路径。',
    subtitle:
      '这个商业化 MVP 将产品打包为面向交易、出口、采购与套保团队的执行方案，包含高层解读、优先覆盖和直达交易台的联系路径。',
    primary: '申请高级访问',
    secondary: '联系交易台',
    audienceLabel: '适用于',
    audienceItems: ['交易与套保', '采购与原料来源', '出口与价格传导'],
    pillars: [
      {
        title: '每日执行解读',
        body: '清晰总结影响利润、流向、能源、汇率和运费的核心信号。',
        icon: LineChart,
      },
      {
        title: '可执行预警',
        body: '按资产、规则、区间突破和市场压力提供优先级更高的预警路径。',
        icon: BellRing,
      },
      {
        title: '商业覆盖',
        body: '围绕产品接入、覆盖范围、演示和高级开通的初始沟通路径。',
        icon: BriefcaseBusiness,
      },
    ],
    valueTitle: '商业主张',
    valueBody:
      '更少噪音，更多决策。产品把现货、期货、宏观与物流整合成一套农业运营视图。',
  },
} as const;

export default function IntelligenceCTASection() {
  const { language } = useTranslation();
  const activeLanguage = (['pt', 'en', 'es', 'ar', 'zh'].includes(language) ? language : 'en') as keyof typeof COPY;
  const copy = COPY[activeLanguage];
  const demoHref = 'mailto:contato@foodpriceglobal.com?subject=FoodPrice%20Global%20Premium%20Access';

  return (
    <section id="intelligence" className="bg-slate-950 py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2.25rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 shadow-[0_30px_100px_rgba(15,23,42,0.22)] md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                <BadgeDollarSign className="h-4 w-4 text-emerald-300" />
                {copy.eyebrow}
              </div>
              <h2 className="mt-6 max-w-3xl text-3xl font-bold tracking-[-0.02em] text-white md:text-4xl">{copy.title}</h2>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{copy.subtitle}</p>

              <div className="mt-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{copy.audienceLabel}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {copy.audienceItems.map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href={demoHref}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-7 py-4 text-[15px] font-bold text-slate-950 transition-all hover:-translate-y-0.5"
                >
                  <ShieldCheck className="h-5 w-5" />
                  {copy.primary}
                </Link>
                <Link
                  href="#contato"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/8 px-7 py-4 text-[15px] font-bold text-white backdrop-blur-sm transition-all hover:bg-white/14"
                >
                  {copy.secondary}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              {copy.pillars.map((pillar) => {
                const Icon = pillar.icon;

                return (
                  <article key={pillar.title} className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-emerald-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{pillar.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-slate-300">{pillar.body}</p>
                      </div>
                    </div>
                  </article>
                );
              })}

              <div className="rounded-[1.75rem] border border-emerald-400/20 bg-emerald-400/10 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200">{copy.valueTitle}</p>
                <p className="mt-3 text-base leading-8 text-emerald-50">{copy.valueBody}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
