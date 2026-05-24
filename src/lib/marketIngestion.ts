import 'server-only';

import { COMMODITY_META } from '@/lib/marketOverview';
import { isRefreshDue } from '@/lib/dataFreshness';
import { MARKET_SOURCE_STACK } from '@/lib/marketSources';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export type CommoditySnapshot = {
  symbol: string;
  price: number;
  previousClose: number;
};

export type MacroDriverSnapshot = {
  symbol: string;
  label: string;
  price: number;
  previousClose: number;
  unit: string;
};

export type PersistedMarketPayload<T> = {
  items: T[];
  source: string;
  updatedAt: string;
};

type CommodityRoutePayload = {
  quotes: CommoditySnapshot[];
  source: string;
  updatedAt: string;
};

type MacroDriverRoutePayload = {
  drivers: MacroDriverSnapshot[];
  source: string;
  updatedAt: string;
};

type ProviderResult<T> = PersistedMarketPayload<T>;

type MarketProvider<T> = {
  source: string;
  isEnabled: () => boolean;
  fetch: () => Promise<ProviderResult<T>>;
};

type TimedCommoditySnapshot = CommoditySnapshot & { updatedAt?: string };
type TimedMacroDriverSnapshot = MacroDriverSnapshot & { updatedAt?: string };

export const FALLBACK_COMMODITY_QUOTES: CommoditySnapshot[] = [
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

export const FALLBACK_MACRO_DRIVERS: MacroDriverSnapshot[] = [
  { symbol: 'DX=F', label: 'US Dollar Index', price: 104.18, previousClose: 103.74, unit: 'pts' },
  { symbol: 'CL=F', label: 'WTI Crude Oil', price: 78.42, previousClose: 77.58, unit: 'USD/bbl' },
  { symbol: 'NG=F', label: 'Natural Gas', price: 2.67, previousClose: 2.61, unit: 'USD/mmbtu' },
  { symbol: 'GC=F', label: 'Gold', price: 2384.1, previousClose: 2371.4, unit: 'USD/oz' },
];

const COMMODITY_BARCHART_SYMBOLS: Record<string, string> = {
  'ZW=F': 'ZW*0',
  'ZC=F': 'ZC*0',
  'ZS=F': 'ZS*0',
  'ZR=F': 'ZR*0',
  'SB=F': 'SB*0',
  'KC=F': 'KC*0',
  'CC=F': 'CC*0',
  'CT=F': 'CT*0',
  'LE=F': 'LE*0',
  'HE=F': 'HE*0',
  'DC=F': 'DC*0',
  'ZL=F': 'ZL*0',
  'OJ=F': 'OJ*0',
};

const MACRO_BARCHART_SYMBOLS: Record<string, string> = {
  'DX=F': 'DX*0',
  'CL=F': 'CL*0',
  'NG=F': 'NG*0',
  'GC=F': 'GC*0',
};

const TRADING_ECONOMICS_COMMODITY_MATCHERS: Record<string, string[]> = {
  'ZW=F': ['Wheat'],
  'ZC=F': ['Corn'],
  'ZS=F': ['Soybeans'],
  'ZR=F': ['Rough Rice', 'Rice'],
  'SB=F': ['Sugar'],
  'KC=F': ['Coffee'],
  'CC=F': ['Cocoa'],
  'CT=F': ['Cotton'],
  'LE=F': ['Live Cattle', 'Cattle'],
  'HE=F': ['Lean Hogs', 'Hogs'],
  'DC=F': ['Milk'],
  'ZL=F': ['Soybean Oil'],
  'OJ=F': ['Orange Juice'],
};

const TRADING_ECONOMICS_MACRO_MATCHERS: Record<string, { names: string[]; category: 'commodities' | 'currencies' }> = {
  'DX=F': { names: ['DXY', 'Dollar Index', 'US Dollar Index'], category: 'currencies' },
  'CL=F': { names: ['Crude Oil'], category: 'commodities' },
  'NG=F': { names: ['Natural gas', 'Natural Gas'], category: 'commodities' },
  'GC=F': { names: ['Gold'], category: 'commodities' },
};

function getBarchartApiKey() {
  return process.env.BARCHART_API_KEY ?? '';
}

function getTradingEconomicsApiKey() {
  return process.env.TRADING_ECONOMICS_API_KEY ?? '';
}

function buildYahooSparkUrl(symbols: string[]) {
  return `https://query1.finance.yahoo.com/v7/finance/spark?symbols=${encodeURIComponent(symbols.join(','))}&range=1d&interval=1d`;
}

function buildBarchartQuoteUrl(symbols: string[]) {
  const apiKey = getBarchartApiKey();
  return `https://ondemand.websol.barchart.com/getQuote.json?apikey=${encodeURIComponent(apiKey)}&symbols=${encodeURIComponent(symbols.join(','))}`;
}

function buildTradingEconomicsUrl(path: 'commodities' | 'currencies') {
  const apiKey = getTradingEconomicsApiKey();
  return `https://api.tradingeconomics.com/markets/${path}?c=${encodeURIComponent(apiKey)}&f=json`;
}

async function fetchJson(url: string, headers?: HeadersInit) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 FoodPriceGlobal/1.0',
      Accept: 'application/json,text/plain,*/*',
      ...headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Market request failed with status ${response.status}`);
  }

  return response.json();
}

function getLatestTimestamp(values: Array<string | undefined>, fallback = new Date().toISOString()) {
  const timestamps = values
    .filter((value): value is string => Boolean(value))
    .map((value) => new Date(value).getTime())
    .filter((value) => !Number.isNaN(value));

  if (timestamps.length === 0) {
    return fallback;
  }

  return new Date(Math.max(...timestamps)).toISOString();
}

function normalizeYahooSparkQuotes(payload: any): CommoditySnapshot[] {
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

      return { symbol: item.symbol, price, previousClose };
    })
    .filter((item): item is CommoditySnapshot => item !== null);
}

function normalizeYahooSparkMacro(payload: any): MacroDriverSnapshot[] {
  const results = payload?.spark?.result;
  if (!Array.isArray(results)) {
    return [];
  }

  return results
    .map((item: any) => {
      const meta = item?.response?.[0]?.meta;
      const price = meta?.regularMarketPrice;
      const previousClose = meta?.chartPreviousClose ?? meta?.previousClose;
      const fallback = FALLBACK_MACRO_DRIVERS.find((driver) => driver.symbol === item?.symbol);

      if (!fallback || typeof price !== 'number' || typeof previousClose !== 'number') {
        return null;
      }

      return {
        ...fallback,
        price,
        previousClose,
      };
    })
    .filter((item): item is MacroDriverSnapshot => item !== null);
}

function normalizeBarchartQuotes(payload: any, symbolMap: Record<string, string>): TimedCommoditySnapshot[] {
  const results = Array.isArray(payload?.results) ? payload.results : [];
  const inverseMap = Object.fromEntries(Object.entries(symbolMap).map(([internal, external]) => [external, internal]));

  return results
    .map((item: any) => {
      const symbol = inverseMap[item?.symbol];
      const price = item?.lastPrice;
      const previousClose =
        typeof item?.previousClose === 'number'
          ? item.previousClose
          : typeof item?.close === 'number'
            ? item.close
            : typeof item?.netChange === 'number' && typeof price === 'number'
              ? price - item.netChange
              : null;

      if (!symbol || typeof price !== 'number' || typeof previousClose !== 'number') {
        return null;
      }

      return {
        symbol,
        price,
        previousClose,
        updatedAt: item?.tradeTimestamp ?? item?.serverTimestamp,
      };
    })
    .filter((item: TimedCommoditySnapshot | null): item is TimedCommoditySnapshot => item !== null);
}

export async function fetchCommodityQuotesFromYahoo(): Promise<ProviderResult<CommoditySnapshot>> {
  const payload = await fetchJson(buildYahooSparkUrl(FALLBACK_COMMODITY_QUOTES.map((item) => item.symbol)));
  const items = normalizeYahooSparkQuotes(payload);

  if (items.length === 0) {
    throw new Error('Yahoo Finance returned no usable commodity quote data');
  }

  return {
    items,
    source: 'yahoo-finance',
    updatedAt: new Date().toISOString(),
  };
}

export async function fetchMacroDriversFromYahoo(): Promise<ProviderResult<MacroDriverSnapshot>> {
  const payload = await fetchJson(buildYahooSparkUrl(FALLBACK_MACRO_DRIVERS.map((item) => item.symbol)));
  const items = normalizeYahooSparkMacro(payload);

  if (items.length === 0) {
    throw new Error('Yahoo Finance returned no usable macro driver data');
  }

  return {
    items,
    source: 'yahoo-finance-macro',
    updatedAt: new Date().toISOString(),
  };
}

export async function fetchCommodityQuotesFromBarchart(): Promise<ProviderResult<CommoditySnapshot>> {
  const payload = await fetchJson(buildBarchartQuoteUrl(Object.values(COMMODITY_BARCHART_SYMBOLS)));
  const quotes: TimedCommoditySnapshot[] = normalizeBarchartQuotes(payload, COMMODITY_BARCHART_SYMBOLS);

  if (quotes.length === 0) {
    throw new Error('Barchart returned no usable commodity quote data');
  }

  return {
    items: quotes.map((quote) => ({
      symbol: quote.symbol,
      price: quote.price,
      previousClose: quote.previousClose,
    })),
    source: 'barchart-commodities',
    updatedAt: getLatestTimestamp(quotes.map((quote) => quote.updatedAt)),
  };
}

export async function fetchMacroDriversFromBarchart(): Promise<ProviderResult<MacroDriverSnapshot>> {
  const payload = await fetchJson(buildBarchartQuoteUrl(Object.values(MACRO_BARCHART_SYMBOLS)));
  const rows: TimedCommoditySnapshot[] = normalizeBarchartQuotes(payload, MACRO_BARCHART_SYMBOLS);

  if (rows.length === 0) {
    throw new Error('Barchart returned no usable macro driver data');
  }

  return {
    items: rows.map(({ symbol, price, previousClose }) => {
      const meta = FALLBACK_MACRO_DRIVERS.find((driver) => driver.symbol === symbol);
      if (!meta) {
        return null;
      }

      return {
        ...meta,
        price,
        previousClose,
      };
    }).filter((item: MacroDriverSnapshot | null): item is MacroDriverSnapshot => item !== null),
    source: 'barchart-macro',
    updatedAt: getLatestTimestamp(rows.map((row) => row.updatedAt)),
  };
}

function findTradingEconomicsRow(rows: any[], names: string[]) {
  const loweredNames = names.map((name) => name.toLowerCase());
  return rows.find((row) => loweredNames.includes(String(row?.Name ?? '').toLowerCase()));
}

async function fetchTradingEconomicsCategory(path: 'commodities' | 'currencies') {
  return fetchJson(buildTradingEconomicsUrl(path), {
    Authorization: getTradingEconomicsApiKey(),
  });
}

export async function fetchCommodityQuotesFromTradingEconomics(): Promise<ProviderResult<CommoditySnapshot>> {
  const payload = await fetchTradingEconomicsCategory('commodities');
  const rows = Array.isArray(payload) ? payload : [];

  const mappedQuotes: Array<TimedCommoditySnapshot | null> = Object.entries(TRADING_ECONOMICS_COMMODITY_MATCHERS)
    .map(([symbol, names]) => {
      const match = findTradingEconomicsRow(rows, names);
      const price = match?.Last;
      const previousClose = match?.Close;

      if (typeof price !== 'number' || typeof previousClose !== 'number') {
        return null;
      }

      return {
        symbol,
        price,
        previousClose,
        updatedAt: match?.LastUpdate ?? match?.Date,
      };
    });

  const quotes: TimedCommoditySnapshot[] = mappedQuotes.filter(
    (item: TimedCommoditySnapshot | null): item is TimedCommoditySnapshot => item !== null
  );

  if (quotes.length === 0) {
    throw new Error('Trading Economics returned no usable commodity quote data');
  }

  return {
    items: quotes.map((quote) => ({
      symbol: quote.symbol,
      price: quote.price,
      previousClose: quote.previousClose,
    })),
    source: 'trading-economics-commodities',
    updatedAt: getLatestTimestamp(quotes.map((quote) => quote.updatedAt)),
  };
}

export async function fetchMacroDriversFromTradingEconomics(): Promise<ProviderResult<MacroDriverSnapshot>> {
  const [commodityPayload, currencyPayload] = await Promise.all([
    fetchTradingEconomicsCategory('commodities'),
    fetchTradingEconomicsCategory('currencies'),
  ]);

  const byCategory = {
    commodities: Array.isArray(commodityPayload) ? commodityPayload : [],
    currencies: Array.isArray(currencyPayload) ? currencyPayload : [],
  };

  const mappedDrivers: Array<TimedMacroDriverSnapshot | null> = Object.entries(TRADING_ECONOMICS_MACRO_MATCHERS)
    .map(([symbol, matcher]) => {
      const match = findTradingEconomicsRow(byCategory[matcher.category], matcher.names);
      const price = match?.Last;
      const previousClose = match?.Close;
      const meta = FALLBACK_MACRO_DRIVERS.find((driver) => driver.symbol === symbol);

      if (!meta || typeof price !== 'number' || typeof previousClose !== 'number') {
        return null;
      }

      return {
        ...meta,
        price,
        previousClose,
        updatedAt: match?.LastUpdate ?? match?.Date,
      };
    });

  const drivers: TimedMacroDriverSnapshot[] = mappedDrivers.filter(
    (item: TimedMacroDriverSnapshot | null): item is TimedMacroDriverSnapshot => item !== null
  );

  if (drivers.length === 0) {
    throw new Error('Trading Economics returned no usable macro driver data');
  }

  return {
    items: drivers.map((driver) => ({
      symbol: driver.symbol,
      label: driver.label,
      price: driver.price,
      previousClose: driver.previousClose,
      unit: driver.unit,
    })),
    source: 'trading-economics-macro',
    updatedAt: getLatestTimestamp(drivers.map((driver) => driver.updatedAt)),
  };
}

async function fetchFromProviderChain<T>(providers: MarketProvider<T>[]) {
  const failures: string[] = [];

  for (const provider of providers) {
    if (!provider.isEnabled()) {
      continue;
    }

    try {
      return await provider.fetch();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown provider error';
      failures.push(`${provider.source}: ${message}`);
    }
  }

  throw new Error(failures.length > 0 ? failures.join(' | ') : 'No market providers are configured');
}

export async function fetchCommodityQuotesFromBestSource() {
  return fetchFromProviderChain<CommoditySnapshot>([
    {
      source: 'barchart-commodities',
      isEnabled: () => Boolean(getBarchartApiKey()),
      fetch: fetchCommodityQuotesFromBarchart,
    },
    {
      source: 'trading-economics-commodities',
      isEnabled: () => Boolean(getTradingEconomicsApiKey()),
      fetch: fetchCommodityQuotesFromTradingEconomics,
    },
    {
      source: 'yahoo-finance',
      isEnabled: () => true,
      fetch: fetchCommodityQuotesFromYahoo,
    },
  ]);
}

export async function fetchMacroDriversFromBestSource() {
  return fetchFromProviderChain<MacroDriverSnapshot>([
    {
      source: 'trading-economics-macro',
      isEnabled: () => Boolean(getTradingEconomicsApiKey()),
      fetch: fetchMacroDriversFromTradingEconomics,
    },
    {
      source: 'barchart-macro',
      isEnabled: () => Boolean(getBarchartApiKey()),
      fetch: fetchMacroDriversFromBarchart,
    },
    {
      source: 'yahoo-finance-macro',
      isEnabled: () => true,
      fetch: fetchMacroDriversFromYahoo,
    },
  ]);
}

export async function fetchCommodityQuotesFromFreshSource() {
  return fetchFromProviderChain<CommoditySnapshot>([
    {
      source: 'barchart-commodities',
      isEnabled: () => Boolean(getBarchartApiKey()),
      fetch: fetchCommodityQuotesFromBarchart,
    },
    {
      source: 'trading-economics-commodities',
      isEnabled: () => Boolean(getTradingEconomicsApiKey()),
      fetch: fetchCommodityQuotesFromTradingEconomics,
    },
    {
      source: 'yahoo-finance',
      isEnabled: () => true,
      fetch: fetchCommodityQuotesFromYahoo,
    },
  ]);
}

export async function fetchMacroDriversFromFreshSource() {
  return fetchFromProviderChain<MacroDriverSnapshot>([
    {
      source: 'trading-economics-macro',
      isEnabled: () => Boolean(getTradingEconomicsApiKey()),
      fetch: fetchMacroDriversFromTradingEconomics,
    },
    {
      source: 'barchart-macro',
      isEnabled: () => Boolean(getBarchartApiKey()),
      fetch: fetchMacroDriversFromBarchart,
    },
    {
      source: 'yahoo-finance-macro',
      isEnabled: () => true,
      fetch: fetchMacroDriversFromYahoo,
    },
  ]);
}

async function startIngestionRun(datasetKey: 'commodities' | 'macro_drivers', sourceKey: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('ingestion_runs')
    .insert({
      dataset_key: datasetKey,
      source_key: sourceKey,
      status: 'running',
      started_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) {
    console.error('Unable to create ingestion run:', error);
    return null;
  }

  return data?.id ?? null;
}

async function finishIngestionRun(runId: string | null, payload: { status: 'success' | 'failed'; records: number; fallbackUsed?: boolean; errorMessage?: string; sourceUpdatedAt?: string; }) {
  const supabase = getSupabaseAdmin();
  if (!supabase || !runId) {
    return;
  }

  const { error } = await supabase
    .from('ingestion_runs')
    .update({
      status: payload.status,
      records_ingested: payload.records,
      fallback_used: payload.fallbackUsed ?? false,
      source_updated_at: payload.sourceUpdatedAt,
      finished_at: new Date().toISOString(),
      error_message: payload.errorMessage ?? null,
    })
    .eq('id', runId);

  if (error) {
    console.error('Unable to finish ingestion run:', error);
  }
}

export async function persistCommodityQuotes(payload: PersistedMarketPayload<CommoditySnapshot>) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return false;
  }

  const runId = await startIngestionRun('commodities', payload.source);

  try {
    const rows = payload.items.map((item) => ({
      run_id: runId,
      source_key: payload.source,
      symbol: item.symbol,
      price: item.price,
      previous_close: item.previousClose,
      currency: 'USD',
      unit: COMMODITY_META[item.symbol]?.unit ?? null,
      market: COMMODITY_META[item.symbol]?.market ?? null,
      source_updated_at: payload.updatedAt,
      ingested_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('commodity_quote_snapshots').insert(rows);
    if (error) {
      throw error;
    }

    await finishIngestionRun(runId, {
      status: 'success',
      records: rows.length,
      sourceUpdatedAt: payload.updatedAt,
    });

    return true;
  } catch (error) {
    console.error('Unable to persist commodity quotes:', error);
    await finishIngestionRun(runId, {
      status: 'failed',
      records: 0,
      errorMessage: error instanceof Error ? error.message : 'Unknown persistence error',
      sourceUpdatedAt: payload.updatedAt,
    });
    return false;
  }
}

export async function persistMacroDrivers(payload: PersistedMarketPayload<MacroDriverSnapshot>) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return false;
  }

  const runId = await startIngestionRun('macro_drivers', payload.source);

  try {
    const rows = payload.items.map((item) => ({
      run_id: runId,
      source_key: payload.source,
      symbol: item.symbol,
      label: item.label,
      price: item.price,
      previous_close: item.previousClose,
      unit: item.unit,
      source_updated_at: payload.updatedAt,
      ingested_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('macro_driver_snapshots').insert(rows);
    if (error) {
      throw error;
    }

    await finishIngestionRun(runId, {
      status: 'success',
      records: rows.length,
      sourceUpdatedAt: payload.updatedAt,
    });

    return true;
  } catch (error) {
    console.error('Unable to persist macro drivers:', error);
    await finishIngestionRun(runId, {
      status: 'failed',
      records: 0,
      errorMessage: error instanceof Error ? error.message : 'Unknown persistence error',
      sourceUpdatedAt: payload.updatedAt,
    });
    return false;
  }
}

export async function readLatestCommodityQuotes() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('latest_commodity_quotes')
    .select('symbol, source_key, price, previous_close, source_updated_at, ingested_at')
    .order('symbol', { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) {
      console.error('Unable to read commodity quotes from Supabase:', error);
    }
    return null;
  }

  const updatedAt =
    data
      .map((row) => row.source_updated_at ?? row.ingested_at)
      .filter(Boolean)
      .sort()
      .at(-1) ?? new Date().toISOString();

  return {
    quotes: data.map((row) => ({
      symbol: row.symbol,
      price: Number(row.price),
      previousClose: Number(row.previous_close),
    })),
    source: data[0].source_key ?? 'yahoo-finance',
    updatedAt,
  };
}

export async function readLatestMacroDrivers() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('latest_macro_driver_quotes')
    .select('symbol, source_key, label, price, previous_close, unit, source_updated_at, ingested_at')
    .order('symbol', { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) {
      console.error('Unable to read macro drivers from Supabase:', error);
    }
    return null;
  }

  const updatedAt =
    data
      .map((row) => row.source_updated_at ?? row.ingested_at)
      .filter(Boolean)
      .sort()
      .at(-1) ?? new Date().toISOString();

  return {
    drivers: data.map((row) => ({
      symbol: row.symbol,
      label: row.label,
      price: Number(row.price),
      previousClose: Number(row.previous_close),
      unit: row.unit,
    })),
    source: data[0].source_key ?? 'yahoo-finance-macro',
    updatedAt,
  };
}

export async function fetchCommodityQuotesFromSupabaseSnapshot(persisted?: CommodityRoutePayload | null) {
  const snapshot = persisted ?? (await readLatestCommodityQuotes());

  if (!snapshot || snapshot.quotes.length === 0) {
    throw new Error('No persisted commodity snapshot available');
  }

  return {
    items: snapshot.quotes,
    source: 'supabase-snapshot',
    updatedAt: snapshot.updatedAt,
  };
}

export async function fetchMacroDriversFromSupabaseSnapshot(persisted?: MacroDriverRoutePayload | null) {
  const snapshot = persisted ?? (await readLatestMacroDrivers());

  if (!snapshot || snapshot.drivers.length === 0) {
    throw new Error('No persisted macro driver snapshot available');
  }

  return {
    items: snapshot.drivers,
    source: 'supabase-snapshot',
    updatedAt: snapshot.updatedAt,
  };
}

export async function fetchCommodityQuotesFromFallback() {
  return {
    items: FALLBACK_COMMODITY_QUOTES,
    source: 'fallback',
    updatedAt: new Date().toISOString(),
  };
}

export async function fetchMacroDriversFromFallback() {
  return {
    items: FALLBACK_MACRO_DRIVERS,
    source: 'fallback',
    updatedAt: new Date().toISOString(),
  };
}

export async function fetchCommodityQuotesFromBestAvailable(options?: { persisted?: CommodityRoutePayload | null }) {
  return fetchFromProviderChain<CommoditySnapshot>([
    {
      source: MARKET_SOURCE_STACK.commodities.primary,
      isEnabled: () => Boolean(getBarchartApiKey()),
      fetch: fetchCommodityQuotesFromBarchart,
    },
    {
      source: MARKET_SOURCE_STACK.commodities.secondary,
      isEnabled: () => Boolean(getTradingEconomicsApiKey()),
      fetch: fetchCommodityQuotesFromTradingEconomics,
    },
    {
      source: MARKET_SOURCE_STACK.commodities.tertiary,
      isEnabled: () => true,
      fetch: fetchCommodityQuotesFromYahoo,
    },
    {
      source: MARKET_SOURCE_STACK.commodities.persisted,
      isEnabled: () => true,
      fetch: () => fetchCommodityQuotesFromSupabaseSnapshot(options?.persisted),
    },
    {
      source: MARKET_SOURCE_STACK.commodities.fallback,
      isEnabled: () => true,
      fetch: fetchCommodityQuotesFromFallback,
    },
  ]);
}

export async function fetchMacroDriversFromBestAvailable(options?: { persisted?: MacroDriverRoutePayload | null }) {
  return fetchFromProviderChain<MacroDriverSnapshot>([
    {
      source: MARKET_SOURCE_STACK.macro_drivers.primary,
      isEnabled: () => Boolean(getTradingEconomicsApiKey()),
      fetch: fetchMacroDriversFromTradingEconomics,
    },
    {
      source: MARKET_SOURCE_STACK.macro_drivers.secondary,
      isEnabled: () => Boolean(getBarchartApiKey()),
      fetch: fetchMacroDriversFromBarchart,
    },
    {
      source: MARKET_SOURCE_STACK.macro_drivers.tertiary,
      isEnabled: () => true,
      fetch: fetchMacroDriversFromYahoo,
    },
    {
      source: MARKET_SOURCE_STACK.macro_drivers.persisted,
      isEnabled: () => true,
      fetch: () => fetchMacroDriversFromSupabaseSnapshot(options?.persisted),
    },
    {
      source: MARKET_SOURCE_STACK.macro_drivers.fallback,
      isEnabled: () => true,
      fetch: fetchMacroDriversFromFallback,
    },
  ]);
}

export function shouldRefreshPersistedData(dataset: 'commodities' | 'macro_drivers', updatedAt?: string) {
  return isRefreshDue(dataset, updatedAt);
}

export function isIngestionAuthorized(request: Request) {
  const secrets = [process.env.MARKET_INGESTION_SECRET, process.env.CRON_SECRET].filter(
    (value): value is string => Boolean(value)
  );

  if (secrets.length === 0) {
    return false;
  }

  const bearer = request.headers.get('authorization');
  const headerSecret = request.headers.get('x-ingestion-secret');

  return secrets.some((secret) => bearer === `Bearer ${secret}` || headerSecret === secret);
}
