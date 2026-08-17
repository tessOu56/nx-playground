export function getEventStackBaseUrl(): string {
  const fromEnv =
    (typeof process !== 'undefined' &&
      (process.env.NEXT_PUBLIC_API_BASE_URL ||
        process.env.VITE_API_BASE_URL ||
        process.env.REACT_APP_API_URL)) ||
    '';
  const trimmed = fromEnv.replace(/\/$/, '');
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
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`event-stack ${response.status} ${path}: ${body}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
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
