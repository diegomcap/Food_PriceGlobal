'use client';

import { AlertTriangle, Siren } from 'lucide-react';
import type { SupportedLanguage } from '@/lib/marketTime';
import type { PipelineDatasetKey } from '@/lib/marketSources';
import { getPipelineAlertTone, getPipelineSourceAlert } from '@/lib/pipelineStatus';

type Props = {
  dataset: PipelineDatasetKey;
  source?: string;
  language: SupportedLanguage;
};

export default function PipelineSourceAlert({ dataset, source, language }: Props) {
  const alert = getPipelineSourceAlert(dataset, source, language);

  if (!alert) {
    return null;
  }

  const Icon = alert.severity === 'critical' ? Siren : AlertTriangle;

  return (
    <div className={`rounded-2xl border px-4 py-3 ${getPipelineAlertTone(alert.severity)}`}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="text-sm font-semibold">{alert.title}</p>
          <p className="mt-1 text-xs leading-5 opacity-90">{alert.detail}</p>
        </div>
      </div>
    </div>
  );
}
