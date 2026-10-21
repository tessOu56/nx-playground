/**
 * Shared TTL key-value for portal isolates (rate limits, webhook replay).
 * Prefers Upstash Redis REST, then Neon/Postgres `portal_kv`, then memory.
 * Store failures fall back to the in-process map so routes stay available.
 */

export type SharedKvIncrResult = { count: number; resetAt: number };

export type SharedKv = {
  incr(
    key: string,
    windowMs: number,
    now?: number
  ): Promise<SharedKvIncrResult>;
  setNx(key: string, ttlMs: number, now?: number): Promise<boolean>;
};

type MemoryBucket = { count: number; resetAt: number };

function createMemoryKv(): SharedKv & { reset(): void } {
  const buckets = new Map<string, MemoryBucket>();
  const nx = new Map<string, number>();

  return {
    async incr(key, windowMs, now = Date.now()) {
      const bucket = buckets.get(key);
      if (!bucket || bucket.resetAt <= now) {
        const next = { count: 1, resetAt: now + windowMs };
        buckets.set(key, next);
        return next;
      }
      bucket.count += 1;
      return { count: bucket.count, resetAt: bucket.resetAt };
    },
    async setNx(key, ttlMs, now = Date.now()) {
      const expiresAt = nx.get(key);
      if (expiresAt !== undefined && expiresAt > now) return false;
      nx.set(key, now + ttlMs);
      return true;
    },
    reset() {
      buckets.clear();
      nx.clear();
    },
  };
}

const memory = createMemoryKv();

export function resetSharedKvMemory() {
  memory.reset();
}

export function memorySharedKv(): SharedKv {
  return memory;
}

function envFlag(name: string): string {
  return process.env[name]?.trim() ?? '';
}

export function sharedKvBackend(
  env: NodeJS.ProcessEnv = process.env
): 'memory' | 'upstash' | 'postgres' {
  if (env.PORTAL_SHARED_KV === 'memory') return 'memory';
  // node:test sets NODE_TEST_CONTEXT; keep unit tests off live Redis/Neon.
  if (
    env.NODE_TEST_CONTEXT &&
    env.PORTAL_SHARED_KV !== 'postgres' &&
    env.PORTAL_SHARED_KV !== 'upstash'
  ) {
    return 'memory';
  }
  if (env.UPSTASH_REDIS_REST_URL?.trim() && env.UPSTASH_REDIS_REST_TOKEN?.trim()) {
    return 'upstash';
  }
  if (env.DATABASE_URL?.trim()) return 'postgres';
  return 'memory';
}

function createUpstashKv(baseUrl: string, token: string): SharedKv {
  const root = baseUrl.replace(/\/$/, '');

  async function command(path: string, init?: RequestInit): Promise<unknown> {
    const response = await fetch(`${root}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(init?.headers ?? {}),
      },
      signal: AbortSignal.timeout(2_000),
    });
    if (!response.ok) {
      throw new Error(`upstash ${response.status}`);
    }
    const body = (await response.json()) as { result?: unknown; error?: string };
    if (body.error) throw new Error(body.error);
    return body.result;
  }

  return {
    async incr(key, windowMs, now = Date.now()) {
      const encoded = encodeURIComponent(key);
      const count = Number(await command(`/incr/${encoded}`));
      if (!Number.isFinite(count)) throw new Error('upstash incr');
      const ttl = Number(await command(`/pttl/${encoded}`));
      if (!Number.isFinite(ttl) || ttl < 0) {
        await command(`/pexpire/${encoded}/${windowMs}`);
        return { count, resetAt: now + windowMs };
      }
      return { count, resetAt: now + ttl };
    },
    async setNx(key, ttlMs) {
      const encoded = encodeURIComponent(key);
      const result = await command(
        `/set/${encoded}/1?PX=${Math.max(1, Math.floor(ttlMs))}&NX=true`
      );
      return result === 'OK';
    },
  };
}

function createPostgresKv(databaseUrl: string): SharedKv {
  let sqlPromise: Promise<(strings: TemplateStringsArray, ...values: unknown[]) => Promise<unknown>> | null =
    null;

  async function sql(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<unknown> {
    if (!sqlPromise) {
      sqlPromise = import('@neondatabase/serverless').then(({ neon }) => {
        return neon(databaseUrl) as (
          strings: TemplateStringsArray,
          ...values: unknown[]
        ) => Promise<unknown>;
      });
    }
    const tagged = await sqlPromise;
    return tagged(strings, ...values);
  }

  return {
    async incr(key, windowMs, now = Date.now()) {
      const expiresAt = new Date(now + windowMs).toISOString();
      const rows = (await sql`
        INSERT INTO portal_kv (key, value, expires_at)
        VALUES (${key}, '1', ${expiresAt}::timestamptz)
        ON CONFLICT (key) DO UPDATE SET
          value = CASE
            WHEN portal_kv.expires_at <= NOW() THEN '1'
            ELSE (portal_kv.value::integer + 1)::text
          END,
          expires_at = CASE
            WHEN portal_kv.expires_at <= NOW() THEN EXCLUDED.expires_at
            ELSE portal_kv.expires_at
          END
        RETURNING value::integer AS count,
          (EXTRACT(EPOCH FROM expires_at) * 1000)::bigint AS reset_at
      `) as Array<{ count: number; reset_at: number | string }>;
      const row = rows[0];
      if (!row) throw new Error('portal_kv incr');
      return { count: Number(row.count), resetAt: Number(row.reset_at) };
    },
    async setNx(key, ttlMs, now = Date.now()) {
      const expiresAt = new Date(now + ttlMs).toISOString();
      await sql`
        DELETE FROM portal_kv WHERE key = ${key} AND expires_at <= NOW()
      `;
      const rows = (await sql`
        INSERT INTO portal_kv (key, value, expires_at)
        VALUES (${key}, '1', ${expiresAt}::timestamptz)
        ON CONFLICT (key) DO NOTHING
        RETURNING key
      `) as Array<{ key: string }>;
      return rows.length > 0;
    },
  };
}

function selectStore(): SharedKv {
  const backend = sharedKvBackend();
  if (backend === 'upstash') {
    return createUpstashKv(
      envFlag('UPSTASH_REDIS_REST_URL'),
      envFlag('UPSTASH_REDIS_REST_TOKEN')
    );
  }
  if (backend === 'postgres') {
    return createPostgresKv(envFlag('DATABASE_URL'));
  }
  return memory;
}

export async function sharedIncr(
  key: string,
  windowMs: number,
  now = Date.now()
): Promise<SharedKvIncrResult> {
  try {
    return await selectStore().incr(key, windowMs, now);
  } catch {
    return memory.incr(key, windowMs, now);
  }
}

export async function sharedSetNx(
  key: string,
  ttlMs: number,
  now = Date.now()
): Promise<boolean> {
  try {
    return await selectStore().setNx(key, ttlMs, now);
  } catch {
    return memory.setNx(key, ttlMs, now);
  }
}
