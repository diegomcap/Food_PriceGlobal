# Data Refresh Strategy

This project is moving from direct source fetches toward a persisted market-intelligence pipeline backed by Supabase.

## Datasets

| Dataset | Current Source | Target Storage | Cadence | Fresh | Stale | Delayed |
| --- | --- | --- | --- | --- | --- | --- |
| `fao_index` | FAO CSV | `fao_index_snapshots` | Daily poll | <= 45 days | <= 75 days | > 75 days |
| `commodities` | Barchart -> Trading Economics -> Yahoo Finance | `commodity_quote_snapshots` | Every 5 min | <= 30 min | <= 2 h | > 2 h |
| `macro_drivers` | Trading Economics -> Barchart -> Yahoo Finance | `macro_driver_snapshots` | Every 5 min | <= 30 min | <= 2 h | > 2 h |
| `market_news` | Google News RSS | `market_news_articles` | Every 30 min | <= 2 h | <= 12 h | > 12 h |
| `market_events` | Editorial / internal | `market_events` | Daily / manual | <= 7 days | <= 14 days | > 14 days |

## Pipeline Flow

1. Scheduled job starts in Supabase or Vercel Cron.
2. Job writes an `ingestion_runs` record with `status = running`.
3. Source payload is normalized and stored in the dataset table.
4. Job updates `ingestion_runs` with `success`, `partial`, or `failed`.
5. UI reads the latest persisted record, not the raw external source.
6. UI computes `fresh`, `stale`, `delayed`, or `fallback`.

## Recommended Jobs

- `fao_index`: daily at `07:00 UTC`
- `commodities`: every `5 minutes`
- `macro_drivers`: every `5 minutes`
- `market_news`: every `30 minutes`
- `market_events`: daily sync plus manual editorial updates

## UI Expectations

Each critical market block should display:

- source
- last successful update
- freshness status
- fallback state when active

## Next Integration Step

1. Add Supabase service-role ingestion functions.
2. Persist snapshots into the new tables.
3. Update app routes to read from Supabase first.
4. Use raw external fetch only as a backup path.

## Ingestion Endpoints

- `POST /api/internal/ingest/commodities`
- `POST /api/internal/ingest/macro-drivers`

Required headers:

- `Authorization: Bearer $MARKET_INGESTION_SECRET`
or
- `x-ingestion-secret: $MARKET_INGESTION_SECRET`

## Multi-Source Priority

- `commodities`: `Barchart -> Trading Economics -> Yahoo Finance -> Supabase snapshot -> local fallback`
- `macro drivers`: `Trading Economics -> Barchart -> Yahoo Finance -> Supabase snapshot -> local fallback`

Internal source keys persisted in Supabase:

- `commodities`: `barchart-commodities -> trading-economics-commodities -> yahoo-finance`
- `macro drivers`: `trading-economics-macro -> barchart-macro -> yahoo-finance-macro`

## Serving Rules

- Public market routes first reuse a fresh Supabase snapshot when it is still inside the refresh window.
- If refresh is due, routes try the external provider chain in priority order.
- If all live providers fail, routes serve `supabase-snapshot`.
- If no persisted snapshot exists, routes serve local `fallback`.
- Internal ingestion jobs only use live providers and never persist `supabase-snapshot` or `fallback` as new market data.
- Vercel cron should call the ingestion endpoints with `CRON_SECRET` and can share the same authorization path as manual ingestion.

## Required Environment Variables

- `BARCHART_API_KEY`
- `TRADING_ECONOMICS_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MARKET_INGESTION_SECRET`
- `CRON_SECRET`
