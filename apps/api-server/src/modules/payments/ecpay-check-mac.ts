import { createHash } from 'node:crypto';

import { UnauthorizedException } from '@nestjs/common';

import { timingSafeEqualUtf8 } from '../../common/auth/timing-safe-equal';

/**
 * ECPay AIO CheckMacValue (MD5). Algorithm is mandated by the vendor spec;
 * it is not used as a password hash.
 */
export function ecpayDotNetUrlEncode(value: string): string {
  return encodeURIComponent(value)
    .toLowerCase()
    .replace(/%2d/g, '-')
    .replace(/%5f/g, '_')
    .replace(/%2e/g, '.')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .replace(/%20/g, '+');
}

export function fieldsForEcpayMac(
  body: Record<string, unknown>
): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const [key, value] of Object.entries(body)) {
    if (key === 'CheckMacValue' || value == null || typeof value === 'object') {
      continue;
    }
    fields[key] = String(value);
  }
  return fields;
}

export function computeEcpayCheckMacValue(
  fields: Record<string, string>,
  hashKey: string,
  hashIV: string
): string {
  const sorted = Object.keys(fields).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  let raw = `HashKey=${hashKey}`;
  for (const key of sorted) {
    raw += `&${key}=${fields[key]}`;
  }
  raw += `&HashIV=${hashIV}`;
  // codeql[js/weak-cryptographic-algorithm] -- ECPay CheckMacValue is MD5 by spec
  return createHash('md5')
    .update(ecpayDotNetUrlEncode(raw))
    .digest('hex')
    .toUpperCase();
}

export function verifyEcpayCheckMacValue(
  body: Record<string, unknown>,
  hashKey: string,
  hashIV: string
): boolean {
  const providedRaw = body.CheckMacValue;
  if (typeof providedRaw !== 'string' || !providedRaw.trim()) {
    return false;
  }
  const provided = providedRaw.trim().toUpperCase();
  const expected = computeEcpayCheckMacValue(
    fieldsForEcpayMac(body),
    hashKey,
    hashIV
  );
  return timingSafeEqualUtf8(provided, expected);
}

export function assertEcpayWebhookMac(body: unknown): void {
  const hashKey = process.env.ECPAY_HASH_KEY?.trim() ?? '';
  const hashIV = process.env.ECPAY_HASH_IV?.trim() ?? '';
  if (!hashKey || !hashIV) {
    throw new UnauthorizedException();
  }
  if (
    !body ||
    typeof body !== 'object' ||
    Array.isArray(body) ||
    !verifyEcpayCheckMacValue(body as Record<string, unknown>, hashKey, hashIV)
  ) {
    throw new UnauthorizedException();
  }
}
