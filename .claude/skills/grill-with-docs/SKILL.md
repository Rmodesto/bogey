---
name: grill-with-docs
description: Grilling session for Bogey, the Part 107 study app. Challenges a plan against the app's domain model (modules, lessons, sections, questions, blueprints, references, ACS codes), sharpens terminology, and updates CONTEXT.md and ADRs inline as decisions crystallise. Use when the user wants to stress-test a plan before building.
---

<what-to-do>

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time, waiting for feedback on each question before continuing.

If a question can be answered by exploring the codebase, explore the codebase instead.

</what-to-do>

<supporting-info>

## What this repo is

**Bogey** is a local Next.js app for studying the FAA **Part 107** remote pilot knowledge test. It teaches through authored lessons, drills with a question bank, and runs weighted practice exams that mirror the real test's domain mix.

The content pipeline is: **authored JSON** under `content/part107/` → **validate** (`scripts/part107/validate.ts`, Zod + referential integrity) → **build** (`scripts/part107/build-content.ts`, denormalizes) → **generated JSON** under `generated/part107/` → **loaders** → **service** → pages.

The study loop is: **Module** → **Lesson** → **Lesson Section** (markdown + optional **Visualizer** + optional **Bogeyman**) → **Lesson Quiz**, with **Study** mode over the whole bank and **Exam** mode drawn from an **Exam Blueprint**.

## Decisions that are already locked

Do not re-open these. If a question implies changing one, say so explicitly and let me decide — don't quietly redesign around it.

- Next.js 14 App Router + TypeScript, Tailwind, `lucide-react` icons, `motion` for animation, `react-markdown` for lesson prose. Hand-rolled components in `src/components/` — no component library
- Content is **authored as JSON files on disk**, not in a database and not in MDX. Zod schemas in `src/lib/part107/schema.ts` are the single definition of content shape
- `generated/part107/` is a **build artifact and gitignored**. `npm run build` runs `part107:build-content` first. Validation errors hard-fail the build; warnings don't
- Generated JSON reaches the app through **static imports** in `src/lib/part107/loaders.ts`. No API routes, no server fetch, no runtime file reads
- No auth, no accounts, no backend, no deploy config. `npm run dev` is the whole runtime story
- Exam generation is **deterministic given a seed** (`mulberry32`), allocating questions across domains by blueprint weight using the largest-remainder method, then honoring `minQuestions`, then backfilling from the rest of the bank
- Every content record carries its own integer `version`. IDs are strings and must be **globally unique across every content type**
- `src/lib/part107/compat.ts` is a deliberate bridge to the legacy numeric-index question shape in `src/data/questions.ts`. It exists so the older pages keep working — not as the target design
- `vitest` for tests, under `src/lib/part107/__tests__/`

## Explicitly out of scope

Auth, user accounts, server-side progress persistence, payments, mobile app, real proctoring, live weather or airspace API feeds, content authoring UI, deployment config. When a plan drifts into any of these, call it out as scope creep rather than designing it.

## Domain awareness

During codebase exploration, also look for existing documentation.

### File structure

This is a single-context repo:

```
/
├── CONTEXT.md
├── docs/
│   └── adr/
├── content/part107/     ← authored source of truth
├── generated/part107/   ← build artifact, gitignored
├── scripts/part107/
└── src/
```

If a `CONTEXT-MAP.md` ever appears at the root, the repo has split into multiple contexts and the map points to where each one lives.

Create files lazily — only when you have something to write. If no `CONTEXT.md` exists, create one when the first term is resolved. If no `docs/adr/` exists, create it when the first ADR is needed.

## During the session

### Challenge against the glossary

When I use a term that conflicts with the existing language in `CONTEXT.md`, call it out immediately. "Your glossary defines a **Domain** as the exam content area, but you're using it to mean the ACS `area` field — which is it?"

### Sharpen fuzzy language

This domain has several overloaded words. Push for the canonical term every time:

- **"question"** — a content **Question** (string `id`, `choices[]` with `isCorrect`) or a **LegacyQuestion** (numeric `id`, `options[]`, `correctAnswer` index)? They are not interchangeable and the index-based one is positional.
- **"domain"** — the exam **Domain** string on a `Question`/`Module` (`"Regulations"`), the ACS **area**, or a blueprint `domainWeights[].domain`? These are three fields that happen to carry the same strings and nothing enforces that.
- **"module" / "lesson" / "section"** — three nesting levels. A **Module** owns `lessonIds`; a **Lesson** owns `sections`; a **Lesson Section** owns markdown `content`.
- **"content"** — the authored JSON under `content/`, the generated output under `generated/`, or the markdown string in `LessonSection.content`?
- **"reference"** — an **FAA Reference** record (`ref-cfr107`), the id string inside `Question.explanation.references`, the `resolvedReferences` the build inlines, or a term in the hardcoded `GLOSSARY` in `AnnotatedMarkdown.tsx`?
- **"ACS"** — an `ACSRef.id` (`acs-ua-i-a-k1`), its `code` (`UA.I.A.K1`), or its `area`?
- **"exam"** — the **Blueprint** (the recipe), the generated question list (the draw), or the attempt the user is sitting?
- **"score"** — the raw count of correct answers, a percentage, or the blueprint's `passingScore` fraction (`0.7`)?
- **"version"** — a record's own `version` integer, or the pipeline's `manifest.contentVersion`?
- **"progress"** — nothing persists anywhere. Ask what store is implied before accepting the word.
- **"figure"** — a `FigureAsset` manifest entry, the image file on disk, or a `figureIds` entry on a question? Validation only checks the manifest entry exists.

### Discuss concrete scenarios

Stress-test with specific scenarios rather than abstractions. The ones that tend to expose muddy thinking here:

- I add a question to `content/part107/questions/weather.json` and run `npm run dev`. What do I see, and why?
- I clone the repo fresh and run `npm test`. `generated/` is gitignored — what happens?
- I retire a question (`status: "retired"`) that was drawn into an exam someone is currently sitting.
- I rename a domain in the question files but not in `blueprints.json`. Which layer complains, and when?
- I reorder the choices on a question. What breaks downstream of `compat.ts`?
- A blueprint's `minQuestions` sum exceeds `totalQuestions`. What does `allocateByWeight` do?
- A domain has fewer active questions than its blueprint target. Where does the shortfall come from, and is the exam still blueprint-conformant?
- I finish an exam, land on `/results`, and refresh the page. Then I hit back.
- A question's `explanation.references` points at an FAA reference id that was deleted from `references.json`.
- Two lesson sections use the same `id`.
- The ACS publishes a new version and every `code` shifts.

### Cross-reference with code

When I state how something works, check whether the code agrees, and surface contradictions. "You said the exam honors the blueprint, but `src/app/exam/page.tsx:23` hardcodes `useState(7200)` instead of reading `timeLimitSeconds` — one of those is wrong."

### Watch the seams specific to this app

These are where the app is most likely to be wrong. Probe them unprompted when a plan touches them:

- **Authored vs generated.** Two shapes for the same data: `Question` (schema) and `DenormalizedQuestion` (loaders), kept in sync by hand. Nothing fails if they drift. Ask which one a change touches, and whether the other needs it too.
- **The rebuild requirement.** `generated/` is gitignored and statically imported. Any content change is invisible until `part107:build-content` runs. Ask how the author finds out.
- **Hardcoded values that duplicate blueprint fields.** The exam timer and the pass threshold are literals in the pages, not reads of `timeLimitSeconds` and `passingScore`. Ask whether a plan deepens that duplication.
- **Domain strings as de-facto foreign keys.** `Question.domain`, `Module.domain`, and `domainWeights[].domain` are free-form strings. The dashboard has its own hardcoded list that does not match the content spelling (`"Loading & Performance"` vs `"Loading and Performance"`). Ask what makes a domain list authoritative.
- **Results passed through the URL.** `/results` reconstructs the exam by calling `getExamQuestions()` (fixed seed `42`) and reads `score`, `total`, `time`, and a JSON `answers` array out of query params. Ask what happens when the seed, the bank, or the URL length changes.
- **Seeding.** `generateExam` defaults to `seed ?? Date.now()`. Determinism is opt-in. Ask whether the caller is passing a seed and where it is stored.
- **The compat layer's positional ids.** `toLegacyQuestion` replaces stable string ids with array indices and the correct choice with its index. Ask whether anything is being stored or compared across renders.
- **Client bundles carry the answers.** The study and exam pages are client components importing the whole denormalized bank, `isCorrect` flags and explanations included. Ask whether a plan assumes otherwise.
- **Loose config escape hatches.** `VisualizerConfigSchema.config` is `z.record(z.string(), z.unknown())` — unvalidated and cast at the component boundary. Ask what the component actually requires.
- **Validation cost and reach.** Near-duplicate stem detection is an O(n²) Levenshtein sweep over every question pair, and it only warns. Ask whether a growing bank makes that a build-time problem.

### Update CONTEXT.md inline

When a term is resolved, update `CONTEXT.md` right there. Don't batch these up — capture them as they happen. Use the format in [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md).

`CONTEXT.md` should be totally devoid of implementation details. File paths, Zod schema names, and field names do not belong in it. It is a glossary and nothing else.

Keep FAA vocabulary (**Remote PIC**, **sUAS**, **ACS**, **Domain**) matching how the FAA uses it. Where the app's internal term differs from the FAA's, record both and say which one the code uses.

### Offer ADRs sparingly

Only offer to create an ADR when all three are true:

1. **Hard to reverse** — the cost of changing your mind later is meaningful
2. **Surprising without context** — a future reader will wonder "why did they do it this way?"
3. **The result of a real trade-off** — there were genuine alternatives and you picked one for specific reasons

If any of the three is missing, skip the ADR. Use the format in [ADR-FORMAT.md](./ADR-FORMAT.md).

In this repo the bar is high. Things that clear it: JSON-on-disk content with a build step instead of a CMS or database, Zod schemas as the single content contract, deterministic seeded exam generation and the allocation algorithm behind it, keeping `generated/` out of git, and the existence of the compat layer. Component structure, Tailwind choices, and icon picks do not.

</supporting-info>
