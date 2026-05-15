import "server-only";

import dns from "node:dns/promises";

import { Pool, type PoolConfig, type QueryResultRow } from "pg";

type PostgresSource = "DATABASE_URL" | "DIRECT_URL";
type SupabaseConnectionMode =
  | "session_pooler"
  | "transaction_pooler"
  | "direct"
  | "unknown";

type PostgresTarget = {
  host: string;
  port: number;
  database: string;
  user: string;
  mode: SupabaseConnectionMode;
  configWarnings: string[];
};

type PostgresDnsDiagnosis = {
  address: string;
  family: number;
  fakeIp: boolean;
};

declare global {
  var __dreamscapeRuntimePgPool: Pool | undefined;
  var __dreamscapeDirectPgPool: Pool | undefined;
}

function readConnectionString(source: PostgresSource) {
  const value = process.env[source]?.trim();

  if (!value) {
    throw new Error(`Missing ${source}`);
  }

  return value;
}

function classifySupabaseMode(host: string, port: number) {
  if (host.endsWith(".pooler.supabase.com") && port === 5432) {
    return "session_pooler";
  }

  if (host.endsWith(".pooler.supabase.com") && port === 6543) {
    return "transaction_pooler";
  }

  if (host.startsWith("db.") && host.endsWith(".supabase.co") && port === 6543) {
    return "transaction_pooler";
  }

  if (host.startsWith("db.") && host.endsWith(".supabase.co") && port === 5432) {
    return "direct";
  }

  return "unknown";
}

function buildConfigWarnings(source: PostgresSource, target: PostgresTarget) {
  const warnings: string[] = [];

  if (source === "DIRECT_URL" && target.mode !== "direct") {
    warnings.push(
      "DIRECT_URL does not look like a direct Supabase connection string. Expected db.<project-ref>.supabase.co:5432."
    );
  }

  if (source === "DATABASE_URL" && target.mode === "direct") {
    warnings.push(
      "DATABASE_URL is using a direct database host. For IPv4-friendly app traffic, Supabase usually recommends a pooler connection string."
    );
  }

  return warnings;
}

function parseConnectionTarget(source: PostgresSource): PostgresTarget {
  const connectionString = readConnectionString(source);
  const parsed = new URL(connectionString);
  const host = parsed.hostname;
  const port = Number(parsed.port || 5432);
  const database = parsed.pathname.replace(/^\//, "") || "postgres";
  const user = decodeURIComponent(parsed.username);
  const mode = classifySupabaseMode(host, port);

  return {
    host,
    port,
    database,
    user,
    mode,
    configWarnings: buildConfigWarnings(source, {
      host,
      port,
      database,
      user,
      mode,
      configWarnings: []
    })
  };
}

function isFakeIp(address: string) {
  const match = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.exec(address);

  if (!match) {
    return false;
  }

  const firstOctet = Number(match[1]);
  const secondOctet = Number(match[2]);

  return firstOctet === 198 && secondOctet >= 18 && secondOctet <= 19;
}

async function lookupHost(host: string): Promise<PostgresDnsDiagnosis | null> {
  try {
    const result = await dns.lookup(host);

    return {
      address: result.address,
      family: result.family,
      fakeIp: isFakeIp(result.address)
    };
  } catch {
    return null;
  }
}

function readSslConfig(connectionString: string): PoolConfig["ssl"] {
  try {
    const { hostname } = new URL(connectionString);

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return false;
    }
  } catch {
    return {
      rejectUnauthorized: false
    };
  }

  return {
    rejectUnauthorized: false
  };
}

function createPool(source: PostgresSource) {
  const connectionString = readConnectionString(source);

  return new Pool({
    connectionString,
    ssl: readSslConfig(connectionString),
    max: 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000
  });
}

function getPool(source: PostgresSource) {
  if (source === "DATABASE_URL") {
    if (!globalThis.__dreamscapeRuntimePgPool) {
      globalThis.__dreamscapeRuntimePgPool = createPool(source);
    }

    return globalThis.__dreamscapeRuntimePgPool;
  }

  if (!globalThis.__dreamscapeDirectPgPool) {
    globalThis.__dreamscapeDirectPgPool = createPool(source);
  }

  return globalThis.__dreamscapeDirectPgPool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  source: PostgresSource,
  text: string,
  values?: unknown[]
) {
  return getPool(source).query<T>(text, values);
}

type PostgresPingRow = {
  current_database: string;
  current_user: string;
  current_time: string;
};

export async function pingPostgres(source: PostgresSource) {
  const startedAt = Date.now();
  const target = parseConnectionTarget(source);
  const result = await query<PostgresPingRow>(
    source,
    "select current_database() as current_database, current_user as current_user, now()::text as current_time"
  );
  const row = result.rows[0];

  return {
    source,
    target,
    database: row?.current_database ?? null,
    user: row?.current_user ?? null,
    currentTime: row?.current_time ?? null,
    latencyMs: Date.now() - startedAt
  };
}

export async function probePostgres(source: PostgresSource) {
  const startedAt = Date.now();
  const target = parseConnectionTarget(source);

  try {
    const result = await pingPostgres(source);

    return {
      ok: true,
      ...result
    };
  } catch (error) {
    const dnsDiagnosis = await lookupHost(target.host);
    const message = error instanceof Error ? error.message : "Unknown error";
    const hints = [...target.configWarnings];

    if (dnsDiagnosis?.fakeIp) {
      hints.push(
        "Local DNS resolved this hostname into the 198.18.0.0/15 fake-IP range. A system proxy is likely intercepting DNS, and raw Postgres ports 5432/6543 may need direct bypass rules for *.supabase.co and *.pooler.supabase.com."
      );
    }

    if (!dnsDiagnosis?.fakeIp && message === "Connection terminated unexpectedly") {
      hints.push(
        "The TCP connection is being closed before PostgreSQL finishes its handshake. This is commonly caused by a local proxy, firewall, or network policy blocking raw database traffic."
      );
    }

    return {
      ok: false,
      source,
      target,
      latencyMs: Date.now() - startedAt,
      error: message,
      diagnosis: {
        dns: dnsDiagnosis,
        hints
      }
    };
  }
}
