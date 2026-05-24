# Vercel Market Pipeline

This project is ready to run the persisted market pipeline on Vercel with branch-based staging and production deployments.

## Branch Strategy

- `staging` -> Preview deployment
- `main` -> Production deployment

## Required Environment Variables

Add these in Vercel Project Settings -> Environment Variables.

### Required in Preview and Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://smcbwelnugbubokzsumt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
MARKET_INGESTION_SECRET=your-long-random-secret
CRON_SECRET=your-vercel-cron-secret
```

### Optional Premium Providers

Leave these empty until the provider contracts are active.

```env
BARCHART_API_KEY=
TRADING_ECONOMICS_API_KEY=
```

## Cron Configuration

The project already contains `vercel.json` with the active schedules:

```json
{
  "crons": [
    {
      "path": "/api/internal/ingest/commodities",
      "schedule": "*/5 * * * *"
    },
    {
      "path": "/api/internal/ingest/macro-drivers",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

The ingestion routes accept `GET` with `Authorization: Bearer $CRON_SECRET`, which matches the Vercel Cron execution model.

## Validation Flow

After deploying `staging`, validate:

```bash
curl -i https://<preview-domain>/api/internal/ingest/commodities \
  -H "Authorization: Bearer $CRON_SECRET"

curl -i https://<preview-domain>/api/internal/ingest/macro-drivers \
  -H "Authorization: Bearer $CRON_SECRET"

curl https://<preview-domain>/api/commodities
curl https://<preview-domain>/api/macro-drivers
```

Expected ingestion response shape:

```json
{
  "ok": true,
  "persisted": true,
  "records": 13,
  "source": "yahoo-finance",
  "updatedAt": "2026-05-24T12:52:09.809Z"
}
```

Expected public route shape:

```json
{
  "quotes": [],
  "source": "yahoo-finance",
  "updatedAt": "2026-05-24T12:52:09.809Z"
}
```

For `macro-drivers`, the expected active source without premium keys is also `yahoo-finance`.

## Current Runtime Outcome

With only Supabase and ingestion secrets configured:

- `commodities` persists from `yahoo-finance`
- `macro_drivers` persists from `yahoo-finance`
- Supabase snapshot serving is active
- local fallback remains available only for contingency

## Production Promotion

Promote to `main` only after:

- Preview ingestion returns `persisted: true`
- Preview public routes expose `source` and `updatedAt`
- Supabase `ingestion_runs` records show `success`
- Commodity and macro snapshots are present in the latest views

## Vercel Access

If you want direct CLI validation from this machine, the repo still needs:

- Vercel CLI installed or runnable non-interactively
- a logged-in Vercel session or a `VERCEL_TOKEN`
- a linked local project directory (`.vercel/project.json`) or explicit project scope
