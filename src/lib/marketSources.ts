export type PipelineDatasetKey = 'commodities' | 'macro_drivers';

type MarketSourceStack = {
  primary: string;
  secondary: string;
  tertiary: string;
  persisted: string;
  fallback: string;
};

export type MarketSourceTier = keyof MarketSourceStack | 'unknown';
export type MarketSourceSeverity = 'healthy' | 'warning' | 'critical';

export const MARKET_SOURCE_STACK: Record<PipelineDatasetKey, MarketSourceStack> = {
  commodities: {
    primary: 'barchart-commodities',
    secondary: 'trading-economics-commodities',
    tertiary: 'yahoo-finance',
    persisted: 'supabase-snapshot',
    fallback: 'fallback',
  },
  macro_drivers: {
    primary: 'trading-economics-macro',
    secondary: 'barchart-macro',
    tertiary: 'yahoo-finance-macro',
    persisted: 'supabase-snapshot',
    fallback: 'fallback',
  },
};

export const MARKET_SOURCE_PRIORITY: Record<PipelineDatasetKey, string[]> = {
  commodities: ['barchart-commodities', 'trading-economics-commodities', 'yahoo-finance', 'supabase-snapshot', 'fallback'],
  macro_drivers: ['trading-economics-macro', 'barchart-macro', 'yahoo-finance-macro', 'supabase-snapshot', 'fallback'],
};

const MARKET_SOURCE_ALIASES: Partial<Record<PipelineDatasetKey, Record<string, string>>> = {
  macro_drivers: {
    'yahoo-finance': 'yahoo-finance-macro',
  },
};

export function normalizeMarketSourceKey(dataset: PipelineDatasetKey, source?: string) {
  if (!source) {
    return undefined;
  }

  return MARKET_SOURCE_ALIASES[dataset]?.[source] ?? source;
}

export function getMarketSourceTier(dataset: PipelineDatasetKey, source?: string): MarketSourceTier {
  const normalized = normalizeMarketSourceKey(dataset, source);
  if (!normalized) {
    return 'unknown';
  }

  const stack = MARKET_SOURCE_STACK[dataset];

  for (const [tier, sourceKey] of Object.entries(stack) as Array<[keyof MarketSourceStack, string]>) {
    if (sourceKey === normalized) {
      return tier;
    }
  }

  return 'unknown';
}

export function getMarketSourceSeverity(dataset: PipelineDatasetKey, source?: string): MarketSourceSeverity {
  const tier = getMarketSourceTier(dataset, source);

  switch (tier) {
    case 'primary':
    case 'secondary':
      return 'healthy';
    case 'tertiary':
      return 'warning';
    case 'persisted':
    case 'fallback':
      return 'critical';
    default:
      return 'warning';
  }
}

export function isMarketSourceDegraded(dataset: PipelineDatasetKey, source?: string) {
  const tier = getMarketSourceTier(dataset, source);
  return tier === 'tertiary' || tier === 'persisted' || tier === 'fallback' || tier === 'unknown';
}
