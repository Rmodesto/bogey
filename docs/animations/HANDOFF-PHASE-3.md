# Lesson animations, Phase 3: handoff for implementation

Build the 20 Phase 3 lesson animations as React components, matching the designs in `docs/animations/designs/`. This phase finishes the animation plan (48 of 48).

Read `docs/animations/HANDOFF.md` first. Everything in it still applies: the shared pieces, the drone spec, the design rules, the accessibility rules, the checks to run, and the rule against committing. This document only adds what is new for Phase 3.

Design canvas (owner's view): https://claude.ai/artifact/BSeMWSepQMvrtgvBjCbYmJ

## Before you start

- Phase 1 must already be built. Phase 3 reuses `AnimationFrame`, `Drone`, `BogeymanPortrait`, `LegalBadge`, the visualizer registry, and the three players (scrub, pick, 6-beat loop). If any of those are missing, stop and say so.
- Phase 2 (17 animations) is designed on the canvas but has no handoff in this repo yet. Do not build Phase 2 from this document.
- The designs have only been logic-checked, never visually reviewed. Fix overlaps and clipped text in the React version and list what you fixed.

## What to build

| ID | Design file | Component | Type | Lesson section |
|---|---|---|---|---|
| R10 | `R10-RegistrationAndMarking.dc.html` | `RegistrationAndMarking` | loop | `sec-reg-registration` |
| R13 | `R13-RightOfWay.dc.html` | `RightOfWay` | loop | `sec-reg-right-of-way` |
| R14 | `R14-CertificateTimeline.dc.html` | `CertificateTimeline` | loop | `sec-reg-eligibility` |
| A9 | `A9-InvisibleHazards.dc.html` | `InvisibleHazards` | loop | `sec-as-ground-hazards` (suggested) |
| W2 | `W2-TafTimeline.dc.html` | `TafTimeline` | scrub | `sec-wx-taf-changes` |
| W4 | `W4-DensityAltitude.dc.html` | `DensityAltitude` | scrub | `sec-wx-density-concept` |
| W5 | `W5-StableVsUnstable.dc.html` | `StableVsUnstable` | loop | `sec-wx-stability` |
| W6 | `W6-ThunderstormLifeCycle.dc.html` | `ThunderstormLifeCycle` | loop | `sec-wx-thunderstorms` |
| W7 | `W7-WindAroundObstacles.dc.html` | `WindAroundObstacles` | loop | `sec-wx-wind-effects` |
| W8 | `W8-HowFogForms.dc.html` | `HowFogForms` | scrub | `sec-wx-fog` |
| W9 | `W9-FrontsInCrossSection.dc.html` | `FrontsInCrossSection` | loop | `sec-wx-icing` (the fronts table is in this section) |
| L2 | `L2-CenterOfGravity.dc.html` | `CenterOfGravity` | scrub | `sec-lp-cg-definition` |
| L3 | `L3-AngleOfAttackAndStall.dc.html` | `AngleOfAttackAndStall` | scrub | `sec-lp-weight-effects` (suggested) |
| L4 | `L4-HeavyHotAndHigh.dc.html` | `HeavyHotAndHigh` | scrub | `sec-lp-high-hot-humid` |
| O2 | `O2-RunwayNumbersAndSigns.dc.html` | `RunwayNumbersAndSigns` | scrub | `sec-ops-airport-markings` |
| O3 | `O3-BuildACtafCall.dc.html` | `BuildACtafCall` | pick | `sec-ops-radio-phraseology` |
| O8 | `O8-HazardousAttitudes.dc.html` | `HazardousAttitudes` | pick | `sec-ops-adm-hazardous` |
| O9 | `O9-RiskLoopOnAJob.dc.html` | `RiskCheckOnAJob` | pick | `sec-ops-adm-pave` |
| O11 | `O11-AirportLighting.dc.html` | `AirportLighting` | loop | `sec-ops-airport-lighting` |
| O12 | `O12-RadioLineOfSight.dc.html` | `RadioLineOfSight` | loop | `sec-ops-emerg-link-loss` (suggested) |

"Suggested" means no lesson section covers the topic directly and this is the closest fit. Confirm with the owner before moving one.

Take all captions, numbers, scenario text, correct answers and Bogeyman lines from the design files exactly. The logic is in each file's `renderVals()`.

## What is new in this phase

- **Monospace weather text.** W2 shows a raw TAF in a monospace block and highlights the group that applies at the slider's time. Use the system monospace stack.
- **Dark stage.** O11 uses a jet-black stage for a night scene. This is a stage background only, not a dark theme; the frame around it stays light.
- **Five-option pick.** O8 has five answers in a two-column grid, on a shorter scene (120px tall) so the buttons fit.
- **Moving objects in loops.** R13, A9, W6, W7 and O12 move the drone or another aircraft between beats with a CSS transform transition (1.2s). With reduced motion, jump to the end position with no transition.
- **Two scenes in one loop.** W7 cross-fades from a building scene (beats 1 to 4) to a coastline scene (beats 5 and 6).
- **Calculation in the caption.** W4 shows the worked density-altitude sum in the caption for the current slider values. Keep it a live region, and keep the formula exactly as the lesson gives it: pressure altitude + 120 x (temperature minus standard temperature), with standard temperature 15°C at sea level falling 2°C per 1,000 ft.

## Color is never the only signal

Several Phase 3 scenes are about colored lights and signs. Every colored light or sign must carry its color as a word next to it, as the designs do (O11 beacon dots, O2 signs). Do not drop those labels to save space.

## Numbers that are illustrative, not real

These bars show direction only. Keep the on-screen "illustrative" label, and mark each formula `// ILLUSTRATIVE` in code:

- W4: the climb-and-lift bar and the air-molecule spacing.
- L2: the front and rear motor percentages, and the plus or minus 6 cm balance limit.
- L3: the lift bar.
- L4: the climb-rate and flight-time percentages.

## Facts not yet confirmed at the source

Phase 3 content was taken from the lesson text and was not re-checked against FAA publications. Build as designed, mark each of these `// TODO(verify)`, and list them in your summary:

- **W7**: the sea breeze and land breeze explanation. It is not in the lesson text.
- **O11**: blue taxiway edge lights. Not in the lesson text. The beacon patterns are in the lesson but cite the AIM, which has not been opened.
- **L3**: the 16° critical angle. It is labeled on screen as an example wing, and must stay labeled that way.
- **W6**: thunderstorm stage names and "mature begins when precipitation starts", pending a check against the Aviation Weather Handbook.
- **A9**: turbulence above stacks and cooling towers, pending a check against the AIM.
- **R10**: the 3-year registration period and the external-marking rule, pending a check against 14 CFR Part 48.

## Suggested order

1. Loops with no moving objects: R10, R14, W5, W9, O11.
2. Loops with motion: R13, A9, W6, W7, O12.
3. Scrub: W2, W4, W8, L2, L3, L4, O2.
4. Pick: O3, O8, O9.
5. Wire each into its lesson section, rebuild generated content, add tests for the pure logic (W2 segment by hour, W4 density altitude, W8 spread, O2 runway number and reciprocal, pick answers), then run the checks from `HANDOFF.md`.

Stop after step 1 and show the result before continuing.
