'use client';

import { Clock3, DatabaseZap } from 'lucide-react';
import { formatDateTime, type SupportedLanguage } from '@/lib/marketTime';
import {
  getFreshnessLabel,
  getFreshnessMeta,
  getFreshnessStatus,
  getFreshnessTone,
  type DatasetKey,
} from '@/lib/dataFreshness';

type Props = {
  dataset: DatasetKey;
  updatedAt?: string;
  source?: string;
  language: SupportedLanguage;
  theme?: 'light' | 'dark';
  compact?: boolean;
};

export default function DataFreshnessBadge({
  dataset,
  updatedAt,
  source,
  language,
  theme = 'light',
  compact = false,
}: Props) {
  const status = getFreshnessStatus(dataset, updatedAt, source);
  const tone = getFreshnessTone(status);
  const meta = getFreshnessMeta(dataset, source, language);
  const dateText = updatedAt ? formatDateTime(new Date(updatedAt), language) : '--';
  const textTone = theme === 'dark' ? 'text-slate-300' : 'text-slate-500';
  const wrapperTone = theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200';

  return (
    <div className={`rounded-2xl border ${wrapperTone} ${compact ? 'px-3 py-2' : 'px-4 py-3'}`}>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${tone}`}>
          {getFreshnessLabel(status, language)}
        </span>
      </div>
      <div className={`flex flex-wrap items-center gap-3 text-xs ${textTone}`}>
        <span className="inline-flex items-center gap-1.5">
          <DatabaseZap className="w-3.5 h-3.5" />
          <span className="font-semibold">{meta.sourceLabel}:</span> {meta.sourceValue}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="w-3.5 h-3.5" />
          {dateText}
        </span>
        {!compact && <span><span className="font-semibold">{meta.cadenceLabel}:</span> {meta.cadenceValue}</span>}
      </div>
    </div>
  );
}
