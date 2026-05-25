'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/context/TranslationContext';
import { Activity, Layers3, MapPin, Play, ShieldCheck } from 'lucide-react';

const MONITORING_FEEDS = [
  { 
    id: 1,
    src: '/videos/farm-harvest.mp4', 
    labelKey: 'feed_harvest_label', 
    locationKey: 'feed_harvest_location',
    typeKey: 'feed_harvest_type'
  },
  { 
    id: 2,
    src: '/videos/port-logistics.mp4', 
    labelKey: 'feed_port_label', 
    locationKey: 'feed_port_location',
    typeKey: 'feed_port_type'
  },
  { 
    id: 3,
    src: '/videos/irrigation-system.mp4', 
    labelKey: 'feed_irrigation_label', 
    locationKey: 'feed_irrigation_location',
    typeKey: 'feed_irrigation_type'
  },
  { 
    id: 4,
    src: '/videos/truck-logistics.mp4', 
    labelKey: 'feed_truck_label', 
    locationKey: 'feed_truck_location',
    typeKey: 'feed_truck_type'
  },
  { 
    id: 5,
    src: '/videos/grain-silos.mp4', 
    labelKey: 'feed_silos_label', 
    locationKey: 'feed_silos_location',
    typeKey: 'feed_silos_type'
  },
  { 
    id: 6,
    src: '/videos/food-lab.mp4', 
    labelKey: 'feed_lab_label', 
    locationKey: 'feed_lab_location',
    typeKey: 'feed_lab_type'
  },
  /* Global Feeds (Novos vídeos únicos) - Aguardando download manual
  { 
    id: 7,
    src: '/videos/global-harvest.mp4', 
    labelKey: 'feed_harvest_label', 
    locationKey: 'feed_harvest_location_global',
    typeKey: 'feed_harvest_type'
  },
  { 
    id: 8,
    src: '/videos/global-port.mp4', 
    labelKey: 'feed_port_label', 
    locationKey: 'feed_port_location_global',
    typeKey: 'feed_port_type'
  },
  { 
    id: 9,
    src: '/videos/global-irrigation.mp4', 
    labelKey: 'feed_irrigation_label', 
    locationKey: 'feed_irrigation_location_global',
    typeKey: 'feed_irrigation_type'
  },
  { 
    id: 10,
    src: '/videos/global-truck.mp4', 
    labelKey: 'feed_truck_label', 
    locationKey: 'feed_truck_location_global',
    typeKey: 'feed_truck_type'
  },
  { 
    id: 11,
    src: '/videos/global-silos.mp4', 
    labelKey: 'feed_silos_label', 
    locationKey: 'feed_silos_location_global',
    typeKey: 'feed_silos_type'
  },
  { 
    id: 12,
    src: '/videos/global-lab.mp4', 
    labelKey: 'feed_lab_label', 
    locationKey: 'feed_lab_location_global',
    typeKey: 'feed_lab_type'
  }
  */
];

const COPY = {
  pt: {
    eyebrow: 'Como a mesa opera',
    title: 'Contexto real, leitura operacional e continuidade de feed.',
    intro:
      'O produto foi redesenhado para funcionar como camada de decisao. Menos storytelling institucional genérico e mais sinais utilizaveis no dia a dia comercial.',
    pillars: [
      {
        title: 'Camadas reais de dados',
        detail: 'FAO, mercado monitorado, macro drivers e leitura editorial convivem no mesmo enquadramento.',
      },
      {
        title: 'Continuidade operacional',
        detail: 'A leitura permanece viva com fallback controlado, snapshot persistido e observabilidade de fonte.',
      },
      {
        title: 'Uso comercial diario',
        detail: 'Pensado para margem, repasse, timing e comparacao entre contratos e referencias oficiais.',
      },
    ],
    mediaEyebrow: 'Operations canvas',
    mediaTitle: 'Ambiente visual da cadeia monitorada',
    mediaNote: 'As cenas abaixo funcionam como contexto visual do desk, nao como falso live feed.',
    visualLabel: 'Visual',
    feedContextLabel: 'Contexto de feed',
  },
  en: {
    eyebrow: 'How the desk works',
    title: 'Real context, operating read and feed continuity.',
    intro:
      'The product is designed to work as a decision layer. Less generic institutional storytelling and more signals that operators can use every day.',
    pillars: [
      {
        title: 'Real data layers',
        detail: 'FAO, monitored markets, macro drivers and editorial reading coexist inside the same frame.',
      },
      {
        title: 'Operating continuity',
        detail: 'The read stays alive with controlled fallback, persisted snapshots and source observability.',
      },
      {
        title: 'Daily commercial use',
        detail: 'Built for margin, pass-through, timing and comparison across contracts and official references.',
      },
    ],
    mediaEyebrow: 'Operations canvas',
    mediaTitle: 'Visual context from the monitored chain',
    mediaNote: 'The scenes below act as visual context for the desk, not as fake live feed.',
    visualLabel: 'Visual',
    feedContextLabel: 'Feed context',
  },
  es: {
    eyebrow: 'Como opera la mesa',
    title: 'Contexto real, lectura operativa y continuidad del feed.',
    intro:
      'El producto fue redisenado para funcionar como capa de decision. Menos storytelling institucional generico y mas senales utilizables en el dia comercial.',
    pillars: [
      {
        title: 'Capas reales de datos',
        detail: 'FAO, mercado monitoreado, drivers macro y lectura editorial conviven en un mismo cuadro.',
      },
      {
        title: 'Continuidad operativa',
        detail: 'La lectura se mantiene viva con fallback controlado, snapshot persistido y observabilidad de fuente.',
      },
      {
        title: 'Uso comercial diario',
        detail: 'Pensado para margen, traslado de precios, timing y comparacion entre contratos y referencias oficiales.',
      },
    ],
    mediaEyebrow: 'Operations canvas',
    mediaTitle: 'Contexto visual de la cadena monitoreada',
    mediaNote: 'Las escenas de abajo funcionan como contexto visual de la mesa, no como falso live feed.',
    visualLabel: 'Visual',
    feedContextLabel: 'Contexto del feed',
  },
  ar: {
    eyebrow: 'كيف يعمل المكتب',
    title: 'سياق حقيقي وقراءة تشغيلية واستمرارية للتغذية.',
    intro:
      'تمت اعادة تصميم المنتج ليعمل كطبقة قرار. ضوضاء مؤسسية اقل واشارات اكثر قابلية للاستخدام في اليوم التجاري.',
    pillars: [
      {
        title: 'طبقات بيانات حقيقية',
        detail: 'يتعايش FAO والسوق المراقب والعوامل الكلية والقراءة التحريرية داخل اطار واحد.',
      },
      {
        title: 'استمرارية تشغيلية',
        detail: 'تبقى القراءة حية عبر fallback مضبوط ولقطات محفوظة ومراقبة للمصادر.',
      },
      {
        title: 'استخدام تجاري يومي',
        detail: 'مصمم للهامش والتمرير السعري والتوقيت والمقارنة بين العقود والمراجع الرسمية.',
      },
    ],
    mediaEyebrow: 'لوحة تشغيلية',
    mediaTitle: 'سياق بصري للسلسلة التي تتم مراقبتها',
    mediaNote: 'المشاهد ادناه تمثل سياقا بصريا للمكتب وليست بثا حيا مزيفا.',
    visualLabel: 'مرئي',
    feedContextLabel: 'سياق التغذية',
  },
  zh: {
    eyebrow: '交易台如何运作',
    title: '真实背景、运营解读与数据流连续性。',
    intro:
      '产品被重新设计为一层决策系统。减少泛泛的机构叙事，增加日常商业场景中可直接使用的信号。',
    pillars: [
      {
        title: '真实数据层',
        detail: 'FAO、监控市场、宏观驱动和编辑解读被放在同一个框架中。',
      },
      {
        title: '运营连续性',
        detail: '通过受控 fallback、持久化快照和来源可观测性，让解读持续在线。',
      },
      {
        title: '日常商业用途',
        detail: '围绕利润、价格传导、时机以及合约和官方参考之间的比较而设计。',
      },
    ],
    mediaEyebrow: '运营画布',
    mediaTitle: '监控链条的可视化背景',
    mediaNote: '下方画面用于提供交易台的视觉背景，而不是伪装的实时视频流。',
    visualLabel: '可视化',
    feedContextLabel: '数据流背景',
  },
} as const;

export default function AboutSection() {
  const { t, language } = useTranslation();
  const [currentFeedIndex, setCurrentFeedIndex] = useState(0);
  const activeLanguage = (['pt', 'en', 'es', 'ar', 'zh'].includes(language) ? language : 'en') as keyof typeof COPY;
  const copy = COPY[activeLanguage];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeedIndex((prev) => (prev + 1) % MONITORING_FEEDS.length);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const currentFeed = MONITORING_FEEDS[currentFeedIndex];

  return (
    <section id="sobre" className="relative overflow-hidden bg-slate-900 py-24 text-white">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.10),_transparent_24%)]" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              <Layers3 className="h-4 w-4" />
              {copy.eyebrow}
            </div>
            <h2 className="mb-6 max-w-2xl text-3xl font-bold tracking-[-0.02em] md:text-4xl">{copy.title}</h2>
            <p className="max-w-2xl text-lg leading-8 text-slate-300/95">{copy.intro}</p>

            <div className="mt-9 space-y-4">
              {copy.pillars.map((pillar, index) => (
                <article
                  key={pillar.title}
                  className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-sm font-bold text-emerald-200">
                      0{index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold tracking-[-0.01em] text-white">{pillar.title}</h3>
                      <p className="mt-2.5 text-sm leading-7 text-slate-300/95">{pillar.detail}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-500 to-green-500 blur-3xl opacity-20 transition-opacity duration-1000 group-hover:opacity-40 motion-safe:animate-[pulse_10s_ease-in-out_infinite]" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/65 shadow-2xl backdrop-blur-sm">
              <div className="border-b border-white/10 p-5 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200">{copy.mediaEyebrow}</p>
                    <h3 className="mt-2 text-[1.65rem] font-semibold tracking-[-0.01em] text-white">{copy.mediaTitle}</h3>
                    <p className="mt-2.5 max-w-xl text-sm leading-7 text-slate-300/95">{copy.mediaNote}</p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300">
                    <Play className="h-3.5 w-3.5 text-emerald-300" />
                    {copy.visualLabel}
                  </div>
                </div>
              </div>

              <div className="relative aspect-video">
                <video
                key={currentFeed.src}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                poster="/img/about-image.svg"
              >
                <source src={currentFeed.src} type="video/mp4" />
                Seu navegador não suporta a tag de vídeo.
              </video>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/30" />

                <div className="absolute left-4 right-4 top-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
                    {copy.feedContextLabel}
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-semibold text-slate-300 backdrop-blur-md">
                    <Activity className="h-3.5 w-3.5 text-sky-300" />
                    {t(currentFeed.typeKey)}
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                  <div className="space-y-2 rounded-2xl border border-white/10 bg-black/35 px-4 py-3.5 backdrop-blur-md">
                    <div className="flex items-center gap-2 text-sm font-medium text-white">
                      <Activity className="h-4 w-4 text-emerald-300" />
                      {t(currentFeed.labelKey)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <MapPin className="h-3 w-3" />
                      {t(currentFeed.locationKey)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {MONITORING_FEEDS.map((feed, idx) => (
                      <button
                        key={feed.id}
                        onClick={() => setCurrentFeedIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === currentFeedIndex ? 'w-8 bg-emerald-400' : 'w-2 bg-slate-600 hover:bg-slate-500'
                        }`}
                        aria-label={`Select feed ${feed.id}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
