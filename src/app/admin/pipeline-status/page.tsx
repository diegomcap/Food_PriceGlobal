import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PipelineAdminStatusPage from '@/components/admin/PipelineAdminStatusPage';
import { hasPipelineAdminAccess, hasPipelineAdminSecret, isValidPipelineAdminToken } from '@/lib/adminAccess';

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
          Esta tela nao fica aberta ao publico. O acesso depende de autenticacao administrativa valida
          e deve ser feito apenas pelo fluxo seguro compartilhado com operadores autorizados.
        </p>
        <p className="mt-4 text-sm leading-6 text-slate-400">
          Se voce nao estiver autenticado, solicite um link seguro ao responsavel pela operacao.
          Nao compartilhe credenciais, tokens ou capturas desta area.
        </p>
        <Link href="/market-analysis/pipeline-status" className="mt-6 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10">
          Abrir Versao Publica Resumida
        </Link>
      </div>
    </div>
  );
}
