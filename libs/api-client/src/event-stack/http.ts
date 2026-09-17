import { getEventStackOrganizerHeaders } from './auth';

/** Hobby `nx-event-stack-api` currently serves the Next portal, not api-mock. */
const BROKEN_HOBBY_MOCK = /nx-event-stack-api\.vercel\.app/i;

function envApiBase(env: NodeJS.ProcessEnv | undefined): string {
  if (!env) return '';
  return (
    env.NEXT_PUBLIC_API_BASE_URL ||
    env.VITE_API_BASE_URL ||
    env.REACT_APP_API_URL ||
    ''
  ).replace(/\/$/, '');
}

/**
 * Public C-end on Vercel should not call the mis-deployed Hobby mock host
 * (it is the Next portal). Same-origin labelled-demo BFF is memory fixtures,
 * not the Nest funds path. Render / localhost Nest URLs are left alone.
 */
export function shouldUseLabelledDemoBff(
  env: NodeJS.ProcessEnv | undefined = typeof process !== 'undefined'
    ? process.env
    : undefined
): boolean {
  if (!env) return false;
  const flag = env.EVENT_STACK_LABELLED_DEMO_BFF?.trim();
  if (flag === '0' || flag === 'false') return false;
  if (flag === '1' || flag === 'true') return true;
  const fromEnv = envApiBase(env);
  if (BROKEN_HOBBY_MOCK.test(fromEnv)) return true;
  return env.VERCEL === '1' && fromEnv.length === 0;
}

export function labelledDemoBffBaseUrl(
  env: NodeJS.ProcessEnv | undefined = typeof process !== 'undefined'
    ? process.env
    : undefined,
  inBrowser = typeof window !== 'undefined'
): string {
  if (inBrowser) return '/api';
  const site =
    env?.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    (env?.VERCEL_URL ? `https://${env.VERCEL_URL.replace(/^https?:\/\//, '')}` : '');
  return site ? `${site}/api` : 'http://localhost:3000/api';
}

export function getEventStackBaseUrl(): string {
  const env = typeof process !== 'undefined' ? process.env : undefined;
  if (shouldUseLabelledDemoBff(env)) {
    return labelledDemoBffBaseUrl(env);
  }
  const trimmed = envApiBase(env);
  return trimmed || 'http://localhost:3001/api';
}

export async function eventStackRequest<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = `${getEventStackBaseUrl()}${path}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...getEventStackOrganizerHeaders(),
      ...(init?.headers ?? {}),
    },
  });

  const contentType = response.headers.get('content-type') ?? '';
  const body = await response.text();

  if (!response.ok) {
    throw new Error(`event-stack ${response.status} ${path}: ${body.slice(0, 180)}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const trimmed = body.trim();
  if (!/json/i.test(contentType) && !trimmed.startsWith('{') && !trimmed.startsWith('[')) {
    throw new Error(
      `event-stack non-json ${response.status} ${path}: ${body.slice(0, 80)}`
    );
  }

  return JSON.parse(body) as T;
}

export function toQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}
