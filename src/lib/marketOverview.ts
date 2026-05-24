import type { SupportedLanguage } from '@/lib/marketTime';

export type CommodityQuote = {
  symbol: string;
  price: number;
  previousClose: number;
};

export type CommoditiesApiResponse = {
  quotes: CommodityQuote[];
  source: string;
  updatedAt: string;
};

export type FaoRecord = {
  date: string;
  food: number;
  meat: number;
  dairy: number;
  cereals: number;
  oils: number;
  sugar: number;
};

export type FaoApiResponse = {
  latest: FaoRecord;
  previous: FaoRecord;
  series: FaoRecord[];
  source?: string;
  updatedAt: string;
};

type CommodityMeta = {
  id: string;
  category: 'grains' | 'oils' | 'meat' | 'dairy' | 'sugar' | 'softs';
  market: string;
  unit: string;
};

export type MarketCommodity = CommodityQuote &
  CommodityMeta & {
    change: number;
    trend: 'up' | 'down';
  };

export const COMMODITY_META: Record<string, CommodityMeta> = {
  'ZW=F': { id: 'commodity_wheat', category: 'grains', market: 'CBOT', unit: 'USd/bu' },
  'ZC=F': { id: 'commodity_corn', category: 'grains', market: 'CBOT', unit: 'USd/bu' },
  'ZS=F': { id: 'commodity_soybean', category: 'grains', market: 'CBOT', unit: 'USd/bu' },
  'SB=F': { id: 'commodity_sugar', category: 'sugar', market: 'ICE', unit: 'USd/lb' },
  'KC=F': { id: 'commodity_coffee_arabica', category: 'softs', market: 'ICE', unit: 'USd/lb' },
  'LE=F': { id: 'commodity_cattle', category: 'meat', market: 'CME', unit: 'USd/lb' },
  'ZL=F': { id: 'commodity_soy_oil', category: 'oils', market: 'CBOT', unit: 'USd/lb' },
  'DC=F': { id: 'commodity_milk_powder', category: 'dairy', market: 'CME', unit: 'USd/cwt' },
  'CC=F': { id: 'commodity_cocoa', category: 'softs', market: 'ICE', unit: 'USd/mt' },
  'CT=F': { id: 'commodity_cotton', category: 'softs', market: 'ICE', unit: 'USd/lb' },
  'HE=F': { id: 'commodity_pork', category: 'meat', market: 'CME', unit: 'USd/lb' },
  'ZR=F': { id: 'commodity_rice', category: 'grains', market: 'CBOT', unit: 'USd/cwt' },
  'OJ=F': { id: 'commodity_orange', category: 'softs', market: 'ICE', unit: 'USd/lb' },
};

export const WATCHLIST_SYMBOLS = ['ZS=F', 'ZC=F', 'ZW=F', 'SB=F', 'KC=F', 'LE=F'] as const;

const CATEGORY_LABELS: Record<SupportedLanguage, Record<CommodityMeta['category'], string>> = {
  pt: {
    grains: 'Graos',
    oils: 'Oleos',
    meat: 'Carnes',
    dairy: 'Laticinios',
    sugar: 'Acucar',
    softs: 'Softs',
  },
  en: {
    grains: 'Grains',
    oils: 'Oils',
    meat: 'Meat',
    dairy: 'Dairy',
    sugar: 'Sugar',
    softs: 'Softs',
  },
  es: {
    grains: 'Granos',
    oils: 'Aceites',
    meat: 'Carnes',
    dairy: 'Lacteos',
    sugar: 'Azucar',
    softs: 'Softs',
  },
  ru: {
    grains: 'Zerno',
    oils: 'Masla',
    meat: 'Myaso',
    dairy: 'Molochnye',
    sugar: 'Sakhar',
    softs: 'Softs',
  },
  ar: {
    grains: 'حبوب',
    oils: 'زيوت',
    meat: 'لحوم',
    dairy: 'ألبان',
    sugar: 'سكر',
    softs: 'Softs',
  },
  zh: {
    grains: '谷物',
    oils: '油脂',
    meat: '肉类',
    dairy: '乳品',
    sugar: '糖',
    softs: '软商品',
  },
};

const SOURCE_LABELS: Record<SupportedLanguage, Record<string, string>> = {
  pt: {
    'barchart-commodities': 'Barchart',
    'trading-economics-commodities': 'Trading Economics',
    'yahoo-finance': 'Yahoo Finance',
    'yahoo-finance-macro': 'Yahoo Finance',
    'barchart-macro': 'Barchart',
    'trading-economics-macro': 'Trading Economics',
    'supabase-snapshot': 'Snapshot persistido',
    'fao-csv': 'FAO',
    'google-news-rss': 'Google News RSS',
    fallback: 'Snapshot de contingencia',
  },
  en: {
    'barchart-commodities': 'Barchart',
    'trading-economics-commodities': 'Trading Economics',
    'yahoo-finance': 'Yahoo Finance',
    'yahoo-finance-macro': 'Yahoo Finance',
    'barchart-macro': 'Barchart',
    'trading-economics-macro': 'Trading Economics',
    'supabase-snapshot': 'Persisted snapshot',
    'fao-csv': 'FAO',
    'google-news-rss': 'Google News RSS',
    fallback: 'Fallback snapshot',
  },
  es: {
    'barchart-commodities': 'Barchart',
    'trading-economics-commodities': 'Trading Economics',
    'yahoo-finance': 'Yahoo Finance',
    'yahoo-finance-macro': 'Yahoo Finance',
    'barchart-macro': 'Barchart',
    'trading-economics-macro': 'Trading Economics',
    'supabase-snapshot': 'Snapshot persistido',
    'fao-csv': 'FAO',
    'google-news-rss': 'Google News RSS',
    fallback: 'Snapshot de contingencia',
  },
  ru: {
    'barchart-commodities': 'Barchart',
    'trading-economics-commodities': 'Trading Economics',
    'yahoo-finance': 'Yahoo Finance',
    'yahoo-finance-macro': 'Yahoo Finance',
    'barchart-macro': 'Barchart',
    'trading-economics-macro': 'Trading Economics',
    'supabase-snapshot': 'Persisted snapshot',
    'fao-csv': 'FAO',
    'google-news-rss': 'Google News RSS',
    fallback: 'Rezervnyy snimok',
  },
  ar: {
    'barchart-commodities': 'Barchart',
    'trading-economics-commodities': 'Trading Economics',
    'yahoo-finance': 'Yahoo Finance',
    'yahoo-finance-macro': 'Yahoo Finance',
    'barchart-macro': 'Barchart',
    'trading-economics-macro': 'Trading Economics',
    'supabase-snapshot': 'لقطة محفوظة',
    'fao-csv': 'FAO',
    'google-news-rss': 'Google News RSS',
    fallback: 'لقطة احتياطية',
  },
  zh: {
    'barchart-commodities': 'Barchart',
    'trading-economics-commodities': 'Trading Economics',
    'yahoo-finance': 'Yahoo Finance',
    'yahoo-finance-macro': 'Yahoo Finance',
    'barchart-macro': 'Barchart',
    'trading-economics-macro': 'Trading Economics',
    'supabase-snapshot': '持久化快照',
    'fao-csv': 'FAO',
    'google-news-rss': 'Google News RSS',
    fallback: '后备快照',
  },
};

export function mapCommodityQuotes(quotes: CommodityQuote[]): MarketCommodity[] {
  return quotes
    .map((quote) => {
      const meta = COMMODITY_META[quote.symbol];
      if (!meta || !quote.previousClose) {
        return null;
      }

      const change = ((quote.price - quote.previousClose) / quote.previousClose) * 100;

      return {
        ...quote,
        ...meta,
        change,
        trend: change >= 0 ? 'up' : 'down',
      };
    })
    .filter((quote): quote is MarketCommodity => quote !== null);
}

export function getCategoryLabel(category: CommodityMeta['category'], language: SupportedLanguage) {
  return CATEGORY_LABELS[language]?.[category] ?? CATEGORY_LABELS.en[category];
}

export function getSourceLabel(source: string, language: SupportedLanguage) {
  return SOURCE_LABELS[language]?.[source] ?? source;
}

export function formatPercent(change: number) {
  return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
}
