insert into public.market_sources (
  source_key,
  source_name,
  dataset_key,
  cadence_minutes,
  stale_after_minutes,
  delayed_after_minutes
) values
  ('yahoo-finance', 'Yahoo Finance Spark API', 'commodities', 5, 30, 120),
  ('barchart-commodities', 'Barchart OnDemand Futures Quotes', 'commodities', 5, 30, 120),
  ('trading-economics-commodities', 'Trading Economics Markets API', 'commodities', 5, 30, 120),
  ('yahoo-finance-macro', 'Yahoo Finance Spark API', 'macro_drivers', 5, 30, 120),
  ('barchart-macro', 'Barchart OnDemand Markets API', 'macro_drivers', 5, 30, 120),
  ('trading-economics-macro', 'Trading Economics Markets API', 'macro_drivers', 5, 30, 120)
on conflict (source_key) do update set
  source_name = excluded.source_name,
  dataset_key = excluded.dataset_key,
  cadence_minutes = excluded.cadence_minutes,
  stale_after_minutes = excluded.stale_after_minutes,
  delayed_after_minutes = excluded.delayed_after_minutes,
  updated_at = now();
