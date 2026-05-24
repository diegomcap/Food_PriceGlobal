import 'server-only';

import { createHash, timingSafeEqual } from 'node:crypto';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export const PIPELINE_ADMIN_COOKIE = 'fpg_pipeline_admin';

function getPipelineAdminSecret() {
  return (
    process.env.PIPELINE_ADMIN_SECRET ??
    process.env.MARKET_INGESTION_SECRET ??
    process.env.CRON_SECRET ??
    ''
  );
}

function toDigest(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

function safeEquals(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function hasPipelineAdminSecret() {
  return Boolean(getPipelineAdminSecret());
}

export function isValidPipelineAdminToken(token?: string | null) {
  const secret = getPipelineAdminSecret();
  if (!secret || !token) {
    return false;
  }

  return safeEquals(token, secret);
}

export function getPipelineAdminCookieDigest() {
  const secret = getPipelineAdminSecret();
  if (!secret) {
    return '';
  }

  return toDigest(secret);
}

export function hasPipelineAdminAccess(cookiesStore: Pick<ReadonlyRequestCookies, 'get'>) {
  const expected = getPipelineAdminCookieDigest();
  const current = cookiesStore.get(PIPELINE_ADMIN_COOKIE)?.value;

  if (!expected || !current) {
    return false;
  }

  return safeEquals(current, expected);
}

export function isPipelineAdminAuthorizedRequest(request: Request) {
  const secret = getPipelineAdminSecret();
  if (!secret) {
    return false;
  }

  const bearer = request.headers.get('authorization');
  const headerSecret = request.headers.get('x-admin-secret');
  const cookieHeader = request.headers.get('cookie') ?? '';
  const cookieValue = cookieHeader
    .split(';')
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${PIPELINE_ADMIN_COOKIE}=`))
    ?.split('=')
    .slice(1)
    .join('=');

  return (
    (bearer ? safeEquals(bearer, `Bearer ${secret}`) : false) ||
    (headerSecret ? safeEquals(headerSecret, secret) : false) ||
    (cookieValue ? safeEquals(cookieValue, getPipelineAdminCookieDigest()) : false)
  );
}
