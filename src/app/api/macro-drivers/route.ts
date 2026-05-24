export const revalidate = 300;

import {
  FALLBACK_MACRO_DRIVERS,
  fetchMacroDriversFromBestAvailable,
  persistMacroDrivers,
  readLatestMacroDrivers,
  shouldRefreshPersistedData,
} from '@/lib/marketIngestion';
import { isPremiumConfigured } from '@/lib/pipelineObservability';

export async function GET() {
  const persisted = await readLatestMacroDrivers();
  const premiumConfigured = isPremiumConfigured('macro_drivers');

  if (persisted && !shouldRefreshPersistedData('macro_drivers', persisted.updatedAt)) {
    return Response.json({
      drivers: persisted.drivers,
      source: persisted.source,
      updatedAt: persisted.updatedAt,
      premiumConfigured,
    });
  }

  try {
    const fresh = await fetchMacroDriversFromBestAvailable({ persisted });

    if (fresh.source !== 'supabase-snapshot' && fresh.source !== 'fallback') {
      await persistMacroDrivers({
        items: fresh.items,
        source: fresh.source,
        updatedAt: fresh.updatedAt,
      });
    }

    return Response.json({
      drivers: fresh.items,
      source: fresh.source,
      updatedAt: fresh.updatedAt,
      premiumConfigured,
    });
  } catch (error) {
    console.error('Failed to resolve macro drivers from multi-source stack:', error);

    if (persisted) {
      return Response.json({
        drivers: persisted.drivers,
        source: persisted.source,
        updatedAt: persisted.updatedAt,
        premiumConfigured,
      });
    }

    return Response.json({
      drivers: FALLBACK_MACRO_DRIVERS,
      source: 'fallback',
      updatedAt: new Date().toISOString(),
      premiumConfigured,
    });
  }
}
