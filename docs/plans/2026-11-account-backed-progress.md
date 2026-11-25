# Account-backed progress: schema and API for sign-off

Prepared 2026-11-25, from the grilling session on the per-user progress handoff.
Decisions recorded in ADR-0003 and ADR-0004. Vocabulary in CONTEXT.md.
Nothing here has been built. No migration runs until this is signed off.

## Settled decisions

| Question | Answer |
|---|---|
| Audience | Public launch, real candidates, soon |
| Signed-out access | Landing page only |
| Gate | Server-enforced middleware; lesson pages stay prerendered behind it |
| Bank exposure | Bank leaves page payloads; served by entitled routes only |
| Billing | One-time $49 purchase, **Access Window** of 365 days, lifetime possible later |
| Trial | One per **Account**, 7 days, full access, no card, auto-started on first sign-in |
| Entitlement | Stripe charge → **Access Grant** row → expiry mirrored into session claims |
| Host / database | AWS Amplify Hosting; Neon Postgres, same AWS region |
| Drills | Server selects ~20 **Questions** by weakness; one call writes and selects |
| Sittings | Row written at start, autosaved, graded on the server, resumable |
| Estimate | From **Sittings** only; **Drills** feed focus areas |
| Rationing | None. **Bank Coverage** shown beside the estimate instead |
| Lesson completion | Reaching the last section. Sequential lock removed |
| Organisations | None in v1; retrofit is **Access Grants** + a membership table |
| Platform admin | One role, one person, claim-checked twice |
| Rate limit | Per-**Account** counter on the row the Drill endpoint already writes |
| Minimum age | 16+, attested, not stored |

## Schema

```sql
-- Identity: no PII. The auth provider owns the person, Stripe owns the money.
create table users (
  id          bigint generated always as identity primary key,
  clerk_id    text not null unique,
  role        text not null default 'candidate',
  created_at  timestamptz not null default now()
);

-- One row per grant, bought or trialled. A row, not a column, so an
-- organisation can own one later.
create table access_grants (
  id            bigint generated always as identity primary key,
  user_id       bigint not null references users(id) on delete cascade,
  source        text not null,                 -- 'trial' | 'stripe' | 'comp'
  stripe_ref    text unique,                   -- checkout session; null for a Trial
  starts_at     timestamptz not null default now(),
  expires_at    timestamptz not null,          -- Trial = +7 days, bought = +365, lifetime = far future
  revoked_at    timestamptz,                   -- refund or chargeback
  created_at    timestamptz not null default now()
);
create index on access_grants (user_id, expires_at desc);
-- One Trial per candidate, ever. Enforced, not merely intended.
create unique index on access_grants (user_id) where source = 'trial';

-- Precomputed for the dashboard and the /learn shelf. Version doubles as ETag.
create table progress_summary (
  user_id            bigint primary key references users(id) on delete cascade,
  version            integer not null default 0,
  lessons_completed  smallint not null default 0,
  drill_answered     integer  not null default 0,
  drill_correct      integer  not null default 0,
  sittings_taken     smallint not null default 0,
  best_sitting_correct  smallint,
  last_sitting_correct  smallint,
  last_sitting_total    smallint,
  readiness          jsonb not null default '{}',  -- per-Domain, from Sittings only
  coverage           jsonb not null default '{}',  -- per-Domain Bank Coverage
  slice_bucket       timestamptz,                  -- rate-limit hour bucket
  slice_count        smallint not null default 0,
  last_active_on     date,
  updated_at         timestamptz not null default now()
);

create table lesson_progress (                    -- <= 25 rows per candidate
  user_id      bigint references users(id) on delete cascade,
  lesson_id    text not null,
  completed_at timestamptz,
  quiz_best_correct smallint,                     -- counts, never percentages
  quiz_last_correct smallint,
  quiz_total        smallint,
  quiz_attempts     smallint not null default 0,
  primary key (user_id, lesson_id)
);

create table question_state (                     -- <= bank size per candidate
  user_id          bigint references users(id) on delete cascade,
  question_id      text not null,
  question_version smallint not null,             -- counters reset when this moves
  seen             smallint not null default 0,
  correct          smallint not null default 0,
  last_correct     boolean,
  last_seen_at     timestamptz not null,
  primary key (user_id, question_id)
);

create table acs_stats (                          -- keyed by ACSRef id, not ACS Code
  user_id    bigint references users(id) on delete cascade,
  acs_ref_id text not null,
  seen       integer not null default 0,
  correct    integer not null default 0,
  primary key (user_id, acs_ref_id)
);

-- One row per Sitting, written at start and completed at submit.
create table sittings (
  id              uuid primary key,
  user_id         bigint not null references users(id) on delete cascade,
  blueprint_id    text not null,
  content_version text not null,                  -- hash of authored content
  seed            integer not null,
  question_ids    text[] not null,
  answers         text[] not null,                -- choice ids; '' = blank
  started_at      timestamptz not null,
  expires_at      timestamptz not null,           -- started_at + blueprint time limit
  autosaved_at    timestamptz,
  submitted_at    timestamptz,
  duration_sec    integer,
  correct         smallint,
  total           smallint,
  passed          boolean,
  domains         jsonb
);
create index on sittings (user_id, started_at desc);

create table ingest_batches (                     -- idempotent flushes; purged weekly
  user_id     bigint not null references users(id) on delete cascade,
  batch_id    uuid not null,
  received_at timestamptz not null default now(),
  primary key (user_id, batch_id)
);

create table admin_audit_log (
  id             bigint generated always as identity primary key,
  admin_clerk_id text not null,
  action         text not null,
  target_user_id bigint,
  detail         jsonb,
  at             timestamptz not null default now()
);
```

Dropped from the handoff's schema, with reasons:

- `progress_summary.study_cursor` — the server selects by weakness, so there is no position to resume.
- `exam_attempts` — replaced by `sittings`, which exists from the moment a candidate starts.
- `acs_stats.acs_code` — the **ACS Code** is an FAA-owned label; the identifier is the key (ADR-0001).
- `answers smallint[]` — positions corrupt silently when choices are reordered.
- Admin rollup tables and the cron route — live queries until a query is slow.
- `/api/progress/import` and every guest-mode field — no signed-out use exists.

## API

Every route: identity from the session, never the body. **Entitlement** checked in the handler as well as middleware. Zod with size caps on input. Generic errors. `Cache-Control: private, no-store`.

| Route | Purpose | Round trips |
|---|---|---|
| `POST /api/trial` | Grants the one **Trial** if none exists. Called once on first sign-in, alongside the `users` row. Conflict on the unique index means already trialled — returns the existing grant, never a second one. | 1 |
| `GET /api/progress` | Snapshot for the `/learn` shelf and the client store. `ETag: version`, 304 on match. Creates the `users` row on first call. | 1 |
| `POST /api/progress/events` | `{ batchId, events[] }` — `lesson.completed`, `lesson.quiz`. Batch id inserted first; a conflict is a retry and returns 200. | 1 batch |
| `POST /api/drill` | `{ batchId, answers[] }` in, next ~20 **Questions** with keys out. Records and selects in one batch. Empty `answers` for the first slice. Refuses past the hourly slice count. | 1 batch |
| `GET /api/lesson/:lessonId/quiz` | That lesson's **Questions** with keys. Replaces the prerendered payload. | 0 |
| `POST /api/sitting` | Assembles a **Draw**, writes the row, returns **Questions** without keys plus `expires_at`. | 1 |
| `GET /api/sitting/:id` | Resume: same **Draw**, saved answers, server-computed remaining time. | 1 |
| `PUT /api/sitting/:id/answers` | Autosave on page-hide and every ~10 answers or ~60 s. Single-row update. | 1 |
| `POST /api/sitting/:id/submit` | Grades on the server, writes the result, `question_state`, `acs_stats`, summary and readiness in one batch, returns the result with explanations. Rejects after `expires_at`. | 1 batch |
| `POST /api/webhooks/stripe` | Signature verified. Checkout completed → bought **Access Grant** running from `max(now, current expiry)` + claim mirror. Refund or dispute → revoke. | 1 |
| `POST /api/webhooks/clerk` | Signature verified. `user.deleted` → delete the row, cascading. | 1 |
| `/admin/content` | Server component. Live aggregates over `sittings` and `question_state` at the current **Question** version, plus a candidate lookup. ≤ 5 queries. | ≤ 5 |

## Phases, one PR each

1. **Gate.** Clerk provider and sign-in, **Trial** granted on first sign-in, Stripe $49 checkout and webhook, **Access Grant**, claim mirror (expiry plus which kind of window it is), middleware, 16+ attestation, CSP for Clerk and Stripe. Includes the expired state: dashboard and **Sitting** history readable, everything else behind the paywall — a seven-day **Trial** means this fires in week two, so it cannot be deferred. Days-remaining copy on the trial window. Budget script: keep prerender assertions for lessons and `/learn`, exempt `/dashboard`, keep every JS budget.
2. **Database.** Neon project in the Amplify region, Drizzle schema and migrations, `server-only` client, PGlite tests, dev round-trip counter that fails above one per request.
3. **Bank off the client.** `/api/drill`, the lesson quiz route, slice rate counter. `/study` and lesson payloads stop carrying keys.
4. **Sittings.** Start, resume, autosave, server grading, persisted result and trend on `/results`.
5. **Surfaces.** Snapshot, client store, real `/learn` bars, lock removed, server-rendered `/dashboard` with the **Sittings**-only estimate, focus areas, and **Bank Coverage**.
6. **Admin.** Role claim, `/admin/content`, candidate lookup, audit log.
7. **Deletion and privacy.** Clerk deletion webhook, in-app delete, privacy copy: what is stored, where, how to remove it.

## Budgets, revised

| Metric | Target |
|---|---|
| Middleware invocations on gated content routes | 1 per navigation — accepted, was 0 |
| Prerendered | All lesson routes and `/learn`; `/dashboard` exempt |
| Database round trips per API request | 1 |
| Snapshot reads per session | ≤ 1, 304 when unchanged |
| Writes per candidate-month, heavy use | ~30 Drill slices + ~3 Sittings × ~10 autosaves + lesson events |
| Storage per candidate | < 50 KB |
| Drill slice p95, warm, same region | < 150 ms |
| Admin queries per page | ≤ 5 |

## Cost, priced 2026-11-25

- Amplify SSR: $0.30 per million requests (first 500k free), $0.20 per GB-hour (first 100 free), $0.15/GB transfer out.
- Neon: $0.106 per CU-hour, $0.35/GB-month, scale-to-zero after 5 minutes idle.
- Clerk: free to 50,000 monthly retained users. Trial candidates are signed-in users and count toward that, unlike the guests the earlier plan assumed.
- A **Trial** costs no Stripe fee and no extra service: it is a row with a seven-day expiry. Its only real cost is content consumed without payment.
- At 1,000 heavy candidates: requests ≈ $0.11/month, transfer ≈ $9/month, Neon ≈ $19–40/month depending on how continuously it stays awake. Storage is noise.
- Deferred: AWS WAF — $15/month per Amplify app plus $5/month per web ACL, $1 per rule, $0.60 per million requests.
