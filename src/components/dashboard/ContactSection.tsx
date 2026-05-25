'use client';

import Link from 'next/link';
import { ArrowUpRight, Mail, MessageSquareQuote, Radar, ShieldCheck, Sparkles } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

const COPY = {
  pt: {
    eyebrow: 'Fale com a mesa',
    title: 'Converse com o time por um canal real, sem formulário de fachada.',
    subtitle:
      'Se a ideia for discutir cobertura, sourcing, exportacao, estrutura de margem ou acesso ao produto, o caminho mais direto hoje e por email.',
    primary: 'Abrir contato por email',
    secondary: 'Solicitar demonstracao',
    emailLabel: 'Canal principal',
    emailValue: 'contato@foodpriceglobal.com',
    responseLabel: 'Fluxo esperado',
    responseValue: 'Triagem comercial e retorno humano',
    coverageLabel: 'Temas de conversa',
    coverageItems: ['trading e hedge', 'origination e sourcing', 'exportacao e repasse', 'inteligencia de mercado'],
    noteTitle: 'Contato mais honesto',
    noteBody: 'Saem telefone placeholder e redes vazias. Entra um CTA direto, consistente com a operacao atual do produto.',
  },
  en: {
    eyebrow: 'Talk to the desk',
    title: 'Reach the team through a real channel, not a fake contact form.',
    subtitle:
      'If you want to discuss hedging, sourcing, exports, margin structure or product access, email is the most direct path right now.',
    primary: 'Open email contact',
    secondary: 'Request a demo',
    emailLabel: 'Primary channel',
    emailValue: 'contato@foodpriceglobal.com',
    responseLabel: 'Expected flow',
    responseValue: 'Commercial triage and human response',
    coverageLabel: 'Conversation themes',
    coverageItems: ['trading and hedge', 'origination and sourcing', 'exports and pass-through', 'market intelligence'],
    noteTitle: 'More honest contact',
    noteBody: 'Placeholder phone numbers and empty socials are gone. A direct CTA now matches the actual product operation.',
  },
  es: {
    eyebrow: 'Hable con la mesa',
    title: 'Converse con el equipo por un canal real, no por un formulario de fachada.',
    subtitle:
      'Si la idea es hablar de cobertura, sourcing, exportacion, estructura de margen o acceso al producto, el camino mas directo hoy es el email.',
    primary: 'Abrir contacto por email',
    secondary: 'Solicitar demo',
    emailLabel: 'Canal principal',
    emailValue: 'contato@foodpriceglobal.com',
    responseLabel: 'Flujo esperado',
    responseValue: 'Triagem comercial y respuesta humana',
    coverageLabel: 'Temas de conversacion',
    coverageItems: ['trading y hedge', 'origination y sourcing', 'exportacion y traslado', 'inteligencia de mercado'],
    noteTitle: 'Contacto mas honesto',
    noteBody: 'Salen el telefono placeholder y las redes vacias. Entra un CTA directo coherente con la operacion actual del producto.',
  },
  ar: {
    eyebrow: 'تحدث مع المكتب',
    title: 'تواصل مع الفريق عبر قناة حقيقية، لا عبر نموذج شكلي.',
    subtitle:
      'اذا كان الهدف مناقشة التحوط او التوريد او التصدير او هيكل الهامش او الوصول الى المنتج، فالبريد الالكتروني هو الطريق المباشر حاليا.',
    primary: 'فتح تواصل عبر البريد',
    secondary: 'طلب عرض توضيحي',
    emailLabel: 'القناة الرئيسية',
    emailValue: 'contato@foodpriceglobal.com',
    responseLabel: 'المسار المتوقع',
    responseValue: 'فرز تجاري ورد بشري',
    coverageLabel: 'محاور النقاش',
    coverageItems: ['التداول والتحوط', 'المنشأ والتوريد', 'التصدير والتمرير السعري', 'ذكاء السوق'],
    noteTitle: 'تواصل اكثر وضوحا',
    noteBody: 'تم حذف الهاتف الوهمي والشبكات الفارغة. والآن يوجد CTA مباشر متسق مع طريقة عمل المنتج فعليا.',
  },
  zh: {
    eyebrow: '联系交易台',
    title: '通过真实渠道与团队沟通，而不是使用摆设式表单。',
    subtitle:
      '如果你想讨论套保、采购、出口、利润结构或产品接入，当前最直接的路径就是电子邮件。',
    primary: '发送邮件联系',
    secondary: '申请演示',
    emailLabel: '主要渠道',
    emailValue: 'contato@foodpriceglobal.com',
    responseLabel: '预期流程',
    responseValue: '商业筛选与人工回复',
    coverageLabel: '沟通主题',
    coverageItems: ['交易与套保', '采购与原料来源', '出口与价格传导', '市场情报'],
    noteTitle: '更真实的联系路径',
    noteBody: '移除了占位电话和空白社媒，改为与当前产品运营状态一致的直接 CTA。',
  },
} as const;

export default function ContactSection() {
  const { language } = useTranslation();
  const activeLanguage = (['pt', 'en', 'es', 'ar', 'zh'].includes(language) ? language : 'en') as keyof typeof COPY;
  const copy = COPY[activeLanguage];
  const emailHref = `mailto:${copy.emailValue}`;
  const demoHref = `mailto:${copy.emailValue}?subject=${encodeURIComponent('FoodPrice Global Demo Request')}`;

  return (
    <section id="contato" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)] md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              <MessageSquareQuote className="h-4 w-4" />
              {copy.eyebrow}
            </div>
            <h2 className="mt-6 max-w-2xl text-3xl font-bold leading-tight tracking-[-0.02em] md:text-4xl">{copy.title}</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300/95">{copy.subtitle}</p>

            <div className="mt-9 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 md:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{copy.emailLabel}</p>
                <p className="mt-3 text-lg font-semibold text-white">{copy.emailValue}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 md:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{copy.responseLabel}</p>
                <p className="mt-3 text-lg font-semibold text-white">{copy.responseValue}</p>
              </div>
            </div>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href={emailHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-7 py-4 text-[15px] font-bold text-slate-950 transition-all hover:-translate-y-0.5 hover:from-emerald-400 hover:to-cyan-400"
              >
                <Mail className="h-5 w-5" />
                {copy.primary}
              </Link>
              <Link
                href={demoHref}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/8 px-7 py-4 text-[15px] font-bold text-white backdrop-blur-sm transition-all hover:bg-white/14"
              >
                <ArrowUpRight className="h-5 w-5" />
                {copy.secondary}
              </Link>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 md:p-9">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                  <Radar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{copy.coverageLabel}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {copy.coverageItems.map((item) => (
                      <span key={item} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 md:p-9 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-sky-600">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.01em] text-slate-900">{copy.noteTitle}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{copy.noteBody}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 to-slate-900 p-8 md:p-9 text-white">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-emerald-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{copy.responseLabel}</p>
                  <p className="mt-3 text-lg font-semibold text-white">{copy.responseValue}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300/95">{copy.subtitle}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
