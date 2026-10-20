# Tokyo exhibition collectors — sources

Collectors fetch **allowlisted HTTPS URLs only** (`redirect: 'error'`, no credentials, 30s timeout). Rows upsert on `(source, externalId)`. Catalog fields are a **short summary + official link**, not full source HTML. `data.i18n` holds ja/en/zh when the source publishes them.

Prisma migrations (including optional pgvector `event_embeddings.embedding`) run in the collector workflow. Embedding backfill is a no-op unless `EMBEDDING_PROVIDER` and `EMBEDDING_API_KEY` are set.

## Used

### 1. Tokyo Metropolitan Teien Art Museum — WordPress REST (exhibition CPT)

| | |
| --- | --- |
| URL | `https://www.teien-art-museum.ne.jp/wp-json/wp/v2/exhibition` (`lang=ja\|en\|zh-tw`, `_fields` limited) |
| Also published | RSS `https://www.teien-art-museum.ne.jp/exhibition/feed/` (ja) and `/en/exhibition/feed/` |
| robots.txt | `Disallow: /wp-admin/` only — `/wp-json/` and `/exhibition/feed/` are allowed |
| Terms | Official metropolitan museum site; REST/RSS are the public listing interfaces |
| i18n | ja / en / zh-tw (Polylang). zh-tw is stored as `zh` |
| Dates | Encoded in the slug (`YYMMDD-MMDD`, `YYYYMMDD-MMDD`, …). Rows without a parseable slug are skipped |
| Source id | `teien-art-museum` |

### 2. Arts Council Tokyo — festivals / 参加・体験 RSS

| | |
| --- | --- |
| URL | `https://www.artscouncil-tokyo.jp/news-cat/festivals/feed/` |
| robots.txt | `Disallow: /sys/wp-admin/` only |
| Terms | Official Tokyo Metropolitan Foundation for History and Culture RSS |
| Filter | Title/body must look like an exhibition (`展覧会`, `企画展`, `特別展`, `作品展示`, `美術展`, `展示`, `exhibition`) |
| i18n | Japanese listing; en/zh venue labels are the organisation name |
| Dates | Parsed from RSS `content:encoded` / description (`開催時期 2026年10月10日～12月20日`) |
| Source id | `arts-council-tokyo` |

### 3. Civic Creative Base Tokyo [CCBT] — events RSS

| | |
| --- | --- |
| URL | `https://ccbt.rekibun.or.jp/events/feed` (no trailing slash; slash 301s and collectors do not follow redirects) |
| robots.txt | `Disallow: /wp-admin/` only |
| Terms | Official Rekibun CCBT WordPress feed |
| Filter | Same exhibition hint as Arts Council |
| Source id | `ccbt` |

### 4. Tokyo Metropolitan Government recommended event CSV (CC BY 4.0)

| | |
| --- | --- |
| URL | `https://www.opendata.metro.tokyo.lg.jp/suisyoudataset/130001_event.csv` |
| Catalog | [東京都イベント一覧](https://catalog.data.metro.tokyo.lg.jp/dataset/t000003d0000000027) |
| License | Creative Commons Attribution 4.0 |
| robots.txt | Host has no robots.txt (404). CSV is the published open-data file |
| i18n | `イベント名` (ja) / `イベント名_英語` (en) |
| Note | The live file is still the 2018–2019 recommended-dataset snapshot. Ended rows are dropped; the collector is ready when TMG refreshes the CSV |
| Source id | `tokyo-opendata-event` |

## Considered and not used

| Source | Why not |
| --- | --- |
| Japan Search Art Commons (`/api/item/search/jps-cross`, `f-type=exhibition`) | Documented developer API, but `robots.txt` **Disallow**s `/api/item/search/jps-cross`. Database-specific `/api/item/search/exhib` returns `permission-denied`. SPARQL is under Disallow `/rdf/`. Metadata is CC BY-ND |
| Tokyo Art Beat | Commercial aggregator, not official TMG/museum open data |
| Tokyo Art Navigation (`tokyoartnavi.jp`) | TLS certificate is not publicly trusted |
| MOT / Tobikan / NACT / MOMAT HTML calendars | No public RSS/API on the checked paths; HTML scrape is out of scope |
| TMG homepage RSS | Redistribution requires a prior application |

## Remaining source risks

- RSS windows are the CMS default (about 10 latest posts), not a full archive.
- Teien slugs without dates (for example `lucie-rie`) are skipped until the museum encodes dates.
- Arts Council / CCBT date parsing is heuristic Japanese civil dates.
- TMG event CSV is stale until the publisher updates it.
- zh is only filled when the source publishes Chinese (Teien zh-tw today).
