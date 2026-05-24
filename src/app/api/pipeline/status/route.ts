import { getPublicPipelineStatusPayload } from '@/lib/pipelineObservability';

export const revalidate = 60;

export async function GET() {
  const payload = await getPublicPipelineStatusPayload();
  return Response.json(payload);
}
