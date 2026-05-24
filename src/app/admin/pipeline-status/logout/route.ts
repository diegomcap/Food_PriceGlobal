import { NextResponse } from 'next/server';
import { PIPELINE_ADMIN_COOKIE } from '@/lib/adminAccess';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const response = NextResponse.redirect(new URL('/market-analysis/pipeline-status', url));

  response.cookies.set(PIPELINE_ADMIN_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 0,
  });

  return response;
}
