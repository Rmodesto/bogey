# Phase 3 lesson animations: build notes

Built 2026-11-22 from the design boards in `docs/animations/designs/` (exported from the canvas the same day), following `HANDOFF-PHASE-3.md`. All 20 animations are implemented, wired, and tested; this file records only what the handoff could not know in advance.

## Placements

Every animation sits in the lesson section the handoff names. Two sections now carry a second animation through the `visualizers` array:

- `sec-as-ground-hazards`: A4 (AGL vs MSL) renders first, then A9 (Invisible hazards).
- `sec-ops-emerg-link-loss`: O4 (Lost link and GPS loss) renders first, then O12 (Radio line of sight).

One placement worth the owner's eye: the handoff marks O12's home as suggested. The implementation review found `sec-ops-emerg-ops-special` an equally strong fit — its "Frequency Spectrums" block (2.4/5.8 GHz shared bands, interference, clear-path dependence) is the animation's exact content. O12 is wired per the handoff; moving it is a two-line change in `content/part107/modules/operations.json`.

## Citations

The Phase 3 design boards carry only the plain-words source chip, not an exact citation string. The `citation` props were therefore mapped from chips by the precedent set in Phases 1–2 ("FAA pilot handbook" → `FAA-H-8083-25`, "FAA weather handbook" → `Aviation Weather Handbook`, "FAA remote pilot guide" → `FAA-G-8082-22`) or chosen from the lesson text (R10 `14 CFR 107.13; 14 CFR Part 48`, R13 `14 CFR 107.37`, R14 `14 CFR 107.61; 14 CFR 107.65`, A9 `AIM 7-5-15`, O2 `AIM 2-3`, O11 `AIM 2-1`). The chosen cites for A9, O2, and O11 have not been opened and are flagged below.

## TODO(verify) markers carried in code

Per the handoff list: R10 (3-year registration period, external-marking rule), A9 (turbulence above stacks and cooling towers, AIM), W6 (thunderstorm stage names, "mature begins when precipitation starts"), W7 (sea breeze and land breeze), O11 (blue taxiway edge lights), L3 (the 16° critical angle stays labeled as an example wing). Illustrative formulas in W4, L2, L3, and L4 are marked `// ILLUSTRATIVE` and keep their on-screen labels.

## Design visual bugs fixed in the React versions

The boards were logic-checked but never rendered; per the handoff these were fixed, not copied:

- **R13**: the "Well clear" measuring arrow ran its lower arrowhead ~18 px into the drone's rotor disc on beat 5; shortened to end above the drone.
- **L4**: at high payload and high density altitude the payload package sank up to 9 px into the ground band; its bottom is clamped to the ground line.
- **W8**: the temperature polyline's last point dipped below the dew-point line while the readout clamps at 14°C; clamped to meet the line, matching the readout.
- **O9**: the "Observer" label was centered 4 px off its figure; aligned like the other labels.

## Text quirks copied verbatim (not bugs, per the port-exactly rule)

- W2's not-legal badge reads "Below 3 SM" even during the BECMG period when the forecast is "more than 6 SM" (the aria text says "below 3 statute miles or changing").
- W4's caption says "Pressure altitude X ft" while its slider is labeled "Field elevation", and it mixes the typographic minus with the ASCII hyphen ("it is -10°C, a difference of −25°C").
- R10's scale reads "0.40 lb" while the caption says "0.40 pounds".
- O2's caption "The other end is 18 away" (18, not 180°).
- O12's beats 5 and 6 both read "Signal: good".

## Component names

Component and logic-module names follow the handoff's table exactly (`RegistrationAndMarking`, `StableVsUnstable`, `ThunderstormLifeCycle`, `WindAroundObstacles`, `HowFogForms`, `FrontsInCrossSection`, `AngleOfAttackAndStall`, `HeavyHotAndHigh`, `RunwayNumbersAndSigns`, `BuildACtafCall`, `RiskCheckOnAJob`, plus the already-matching nine). Visualizer types are the twenty `anim-*` values appended to `VisualizerConfigSchema`.

## Checks at completion

`npm run part107:validate` and `part107:build-content` green; `npx tsc --noEmit` clean; `npm run lint` clean; `npx vitest run` 232/232 across 16 files (Phase 3 adds `loopLogicPhase3a`, `weatherLogicPhase3`, `scrubLogicPhase3`, `opsLogicPhase3` under `src/lib/part107/__tests__/`).
