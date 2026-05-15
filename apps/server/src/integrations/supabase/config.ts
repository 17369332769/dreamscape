import "server-only";

type SupabasePublicConfig = {
  url: string;
  anonKey: string;
};

type SupabaseServiceConfig = SupabasePublicConfig & {
  serviceRoleKey: string;
};

function readRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}

export function getSupabasePublicConfig(): SupabasePublicConfig {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || readRequiredEnv("SUPABASE_URL"),
    anonKey: readRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  };
}

export function getSupabaseServiceConfig(): SupabaseServiceConfig {
  const publicConfig = getSupabasePublicConfig();

  return {
    ...publicConfig,
    serviceRoleKey: readRequiredEnv("SUPABASE_SERVICE_ROLE_KEY")
  };
}
