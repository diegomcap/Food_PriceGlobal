'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, BarChart3, Globe2, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

const COPY = {
  pt: {
    brand: 'Brasil Food Transport',
    login: 'Login',
    register: 'Cadastrar',
    titleLine1: 'O futuro da logistica',
    titleLine2: 'agroalimentar brasileira',
    subtitle:
      'Conectamos produtores, transportadores e exportadores em uma unica plataforma integrada com compliance total ANVISA e MAPA.',
    primary: 'Acessar plataforma',
    secondary: 'Saiba mais',
    featuresTitle: 'Por que escolher o Brasil Food Transport?',
    featuresSubtitle:
      'Nossa plataforma oferece ferramentas exclusivas para otimizar sua operacao logistica e garantir a qualidade dos alimentos.',
    ctaTitle: 'Pronto para revolucionar sua logistica?',
    ctaSubtitle:
      'Junte-se a milhares de empresas que ja usam o Brasil Food Transport para gerenciar suas operacoes.',
    ctaAction: 'Comecar agora',
    footer: 'Todos os direitos reservados.',
    links: ['Termos de Uso', 'Privacidade', 'Suporte'],
    cards: [
      ['Gestao de frota', 'Monitoramento em tempo real de veiculos e cargas com integracao direta aos sistemas de rastreamento.'],
      ['Certificacao digital', 'Emissao e validacao automatica de certificados sanitarios e documentos fiscais.'],
      ['Analytics avancado', 'Paineis de controle com indicadores de performance, custos e eficiencia logistica.'],
      ['Conexao global', 'Integracao nativa com os portais LATAM Export e MFD para expansao internacional.'],
    ],
  },
  en: {
    brand: 'Brazil Food Transport',
    login: 'Login',
    register: 'Sign up',
    titleLine1: 'The future of',
    titleLine2: 'Brazilian food logistics',
    subtitle:
      'We connect producers, carriers and exporters on one integrated platform with full ANVISA and MAPA compliance.',
    primary: 'Access platform',
    secondary: 'Learn more',
    featuresTitle: 'Why choose Brazil Food Transport?',
    featuresSubtitle:
      'Our platform offers exclusive tools to optimize logistics operations and protect food quality.',
    ctaTitle: 'Ready to transform your logistics?',
    ctaSubtitle:
      'Join thousands of companies already using Brazil Food Transport to manage operations.',
    ctaAction: 'Start now',
    footer: 'All rights reserved.',
    links: ['Terms of Use', 'Privacy', 'Support'],
    cards: [
      ['Fleet management', 'Real-time monitoring of vehicles and cargo with direct integration into tracking systems.'],
      ['Digital certification', 'Automatic issuance and validation of sanitary certificates and fiscal documents.'],
      ['Advanced analytics', 'Control panels with performance, cost and logistics efficiency indicators.'],
      ['Global connection', 'Native integration with LATAM Export and MFD portals for international expansion.'],
    ],
  },
  es: {
    brand: 'Brasil Food Transport',
    login: 'Login',
    register: 'Registrar',
    titleLine1: 'El futuro de la logistica',
    titleLine2: 'agroalimentaria brasilena',
    subtitle:
      'Conectamos productores, transportistas y exportadores en una sola plataforma integrada con compliance total de ANVISA y MAPA.',
    primary: 'Acceder a la plataforma',
    secondary: 'Saber mas',
    featuresTitle: 'Por que elegir Brasil Food Transport?',
    featuresSubtitle:
      'Nuestra plataforma ofrece herramientas exclusivas para optimizar la operacion logistica y proteger la calidad de los alimentos.',
    ctaTitle: 'Listo para revolucionar su logistica?',
    ctaSubtitle:
      'Unase a miles de empresas que ya usan Brasil Food Transport para gestionar sus operaciones.',
    ctaAction: 'Comenzar ahora',
    footer: 'Todos los derechos reservados.',
    links: ['Terminos de Uso', 'Privacidad', 'Soporte'],
    cards: [
      ['Gestion de flota', 'Monitoreo en tiempo real de vehiculos y cargas con integracion directa a los sistemas de rastreo.'],
      ['Certificacion digital', 'Emision y validacion automatica de certificados sanitarios y documentos fiscales.'],
      ['Analytics avanzado', 'Paneles con indicadores de desempeno, costos y eficiencia logistica.'],
      ['Conexion global', 'Integracion nativa con LATAM Export y MFD para expansion internacional.'],
    ],
  },
  ru: {
    brand: 'Brazil Food Transport',
    login: 'Vhod',
    register: 'Registratsiya',
    titleLine1: 'Budushchee logistiki',
    titleLine2: 'brazilskogo agroprodovolstviya',
    subtitle:
      'My soedinyaem proizvoditeley, perevozchikov i eksporterov na edinoj integrirovannoj platforme s polnym compliance ANVISA i MAPA.',
    primary: 'Voyti v platformu',
    secondary: 'Uznat bolshe',
    featuresTitle: 'Pochemu vybrat Brazil Food Transport?',
    featuresSubtitle:
      'Nasha platforma predlagaet eksklyuzivnye instrumenty dlya optimizatsii logistiki i zashchity kachestva produktov.',
    ctaTitle: 'Gotovy transformirovat logistiku?',
    ctaSubtitle:
      'Prisoedinyaytes k kompaniyam, kotorye uzhe ispolzuyut Brazil Food Transport dlya upravleniya operatsiyami.',
    ctaAction: 'Nachat seychas',
    footer: 'Vse prava zashchishcheny.',
    links: ['Usloviya ispolzovaniya', 'Konfidentsialnost', 'Podderzhka'],
    cards: [
      ['Upravlenie flotom', 'Monitoring transporta i gruzov v realnom vremeni s pryamoy integratsiey v sistemy trekinga.'],
      ['Tsifrovaya sertifikatsiya', 'Avtomaticheskiy vypusk i proverka sanitarnykh sertifikatov i fiskalnykh dokumentov.'],
      ['Prodvinutaya analitika', 'Paneli s pokazatelyami effektivnosti, zatrat i logisticheskoy proizvoditelnosti.'],
      ['Globalnaya svyaz', 'Nativnaya integratsiya s portalami LATAM Export i MFD dlya mezhdunarodnogo rosta.'],
    ],
  },
  ar: {
    brand: 'Brasil Food Transport',
    login: 'تسجيل الدخول',
    register: 'تسجيل',
    titleLine1: 'مستقبل الخدمات اللوجستية',
    titleLine2: 'الغذائية الزراعية في البرازيل',
    subtitle:
      'نربط المنتجين والناقلين والمصدرين في منصة موحدة ومتكاملة مع امتثال كامل لمتطلبات ANVISA و MAPA.',
    primary: 'الدخول الى المنصة',
    secondary: 'اعرف المزيد',
    featuresTitle: 'لماذا تختار Brasil Food Transport؟',
    featuresSubtitle:
      'توفر منصتنا ادوات حصرية لتحسين العمليات اللوجستية وضمان جودة الاغذية.',
    ctaTitle: 'هل انت مستعد لتطوير لوجستياتك؟',
    ctaSubtitle:
      'انضم الى الشركات التي تستخدم Brasil Food Transport لادارة عملياتها.',
    ctaAction: 'ابدأ الآن',
    footer: 'جميع الحقوق محفوظة.',
    links: ['شروط الاستخدام', 'الخصوصية', 'الدعم'],
    cards: [
      ['ادارة الاسطول', 'مراقبة المركبات والشحنات في الوقت الفعلي مع تكامل مباشر مع انظمة التتبع.'],
      ['شهادات رقمية', 'اصدار واعتماد تلقائي للشهادات الصحية والمستندات الضريبية.'],
      ['تحليلات متقدمة', 'لوحات تحكم بمؤشرات الاداء والتكاليف والكفاءة اللوجستية.'],
      ['اتصال عالمي', 'تكامل مباشر مع بوابتي LATAM Export و MFD للتوسع الدولي.'],
    ],
  },
  zh: {
    brand: 'Brasil Food Transport',
    login: '登录',
    register: '注册',
    titleLine1: '巴西农食物流的',
    titleLine2: '未来平台',
    subtitle:
      '将生产者、承运商和出口商连接到同一体化平台，并满足 ANVISA 与 MAPA 的合规要求。',
    primary: '进入平台',
    secondary: '了解更多',
    featuresTitle: '为什么选择 Brasil Food Transport？',
    featuresSubtitle:
      '平台提供专属工具，用于优化物流运营并保障食品质量。',
    ctaTitle: '准备升级您的物流体系了吗？',
    ctaSubtitle:
      '加入已经使用 Brasil Food Transport 管理运营的企业。',
    ctaAction: '立即开始',
    footer: '版权所有。',
    links: ['使用条款', '隐私', '支持'],
    cards: [
      ['车队管理', '实时监控车辆与货物，并直接接入追踪系统。'],
      ['数字认证', '自动签发并校验卫生证书和税务文件。'],
      ['高级分析', '提供绩效、成本和物流效率指标的控制面板。'],
      ['全球连接', '与 LATAM Export 和 MFD 门户原生集成，支持国际扩张。'],
    ],
  },
} as const;

export default function BrasilWelcomePage() {
  const currentYear = new Date().getFullYear();
  const { language } = useTranslation();
  const copy = COPY[language];

  return (
    <div className="min-h-screen bg-green-50 font-sans">
      {/* Navbar */}
      <nav className="bg-green-800 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-2xl">🇧🇷</span>
            {copy.brand}
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher className="bg-green-900/60" />
            <Link href="/brasil/login" className="px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              {copy.login}
            </Link>
            <Link href="/brasil/login" className="px-4 py-2 bg-yellow-400 text-green-900 rounded-lg font-bold hover:bg-yellow-300 transition-colors">
              {copy.register}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-br from-green-800 to-green-600 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {copy.titleLine1} <br/>
            <span className="text-yellow-400">{copy.titleLine2}</span>
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            {copy.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/brasil/login" className="px-8 py-4 bg-yellow-400 text-green-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transform hover:-translate-y-1 transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2">
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
            <h2 className="text-3xl font-bold text-green-900 mb-4">{copy.featuresTitle}</h2>
            <p className="text-green-700 max-w-2xl mx-auto">
              {copy.featuresSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Truck className="w-8 h-8 text-green-600" />}
              title={copy.cards[0][0]}
              description={copy.cards[0][1]}
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8 text-green-600" />}
              title={copy.cards[1][0]}
              description={copy.cards[1][1]}
            />
            <FeatureCard 
              icon={<BarChart3 className="w-8 h-8 text-green-600" />}
              title={copy.cards[2][0]}
              description={copy.cards[2][1]}
            />
            <FeatureCard 
              icon={<Globe2 className="w-8 h-8 text-green-600" />}
              title={copy.cards[3][0]}
              description={copy.cards[3][1]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-900 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">{copy.ctaTitle}</h2>
          <p className="text-green-200 mb-8 max-w-2xl mx-auto">
            {copy.ctaSubtitle}
          </p>
          <Link href="/brasil/login" className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-green-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all shadow-lg">
            {copy.ctaAction}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-950 text-green-400 py-8 px-4 text-center text-sm">
        <div className="container mx-auto">
          <p>&copy; {currentYear} {copy.brand}. {copy.footer}</p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="#" className="hover:text-white transition-colors">{copy.links[0]}</a>
            <a href="#" className="hover:text-white transition-colors">{copy.links[1]}</a>
            <a href="#" className="hover:text-white transition-colors">{copy.links[2]}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-shadow">
      <div className="bg-green-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-green-900 mb-3">{title}</h3>
      <p className="text-green-700 leading-relaxed">{description}</p>
    </div>
  );
}
