'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Activity, AlertTriangle, CheckCircle2, Clock3, DatabaseZap, RefreshCw, ShieldAlert, Siren } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useTranslation } from '@/context/TranslationContext';
import { getFreshnessLabel, getFreshnessTone } from '@/lib/dataFreshness';
import { getSourceLabel } from '@/lib/marketOverview';
import type { SupportedLanguage } from '@/lib/marketTime';
import { formatDateTime } from '@/lib/marketTime';
import {
  getPipelineAlertTone,
  getPipelineDatasetLabel,
  getPipelineSourceAlert,
  getPipelineTierLabel,
} from '@/lib/pipelineStatus';
import type {
  IngestionRunSummary,
  PipelineHealth,
  PipelineObservabilityPayload,
} from '@/lib/pipelineObservabilityTypes';

const COPY = {
  pt: {
    back: '← Voltar',
    title: 'Status da Pipeline',
    subtitle: 'Observabilidade operacional da ingestao, serving e fallback dos datasets de mercado.',
    loading: 'Carregando observabilidade da pipeline...',
    fetchError: 'Nao foi possivel carregar o status da pipeline.',
    retry: 'Tentar novamente',
    overall: 'Status geral',
    updatedAt: 'Atualizado em',
    alerts: 'Alertas ativos',
    noAlerts: 'Nenhum alerta operacional ativo no momento.',
    datasets: 'Datasets monitorados',
    recentRuns: 'Ingestion runs recentes',
    noRuns: 'Nenhum ingestion run encontrado.',
    currentSource: 'Fonte atual',
    sourceTier: 'Tier atual',
    freshness: 'Freshness',
    records: 'Registros disponiveis',
    refreshDue: 'Refresh devido',
    premiumConfigured: 'Premium configurado',
    latestRun: 'Ultima ingestao',
    runs24h: 'Runs 24h',
    status: 'Status',
    startedAt: 'Inicio',
    finishedAt: 'Fim',
    recordsIngested: 'Registros',
    dataset: 'Dataset',
    source: 'Fonte',
    yes: 'Sim',
    no: 'Nao',
    runFailedTitle: (dataset: string) => `${dataset} com falha na ultima ingestao`,
    runFailedDetail: 'O ultimo ingestion run falhou. Revise o erro, o provider e a persistencia.',
    freshnessDelayedTitle: (dataset: string) => `${dataset} com atraso operacional`,
    freshnessDelayedDetail: 'A atualizacao esta alem da janela esperada e precisa de atencao imediata.',
    health: {
      healthy: 'Saudavel',
      warning: 'Atencao',
      critical: 'Critico',
    },
  },
  en: {
    back: '← Back',
    title: 'Pipeline Status',
    subtitle: 'Operational observability for ingestion, serving and fallback across market datasets.',
    loading: 'Loading pipeline observability...',
    fetchError: 'Unable to load pipeline status.',
    retry: 'Retry',
    overall: 'Overall status',
    updatedAt: 'Updated at',
    alerts: 'Active alerts',
    noAlerts: 'No active operational alerts right now.',
    datasets: 'Monitored datasets',
    recentRuns: 'Recent ingestion runs',
    noRuns: 'No ingestion runs found.',
    currentSource: 'Current source',
    sourceTier: 'Current tier',
    freshness: 'Freshness',
    records: 'Available records',
    refreshDue: 'Refresh due',
    premiumConfigured: 'Premium configured',
    latestRun: 'Latest ingestion',
    runs24h: 'Runs 24h',
    status: 'Status',
    startedAt: 'Started',
    finishedAt: 'Finished',
    recordsIngested: 'Records',
    dataset: 'Dataset',
    source: 'Source',
    yes: 'Yes',
    no: 'No',
    runFailedTitle: (dataset: string) => `${dataset} failed on the latest ingestion`,
    runFailedDetail: 'The latest ingestion run failed. Review the error, provider and persistence path.',
    freshnessDelayedTitle: (dataset: string) => `${dataset} is operationally delayed`,
    freshnessDelayedDetail: 'The latest update is beyond the expected window and needs immediate attention.',
    health: {
      healthy: 'Healthy',
      warning: 'Warning',
      critical: 'Critical',
    },
  },
  es: {
    back: '← Volver',
    title: 'Estado de la Pipeline',
    subtitle: 'Observabilidad operativa de la ingesta, serving y fallback de los datasets de mercado.',
    loading: 'Cargando observabilidad de la pipeline...',
    fetchError: 'No fue posible cargar el estado de la pipeline.',
    retry: 'Reintentar',
    overall: 'Estado general',
    updatedAt: 'Actualizado en',
    alerts: 'Alertas activas',
    noAlerts: 'No hay alertas operativas activas en este momento.',
    datasets: 'Datasets monitoreados',
    recentRuns: 'Ingestion runs recientes',
    noRuns: 'No se encontraron ingestion runs.',
    currentSource: 'Fuente actual',
    sourceTier: 'Tier actual',
    freshness: 'Freshness',
    records: 'Registros disponibles',
    refreshDue: 'Refresh vencido',
    premiumConfigured: 'Premium configurado',
    latestRun: 'Ultima ingesta',
    runs24h: 'Runs 24h',
    status: 'Estado',
    startedAt: 'Inicio',
    finishedAt: 'Fin',
    recordsIngested: 'Registros',
    dataset: 'Dataset',
    source: 'Fuente',
    yes: 'Si',
    no: 'No',
    runFailedTitle: (dataset: string) => `${dataset} fallo en la ultima ingesta`,
    runFailedDetail: 'La ultima ingestion fallo. Revise el error, el provider y la persistencia.',
    freshnessDelayedTitle: (dataset: string) => `${dataset} presenta retraso operativo`,
    freshnessDelayedDetail: 'La actualizacion excedio la ventana esperada y necesita atencion inmediata.',
    health: {
      healthy: 'Saludable',
      warning: 'Atencion',
      critical: 'Critico',
    },
  },
  ru: {
    back: '← Nazad',
    title: 'Status pipeline',
    subtitle: 'Operatsionnaya nablyudaemost ingest, serving i fallback po rynochnym datasetam.',
    loading: 'Zagruzhaem status pipeline...',
    fetchError: 'Ne udalos zagruzit status pipeline.',
    retry: 'Povtorit',
    overall: 'Obshchiy status',
    updatedAt: 'Obnovleno',
    alerts: 'Aktivnye alerty',
    noAlerts: 'Aktivnykh operatsionnykh alertov seychas net.',
    datasets: 'Nablyudaemye datasety',
    recentRuns: 'Poslednie ingestion runs',
    noRuns: 'Ingestion runs ne naydeny.',
    currentSource: 'Tekushchiy istochnik',
    sourceTier: 'Tekushchiy tier',
    freshness: 'Freshness',
    records: 'Dostupnye zapisi',
    refreshDue: 'Refresh prosrochen',
    premiumConfigured: 'Premium nastroen',
    latestRun: 'Poslednyaya ingestiya',
    runs24h: 'Runs 24h',
    status: 'Status',
    startedAt: 'Start',
    finishedAt: 'Finish',
    recordsIngested: 'Zapisi',
    dataset: 'Dataset',
    source: 'Istochnik',
    yes: 'Da',
    no: 'Net',
    runFailedTitle: (dataset: string) => `${dataset} sboi v posledney ingestii`,
    runFailedDetail: 'Posledniy ingestion run zavershilsya s oshibkoy. Proverte provider, oshibku i persist.',
    freshnessDelayedTitle: (dataset: string) => `${dataset} operatsionno zaderzhan`,
    freshnessDelayedDetail: 'Obnovlenie vyshlo za ozhidaemoe okno i trebuet srochnogo vnimaniya.',
    health: {
      healthy: 'Healthy',
      warning: 'Warning',
      critical: 'Critical',
    },
  },
  ar: {
    back: '← رجوع',
    title: 'حالة خط الانابيب',
    subtitle: 'مراقبة تشغيلية لادخال البيانات والتقديم والاحتياط لبيانات السوق.',
    loading: 'جار تحميل حالة خط الانابيب...',
    fetchError: 'تعذر تحميل حالة خط الانابيب.',
    retry: 'اعادة المحاولة',
    overall: 'الحالة العامة',
    updatedAt: 'تم التحديث',
    alerts: 'التنبيهات النشطة',
    noAlerts: 'لا توجد تنبيهات تشغيلية نشطة حاليا.',
    datasets: 'مجموعات البيانات المراقبة',
    recentRuns: 'عمليات الادخال الحديثة',
    noRuns: 'لا توجد عمليات ادخال.',
    currentSource: 'المصدر الحالي',
    sourceTier: 'الطبقة الحالية',
    freshness: 'الحداثة',
    records: 'السجلات المتاحة',
    refreshDue: 'التحديث مستحق',
    premiumConfigured: 'تم تهيئة premium',
    latestRun: 'اخر عملية ادخال',
    runs24h: 'العمليات خلال 24 ساعة',
    status: 'الحالة',
    startedAt: 'البداية',
    finishedAt: 'النهاية',
    recordsIngested: 'السجلات',
    dataset: 'مجموعة البيانات',
    source: 'المصدر',
    yes: 'نعم',
    no: 'لا',
    runFailedTitle: (dataset: string) => `${dataset} فشل في اخر عملية ادخال`,
    runFailedDetail: 'فشلت اخر عملية ادخال. راجع الخطأ والمزود ومسار الحفظ.',
    freshnessDelayedTitle: (dataset: string) => `${dataset} متأخر تشغيليا`,
    freshnessDelayedDetail: 'اخر تحديث تجاوز النافذة المتوقعة ويحتاج الى تدخل فوري.',
    health: {
      healthy: 'سليم',
      warning: 'تحذير',
      critical: 'حرج',
    },
  },
  zh: {
    back: '← 返回',
    title: 'Pipeline 状态',
    subtitle: '面向市场数据采集、服务与后备层的运行可观测性。',
    loading: '正在加载 pipeline 状态...',
    fetchError: '无法加载 pipeline 状态。',
    retry: '重试',
    overall: '整体状态',
    updatedAt: '更新时间',
    alerts: '活动告警',
    noAlerts: '当前没有活动中的运行告警。',
    datasets: '监控中的数据集',
    recentRuns: '最近 ingestion runs',
    noRuns: '未找到 ingestion runs。',
    currentSource: '当前来源',
    sourceTier: '当前层级',
    freshness: '新鲜度',
    records: '可用记录',
    refreshDue: '应刷新',
    premiumConfigured: 'Premium 已配置',
    latestRun: '最近一次采集',
    runs24h: '24 小时 runs',
    status: '状态',
    startedAt: '开始',
    finishedAt: '结束',
    recordsIngested: '记录',
    dataset: '数据集',
    source: '来源',
    yes: '是',
    no: '否',
    runFailedTitle: (dataset: string) => `${dataset} 最近一次采集失败`,
    runFailedDetail: '最近一次采集失败。请检查错误、provider 与持久化路径。',
    freshnessDelayedTitle: (dataset: string) => `${dataset} 运行已延迟`,
    freshnessDelayedDetail: '最新更新时间已经超过预期窗口，需要立即关注。',
    health: {
      healthy: '健康',
      warning: '警告',
      critical: '严重',
    },
  },
} as const;

function getHealthTone(status: PipelineHealth) {
  switch (status) {
    case 'healthy':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    case 'warning':
      return 'border-amber-200 bg-amber-50 text-amber-700';
    default:
      return 'border-red-200 bg-red-50 text-red-700';
  }
}

function formatRunWindow(run: IngestionRunSummary, language: SupportedLanguage) {
  const started = formatDateTime(new Date(run.startedAt), language);
  const finished = run.finishedAt ? formatDateTime(new Date(run.finishedAt), language) : '--';
  return { started, finished };
}

export default function PipelineStatusPage() {
  const { language } = useTranslation();
  const activeLanguage = (['pt', 'en', 'es', 'ru', 'ar', 'zh'].includes(language) ? language : 'en') as keyof typeof COPY;
  const copy = COPY[activeLanguage];
  const [payload, setPayload] = useState<PipelineObservabilityPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadStatus() {
    try {
      setError(null);
      const response = await fetch('/api/pipeline/status');
      if (!response.ok) {
        throw new Error(`Pipeline status request failed with ${response.status}`);
      }

      const json = (await response.json()) as PipelineObservabilityPayload;
      setPayload(json);
    } catch (requestError) {
      console.error('Unable to load pipeline status page:', requestError);
      setError(requestError instanceof Error ? requestError.message : copy.fetchError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const localizedAlerts = useMemo(() => {
    if (!payload) {
      return [];
    }

    return payload.alerts.map((alert) => {
      const datasetLabel = getPipelineDatasetLabel(alert.datasetKey, language as SupportedLanguage);

      if (alert.kind === 'source_degraded') {
        const sourceAlert = getPipelineSourceAlert(alert.datasetKey, alert.sourceKey, language as SupportedLanguage);
        return {
          ...alert,
          title: sourceAlert?.title ?? datasetLabel,
          detail: sourceAlert?.detail ?? getSourceLabel(alert.sourceKey ?? 'unknown', language as SupportedLanguage),
        };
      }

      if (alert.kind === 'run_failed') {
        return {
          ...alert,
          title: copy.runFailedTitle(datasetLabel),
          detail: alert.message ?? copy.runFailedDetail,
        };
      }

      return {
        ...alert,
        title: copy.freshnessDelayedTitle(datasetLabel),
        detail: copy.freshnessDelayedDetail,
      };
    });
  }, [copy, language, payload]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <Link href="/#analise-mercado" className="inline-block text-blue-600 hover:underline">
            {copy.back}
          </Link>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">{copy.title}</h1>
              <p className="mt-2 max-w-3xl text-slate-600">{copy.subtitle}</p>
            </div>
            {payload?.generatedAt && (
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
                <RefreshCw className="h-4 w-4" />
                {copy.updatedAt}: {formatDateTime(new Date(payload.generatedAt), language as SupportedLanguage)}
              </div>
            )}
          </div>
        </div>

        {loading && !payload ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">{copy.loading}</div>
        ) : error && !payload ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
            <p className="font-semibold">{copy.fetchError}</p>
            <p className="mt-2 text-sm opacity-90">{error}</p>
            <button
              onClick={loadStatus}
              className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm"
            >
              {copy.retry}
            </button>
          </div>
        ) : (
          <>
            {payload && (
              <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{copy.overall}</p>
                    <div className={`mt-3 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${getHealthTone(payload.overallStatus)}`}>
                      {payload.overallStatus === 'healthy' ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : payload.overallStatus === 'warning' ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        <Siren className="h-4 w-4" />
                      )}
                      {copy.health[payload.overallStatus]}
                    </div>
                  </div>
                  <div className="text-sm text-slate-500">
                    {payload.datasets.length} datasets | {payload.alerts.length} alerts
                  </div>
                </div>
              </div>
            )}

            {payload && (
              <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-slate-700" />
                  <h2 className="text-xl font-bold text-slate-900">{copy.alerts}</h2>
                </div>
                {localizedAlerts.length === 0 ? (
                  <p className="text-sm text-slate-500">{copy.noAlerts}</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {localizedAlerts.map((alert) => {
                      const Icon = alert.severity === 'critical' ? Siren : AlertTriangle;
                      return (
                        <article key={alert.id} className={`rounded-2xl border p-4 ${getPipelineAlertTone(alert.severity as 'warning' | 'critical')}`}>
                          <div className="flex items-start gap-3">
                            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                            <div>
                              <p className="text-sm font-semibold">{alert.title}</p>
                              <p className="mt-1 text-xs leading-5 opacity-90">{alert.detail}</p>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {payload && (
              <div className="mb-10">
                <div className="mb-5 flex items-center gap-2">
                  <DatabaseZap className="h-5 w-5 text-slate-700" />
                  <h2 className="text-xl font-bold text-slate-900">{copy.datasets}</h2>
                </div>
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                  {payload.datasets.map((dataset) => {
                    const freshnessTone = getFreshnessTone(dataset.freshnessStatus);
                    const latestRunTimes = dataset.latestRun
                      ? formatRunWindow(dataset.latestRun, language as SupportedLanguage)
                      : null;

                    return (
                      <article key={dataset.datasetKey} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">
                              {getPipelineDatasetLabel(dataset.datasetKey, language as SupportedLanguage)}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                              {copy.currentSource}: {getSourceLabel(dataset.currentSource, language as SupportedLanguage)}
                            </p>
                          </div>
                          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${getHealthTone(dataset.currentSourceSeverity === 'healthy' ? 'healthy' : dataset.currentSourceSeverity === 'warning' ? 'warning' : 'critical')}`}>
                            <Activity className="h-3.5 w-3.5" />
                            {getPipelineTierLabel(dataset.currentSourceTier, language as SupportedLanguage)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{copy.freshness}</p>
                            <div className="mt-2 flex items-center gap-2">
                              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${freshnessTone}`}>
                                {getFreshnessLabel(dataset.freshnessStatus, language as SupportedLanguage)}
                              </span>
                            </div>
                            <p className="mt-3 text-sm text-slate-600">
                              {dataset.updatedAt
                                ? formatDateTime(new Date(dataset.updatedAt), language as SupportedLanguage)
                                : '--'}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{copy.records}</p>
                            <p className="mt-2 text-3xl font-black text-slate-900">{dataset.recordsAvailable}</p>
                            <p className="mt-3 text-sm text-slate-600">
                              {copy.refreshDue}: {dataset.refreshDue ? copy.yes : copy.no}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{copy.premiumConfigured}</p>
                            <p className="mt-2 text-lg font-bold text-slate-900">
                              {dataset.premiumConfigured ? copy.yes : copy.no}
                            </p>
                            <p className="mt-3 text-sm text-slate-600">
                              {copy.sourceTier}: {getPipelineTierLabel(dataset.currentSourceTier, language as SupportedLanguage)}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{copy.runs24h}</p>
                            <p className="mt-2 text-sm text-slate-700">
                              success {dataset.runStats24h.success} | failed {dataset.runStats24h.failed}
                            </p>
                            <p className="mt-1 text-sm text-slate-700">
                              partial {dataset.runStats24h.partial} | running {dataset.runStats24h.running}
                            </p>
                          </div>
                        </div>

                        {dataset.latestRun && latestRunTimes && (
                          <div className="mt-5 rounded-2xl border border-slate-200 p-4">
                            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                              <Clock3 className="h-4 w-4" />
                              {copy.latestRun}
                            </div>
                            <div className="grid grid-cols-1 gap-3 text-sm text-slate-600 md:grid-cols-2">
                              <p>{copy.status}: {dataset.latestRun.status}</p>
                              <p>{copy.source}: {getSourceLabel(dataset.latestRun.sourceKey, language as SupportedLanguage)}</p>
                              <p>{copy.startedAt}: {latestRunTimes.started}</p>
                              <p>{copy.finishedAt}: {latestRunTimes.finished}</p>
                              <p>{copy.recordsIngested}: {dataset.latestRun.recordsIngested}</p>
                            </div>
                            {dataset.latestRun.errorMessage && (
                              <p className="mt-3 rounded-xl bg-red-50 p-3 text-xs text-red-700">{dataset.latestRun.errorMessage}</p>
                            )}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            )}

            {payload && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-slate-700" />
                  <h2 className="text-xl font-bold text-slate-900">{copy.recentRuns}</h2>
                </div>
                {payload.recentRuns.length === 0 ? (
                  <p className="text-sm text-slate-500">{copy.noRuns}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="border-b border-slate-200 text-slate-500">
                        <tr>
                          <th className="px-3 py-3 font-semibold">{copy.dataset}</th>
                          <th className="px-3 py-3 font-semibold">{copy.source}</th>
                          <th className="px-3 py-3 font-semibold">{copy.status}</th>
                          <th className="px-3 py-3 font-semibold">{copy.recordsIngested}</th>
                          <th className="px-3 py-3 font-semibold">{copy.startedAt}</th>
                          <th className="px-3 py-3 font-semibold">{copy.finishedAt}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {payload.recentRuns.map((run) => {
                          const runTimes = formatRunWindow(run, language as SupportedLanguage);
                          return (
                            <tr key={run.id}>
                              <td className="px-3 py-3 text-slate-700">
                                {getPipelineDatasetLabel(run.datasetKey, language as SupportedLanguage)}
                              </td>
                              <td className="px-3 py-3 text-slate-700">
                                {getSourceLabel(run.sourceKey, language as SupportedLanguage)}
                              </td>
                              <td className="px-3 py-3">
                                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${run.status === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : run.status === 'failed' ? 'border-red-200 bg-red-50 text-red-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
                                  {run.status === 'success' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                                  {run.status}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-slate-700">{run.recordsIngested}</td>
                              <td className="px-3 py-3 text-slate-700">{runTimes.started}</td>
                              <td className="px-3 py-3 text-slate-700">{runTimes.finished}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
