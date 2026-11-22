# Lesson animations: handoff for implementation

Build the ten Phase 1 lesson animations as React components in this app, matching the designs in `docs/animations/designs/`.

Design canvas (owner's view): https://claude.ai/artifact/BSeMWSepQMvrtgvBjCbYmJ

## Before you start

- The working tree has uncommitted changes from a curriculum update (lesson JSON, question explanations, exam blueprint, `src/lib/part107/exam.ts` and its test). They are intended. Do not revert or reformat them.
- `generated/part107/` is git-ignored and built by `npm run part107:build-content`. Rebuild it after any change under `content/part107/`.
- Checks that must pass when you finish: `npm run part107:validate`, `npm test`, `npm run lint`, `npx tsc --noEmit`.
- The design files have only been syntax-checked, never visually reviewed. If something in a design looks broken (overlap, clipped text), fix it in the React version and say so. Do not copy a visual bug.

## What to build

One component per animation in `src/components/animations/`, plus shared pieces. Each animation is a 16:10-ish stage with a caption, controls, and a dark summary card.

| ID | Design file | Component | Type | Lesson section it belongs in |
|---|---|---|---|---|
| R1 | `R1-AltitudeLimit.dc.html` (dark: `R1-AltitudeLimit-Dark.dc.html`) | `AltitudeLimit` | scrub | `sec-reg-operating-limits` |
| R2 | `R2-CloudBox.dc.html` | `CloudBox` | scrub | `sec-reg-operating-limits` |
| R4 | `R4-DayTwilightNight.dc.html` | `DayTwilightNight` | scrub | `sec-reg-day-night` |
| R6 | `R6-CategorySorter.dc.html` | `CategorySorter` | pick | `sec-reg-ops-categories` |
| R8 | `R8-RemoteID.dc.html` | `RemoteId` | pick | `sec-reg-remote-id` |
| A1 | `A1-AirspaceStack.dc.html` | `AirspaceStack` | 6-beat loop | `sec-as-overview` |
| A2 | `A2-ChartLineToShape.dc.html` | `ChartLineToShape` | pick | `sec-as-class-e-chart` |
| A4 | `A4-AGLvsMSL.dc.html` | `AglVsMsl` | scrub | `sec-as-ground-hazards` (suggested) |
| W3 | `W3-CeilingToAltitude.dc.html` | `CeilingToAltitude` | scrub | `sec-wx-metar-sky` |
| O1 | `O1-TrafficPattern.dc.html` | `TrafficPattern` | 6-beat loop | `sec-ops-airport-traffic` |
| L1 | `L1-LoadFactor.dc.html` | `LoadFactor` | scrub | `sec-lp-load-factor` |

Interaction types:

- **scrub**: a slider drives the scene; readouts and the legal / not-legal badge update live.
- **pick**: the student chooses an answer for a scenario and gets immediate feedback.
- **6-beat loop**: auto-advances one beat every 2600 ms with Replay, Back and Next. With reduced motion it starts on beat 6 and does not auto-advance.

## Reading the design files

Each `.dc.html` is a self-contained artboard, 720 x 820:

- `<helmet>` holds the CSS, including keyframes.
- The markup is plain HTML and inline SVG with `{{name}}` holes, `<sc-if>` conditionals and `<sc-for>` loops.
- The `<script>` at the bottom has a `class Component extends DCLogic`. Its state and `renderVals()` are the full logic: thresholds, captions, beat text, scenario lists and correct answers. Port that logic, do not re-derive it.

Take all numbers, captions and Bogeyman lines from the design files exactly. They were verified against eCFR and the lesson text.

## Wiring into lessons

`LessonSection.visualizer` in `src/lib/part107/schema.ts` currently allows `"airspace" | "metar"`, and `src/app/learn/[moduleId]/[lessonId]/page.tsx` renders them with two `if` blocks.

1. Extend the enum with one value per animation and replace the `if` blocks with a registry map from type to component. Load animation components with `next/dynamic` so they stay out of the lesson page's first load.
2. `sec-reg-operating-limits` needs two animations (R1 and R2). Let a section carry more than one, for example an optional `visualizers` array alongside the existing field, and keep existing content valid.
3. Add the entries to `content/part107/modules/*.json`, then rebuild generated content. Update `scripts/part107/validate.ts` if it checks visualizer types.
4. `sec-as-overview` already shows the existing `AirspaceVisualizer`. Show A1 above it and keep both; do not delete the existing component.

## Shared pieces

- `AnimationFrame`: header (title + category chip), stage, caption, controls slot, dark summary card.
- `Drone`: the SVG drone used on every stage. Props: `size`, `flying`, `dark`. Spec below.
- `BogeymanPortrait`: the small head-and-shoulders SVG on the summary card. This is separate from `src/components/Bogeyman.tsx`; leave that component unchanged unless the owner asks for it to be redrawn to match.
- `LegalBadge`: legal = volt-green fill with a check; not legal = `#b42318` outline with a cross. Never signal legality by color alone.
- `useReducedMotion` from `motion/react` for the reduced-motion paths.

### Drone spec

SVG `viewBox="0 0 88 40"`. Square ice-blue body (`rect` 22 x 18, `rx` 4, jet-black 2px stroke), black visor, volt-green status light, two front arms plus a rear mast, three propellers, landing legs, gimbal. Copy the path data from `R1-AltitudeLimit.dc.html`.

Propellers: each is a blade (`.pblade`) and a disc (`.pdisc`). At rest the blade spins slowly (0.5 s) and the disc is hidden. While the drone is moving (slider being dragged, or for 700 ms after the last change) the blade speeds up to 0.1 s and the disc fades in to 0.65 opacity, so the blades blur into a circle. With reduced motion, no spin; show the static blade.

## Design rules

- Use the Tailwind tokens already in `tailwind.config.ts` (ice-blue, deep-ice-blue, mist-blue, volt-green, volt-lime, volt-mist, jet-black, graphite, slate, fog-gray, divider-gray). No new brand colors.
- Chart blue `#1F4E9A` and chart magenta `#8E1C5E` are used only for airspace drawn the way a sectional chart draws it (A1, A2). Add them as tokens named for that purpose.
- Pill buttons, 12-13px card radius, Helvetica Neue stack, tabular numerals on readouts.
- The header chip shows the test category in plain words: Regulations, Airspace, Weather, Loading & Performance, Operations. No ACS codes on screen.
- The summary-card chip names the source in plain words (Part 107 rules, Remote ID rules, FAA chart guide, FAA pilot handbook, FAA airport procedures). No CFR section numbers on screen. Keep the exact citation in the component as a `citation` prop or data attribute so it is not lost.
- Bogeyman says one short line per animation, exactly as written in the design.

## Accessibility and behavior

- Every slider is a real `input[type=range]` with a label and `aria-valuetext` that includes units (for example "450 feet above ground, not legal").
- Readout and verdict changes are announced through an `aria-live="polite"` region.
- All controls are keyboard-reachable with a visible focus ring. Pick options are buttons or radio inputs.
- Honor `prefers-reduced-motion` on every animation.
- The stage scales down to a 360px-wide viewport without horizontal scroll.
- Only R1 has a dark design. Do not invent dark versions of the others.

## Facts not yet confirmed at the source

Build these as designed, but mark each with a `// TODO(verify)` comment and list them in your summary:

- **A2**: the chart line styles (which Class E floor each line and vignette means) are placeholders pending a check against the FAA Aeronautical Chart Users' Guide.
- **O1**: the traffic-pattern details cited to AIM 4-3-3.
- **L1**: the load-factor values per bank angle cited to the Pilot's Handbook (FAA-H-8083-25).

## Out of scope

- Phase 2 animations (the other 38 in the animation plan).
- Redrawing `Bogeyman.tsx`.
- Changing lesson text, questions, or the exam blueprint.
- Committing or pushing. Leave the work uncommitted for the owner to review unless asked.

## Suggested order

1. Shared pieces and the registry, with R1 end to end in its lesson. Stop and show it.
2. The other scrub animations (R2, R4, A4, W3, L1).
3. Pick animations (R6, R8, A2).
4. Loops (A1, O1).
5. Tests for the pure logic (verdict thresholds, pick answers, beat sequencing), then the checks listed at the top.
