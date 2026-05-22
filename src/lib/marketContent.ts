import { formatShortDate, getDayMonthParts, shiftDate, type SupportedLanguage } from '@/lib/marketTime';

export type MarketArticle = {
  title: string;
  link: string;
  source: string;
  description: string;
  time: string;
  image: string;
  isNew: boolean;
};

export type MarketEvent = {
  date: Date;
  title: string;
  desc: string;
  day: string;
  month: string;
};

export const FALLBACK_NEWS_IMAGES = [
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1593924689241-1b78c38f0071?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1551754655-cd27e38d2076?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
];

export function buildFallbackNews(query: string, language: SupportedLanguage): MarketArticle[] {
  const baseDate = new Date();
  const titles: Record<SupportedLanguage, string[]> = {
    pt: [
      `Oferta global de commodities reage a ${query}`,
      'Fluxos logísticos pressionam custos agrícolas',
      'Óleos vegetais seguem com volatilidade internacional',
      'Mercado de carnes monitora demanda asiática',
      'Laticínios e açúcar ajustam preços com nova rodada de dados',
      'Exportadores reforçam atenção em clima e fretes',
    ],
    en: [
      `Global commodity supply reacts to ${query}`,
      'Logistics flows keep pressure on farm costs',
      'Vegetable oils remain volatile across global markets',
      'Meat markets monitor Asian demand closely',
      'Dairy and sugar reset after fresh macro data',
      'Exporters keep focus on weather and freight rates',
    ],
    es: [
      `La oferta global de materias primas reacciona a ${query}`,
      'La logística mantiene presión sobre los costos agrícolas',
      'Los aceites vegetales siguen volátiles en el mercado global',
      'El mercado cárnico monitorea la demanda asiática',
      'Lácteos y azúcar se ajustan con nuevos datos macro',
      'Exportadores refuerzan foco en clima y fletes',
    ],
    ru: [
      `Мировое предложение сырья реагирует на ${query}`,
      'Логистика продолжает давить на аграрные издержки',
      'Рынок растительных масел остается волатильным',
      'Мясной рынок следит за спросом в Азии',
      'Молочная продукция и сахар корректируются на новых данных',
      'Экспортеры усиливают фокус на погоде и фрахте',
    ],
    ar: [
      `المعروض العالمي من السلع يتفاعل مع ${query}`,
      'سلاسل الإمداد تواصل الضغط على تكاليف الزراعة',
      'الزيوت النباتية تبقى متقلبة في الأسواق العالمية',
      'أسواق اللحوم تراقب الطلب الآسيوي',
      'الألبان والسكر يعيدان التسعير بعد بيانات جديدة',
      'المصدرون يركزون على الطقس والشحن',
    ],
    zh: [
      `${query} 带动全球大宗农产品供给重新定价`,
      '物流链继续推高农业成本',
      '植物油市场维持高波动',
      '肉类市场持续关注亚洲需求',
      '乳制品与糖价根据新数据重新调整',
      '出口商继续聚焦天气与运费',
    ],
  };

  return titles[language].map((title, index) => {
    const date = shiftDate(baseDate, -((index * 2) + 1));

    return {
      title,
      link: '#',
      source: 'FoodPrice Intelligence',
      description: title,
      time: formatShortDate(date, language),
      image: FALLBACK_NEWS_IMAGES[index % FALLBACK_NEWS_IMAGES.length],
      isNew: index < 2,
    };
  });
}

function getNextMonthlyDate(baseDate: Date, dayOfMonth: number, monthOffset = 0) {
  const date = new Date(baseDate);
  date.setDate(1);
  date.setMonth(date.getMonth() + monthOffset);

  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.min(dayOfMonth, daysInMonth));
  if (date <= baseDate) {
    date.setMonth(date.getMonth() + 1);
    const nextMonthDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    date.setDate(Math.min(dayOfMonth, nextMonthDays));
  }

  return date;
}

export function buildRollingMarketEvents(
  currentDate: Date,
  language: SupportedLanguage,
  definitions: Array<{ dayOfMonth: number; monthOffset?: number; title: string; desc: string }>
): MarketEvent[] {
  return definitions.map((definition) => {
    const date = getNextMonthlyDate(currentDate, definition.dayOfMonth, definition.monthOffset ?? 0);
    const parts = getDayMonthParts(date, language);

    return {
      date,
      title: definition.title,
      desc: definition.desc,
      day: parts.day,
      month: parts.month,
    };
  });
}
