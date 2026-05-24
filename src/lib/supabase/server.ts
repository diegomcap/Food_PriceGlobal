import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let adminClient: SupabaseClient | null | undefined;

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url, serviceRoleKey };
}

export function hasSupabaseAdmin() {
  return getSupabaseEnv() !== null;
}

export function getSupabaseAdmin() {
  if (adminClient !== undefined) {
    return adminClient;
  }

  const env = getSupabaseEnv();
  if (!env) {
    adminClient = null;
    return adminClient;
  }

  adminClient = createClient(env.url, env.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return adminClient;
}
