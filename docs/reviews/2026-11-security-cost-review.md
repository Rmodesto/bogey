# Bogeyman: security, per-screen cost, and efficiency review

**Date:** 2026-11-24 · **Commit reviewed:** `bb6e174` · **Mode:** review only — no app code changed.
**Hosting assumption:** AWS Amplify Hosting (per the owner; nothing is deployed yet, so every platform-side statement below is about what the repo would do on Amplify, not about a live configuration).

**State corrections against the handoff brief:** the 197-question bank and the November lesson edits are committed and pushed (working tree was clean at review start; `generated/part107/` is intentionally gitignored build output, rebuilt by `npm run build`). The app now has 48 lesson animations (all CSS/SVG React components, code-split). Still true: no auth, no database, no payments, no analytics, no LLM calls, no middleware, no route handlers, no server actions, no `.env` files, and no saved progress. The practice exam is 60 questions from a 197-question bank. The repo `Rmodesto/bogey` is **public**.

Baselines ran green before and after the review's only installs (Playwright, isolated in `.review/` with its own package.json; browser in the user npm cache): `npx vitest run` 232/232, `npm run part107:validate` passes (5 modules, 25 lessons, 197 questions, 1 blueprint). Measurement tooling: `.review/measure-routes.mjs` (re-runnable), raw data in `.review/measurements.json`, build table in `.review/build-output.txt`, audits in `.review/npm-audit-*.txt`.

---

## Summary: top 5 actions, ranked by impact ÷ effort

1. **Remove the fabricated marketing claims before anything public.** "FAA Approved Content" (`src/app/page.tsx:21`, `:83`), "94% Pass Rate" (`:19`), "12,400+ Pilots Certified" (`:20`), "Join thousands…" (`:149`), and the dashboard's fake personal history (`src/app/dashboard/page.tsx:16-34`). The FAA does not approve third-party prep; the numbers have no basis. Legal exposure, zero engineering effort. (S)
2. **Make the lesson route static.** `/learn/[moduleId]/[lessonId]` is the app's only dynamic (ƒ) route — a server render on every one of the ~25 lesson views per user — purely because the page is `"use client"` with `useParams` and no `generateStaticParams` (`src/app/learn/[moduleId]/[lessonId]/page.tsx:1`). A server-component shell with `generateStaticParams` over the 25 lessons makes the whole app CDN-only: zero SSR invocations, zero compute line on Amplify. (M)
3. **Stop shipping the whole content dataset to the browser.** Chunk `5778-…js` — **113.9 KB gzipped (474 KB raw), the full 197-question bank with `isCorrect` flags and explanations plus all lesson text** — loads on 11 of 12 routes because `src/lib/part107/loaders.ts:58-64` statically imports `generated/part107/*.json` and four pages are client components importing the service/compat layer. Move content reads into server components and pass each screen its slice. Cuts 34–47% of cold-load bytes on every route and closes the answer-key exposure in the same change. (M)
4. **Security quick wins in one pass:** `npm audit fix` (clears zod/nanoid/source-map-js), add a `headers()` block (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS) and `poweredByHeader: false` to `next.config.mjs:2`, broaden `.gitignore:31` from `.env*.local` to `.env*`, harden `/results` against malformed query params (`src/app/results/page.tsx:24-27`). (S)
5. **Plan the Next.js 15.5.x upgrade.** 14.2.35 is the final 14.x release; npm audit's critical against `next` will never be patched on this line. No middleware, no server code, no `next/image` → migration surface is small and no advisory is concretely exploitable here today, but an EOL framework on an internet-facing host is a standing liability. (M)

---

## Security findings

Severity is rated against what the app exposes **today**: a static, first-party-content study app with no server state.

### Medium

**S1. Next.js 14.2.35 is end-of-line with unpatchable advisories.** `package.json:18`. npm dist-tags confirm 14.2.35 is the last 14.x; `npm audit --omit=dev` rates `next` Critical with fixes only in 15.5.x/16.x. The headline advisories (image-optimizer RCEs GHSA-2xp9-vwfh-vxw4 / GHSA-2464-fhr4-w9xw) list 14.2.35 in range but require the image optimizer to process attacker-supplied images — this app uses no `next/image` and no remote images, so concrete exploitability is near zero; the middleware/server-action advisories don't apply (no such code exists). Rated Medium as "EOL framework serving an internet-facing app," not as a live exploit. **Fix:** upgrade to `next@15.5.29` (backport line) or 16.x. Effort: M.

### Low

**S2. No security headers, `poweredByHeader` on.** `next.config.mjs:1-4` is an empty config; no `customHttp.yml`/`amplify.yml` in the repo. Missing CSP, frame-ancestors/X-Frame-Options (clickjacking), X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS; `X-Powered-By` advertises the EOL framework. **Fix:** `headers()` in next.config (host-independent) and/or Amplify `customHttp.yml`; `poweredByHeader: false`. Effort: S.

**S3. `zod` 4.3.6 < 4.6.6 memory-exhaustion advisory (GHSA-mrhx-c7xc-m3w5).** `package.json:24`. Only used at build time on first-party JSON — no untrusted input path. **Fix:** `npm audit fix`. Effort: S.

**S4. Remaining production-tree audit highs** (nanoid, source-map-js, postcss — all build-time/framework-internal, no attacker-reachable input). **Fix:** `npm audit fix` for the first two; postcss rides the Next upgrade. Effort: S.

**S5. `/results` trusts and `JSON.parse`s URL params unguarded.** `src/app/results/page.tsx:24-27`. `/results?answers=}` throws in render (white screen on a shareable URL); `score`/`total` are freely forgeable (`/results?score=60&total=60` renders a pass). Self-grading app, nothing server-side trusts it — a crash bug and a screenshot-forgery nit, not an exploit. **Fix:** try/catch, clamp, derive totals from the exam. Effort: S.

### Info

**S6. Full answer key and question bank ship to every client, pre-answer.** `src/lib/part107/loaders.ts:58-64` static-imports `generated/part107/questions.json` (every choice carries `isCorrect` plus full explanations) into client pages (`src/app/exam/page.tsx`, `/study`, `/results`, `LessonQuiz`); scoring happens in the browser. The bank is also committed to a public GitHub repo. Zero risk for a free self-assessment app; a direct business risk the day the bank is paywalled or scores matter — anyone can scrape bank + key from one JS chunk. **Fix if monetizing:** server-side exam assembly and grading, strip `isCorrect`/explanations from pre-answer payloads, private repo. Effort then: M. (The bundle-size fix in action 3 does most of this work anyway.)

**S7. Fixed exam seed.** `src/lib/part107/active.ts:8` (`ACTIVE_SEED = 42`). Every user, every retake: the identical 60 questions in identical order. Coupling to note before fixing: `/results` re-generates the exam with the same seed and matches answers by index — a randomized seed must travel to the results page (URL or state) or grading silently breaks. **Fix:** random seed per attempt, carried through. Effort: S.

**S8. Markdown/XSS: currently safe, latent risk documented.** `src/components/AnnotatedMarkdown.tsx:123-163` uses react-markdown 10 + remark-gfm only — no `rehype-raw`, no `dangerouslySetInnerHTML`, no `allowDangerousHtml` anywhere; raw HTML in lesson markdown is escaped; the glossary tooltip path manipulates React text nodes only. The METAR decoder parses a passed string client-side — no fetch, no SSRF surface. Nothing renders URL params or storage as HTML (no storage is used at all). **What flips it:** content becoming CMS/user-supplied plus someone adding `rehype-raw` = stored XSS with no CSP backstop (see S2). Keep `rehype-raw` out; if third-party content ever lands, add `rehype-sanitize` + CSP first.

**S9. Fabricated marketing and progress claims (FTC/consumer-protection, not security).** `src/app/page.tsx:19` "94% Pass Rate", `:20` "12,400+ Pilots Certified", `:21` and `:83` "FAA Approved", `:149` "Join thousands of professional drone pilots"; `src/app/dashboard/page.tsx:16-34` hardcodes fake personal study history presented as the user's data. Fine as an unlaunched mock; must be reworded ("Aligned with the FAA Part 107 ACS") or removed before launch. Effort: S.

**S10. Supply-chain hygiene is otherwise clean.** Lockfile committed; zero install/postinstall scripts in the dependency tree; no `.env` files in tree or in full git history; secret scan of the complete history (AWS keys, PEM, token patterns) found nothing (`.review/secret-scan-out.txt`). One nit: `.gitignore:31` covers only `.env*.local` — broaden to `.env*` since the repo is public. Effort: S.

**npm audit summary:** production: 5 (1 critical — next; 4 high — nanoid, postcss, source-map-js, zod). Full incl. dev: 20 (dev-only additions in the vitest/vite/eslint chain). `npm audit fix` clears everything except next/postcss, which need the framework upgrade.

---

## Per-screen cost

Method: production build (`next build`, table in `.review/build-output.txt`), then real loads via Playwright/CDP against `next start` — cold (empty cache) and warm (primed), desktop and mobile (Pixel 5 emulation, 4× CPU throttle, ~9 Mbps/170 ms RTT). Bytes are wire-transfer (gzip). Full per-request data: `.review/measurements.json`; CSV: `docs/reviews/screen-cost.csv`.

**Render modes:** every route is static (○) except `/learn/[moduleId]/[lessonId]`, which is dynamic (ƒ) because the page is a client component using `useParams` with no `generateStaticParams` — not because anything needs request-time data. That one marker is the app's entire server-compute bill.

| Route | Mode | Cold KB | Warm KB | Reqs | LCP mobile | JS exec mobile | $/1k cold views* |
|---|---|---|---|---|---|---|---|
| / | ○ | 240.6 | 1.1 | 14 | 444 ms | 75 ms | $0.035 |
| /learn | ○ | 118.6 | 1.0 | 10 | 480 ms | 84 ms | $0.017 |
| /dashboard | ○ | 236.1 | 0.8 | 12 | 468 ms | 87 ms | $0.035 |
| /study | ○ | 231.7 | 0.6 | 11 | 440 ms | 73 ms | $0.034 |
| /exam | ○ | 232.1 | 0.6 | 11 | 440 ms | 71 ms | $0.034 |
| /results | ○ | 242.3 | 1.1 | 15 | 748 ms | 101 ms | $0.036 |
| lesson (typical, ×5 measured) | ƒ | 325–336 | 5.6–8.6 | 12–14 | ~450 ms | 90–164 ms | ~$0.053 |
| lesson (largest: les-reg-operating) | ƒ | 326.2 | 6.4 | 12 | 436 ms | 123 ms | ~$0.053 |

\* Amplify transfer at $0.15/GB on cold bytes; lesson adds SSR request ($0.30/M) + estimated ~0.02 GB-h/1k views ($0.004/1k; duration not directly measurable locally — estimate assumes ~50 ms at 1.7 GB). Warm views cost ≈ $0.0001–0.0013/1k. TBT was 0 ms and CLS 0.000 on every route even throttled; JS execution time is reported instead as the CPU signal. **Third-party requests: zero on every route and every interaction.** Images and font requests: zero (system font stack, inline SVG art).

**What's in the bytes:** `5778-…js` = 113.9 KB gz (474 KB raw) — the entire content dataset (bank + lessons + explanations) — on 11/12 routes (all but `/learn`). `9403-…js` = 84.0 KB gz — framer-motion + the react-markdown/micromark stack — lesson pages only. react-dom 52.9 KB and Next runtime 31.5 KB everywhere. Everything else ≤10 KB; the 48 animations are properly code-split (3–5 KB gz each, loaded per section on demand).

**Interactions measured:** answering study/exam questions, decoding a METAR, finishing a quiz — **0 network requests, 0 bytes**. Advancing lesson sections lazy-loads animation chunks (3–4 KB each). The app makes no data calls at all after page load.

### Per-user monthly model

Journey (handoff's assumption, adjustable in the CSV/script): landing ×2, /learn ×6, 25 lesson views, 4 visualizer/METAR uses (0 bytes), /study with 150 answers (0 bytes beyond load), 3 full exams + results, dashboard ×8 — 48 page views.

Because chunks are shared and cached across routes, a month is one cold superset download (~330 KB: framework 85 + data chunk 114 + lesson markdown/motion stack 84 + route chunks + 10.8 KB CSS) plus per-view HTML/RSC (0.6–8.6 KB) plus a handful of animation chunks:

- **Data per user per month: ≈ 0.5 MB.** Trivial for students even on mobile plans; the only per-view growth is the lesson HTML (~6 KB each).
- **Cost per user per month on Amplify: ≈ $0.000075 (seven-thousandths of a cent).** Biggest line item: the 114 KB content chunk inside that first cold load; biggest *structural* line: 25 SSR invocations per user from the dynamic lesson route.
- **At scale (Amplify pricing checked 2026-11-24: 15 GB transfer, 500k SSR requests, 100 GB-h free monthly; then $0.15/GB, $0.30/M requests, $0.20/GB-h):**

| MAU | Transfer | SSR requests | Est. monthly cost | After fixes (all-static, −114 KB chunk) |
|---|---|---|---|---|
| 1,000 | 0.5 GB | 25k | **$0** (inside free tier) | $0 |
| 10,000 | 5 GB | 250k | **$0** (inside free tier) | $0 |
| 100,000 | 50 GB | 2.5M | **≈ $6.5** ($5.25 transfer + $0.60 requests + duration ≈ $0.6) | **≈ $1.9** (transfer only, ~27 GB) |

Build minutes (~2–4 min/deploy at $0.01/min after 1,000 free) and optional WAF ($15/month flat) excluded. Honest conclusion: **hosting cost is a rounding error at any realistic scale; the fixes below are worth doing for user experience, battery/data, and the paywall-readiness of the answer key — not to save hosting dollars.** The one line that grows linearly with success and disappears entirely with fix 2 is lesson SSR.

---

## Inefficiencies: confirmed, ruled out, measured

1. **Whole content bundle ships to the browser — CONFIRMED.** 113.9 KB gz / 474 KB raw on 11/12 routes (`loaders.ts:58-64` static imports; client pages `src/app/study/page.tsx:1`, `exam/page.tsx:1`, `results/page.tsx:1`, lesson page). Fix: content reads in server components; pass each screen its slice; split per lesson. Saving: −114 KB cold on every route (34–47%), plus S6 goes away.
2. **`"use client"` at page level — CONFIRMED** for lesson, study, exam, results pages (each `:1`). `/`, `/learn`, `/dashboard` are already server components. Fix: server shells with client islands (quiz, timer, animations already islands).
3. **Markdown parsed in the browser — CONFIRMED.** react-markdown/micromark rides the 84 KB lesson chunk and runs per render (lesson JS exec 90–164 ms, the app's highest). Fix: render in `build-content.ts` (or in the server component); ship HTML/RSC. Saving: most of the markdown share of that chunk plus the parse time.
4. **Legacy code — PARTLY RULED OUT.** `src/data/questions.ts` (10.7 KB source) is imported by nothing — tree-shaken, not in any bundle; delete for hygiene only. `compat.ts` *is* live: study/exam/results convert the bank to the legacy positional shape on the client each render — cheap CPU-wise, but it's the import path that drags the bank into those bundles.
5. **Exam generated in the browser from the full bank — CONFIRMED** (`compat.ts:45-46`, seed fixed at `active.ts:8`). The server-slice fix plus a per-attempt seed covers bundle, exposure, and variety in one change (keep `/results` seed-coupling in mind, see S7).
6. **Heavy tools loaded eagerly — MOSTLY RULED OUT.** All 48 animations are `next/dynamic` and measured lazy (3–4 KB on demand). Exception: `AirspaceVisualizer` and `METARDecoder` are static imports in `src/components/animations/registry.tsx:5-6`, so they land in every lesson's first load. Fix: make them `dynamic()` like the rest. Effort: S.
7. **Routes dynamic by accident — CONFIRMED for exactly one route**, the lesson page (ƒ in the build table). Landing, learn, dashboard, study, exam, results are already static. Fix: `generateStaticParams` + server component → entire app static, zero invocations.
8. **Uncached external calls — RULED OUT.** Zero `fetch` in the codebase; zero third-party requests observed. The METAR decoder is a pure string parser.
9. **Images, mascot, fonts — RULED OUT as cost items.** No image or font requests at all (system font stack; all art inline SVG). Mascot appears ~4×/lesson as small inline SVG — negligible. CSS is 10.8 KB total (Tailwind purge working).
10. **Animations — already on the right pattern.** CSS/SVG components, pure logic modules, per-section lazy chunks of 3–5 KB gz. Recommendation: keep this format (no Lottie/Rive runtime needed — a Lottie player alone is ~60 KB gz); budget **≤ 6 KB gz per animation chunk**, loaded on section entry (current behavior) or viewport entry.

---

## Performance budget to adopt

Measured today (mobile, throttled): LCP 436–748 ms, TBT 0 ms, CLS 0.000 — the app is fast; the budget exists to keep it that way as animations and content grow.

- **First-load JS (gz):** marketing/learn/dashboard ≤ 100 KB (today 89–97); study/exam/results ≤ 120 KB after the content-slice fix (today 216–217); lesson pages ≤ 180 KB after markdown + slice fixes (today 308).
- **Mobile LCP ≤ 2.5 s** on throttled 4G (today ≤ 0.75 s locally; leaves headroom for real networks/CDN).
- **Zero server invocations on content routes** (landing, learn, lessons, study, exam): everything ○ in the build table.
- **Per-animation chunk ≤ 6 KB gz**, always lazy.
- **CI check:** a small script that parses `next build` output and fails on budget breaches (or `size-limit` on the chunk files) plus a grep that fails if any route reports ƒ. The build table is machine-readable enough that the script is ~30 lines; wire it into the Amplify build or a GitHub Action.

---

## Not checked / couldn't verify

- Amplify-side configuration (headers, WAF, compute platform, caching behavior) — nothing is deployed; all platform statements are about defaults.
- SSR duration on Amplify (est. ~50 ms at 1.7 GB per lesson render) — not measurable locally; the cost model labels it an estimate.
- Individual in-range verification of all ~27 npm-audit `next` advisories — the two image-optimizer RCEs were checked against the GitHub advisories; the rest rely on npm's range resolution.
- Real-network Core Web Vitals (local `next start` only; no CDN/TLS latency in the numbers).
- Dev-dependency advisories (vitest/vite/eslint chain) — captured in `.review/npm-audit-full.txt`, not individually assessed; none ship.
- `generated/part107` provenance beyond spot checks; animation components skimmed for sinks only.
- Review-tooling note: a Playwright install briefly hoisted into the repo-root `package.json`/lockfile and was restored byte-for-byte from HEAD; the final working tree touches only `.gitignore` (the `/.review/` entry) and `docs/reviews/`.

---

## Proposed fix order (PR-sized)

1. **PR a — honest copy + security quick wins (S):** marketing claims, dashboard mock labeling, `npm audit fix`, headers + `poweredByHeader`, `.env*` gitignore, `/results` param hardening.
2. **PR b — static content routes + server slices (M):** lesson page → server component + `generateStaticParams`; content reads server-side; study/exam/results get per-screen slices; per-attempt exam seed threaded to results.
3. **PR c — build-time markdown (M):** render lesson markdown in `build-content.ts`/server, drop react-markdown from the client.
4. **PR d — lazy leftovers + dead code (S):** `dynamic()` for AirspaceVisualizer/METARDecoder, delete `src/data/questions.ts`.
5. **PR e — CI budget check (S):** build-output parser failing on JS budgets or any ƒ route.
6. **PR f — Next 15.5.x upgrade (M):** last, on its own branch, after a and b land.

---

## Addendum: fixes implemented 2026-11-24 (same day)

All six proposed chunks landed as commits `4a5fb1b`, `8f8c2f3`, `bbc80d5`, `8e07a10`, `d0092a5`:

- **(a)** Marketing claims replaced with true figures; dashboard labeled sample data; security headers + `poweredByHeader: false` live (verified in response headers); `.env*` ignored; `npm audit fix` applied; `/results` params clamped and crash-proofed.
- **(b+c)** Lesson route: dynamic ƒ → SSG ● (all 25 prerendered, `generateStaticParams` + server component); markdown renders on the server (AnnotatedMarkdown is a server component); study/exam/results are server pages over client islands. The 113.9 KB content chunk is gone from the client: first-load JS fell from 216–217 KB to ~100 KB on study/exam/results and 308 KB → 144 KB on lessons (Next 14 numbers). Exam seed is random per attempt and travels to /results in the URL (seedless links fall back to the historical fixed draw). Verified in-browser: two consecutive attempts draw different exams; forged/malformed result URLs render safely.
- **(d)** AirspaceVisualizer and METARDecoder lazy-load; dead `src/data/questions.ts` deleted.
- **(e)** `scripts/check-budgets.mjs` runs as postbuild: fails the build if any route exceeds its first-load budget (110/130/180 KB) or is not fully prerendered.
- **(f)** Next 15.5.29 + React 19. Production `npm audit` drops from 1 critical + 4 high to two advisories nested in next's bundled postcss. First-load JS rises ~10 KB everywhere (React 19 runtime); final numbers: lessons 151.9 KB, app screens ~107–109 KB, marketing 104.7 KB — all within budget, all routes prerendered.

Checks after each chunk and at the end: 232/232 tests, lint clean, tsc clean, content validator green, production build + budget check green. Re-run `.review/measure-routes.mjs` against a `next start` to refresh the transfer/vitals columns in `screen-cost.csv`; the cost model's "after fixes" row now holds (zero SSR invocations anywhere).
