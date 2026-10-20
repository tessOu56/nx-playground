const WEBHOOK_URL =
  /https:\/\/(?:(?:canary|ptb)\.)?discord(?:app)?\.com\/api\/webhooks\/[^\s"'\\]+/gi;
const WEBHOOK_ENV = /DISCORD_WEBHOOK_URL\s*=\s*\S+/gi;

/** Strip Discord webhook URLs so logs and error text never leak them. */
export function redactSecrets(value: string): string {
  return value
    .replace(WEBHOOK_URL, 'https://discord.com/api/webhooks/[redacted]')
    .replace(WEBHOOK_ENV, 'DISCORD_WEBHOOK_URL=[redacted]');
}

export function safeErrorReason(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return redactSecrets(error.message).slice(0, 160);
  }
  return 'unknown-error';
}
