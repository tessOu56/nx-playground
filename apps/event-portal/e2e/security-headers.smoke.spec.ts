import { expect, test } from '@playwright/test';

function isCspConsoleViolation(text: string): boolean {
  return /content security policy|refused to (apply|connect|load|execute|frame)/i.test(
    text
  );
}

test.describe('event-portal security headers smoke', () => {
  test('catalog and login send CSP-RO / Permissions-Policy without x-powered-by or CSP violations', async ({
    page,
    request,
  }) => {
    const violations: string[] = [];
    page.on('console', message => {
      const text = message.text();
      if (isCspConsoleViolation(text)) {
        violations.push(`${message.type()}: ${text}`);
      }
    });

    const head = await request.fetch('/zh-TW/events', { method: 'HEAD' });
    expect(head.headers()['content-security-policy-report-only'] ?? '').toMatch(
      /default-src 'self'/
    );
    expect(head.headers()['content-security-policy-report-only'] ?? '').toMatch(
      /va\.vercel-scripts\.com/
    );
    expect(head.headers()['permissions-policy'] ?? '').toMatch(
      /publickey-credentials-get=\(self\)/
    );
    expect(head.headers()['permissions-policy'] ?? '').toMatch(/camera=\(\)/);
    expect(head.headers()['x-powered-by']).toBeUndefined();

    const catalog = await page.goto('/zh-TW/events', {
      waitUntil: 'domcontentloaded',
    });
    expect(catalog?.ok()).toBeTruthy();
    await expect(page.locator('#main-content')).toBeVisible();

    const login = await page.goto('/zh-TW/login', {
      waitUntil: 'domcontentloaded',
    });
    expect(login?.ok()).toBeTruthy();
    await expect(page.getByRole('heading')).toBeVisible();

    expect(violations, violations.join('\n')).toEqual([]);
  });
});
