'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, RefreshCw, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useTranslation } from '@/context/TranslationContext';
import { getFreshnessLabel, getFreshnessTone } from '@/lib/dataFreshness';
import { formatDateTime, type SupportedLanguage } from '@/lib/marketTime';
import { getPipelineDatasetLabel } from '@/lib/pipelineStatus';
import type { PipelineHealth, PublicPipelineStatusPayload } from '@/lib/pipelineObservabilityTypes';

const COPY = {
  pt: {
    back: '← Voltar',
    title: 'Confiabilidade dos Dados',
    subtitle: 'Monitoramos continuamente a atualizacao e a disponibilidade das principais leituras de mercado exibidas no produto.',
    loading: 'Carregando status publico de confiabilidade...',
    fetchError: 'Nao foi possivel carregar o status publico de confiabilidade.',
    retry: 'Tentar novamente',
    overall: 'Status geral',
    updatedAt: 'Atualizado em',
    datasets: 'Datasets monitorados',
    records: 'Registros disponiveis',
    freshness: 'Atualizacao',
    liveMode: 'Modo de operacao',
    monitored: 'Monitoramento continuo ativo',
    health: {
      healthy: 'Saudavel',
      warning: 'Monitorado',
      critical: 'Atencao',
    },
    mode: {
      primary: 'Feed principal ativo',
      secondary: 'Feed redundante ativo',
      tertiary: 'Feed de mercado alternativo ativo',
      backup: 'Camada de continuidade ativa',
    },
  },
  en: {
    back: '← Back',
    title: 'Data Reliability',
    subtitle: 'We continuously monitor update cadence and availability for the main market readings shown in the product.',
    loading: 'Loading public reliability status...',
    fetchError: 'Unable to load public reliability status.',
    retry: 'Retry',
    overall: 'Overall status',
    updatedAt: 'Updated at',
    datasets: 'Monitored datasets',
    records: 'Available records',
    freshness: 'Freshness',
    liveMode: 'Operating mode',
    monitored: 'Continuous monitoring active',
    health: {
      healthy: 'Healthy',
      warning: 'Monitored',
      critical: 'Attention',
    },
    mode: {
      primary: 'Primary feed active',
      secondary: 'Redundant feed active',
      tertiary: 'Alternative market feed active',
      backup: 'Continuity layer active',
    },
  },
  es: {
    back: '← Volver',
    title: 'Confiabilidad de los Datos',
    subtitle: 'Monitoreamos continuamente la actualizacion y la disponibilidad de las principales lecturas de mercado del producto.',
    loading: 'Cargando estado publico de confiabilidad...',
    fetchError: 'No fue posible cargar el estado publico de confiabilidad.',
    retry: 'Reintentar',
    overall: 'Estado general',
    updatedAt: 'Actualizado en',
    datasets: 'Datasets monitoreados',
    records: 'Registros disponibles',
    freshness: 'Actualizacion',
    liveMode: 'Modo de operacion',
    monitored: 'Monitoreo continuo activo',
    health: {
      healthy: 'Saludable',
      warning: 'Monitoreado',
      critical: 'Atencion',
    },
    mode: {
      primary: 'Feed principal activo',
      secondary: 'Feed redundante activo',
      tertiary: 'Feed alternativo activo',
      backup: 'Capa de continuidad activa',
    },
  },
  ru: {
    back: '← Nazad',
    title: 'Nadezhnost Dannykh',
    subtitle: 'My nepreryvno monitorim aktualnost i dostupnost klyuchevykh rynochnykh dannykh, pokazyvaemykh v produkte.',
    loading: 'Zagruzhaem publichnyy status nadezhnosti...',
    fetchError: 'Ne udalos zagruzit publichnyy status nadezhnosti.',
    retry: 'Povtorit',
    overall: 'Obshchiy status',
    updatedAt: 'Obnovleno',
    datasets: 'Monitorimye datasety',
    records: 'Dostupnye zapisi',
    freshness: 'Aktualnost',
    liveMode: 'Rezhim raboty',
    monitored: 'Nepreryvnyy monitoring aktiven',
    health: {
      healthy: 'Zdorovo',
      warning: 'Pod nablyudeniem',
      critical: 'Vnimanie',
    },
    mode: {
      primary: 'Osnovnoy feed aktiven',
      secondary: 'Rezervnyy feed aktiven',
      tertiary: 'Alternativnyy rynochnyy feed aktiven',
      backup: 'Sloy nepreryvnosti aktiven',
    },
  },
  ar: {
    back: '← رجوع',
    title: 'موثوقية البيانات',
    subtitle: 'نراقب بشكل مستمر حداثة البيانات وتوافر القراءات السوقية الرئيسية المعروضة في المنتج.',
    loading: 'جار تحميل حالة الموثوقية العامة...',
    fetchError: 'تعذر تحميل حالة الموثوقية العامة.',
    retry: 'إعادة المحاولة',
    overall: 'الحالة العامة',
    updatedAt: 'آخر تحديث',
    datasets: 'مجموعات البيانات المراقبة',
    records: 'السجلات المتاحة',
    freshness: 'حداثة البيانات',
    liveMode: 'وضع التشغيل',
    monitored: 'المراقبة المستمرة مفعلة',
    health: {
      healthy: 'سليم',
      warning: 'تحت المراقبة',
      critical: 'انتباه',
    },
    mode: {
      primary: 'المصدر الرئيسي نشط',
      secondary: 'المصدر الاحتياطي نشط',
      tertiary: 'مصدر سوق بديل نشط',
      backup: 'طبقة الاستمرارية نشطة',
    },
  },
  zh: {
    back: '← 返回',
    title: '数据可靠性',
    subtitle: '我们持续监控产品中核心市场数据的更新频率、时效性与可用性。',
    loading: '正在加载公开可靠性状态...',
    fetchError: '无法加载公开可靠性状态。',
    retry: '重试',
    overall: '总体状态',
    updatedAt: '更新时间',
    datasets: '监控中的数据集',
    records: '可用记录',
    freshness: '数据时效',
    liveMode: '运行模式',
    monitored: '持续监控已启用',
    health: {
      healthy: '健康',
      warning: '监控中',
      critical: '注意',
    },
    mode: {
      primary: '主数据源运行中',
      secondary: '冗余数据源运行中',
      tertiary: '替代市场数据源运行中',
      backup: '连续性保障层运行中',
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

function getHealthIcon(status: PipelineHealth) {
  switch (status) {
    case 'healthy':
      return ShieldCheck;
    case 'warning':
      return ShieldAlert;
    default:
      return ShieldX;
  }
}

export default function PipelineStatusPage() {
  const { language } = useTranslation();
  const activeLanguage = (['pt', 'en', 'es', 'ru', 'ar', 'zh'].includes(language) ? language : 'en') as keyof typeof COPY;
  const copy = COPY[activeLanguage];
  const [payload, setPayload] = useState<PublicPipelineStatusPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadStatus() {
    try {
      setError(null);
      const response = await fetch('/api/pipeline/status');
      if (!response.ok) {
        throw new Error(`Pipeline status request failed with ${response.status}`);
      }

      const json = (await response.json()) as PublicPipelineStatusPayload;
      setPayload(json);
    } catch (requestError) {
      console.error('Unable to load public pipeline status page:', requestError);
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
                      {(() => {
                        const Icon = getHealthIcon(payload.overallStatus);
                        return <Icon className="h-4 w-4" />;
                      })()}
                      {copy.health[payload.overallStatus]}
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {copy.monitored}
                  </div>
                </div>
              </div>
            )}

            {payload && (
              <div>
                <div className="mb-5 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-slate-700" />
                  <h2 className="text-xl font-bold text-slate-900">{copy.datasets}</h2>
                </div>
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                  {payload.datasets.map((dataset) => (
                    <article key={dataset.datasetKey} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">
                            {getPipelineDatasetLabel(dataset.datasetKey, language as SupportedLanguage)}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">{copy.mode[dataset.liveMode]}</p>
                        </div>
                        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getHealthTone(dataset.reliabilityStatus)}`}>
                          {copy.health[dataset.reliabilityStatus]}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{copy.freshness}</p>
                          <span className={`mt-2 inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getFreshnessTone(dataset.freshnessStatus)}`}>
                            {getFreshnessLabel(dataset.freshnessStatus, language as SupportedLanguage)}
                          </span>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{copy.records}</p>
                          <p className="mt-2 text-3xl font-black text-slate-900">{dataset.recordsAvailable}</p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{copy.updatedAt}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-700">
                            {dataset.updatedAt
                              ? formatDateTime(new Date(dataset.updatedAt), language as SupportedLanguage)
                              : '--'}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
