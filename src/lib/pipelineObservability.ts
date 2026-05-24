import 'server-only';

import { getFreshnessStatus, isRefreshDue } from '@/lib/dataFreshness';
import {
  getMarketSourceSeverity,
  getMarketSourceTier,
  type PipelineDatasetKey,
} from '@/lib/marketSources';
import {
  readLatestCommodityQuotes,
  readLatestMacroDrivers,
} from '@/lib/marketIngestion';
import type {
  DatasetPipelineSnapshot,
  IngestionRunSummary,
  PipelineAlert,
  PipelineHealth,
  PipelineObservabilityPayload,
} from '@/lib/pipelineObservabilityTypes';
import { getSupabaseAdmin } from '@/lib/supabase/server';

const OBSERVED_DATASETS: PipelineDatasetKey[] = ['commodities', 'macro_drivers'];

function isPremiumConfigured(dataset: PipelineDatasetKey) {
  if (dataset === 'commodities' || dataset === 'macro_drivers') {
    return Boolean(process.env.BARCHART_API_KEY) || Boolean(process.env.TRADING_ECONOMICS_API_KEY);
  }

  return false;
}

function mapRunRow(row: any): IngestionRunSummary {
  return {
    id: row.id,
    datasetKey: row.dataset_key,
    sourceKey: row.source_key,
    status: row.status,
    recordsIngested: row.records_ingested,
    fallbackUsed: row.fallback_used,
    sourceUpdatedAt: row.source_updated_at,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    errorMessage: row.error_message,
  };
}

async function readRecentIngestionRuns(limit = 60) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return [] as IngestionRunSummary[];
  }

  const { data, error } = await supabase
    .from('ingestion_runs')
    .select(
      'id, dataset_key, source_key, status, records_ingested, fallback_used, source_updated_at, started_at, finished_at, error_message'
    )
    .in('dataset_key', OBSERVED_DATASETS)
    .order('started_at', { ascending: false })
    .limit(limit);

  if (error || !data) {
    if (error) {
      console.error('Unable to read ingestion runs from Supabase:', error);
    }
    return [];
  }

  return data.map(mapRunRow);
}

function getRunStats24h(runs: IngestionRunSummary[]) {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;

  return runs
    .filter((run) => new Date(run.startedAt).getTime() >= cutoff)
    .reduce(
      (acc, run) => {
        acc[run.status] += 1;
        return acc;
      },
      { success: 0, failed: 0, partial: 0, running: 0 }
    );
}

async function buildDatasetSnapshot(
  datasetKey: PipelineDatasetKey,
  runs: IngestionRunSummary[]
): Promise<DatasetPipelineSnapshot> {
  const datasetRuns = runs.filter((run) => run.datasetKey === datasetKey);
  const latestRun = datasetRuns[0] ?? null;

  if (datasetKey === 'commodities') {
    const latest = await readLatestCommodityQuotes();
    const currentSource = latest?.source ?? latestRun?.sourceKey ?? 'unknown';
    const updatedAt = latest?.updatedAt ?? latestRun?.sourceUpdatedAt ?? undefined;

    return {
      datasetKey,
      currentSource,
      currentSourceTier: getMarketSourceTier(datasetKey, currentSource),
      currentSourceSeverity: getMarketSourceSeverity(datasetKey, currentSource),
      updatedAt,
      recordsAvailable: latest?.quotes.length ?? 0,
      freshnessStatus: getFreshnessStatus(datasetKey, updatedAt, currentSource),
      refreshDue: isRefreshDue(datasetKey, updatedAt),
      premiumConfigured: isPremiumConfigured(datasetKey),
      latestRun,
      runStats24h: getRunStats24h(datasetRuns),
    };
  }

  const latest = await readLatestMacroDrivers();
  const currentSource = latest?.source ?? latestRun?.sourceKey ?? 'unknown';
  const updatedAt = latest?.updatedAt ?? latestRun?.sourceUpdatedAt ?? undefined;

  return {
    datasetKey,
    currentSource,
    currentSourceTier: getMarketSourceTier(datasetKey, currentSource),
    currentSourceSeverity: getMarketSourceSeverity(datasetKey, currentSource),
    updatedAt,
    recordsAvailable: latest?.drivers.length ?? 0,
    freshnessStatus: getFreshnessStatus(datasetKey, updatedAt, currentSource),
    refreshDue: isRefreshDue(datasetKey, updatedAt),
    premiumConfigured: isPremiumConfigured(datasetKey),
    latestRun,
    runStats24h: getRunStats24h(datasetRuns),
  };
}

function buildAlerts(datasets: DatasetPipelineSnapshot[]) {
  const alerts: PipelineAlert[] = [];

  for (const dataset of datasets) {
    if (
      dataset.currentSourceTier === 'tertiary' ||
      dataset.currentSourceTier === 'persisted' ||
      dataset.currentSourceTier === 'fallback'
    ) {
      alerts.push({
        id: `${dataset.datasetKey}-source`,
        datasetKey: dataset.datasetKey,
        kind: 'source_degraded',
        severity: dataset.currentSourceTier === 'tertiary' ? 'warning' : 'critical',
        sourceKey: dataset.currentSource,
        sourceTier: dataset.currentSourceTier,
      });
    }

    if (dataset.latestRun?.status === 'failed') {
      alerts.push({
        id: `${dataset.datasetKey}-failed-run`,
        datasetKey: dataset.datasetKey,
        kind: 'run_failed',
        severity: 'critical',
        sourceKey: dataset.latestRun.sourceKey,
        sourceTier: dataset.currentSourceTier,
        message: dataset.latestRun.errorMessage ?? undefined,
      });
    }

    if (dataset.freshnessStatus === 'delayed') {
      alerts.push({
        id: `${dataset.datasetKey}-freshness`,
        datasetKey: dataset.datasetKey,
        kind: 'freshness_delayed',
        severity: 'critical',
        sourceKey: dataset.currentSource,
        sourceTier: dataset.currentSourceTier,
      });
    }
  }

  return alerts;
}

function resolveOverallStatus(alerts: PipelineAlert[], datasets: DatasetPipelineSnapshot[]): PipelineHealth {
  if (
    alerts.some((alert) => alert.severity === 'critical') ||
    datasets.some((dataset) => dataset.latestRun?.status === 'failed')
  ) {
    return 'critical';
  }

  if (alerts.length > 0 || datasets.some((dataset) => dataset.freshnessStatus === 'stale')) {
    return 'warning';
  }

  return 'healthy';
}

export async function getPipelineObservabilityPayload(): Promise<PipelineObservabilityPayload> {
  const recentRuns = await readRecentIngestionRuns();
  const datasets = await Promise.all(OBSERVED_DATASETS.map((dataset) => buildDatasetSnapshot(dataset, recentRuns)));
  const alerts = buildAlerts(datasets);

  return {
    generatedAt: new Date().toISOString(),
    overallStatus: resolveOverallStatus(alerts, datasets),
    datasets,
    alerts,
    recentRuns,
  };
}
