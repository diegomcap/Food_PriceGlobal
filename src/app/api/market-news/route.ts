import { formatShortDate, getLocale, shiftDate, type SupportedLanguage } from '@/lib/marketTime';

export const revalidate = 1800;

type NewsParams = {
  hl: string;
  gl: string;
  ceid: string;
};

type NewsItem = {
  title: string;
  link: string;
  source: string;
  description: string;
  time: string;
  image: string;
  isNew: boolean;
};

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1593924689241-1b78c38f0071?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1551754655-cd27e38d2076?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
];

function getGoogleNewsParams(language: SupportedLanguage): NewsParams {
  switch (language) {
    case 'pt':
      return { hl: 'pt-BR', gl: 'BR', ceid: 'BR:pt-419' };
    case 'es':
      return { hl: 'es-419', gl: 'AR', ceid: 'AR:es-419' };
    case 'ar':
      return { hl: 'ar', gl: 'AE', ceid: 'AE:ar' };
    case 'ru':
      return { hl: 'ru', gl: 'RU', ceid: 'RU:ru' };
    case 'zh':
      return { hl: 'zh-HK', gl: 'HK', ceid: 'HK:zh-Hant' };
    default:
      return { hl: 'en-US', gl: 'US', ceid: 'US:en' };
  }
}

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripHtml(value: string) {
  return decodeXml(value)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTag(content: string, tag: string) {
  const match = content.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? decodeXml(match[1].trim()) : '';
}

function parseGoogleNewsRss(xml: string, language: SupportedLanguage): NewsItem[] {
  const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/gi) ?? [];

  return itemMatches.slice(0, 6).map((item, index) => {
    const title = extractTag(item, 'title');
    const source = extractTag(item, 'source') || 'Google News';
    const link = extractTag(item, 'link') || '#';
    const description = stripHtml(extractTag(item, 'description'));
    const pubDate = extractTag(item, 'pubDate');
    const date = pubDate ? new Date(pubDate) : shiftDate(new Date(), -(index + 1));
    const cleanedTitle = title.replace(new RegExp(`\\s-\\s${source}$`), '').trim();

    return {
      title: cleanedTitle || `Market Update ${index + 1}`,
      link,
      source,
      description: description.slice(0, 180) || 'Market analysis and commodities update.',
      time: formatShortDate(date, language),
      image: FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
      isNew: Date.now() - date.getTime() < 48 * 60 * 60 * 1000,
    };
  });
}

function buildFallbackNews(query: string, language: SupportedLanguage): NewsItem[] {
  const baseDate = new Date();
  const titles: Record<SupportedLanguage, string[]> = {
    pt: [
      `Oferta global de commodities reage a ${query}`,
      'Fluxos logísticos pressionam custos agrícolas',
      'Óleos vegetais seguem com volatilidade internacional',
      'Mercado de carnes monitora demanda asiática',
      'Dairy e açúcar ajustam preços com nova rodada de dados',
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
      description: stripHtml(title),
      time: formatShortDate(date, language),
      image: FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
      isNew: index < 2,
    };
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('query') || 'agricultural commodities market').trim();
  const rawLanguage = (searchParams.get('language') || 'en') as SupportedLanguage;
  const language: SupportedLanguage = ['pt', 'en', 'es', 'ru', 'ar', 'zh'].includes(rawLanguage) ? rawLanguage : 'en';
  const params = getGoogleNewsParams(language);
  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${params.hl}&gl=${params.gl}&ceid=${params.ceid}`;

  try {
    const response = await fetch(rssUrl, {
      next: { revalidate },
      headers: {
        'User-Agent': `FoodPriceGlobalBot/1.0 (${getLocale(language)})`,
        Accept: 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`Google News RSS request failed with status ${response.status}`);
    }

    const xml = await response.text();
    const articles = parseGoogleNewsRss(xml, language);

    if (articles.length === 0) {
      throw new Error('No news items parsed from Google News RSS');
    }

    return Response.json({
      articles,
      source: 'google-news-rss',
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to fetch market news on server:', error);

    return Response.json({
      articles: buildFallbackNews(query, language),
      source: 'fallback',
      updatedAt: new Date().toISOString(),
    });
  }
}
