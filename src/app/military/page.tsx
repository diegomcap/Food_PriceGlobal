'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Target, Lock, Database, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

const COPY = {
  pt: {
    brand: 'MFD DEFENSE',
    login: 'Login seguro',
    badge: 'SISTEMA CLASSIFICADO // NIVEL 3',
    titleLine1: 'SISTEMAS MILITARES AVANCADOS',
    titleLine2: 'DE ALIMENTACAO',
    subtitle:
      'Gestao estrategica da cadeia de suprimentos para operacoes de defesa, com nutricao de alta performance, vida util estendida e logistica segura.',
    primary: 'Iniciar acesso',
    secondary: 'Ver capacidades',
    footer: 'Todos os direitos reservados. Acesso nao autorizado e estritamente proibido.',
    cards: [
      ['Logistica de precisao', 'Rastreamento em tempo real de suprimentos para zonas de combate e postos remotos.'],
      ['Reservas estrategicas', 'Gestao automatizada de inventario para seguranca alimentar de longo prazo e resposta a desastres.'],
      ['Protocolos seguros', 'Protecao ponta a ponta dos dados da cadeia de suprimentos com controles de acesso reforcados.'],
    ],
  },
  en: {
    brand: 'MFD DEFENSE',
    login: 'Secure login',
    badge: 'CLASSIFIED SYSTEM // LEVEL 3',
    titleLine1: 'ADVANCED MILITARY',
    titleLine2: 'FOOD SYSTEMS',
    subtitle:
      'Strategic supply-chain management for defense operations, with high-performance nutrition, extended shelf-life solutions and secure logistics.',
    primary: 'Initialize access',
    secondary: 'View capabilities',
    footer: 'All rights reserved. Unauthorized access is strictly prohibited.',
    cards: [
      ['Precision logistics', 'Real-time supply tracking for active combat zones and remote outposts.'],
      ['Strategic reserves', 'Automated inventory management for long-term food security and disaster response.'],
      ['Secure protocols', 'End-to-end protection of supply-chain data with hardened access controls.'],
    ],
  },
  es: {
    brand: 'MFD DEFENSE',
    login: 'Login seguro',
    badge: 'SISTEMA CLASIFICADO // NIVEL 3',
    titleLine1: 'SISTEMAS MILITARES AVANZADOS',
    titleLine2: 'DE ALIMENTACION',
    subtitle:
      'Gestion estrategica de la cadena de suministro para operaciones de defensa, con nutricion de alto desempeno, vida util extendida y logistica segura.',
    primary: 'Iniciar acceso',
    secondary: 'Ver capacidades',
    footer: 'Todos los derechos reservados. El acceso no autorizado esta estrictamente prohibido.',
    cards: [
      ['Logistica de precision', 'Seguimiento en tiempo real de suministros para zonas de combate y puestos remotos.'],
      ['Reservas estrategicas', 'Gestion automatizada de inventario para seguridad alimentaria de largo plazo y respuesta a desastres.'],
      ['Protocolos seguros', 'Proteccion de extremo a extremo de los datos de la cadena de suministro con controles de acceso reforzados.'],
    ],
  },
  ru: {
    brand: 'MFD DEFENSE',
    login: 'Zashchishchennyy vhod',
    badge: 'SEKRETNAYA SISTEMA // UROVEN 3',
    titleLine1: 'PRODVINUTYE VOENNYE SISTEMY',
    titleLine2: 'PITANIYA',
    subtitle:
      'Strategicheskoe upravlenie tsepochkoy postavok dlya oboronnykh operatsiy s vysokoproizvoditelnym pitaniem, dlitelnym srokom khraneniya i bezopasnoy logistikoy.',
    primary: 'Nachat dostup',
    secondary: 'Smotret vozmozhnosti',
    footer: 'Vse prava zashchishcheny. Nesanktsionirovannyy dostup strogo zapreshchen.',
    cards: [
      ['Tochnaya logistika', 'Otslezhivanie postavok v realnom vremeni dlya zon boevykh deystviy i udalennykh baz.'],
      ['Strategicheskie rezervy', 'Avtomatizirovannoe upravlenie zapasami dlya dolgostrochnoy prodovolstvennoy bezopasnosti i reagirovaniya na krizisy.'],
      ['Bezopasnye protokoly', 'Skvoznaya zashchita dannykh tsepochki postavok s usilennym kontrolem dostupa.'],
    ],
  },
  ar: {
    brand: 'MFD DEFENSE',
    login: 'دخول آمن',
    badge: 'نظام سري // المستوى 3',
    titleLine1: 'انظمة عسكرية متقدمة',
    titleLine2: 'للغذاء',
    subtitle:
      'ادارة استراتيجية لسلسلة الامداد لعمليات الدفاع مع تغذية عالية الاداء وحلول عمر تخزين ممتد ولوجستيات آمنة.',
    primary: 'بدء الوصول',
    secondary: 'عرض القدرات',
    footer: 'جميع الحقوق محفوظة. يمنع الوصول غير المصرح به بشكل صارم.',
    cards: [
      ['لوجستيات دقيقة', 'تتبع الامدادات في الوقت الفعلي لمناطق القتال والمواقع البعيدة.'],
      ['احتياطيات استراتيجية', 'ادارة مخزون آلية للامن الغذائي طويل الاجل والاستجابة للكوارث.'],
      ['بروتوكولات آمنة', 'حماية شاملة لبيانات سلسلة الامداد مع ضوابط وصول معززة.'],
    ],
  },
  zh: {
    brand: 'MFD DEFENSE',
    login: '安全登录',
    badge: '机密系统 // 3级',
    titleLine1: '先进军用',
    titleLine2: '食品系统',
    subtitle:
      '面向国防行动的战略供应链管理，涵盖高性能营养、长保质期方案与安全物流。',
    primary: '开始访问',
    secondary: '查看能力',
    footer: '版权所有。严禁未经授权访问。',
    cards: [
      ['精准物流', '为作战区域和偏远基地提供实时补给追踪。'],
      ['战略储备', '为长期粮食安全和灾害响应提供自动化库存管理。'],
      ['安全协议', '通过强化访问控制实现供应链数据端到端保护。'],
    ],
  },
} as const;

export default function MilitaryPage() {
  const currentYear = new Date().getFullYear();
  const { language } = useTranslation();
  const copy = COPY[language];

  return (
    <div className="min-h-screen bg-zinc-950 font-mono text-gray-300">
      {/* Navbar */}
      <nav className="border-b border-red-900/30 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 text-red-500 font-bold tracking-widest">
            <Shield className="w-6 h-6" />
            {copy.brand}
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher className="bg-zinc-900" />
            <Link href="/military/login" className="px-6 py-2 border border-red-900/50 text-red-500 hover:bg-red-900/20 transition-all text-xs tracking-widest uppercase">
              {copy.login}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative py-32 px-6 overflow-hidden border-b border-red-900/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_70%)]"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1 border border-red-500/30 bg-red-950/30 text-red-400 text-xs tracking-[0.3em] mb-6 animate-pulse">
            {copy.badge}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tighter">
            {copy.titleLine1} <br/>
            <span className="text-red-600 text-shadow-red">{copy.titleLine2}</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed tracking-wide">
            {copy.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/military/login" className="group px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-bold tracking-widest text-sm uppercase transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-3">
              {copy.primary}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#capabilities" className="px-8 py-4 border border-gray-700 hover:border-gray-500 text-gray-300 font-bold tracking-widest text-sm uppercase transition-all">
              {copy.secondary}
            </Link>
          </div>
        </div>
      </header>

      {/* Capabilities Grid */}
      <section id="capabilities" className="py-24 px-6 bg-zinc-900/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <CapabilityCard 
              icon={<Target className="w-8 h-8 text-red-500" />}
              title={copy.cards[0][0]}
              description={copy.cards[0][1]}
            />
            <CapabilityCard 
              icon={<Database className="w-8 h-8 text-red-500" />}
              title={copy.cards[1][0]}
              description={copy.cards[1][1]}
            />
            <CapabilityCard 
              icon={<Lock className="w-8 h-8 text-red-500" />}
              title={copy.cards[2][0]}
              description={copy.cards[2][1]}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-red-900/30 py-12 px-6 bg-black text-center">
        <div className="container mx-auto">
          <p className="text-gray-600 text-xs tracking-widest uppercase">
            &copy; {currentYear} Military Food Development.
            <br/>{copy.footer}
          </p>
        </div>
      </footer>
    </div>
  );
}

function CapabilityCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-black/40 border border-white/5 p-8 hover:border-red-500/50 transition-colors group">
      <div className="mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-4 tracking-wide group-hover:text-red-400 transition-colors">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">{description}</p>
    </div>
  );
}
