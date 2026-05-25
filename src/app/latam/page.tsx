'use client';

import React from 'react';
import Link from 'next/link';
import { Globe2, Ship, Coins, FileCheck, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

const COPY = {
  pt: {
    brand: 'LATAM Export',
    login: 'Login',
    register: 'Registrar',
    titleLine1: 'Conectando mercados',
    titleLine2: 'latino-americanos',
    subtitle:
      'Plataforma unificada para comercio exterior, logistica integrada e gestao aduaneira em toda a America Latina.',
    primary: 'Comecar agora',
    secondary: 'Explorar solucoes',
    sectionTitle: 'Solucoes integrais de exportacao',
    sectionSubtitle:
      'Simplificamos o comercio internacional com ferramentas desenhadas para o mercado latino-americano.',
    footer: 'Todos os direitos reservados.',
    cards: [
      ['Logistica multimodal', 'Gestao de transporte maritimo, aereo e terrestre com acompanhamento em tempo real.'],
      ['Gestao de divisas', 'Conversao e cobertura de moedas locais para transacoes internacionais mais seguras.'],
      ['Tramites aduaneiros', 'Automacao de documentacao e compliance regulatorio para 18 paises.'],
    ],
  },
  en: {
    brand: 'LATAM Export',
    login: 'Login',
    register: 'Register',
    titleLine1: 'Connecting',
    titleLine2: 'Latin American markets',
    subtitle:
      'Unified platform for foreign trade, integrated logistics and customs management across Latin America.',
    primary: 'Start now',
    secondary: 'Explore solutions',
    sectionTitle: 'Integrated export solutions',
    sectionSubtitle:
      'We simplify international trade with tools designed for the Latin American market.',
    footer: 'All rights reserved.',
    cards: [
      ['Multimodal logistics', 'Management of ocean, air and road transport with real-time tracking.'],
      ['FX management', 'Conversion and hedging of local currencies for safer international transactions.'],
      ['Customs workflows', 'Automated documentation and regulatory compliance for 18 countries.'],
    ],
  },
  es: {
    brand: 'LATAM Export',
    login: 'Login',
    register: 'Registrar',
    titleLine1: 'Conectando mercados',
    titleLine2: 'latinoamericanos',
    subtitle:
      'Plataforma unificada para comercio exterior, logistica integrada y gestion aduanera en toda America Latina.',
    primary: 'Comenzar ahora',
    secondary: 'Explorar soluciones',
    sectionTitle: 'Soluciones integrales de exportacion',
    sectionSubtitle:
      'Simplificamos el comercio internacional con herramientas disenadas para el mercado latinoamericano.',
    footer: 'Todos los derechos reservados.',
    cards: [
      ['Logistica multimodal', 'Gestion de transporte maritimo, aereo y terrestre con seguimiento en tiempo real.'],
      ['Gestion de divisas', 'Conversion y cobertura de monedas locales para transacciones internacionales seguras.'],
      ['Tramites aduaneros', 'Automatizacion de documentacion y cumplimiento normativo para 18 paises.'],
    ],
  },
  ru: {
    brand: 'LATAM Export',
    login: 'Vhod',
    register: 'Registratsiya',
    titleLine1: 'Soedinyaem rynki',
    titleLine2: 'Latinskoy Ameriki',
    subtitle:
      'Edinaya platforma dlya vneshney torgovli, integrirovannoy logistiki i tamozhennogo upravleniya vo vsey Latinskoy Amerike.',
    primary: 'Nachat seychas',
    secondary: 'Izuchit resheniya',
    sectionTitle: 'Kompleksnye eksportnye resheniya',
    sectionSubtitle:
      'My uproshchaem mezhdunarodnuyu torgovlyu s pomoshchyu instrumentov, sozdannykh dlya latinoamerikanskogo rynka.',
    footer: 'Vse prava zashchishcheny.',
    cards: [
      ['Multimodalnaya logistika', 'Upravlenie morskimi, vozdushnymi i nazemnymi perevozkami s otslezhivaniem v realnom vremeni.'],
      ['Valyutnoe upravlenie', 'Konvertatsiya i khedzhirovanie lokalnykh valyut dlya bolee bezopasnykh mezhdunarodnykh sdelok.'],
      ['Tamozhennye protsessy', 'Avtomatizatsiya dokumentov i normativnogo compliance dlya 18 stran.'],
    ],
  },
  ar: {
    brand: 'LATAM Export',
    login: 'تسجيل الدخول',
    register: 'تسجيل',
    titleLine1: 'ربط اسواق',
    titleLine2: 'امريكا اللاتينية',
    subtitle:
      'منصة موحدة للتجارة الخارجية واللوجستيات المتكاملة وادارة الجمارك في جميع انحاء امريكا اللاتينية.',
    primary: 'ابدأ الآن',
    secondary: 'استكشف الحلول',
    sectionTitle: 'حلول تصدير متكاملة',
    sectionSubtitle:
      'نبسط التجارة الدولية بادوات مصممة خصيصا لسوق امريكا اللاتينية.',
    footer: 'جميع الحقوق محفوظة.',
    cards: [
      ['لوجستيات متعددة الوسائط', 'ادارة النقل البحري والجوي والبري مع تتبع لحظي.'],
      ['ادارة العملات', 'تحويل العملات المحلية والتحوط لها من اجل معاملات دولية اكثر امانا.'],
      ['اجراءات جمركية', 'اتمتة المستندات والامتثال التنظيمي في 18 دولة.'],
    ],
  },
  zh: {
    brand: 'LATAM Export',
    login: '登录',
    register: '注册',
    titleLine1: '连接',
    titleLine2: '拉丁美洲市场',
    subtitle:
      '面向整个拉丁美洲的外贸、综合物流与海关管理统一平台。',
    primary: '立即开始',
    secondary: '探索解决方案',
    sectionTitle: '一体化出口解决方案',
    sectionSubtitle:
      '用专为拉美市场设计的工具简化国际贸易。',
    footer: '版权所有。',
    cards: [
      ['多式联运物流', '统一管理海运、空运和陆运，并提供实时追踪。'],
      ['汇率管理', '本地货币转换与套保，提升国际交易安全性。'],
      ['海关流程', '为18个国家提供文档自动化与合规支持。'],
    ],
  },
} as const;

export default function LatamWelcomePage() {
  const currentYear = new Date().getFullYear();
  const { language } = useTranslation();
  const copy = COPY[language];

  return (
    <div className="min-h-screen bg-blue-50 font-sans">
      {/* Navbar */}
      <nav className="bg-blue-900 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Globe2 className="text-orange-400" />
            {copy.brand}
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher className="bg-blue-950/60" />
            <Link href="/latam/login" className="px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
              {copy.login}
            </Link>
            <Link href="/latam/login" className="px-4 py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors">
              {copy.register}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {copy.titleLine1} <br/>
            <span className="text-orange-400">{copy.titleLine2}</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            {copy.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/latam/login" className="px-8 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transform hover:-translate-y-1 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2">
              {copy.primary}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#features" className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all">
              {copy.secondary}
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">{copy.sectionTitle}</h2>
            <p className="text-blue-700 max-w-2xl mx-auto">
              {copy.sectionSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Ship className="w-8 h-8 text-blue-600" />}
              title={copy.cards[0][0]}
              description={copy.cards[0][1]}
            />
            <FeatureCard 
              icon={<Coins className="w-8 h-8 text-blue-600" />}
              title={copy.cards[1][0]}
              description={copy.cards[1][1]}
            />
            <FeatureCard 
              icon={<FileCheck className="w-8 h-8 text-blue-600" />}
              title={copy.cards[2][0]}
              description={copy.cards[2][1]}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-blue-400 py-8 px-4 text-center text-sm">
        <div className="container mx-auto">
          <p>&copy; {currentYear} {copy.brand}. {copy.footer}</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow group hover:-translate-y-2 duration-300">
      <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-blue-900 mb-3">{title}</h3>
      <p className="text-blue-700 leading-relaxed">{description}</p>
    </div>
  );
}
