export const revalidate = 300;

import {
  FALLBACK_COMMODITY_QUOTES,
  fetchCommodityQuotesFromBestAvailable,
  persistCommodityQuotes,
  readLatestCommodityQuotes,
  shouldRefreshPersistedData,
} from '@/lib/marketIngestion';
import { isPremiumConfigured } from '@/lib/pipelineObservability';

export async function GET() {
  const persisted = await readLatestCommodityQuotes();
  const premiumConfigured = isPremiumConfigured('commodities');

  if (persisted && !shouldRefreshPersistedData('commodities', persisted.updatedAt)) {
    return Response.json({
      quotes: persisted.quotes,
      source: persisted.source,
      updatedAt: persisted.updatedAt,
      premiumConfigured,
    });
  }

  try {
    const fresh = await fetchCommodityQuotesFromBestAvailable({ persisted });

    if (fresh.source !== 'supabase-snapshot' && fresh.source !== 'fallback') {
      await persistCommodityQuotes({
        items: fresh.items,
        source: fresh.source,
        updatedAt: fresh.updatedAt,
      });
    }

    return Response.json({
      quotes: fresh.items,
      source: fresh.source,
      updatedAt: fresh.updatedAt,
      premiumConfigured,
    });
  } catch (error) {
    console.error('Failed to resolve commodities from multi-source stack:', error);

    if (persisted) {
      return Response.json({
        quotes: persisted.quotes,
        source: persisted.source,
        updatedAt: persisted.updatedAt,
        premiumConfigured,
      });
    }

    return Response.json({
      quotes: FALLBACK_COMMODITY_QUOTES,
      source: 'fallback',
      updatedAt: new Date().toISOString(),
      premiumConfigured,
    });
  }
}
