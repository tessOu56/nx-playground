/**
 * Security Headers Configuration for Profile App
 *
 * This configuration defines security headers to protect against common web vulnerabilities:
 * - XSS (Cross-Site Scripting)
 * - Clickjacking
 * - MIME sniffing
 * - Information leakage
 */

export interface SecurityHeadersConfig {
  contentSecurityPolicy: string;
  xFrameOptions: string;
  xContentTypeOptions: string;
  referrerPolicy: string;
  permissionsPolicy: string;
  strictTransportSecurity?: string;
}

/**
 * Development CSP - More permissive for hot reload and dev tools
 */
export const developmentCSP = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // unsafe-eval for Vite HMR
  'style-src': ["'self'", "'unsafe-inline'"], // unsafe-inline for Tailwind
  'img-src': ["'self'", 'data:', 'https:', 'blob:'],
  'font-src': ["'self'", 'data:'],
  'connect-src': ["'self'", 'ws:', 'wss:'], // WebSocket for HMR
  'media-src': ["'self'"],
  'object-src': ["'none'"],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'upgrade-insecure-requests': [],
};

/**
 * Production CSP - Strict security with nonce support
 */
export const productionCSP = {
  'default-src': ["'self'"],
  'script-src': ["'self'"], // Will add nonce in runtime
  'style-src': ["'self'", "'unsafe-inline'"], // Tailwind needs unsafe-inline
  'img-src': ["'self'", 'data:', 'https://picsum.photos'], // Placeholder images
  'font-src': ["'self'", 'data:'],
  'connect-src': ["'self'"],
  'media-src': ["'self'"],
  'object-src': ["'none'"],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'upgrade-insecure-requests': [],
};

/**
 * Convert CSP object to string
 */
export function cspToString(csp: Record<string, string[]>): string {
  return Object.entries(csp)
    .map(([directive, values]) => {
      if (values.length === 0) {
        return directive;
      }
      return `${directive} ${values.join(' ')}`;
    })
    .join('; ');
}

/**
 * Get security headers for development environment
 */
export function getDevelopmentHeaders(): Record<string, string> {
  return {
    'Content-Security-Policy': cspToString(developmentCSP),
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
}

/**
 * Get security headers for production environment
 */
export function getProductionHeaders(): Record<string, string> {
  return {
    'Content-Security-Policy': cspToString(productionCSP),
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  };
}

/**
 * Get security headers with nonce for production
 */
export function getProductionHeadersWithNonce(
  nonce: string
): Record<string, string> {
  const csp = { ...productionCSP };
  csp['script-src'] = ["'self'", `'nonce-${nonce}'`];

  return {
    'Content-Security-Policy': cspToString(csp),
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  };
}

/**
 * Report-Only CSP for testing (won't block, only reports violations)
 */
export function getReportOnlyHeaders(): Record<string, string> {
  return {
    'Content-Security-Policy-Report-Only': cspToString(productionCSP),
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
}
