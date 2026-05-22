import { buildFallbackNews, FALLBACK_NEWS_IMAGES, type MarketArticle } from '@/lib/marketContent';
import { formatShortDate, getLocale, shiftDate, type SupportedLanguage } from '@/lib/marketTime';

export const revalidate = 1800;

type NewsParams = {
  hl: string;
  gl: string;
  ceid: string;
};

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

function parseGoogleNewsRss(xml: string, language: SupportedLanguage): MarketArticle[] {
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
      image: FALLBACK_NEWS_IMAGES[index % FALLBACK_NEWS_IMAGES.length],
      isNew: Date.now() - date.getTime() < 48 * 60 * 60 * 1000,
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
