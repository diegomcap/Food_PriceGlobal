import type { FreshnessStatus } from '@/lib/dataFreshness';
import type { MarketSourceSeverity, MarketSourceTier, PipelineDatasetKey } from '@/lib/marketSources';

export type IngestionRunStatus = 'running' | 'success' | 'partial' | 'failed';
export type PipelineHealth = 'healthy' | 'warning' | 'critical';
export type PipelineAlertKind = 'source_degraded' | 'run_failed' | 'freshness_delayed';

export type IngestionRunSummary = {
  id: string;
  datasetKey: PipelineDatasetKey;
  sourceKey: string;
  status: IngestionRunStatus;
  recordsIngested: number;
  fallbackUsed: boolean;
  sourceUpdatedAt?: string | null;
  startedAt: string;
  finishedAt?: string | null;
  errorMessage?: string | null;
};

export type PipelineAlert = {
  id: string;
  datasetKey: PipelineDatasetKey;
  kind: PipelineAlertKind;
  severity: PipelineHealth;
  sourceKey?: string;
  sourceTier?: MarketSourceTier;
  message?: string;
};

export type DatasetPipelineSnapshot = {
  datasetKey: PipelineDatasetKey;
  currentSource: string;
  currentSourceTier: MarketSourceTier;
  currentSourceSeverity: MarketSourceSeverity;
  updatedAt?: string;
  recordsAvailable: number;
  freshnessStatus: FreshnessStatus;
  refreshDue: boolean;
  premiumConfigured: boolean;
  latestRun: IngestionRunSummary | null;
  runStats24h: {
    success: number;
    failed: number;
    partial: number;
    running: number;
  };
};

export type PipelineObservabilityPayload = {
  generatedAt: string;
  overallStatus: PipelineHealth;
  datasets: DatasetPipelineSnapshot[];
  alerts: PipelineAlert[];
  recentRuns: IngestionRunSummary[];
};

export type PublicDatasetReliabilitySnapshot = {
  datasetKey: PipelineDatasetKey;
  reliabilityStatus: PipelineHealth;
  freshnessStatus: FreshnessStatus;
  updatedAt?: string;
  recordsAvailable: number;
  liveMode: 'primary' | 'secondary' | 'tertiary' | 'backup';
};

export type PublicPipelineStatusPayload = {
  generatedAt: string;
  overallStatus: PipelineHealth;
  datasets: PublicDatasetReliabilitySnapshot[];
};
