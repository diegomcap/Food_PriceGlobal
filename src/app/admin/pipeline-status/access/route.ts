import { NextResponse } from 'next/server';
import {
  getPipelineAdminCookieDigest,
  hasPipelineAdminSecret,
  isValidPipelineAdminToken,
  PIPELINE_ADMIN_COOKIE,
} from '@/lib/adminAccess';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!hasPipelineAdminSecret() || !isValidPipelineAdminToken(token)) {
    return NextResponse.redirect(new URL('/admin/pipeline-status', url));
  }

  const response = NextResponse.redirect(new URL('/admin/pipeline-status', url));
  response.cookies.set(PIPELINE_ADMIN_COOKIE, getPipelineAdminCookieDigest(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
