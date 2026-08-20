const POSTGRES_SCHEME = /^postgres(ql)?:\/\//i;

export function assertPostgresUrl(url: string | undefined): string {
  if (!url || !url.trim()) {
    throw new Error(
      'DATABASE_URL is required. Use the existing Neon event-stack URL or local docker postgres (make db-up). SQLite is not the product path.',
    );
  }
  const trimmed = url.trim();
  if (
    trimmed.startsWith('file:') ||
    trimmed.includes('mode=memory') ||
    !POSTGRES_SCHEME.test(trimmed)
  ) {
    throw new Error(
      'DATABASE_URL must be postgresql (Neon or local docker). SQLite file: URLs are not allowed.',
    );
  }
  return trimmed;
}
