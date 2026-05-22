export const revalidate = 300;

type CommoditySnapshot = {
  symbol: string;
  price: number;
  previousClose: number;
};

const FALLBACK_QUOTES: CommoditySnapshot[] = [
  { symbol: 'ZW=F', price: 698.5, previousClose: 691.25 },
  { symbol: 'ZC=F', price: 461.0, previousClose: 457.75 },
  { symbol: 'ZS=F', price: 1244.0, previousClose: 1238.5 },
  { symbol: 'ZR=F', price: 15.91, previousClose: 15.84 },
  { symbol: 'SB=F', price: 18.74, previousClose: 18.62 },
  { symbol: 'KC=F', price: 226.9, previousClose: 223.4 },
  { symbol: 'CC=F', price: 7420.0, previousClose: 7354.0 },
  { symbol: 'CT=F', price: 78.44, previousClose: 77.98 },
  { symbol: 'LE=F', price: 184.2, previousClose: 182.95 },
  { symbol: 'HE=F', price: 102.55, previousClose: 101.8 },
  { symbol: 'DC=F', price: 41.3, previousClose: 41.0 },
  { symbol: 'ZL=F', price: 49.82, previousClose: 49.17 },
  { symbol: 'OJ=F', price: 372.6, previousClose: 369.4 },
];

function buildYahooUrl() {
  const symbols = FALLBACK_QUOTES.map((item) => item.symbol).join(',');
  return `https://query1.finance.yahoo.com/v7/finance/spark?symbols=${encodeURIComponent(symbols)}&range=1d&interval=1d`;
}

function normalizeYahooPayload(payload: any): CommoditySnapshot[] {
  const results = payload?.spark?.result;
  if (!Array.isArray(results)) {
    return [];
  }

  return results
    .map((item: any) => {
      const meta = item?.response?.[0]?.meta;
      const price = meta?.regularMarketPrice;
      const previousClose = meta?.chartPreviousClose ?? meta?.previousClose;

      if (!item?.symbol || typeof price !== 'number' || typeof previousClose !== 'number') {
        return null;
      }

      return {
        symbol: item.symbol,
        price,
        previousClose,
      };
    })
    .filter((item): item is CommoditySnapshot => item !== null);
}

export async function GET() {
  try {
    const response = await fetch(buildYahooUrl(), {
      next: { revalidate },
      headers: {
        'User-Agent': 'Mozilla/5.0 FoodPriceGlobal/1.0',
        Accept: 'application/json,text/plain,*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`Yahoo Finance request failed with status ${response.status}`);
    }

    const payload = await response.json();
    const quotes = normalizeYahooPayload(payload);

    if (quotes.length === 0) {
      throw new Error('Yahoo Finance returned no usable quote data');
    }

    return Response.json({
      quotes,
      source: 'yahoo-finance',
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to fetch commodities from Yahoo Finance:', error);

    return Response.json({
      quotes: FALLBACK_QUOTES,
      source: 'fallback',
      updatedAt: new Date().toISOString(),
    });
  }
}
