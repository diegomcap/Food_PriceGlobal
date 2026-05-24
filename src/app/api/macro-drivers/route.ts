export const revalidate = 300;

import {
  FALLBACK_MACRO_DRIVERS,
  fetchMacroDriversFromBestAvailable,
  persistMacroDrivers,
  readLatestMacroDrivers,
  shouldRefreshPersistedData,
} from '@/lib/marketIngestion';

export async function GET() {
  const persisted = await readLatestMacroDrivers();

  if (persisted && !shouldRefreshPersistedData('macro_drivers', persisted.updatedAt)) {
    return Response.json(persisted);
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
    });
  } catch (error) {
    console.error('Failed to resolve macro drivers from multi-source stack:', error);

    if (persisted) {
      return Response.json(persisted);
    }

    return Response.json({
      drivers: FALLBACK_MACRO_DRIVERS,
      source: 'fallback',
      updatedAt: new Date().toISOString(),
    });
  }
}
