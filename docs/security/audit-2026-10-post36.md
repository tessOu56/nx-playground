# Security audit (post-#36) — PRs #37–#40

Follow-up to PR #36 (`docs/security/audit-2026-10.md` on that branch). Scope is exhibition discovery UI (#37), visitor QA (#38), labs move (#39), and Phase 3 FTS search (#40). Do not duplicate LINE PKCE, webhook HMAC, Taipei collector SSRF, Nest admin bearer, or ECPay MAC — those stay on #36.

## Fixed in this pass

1. **Unpublished event disclosure (high)** — `GET` detail / metadata used `WHERE id = $1` with no `status = 'published'`. Drafts (`status` defaults to `draft`) were readable by ID.
2. **Untrusted URLs on catalog/detail (high)** — `sourceUrl` and `data.image` reached `<a href>`, Next/Image, and Open Graph. `javascript:`, `http://`, credentialed hosts, localhost, IPs, and `.internal` are dropped.
3. **Stored XSS via markdown links (high on content blocks)** — `[text](javascript:…)` from JSON `content` became `href`.
4. **Public FTS DoS (medium-high)** — `/api/exhibitions/search` had no length cap or rate limit. Query string > 2048 → 414; 60 req/min/IP → 429; `q`/`category`/`id` truncated.

SQL stays parameterized (`neon` tagged templates). ILIKE wildcards were already stripped.

## Left to #36

LINE token/PKCE, webhook raw HMAC + body cap, collector SSRF allowlist, Nest mutating Bearer, ECPay CheckMacValue, axios 1.20.0, swiper 12.1.2.

## Remaining (this pass)

See the pull request body.
