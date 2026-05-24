create extension if not exists pgcrypto;

create table if not exists public.market_sources (
  id uuid primary key default gen_random_uuid(),
  source_key text not null unique,
  source_name text not null,
  dataset_key text not null,
  cadence_minutes integer not null,
  stale_after_minutes integer not null,
  delayed_after_minutes integer not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint market_sources_dataset_key_check
    check (dataset_key in ('fao_index', 'commodities', 'macro_drivers', 'market_news', 'market_events'))
);

create table if not exists public.ingestion_runs (
  id uuid primary key default gen_random_uuid(),
  dataset_key text not null,
  source_key text not null,
  status text not null,
  records_ingested integer not null default 0,
  fallback_used boolean not null default false,
  source_updated_at timestamptz,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  constraint ingestion_runs_dataset_key_check
    check (dataset_key in ('fao_index', 'commodities', 'macro_drivers', 'market_news', 'market_events')),
  constraint ingestion_runs_status_check
    check (status in ('running', 'success', 'partial', 'failed')),
  constraint ingestion_runs_source_key_fkey
    foreign key (source_key) references public.market_sources (source_key)
);

create index if not exists ingestion_runs_dataset_started_idx
  on public.ingestion_runs (dataset_key, started_at desc);

create table if not exists public.fao_index_snapshots (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references public.ingestion_runs (id) on delete set null,
  source_key text not null references public.market_sources (source_key),
  reference_month date not null,
  food numeric(10,2) not null,
  meat numeric(10,2) not null,
  dairy numeric(10,2) not null,
  cereals numeric(10,2) not null,
  oils numeric(10,2) not null,
  sugar numeric(10,2) not null,
  source_published_at timestamptz,
  ingested_at timestamptz not null default now(),
  unique (source_key, reference_month)
);

create index if not exists fao_index_snapshots_reference_month_idx
  on public.fao_index_snapshots (reference_month desc);

create table if not exists public.commodity_quote_snapshots (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references public.ingestion_runs (id) on delete set null,
  source_key text not null references public.market_sources (source_key),
  symbol text not null,
  price numeric(18,6) not null,
  previous_close numeric(18,6) not null,
  currency text default 'USD',
  unit text,
  market text,
  source_updated_at timestamptz,
  ingested_at timestamptz not null default now()
);

create index if not exists commodity_quote_snapshots_symbol_ingested_idx
  on public.commodity_quote_snapshots (symbol, ingested_at desc);

create table if not exists public.macro_driver_snapshots (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references public.ingestion_runs (id) on delete set null,
  source_key text not null references public.market_sources (source_key),
  symbol text not null,
  label text not null,
  price numeric(18,6) not null,
  previous_close numeric(18,6) not null,
  unit text,
  source_updated_at timestamptz,
  ingested_at timestamptz not null default now()
);

create index if not exists macro_driver_snapshots_symbol_ingested_idx
  on public.macro_driver_snapshots (symbol, ingested_at desc);

create table if not exists public.market_news_articles (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references public.ingestion_runs (id) on delete set null,
  source_key text not null references public.market_sources (source_key),
  language text not null,
  query_key text not null,
  title text not null,
  link text not null,
  source_name text,
  summary text,
  image_url text,
  published_at timestamptz,
  ingested_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  unique (language, link)
);

create index if not exists market_news_articles_language_ingested_idx
  on public.market_news_articles (language, ingested_at desc);

create table if not exists public.market_events (
  id uuid primary key default gen_random_uuid(),
  source_key text not null references public.market_sources (source_key),
  event_key text not null,
  title text not null,
  description text,
  location text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  event_type text not null default 'market',
  status text not null default 'scheduled',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_key, event_key)
);

create index if not exists market_events_starts_at_idx
  on public.market_events (starts_at asc);

create or replace view public.latest_commodity_quotes as
select distinct on (symbol)
  symbol,
  source_key,
  price,
  previous_close,
  currency,
  unit,
  market,
  source_updated_at,
  ingested_at
from public.commodity_quote_snapshots
order by symbol, ingested_at desc;

create or replace view public.latest_macro_driver_quotes as
select distinct on (symbol)
  symbol,
  source_key,
  label,
  price,
  previous_close,
  unit,
  source_updated_at,
  ingested_at
from public.macro_driver_snapshots
order by symbol, ingested_at desc;

create or replace view public.latest_fao_index_snapshot as
select
  source_key,
  reference_month,
  food,
  meat,
  dairy,
  cereals,
  oils,
  sugar,
  source_published_at,
  ingested_at
from public.fao_index_snapshots
order by reference_month desc
limit 1;

insert into public.market_sources (
  source_key,
  source_name,
  dataset_key,
  cadence_minutes,
  stale_after_minutes,
  delayed_after_minutes
) values
  ('fao-csv', 'FAO Food Price Index CSV', 'fao_index', 1440, 64800, 108000),
  ('yahoo-finance', 'Yahoo Finance Spark API', 'commodities', 5, 30, 120),
  ('yahoo-finance-macro', 'Yahoo Finance Spark API', 'macro_drivers', 5, 30, 120),
  ('google-news-rss', 'Google News RSS', 'market_news', 30, 120, 720),
  ('editorial-calendar', 'Editorial Managed Calendar', 'market_events', 1440, 10080, 20160)
on conflict (source_key) do update set
  source_name = excluded.source_name,
  dataset_key = excluded.dataset_key,
  cadence_minutes = excluded.cadence_minutes,
  stale_after_minutes = excluded.stale_after_minutes,
  delayed_after_minutes = excluded.delayed_after_minutes,
  updated_at = now();
