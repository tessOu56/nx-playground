# Security Policy

## Security Headers Configuration

This application implements comprehensive security headers to protect against common web vulnerabilities.

### Implemented Headers

#### 1. Content Security Policy (CSP)

**Purpose**: Prevents Cross-Site Scripting (XSS) and other code injection attacks.

**Development Mode**:
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https: blob:;
connect-src 'self' ws: wss:;
```

**Production Mode**:
```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https://picsum.photos;
connect-src 'self';
font-src 'self' data:;
object-src 'none';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
upgrade-insecure-requests;
```

**Known Exceptions**:
- `'unsafe-inline'` for styles: Required by Tailwind CSS runtime styles
- `https://picsum.photos`: Placeholder images (can be removed in production)

#### 2. X-Frame-Options

**Value**: `DENY`

**Purpose**: Prevents the page from being embedded in iframes, protecting against clickjacking attacks.

#### 3. X-Content-Type-Options

**Value**: `nosniff`

**Purpose**: Prevents browsers from MIME-sniffing responses, reducing exposure to drive-by downloads.

#### 4. Referrer-Policy

**Value**: `strict-origin-when-cross-origin`

**Purpose**: Controls referrer information sent with requests, balancing privacy and analytics needs.

#### 5. Permissions-Policy

**Value**: `camera=(), microphone=(), geolocation=()`

**Purpose**: Explicitly disables unused browser features, reducing attack surface.

#### 6. Strict-Transport-Security (HSTS)

**Value**: `max-age=63072000; includeSubDomains; preload`

**Purpose**: Forces HTTPS connections for 2 years, prevents man-in-the-middle attacks.

**Note**: Only applied in production (HTTPS required).

---

## Deployment Platform Integration

### Cloudflare Pages

Security headers are configured in `public/_headers` file.

**Initial Deployment**: Uses `Content-Security-Policy-Report-Only` to test without breaking functionality.

**Production**: Switch to `Content-Security-Policy` after validation.

### Vercel

Create `vercel.json` with headers configuration if deploying to Vercel.

### Self-Hosted (Nginx)

Use `nginx.conf` with appropriate header directives.

---

## CSP Nonce Strategy (Future Enhancement)

For stricter CSP without `'unsafe-inline'`:

1. Generate unique nonce per request
2. Inject nonce into HTML template
3. Add nonce attribute to inline scripts/styles
4. Update CSP to use `'nonce-{value}'`

**Implementation**: Requires Edge Function or Server-Side Rendering.

---

## Validation

### Manual Testing

Check headers using browser DevTools:
1. Open DevTools → Network tab
2. Reload page
3. Click on document request
4. Check Response Headers

### Automated Testing

Run verification script:
```bash
# Check local dev server
tsx apps/profile/scripts/verify-security-headers.ts http://localhost:3003

# Check production deployment
tsx apps/profile/scripts/verify-security-headers.ts https://your-domain.com
```

### Online Tools

- [Security Headers](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)

---

## Known Limitations and Trade-offs

### 1. Tailwind CSS Requires unsafe-inline

**Issue**: Tailwind generates inline styles at runtime.

**Mitigation**:
- Accept `'unsafe-inline'` for styles (lower risk than scripts)
- Consider extracting critical CSS for stricter CSP

### 2. Third-party Images

**Issue**: Blog cover images from `picsum.photos`.

**Mitigation**:
- Whitelist specific CDN in `img-src`
- Consider hosting images locally for production

### 3. Development vs Production

**Issue**: Dev server needs relaxed CSP for HMR (Hot Module Replacement).

**Solution**:
- Separate dev and prod configurations
- Use Report-Only mode for testing

---

## Reporting Security Issues

If you discover a security vulnerability, please email: [your-email@example.com]

**Please do not** open public issues for security vulnerabilities.

---

## Security Checklist

- [x] CSP configured and tested
- [x] X-Frame-Options set to DENY
- [x] X-Content-Type-Options set to nosniff
- [x] Referrer-Policy configured
- [x] Permissions-Policy configured
- [x] HSTS enabled (production only)
- [x] Dev/Prod environments separated
- [x] Cloudflare _headers file created
- [ ] CSP nonce implementation (future)
- [ ] CSP violation reporting (optional)

---

## References

- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [MDN CSP Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Cloudflare Headers Documentation](https://developers.cloudflare.com/pages/platform/headers/)
- [Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)

---

Last Updated: 2025-01-27

