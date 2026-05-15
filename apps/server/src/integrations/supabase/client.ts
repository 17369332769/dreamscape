import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import {
  getSupabasePublicConfig,
  getSupabaseServiceConfig
} from "@/integrations/supabase/config";

declare global {
  var __dreamscapeSupabaseAnonClient: SupabaseClient | undefined;
  var __dreamscapeSupabaseAdminClient: SupabaseClient | undefined;
}

function createAnonClient() {
  const config = getSupabasePublicConfig();

  return createClient(config.url, config.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

function createAdminClient() {
  const config = getSupabaseServiceConfig();

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export function getSupabaseAnonClient() {
  if (!globalThis.__dreamscapeSupabaseAnonClient) {
    globalThis.__dreamscapeSupabaseAnonClient = createAnonClient();
  }

  return globalThis.__dreamscapeSupabaseAnonClient;
}

export function getSupabaseAdminClient() {
  if (!globalThis.__dreamscapeSupabaseAdminClient) {
    globalThis.__dreamscapeSupabaseAdminClient = createAdminClient();
  }

  return globalThis.__dreamscapeSupabaseAdminClient;
}

export async function probeSupabasePublicApi() {
  const startedAt = Date.now();

  const { error } = await getSupabaseAnonClient()
    .from("__dreamscape_connection_probe__")
    .select("*")
    .limit(1);

  if (error && error.code !== "PGRST205") {
    throw new Error(error.message);
  }

  return {
    mode: "anon",
    api: "rest",
    latencyMs: Date.now() - startedAt
  };
}

export async function probeSupabaseAdminApi() {
  const startedAt = Date.now();
  const { data, error } = await getSupabaseAdminClient().auth.admin.listUsers({
    page: 1,
    perPage: 1
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    mode: "service_role",
    api: "auth.admin",
    latencyMs: Date.now() - startedAt,
    sampleUsers: data.users.length
  };
}
