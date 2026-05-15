import { probePostgres } from "@/integrations/db/postgres";
import {
  probeSupabaseAdminApi,
  probeSupabasePublicApi
} from "@/integrations/supabase/client";

export const runtime = "nodejs";

async function runCheck<T>(runner: () => Promise<T>) {
  try {
    const result = await runner();

    return {
      ok: true,
      ...result
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export async function GET() {
  const [supabasePublic, supabaseAdmin, postgresRuntime, postgresDirect] =
    await Promise.all([
      runCheck(() => probeSupabasePublicApi()),
      runCheck(() => probeSupabaseAdminApi()),
      probePostgres("DATABASE_URL"),
      probePostgres("DIRECT_URL")
    ]);

  const supabaseOk = supabasePublic.ok && supabaseAdmin.ok;
  const postgresOk = postgresRuntime.ok && postgresDirect.ok;
  const degraded = supabaseOk && !postgresOk;
  const ok = supabaseOk;
  const status = ok ? (degraded ? "degraded" : "ok") : "error";

  return Response.json(
    {
      ok,
      degraded,
      status,
      service: "dreamscape-server",
      summary: {
        supabaseOk,
        postgresOk
      },
      checks: {
        supabase: {
          publicApi: supabasePublic,
          adminApi: supabaseAdmin
        },
        postgres: {
          runtime: postgresRuntime,
          direct: postgresDirect
        }
      }
    },
    { status: ok ? 200 : 500 }
  );
}
