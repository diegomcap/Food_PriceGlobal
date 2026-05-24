import {
  fetchCommodityQuotesFromFreshSource,
  isIngestionAuthorized,
  persistCommodityQuotes,
} from '@/lib/marketIngestion';

export const dynamic = 'force-dynamic';

async function handleIngest(request: Request) {
  if (!isIngestionAuthorized(request)) {
    return Response.json({ error: 'Unauthorized ingestion request' }, { status: 401 });
  }

  try {
    const payload = await fetchCommodityQuotesFromFreshSource();
    const persisted = await persistCommodityQuotes({
      items: payload.items,
      source: payload.source,
      updatedAt: payload.updatedAt,
    });

    return Response.json({
      ok: true,
      persisted,
      records: payload.items.length,
      source: payload.source,
      updatedAt: payload.updatedAt,
    });
  } catch (error) {
    console.error('Commodities ingestion job failed:', error);
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown ingestion error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return handleIngest(request);
}

export async function POST(request: Request) {
  return handleIngest(request);
}
