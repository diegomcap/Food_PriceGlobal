import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PipelineAdminStatusPage from '@/components/admin/PipelineAdminStatusPage';
import {
  hasPipelineAdminAccess,
  hasPipelineAdminSecret,
  isValidPipelineAdminToken,
} from '@/lib/adminAccess';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getTokenValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminPipelineStatusPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const cookieStore = await cookies();
  const params = searchParams ? await searchParams : {};
  const token = getTokenValue(params.token);

  if (token && isValidPipelineAdminToken(token)) {
    redirect(`/admin/pipeline-status/access?token=${encodeURIComponent(token)}`);
  }

  if (hasPipelineAdminSecret() && hasPipelineAdminAccess(cookieStore)) {
    return <PipelineAdminStatusPage />;
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Admin Only</p>
        <h1 className="mt-4 text-3xl font-bold">Observabilidade Completa Da Pipeline</h1>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          Esta tela admin nao fica aberta ao publico. Para acessar, abra a URL com
          <code className="mx-1 rounded bg-white/10 px-2 py-1">?token=SEU_SEGREDO_ADMIN</code>
          usando o segredo configurado no servidor.
        </p>
        <p className="mt-4 text-sm leading-6 text-slate-400">
          O projeto aceita <code className="mx-1 rounded bg-white/10 px-2 py-1">PIPELINE_ADMIN_SECRET</code> e,
          na ausencia dele, reutiliza <code className="mx-1 rounded bg-white/10 px-2 py-1">MARKET_INGESTION_SECRET</code>.
        </p>
        <Link href="/market-analysis/pipeline-status" className="mt-6 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10">
          Abrir Versao Publica Resumida
        </Link>
      </div>
    </div>
  );
}
