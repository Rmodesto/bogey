# Phase 2 lesson animations

Source: "Bogeyman Animation Plan" (claude.ai artifact `b3685dde-515c-4560-94c8-aa310b00f7fb`), read 2026-11-22.
Phase 2 per the plan's build order: **R3, R5, R7, R9, R11, R12, A3, A5, A6, A7, A8, W1, L1, O4, O5, O6, O7, O10** — "mostly scenarios, plus the night set (A7, O6, O7, O10)". L1 was already built in Phase 1, leaving 17 to build.

Design files for all 17 landed on the canvas on 2026-11-22 (exported via the canvas "Entire project" download) and live in `docs/animations/designs/` alongside the Phase 1 boards. The implementations were first built from the plan's descriptions, then reconciled to the design files — the design `DCLogic` scripts are the authoritative source for every number, caption, and Bogeyman line. The designs were never visually rendered by their author; visual bugs found in them were fixed in the React versions and noted.

Formats (from the plan): **Scrub** — one slider drives the scene. **Scenario** — student makes a legal / not-legal call, then watches the consequence (3–5 beats; maps to the Phase 1 "pick" pattern). **Loop** — 10–20 s auto-advancing beats with Replay/Back/Next (Phase 1 6-beat loop pattern).

## Roster

| ID | Animation | What it shows | Format | ACS codes | Trap it targets | Verify at |
|---|---|---|---|---|---|---|
| R3 | Groundspeed, not airspeed | Same drone, same airspeed, headwind then tailwind. The groundspeed readout crosses 87 knots (100 mph) only with the tailwind. | Scrub | UA.I.B.K21a | "100 knots"; treating the limit as airspeed | 14 CFR 107.51(a) |
| R5 | Line of sight | Drone passes behind a building and the sight line breaks. A visual observer restores coverage; binoculars and FPV goggles do not. | Scenario | UA.I.B.K10, K11 | Counting vision aids or a camera feed as VLOS | 14 CFR 107.31, 107.33 |
| R7 | Over people and vehicles | Top-down site: transit across a road versus hovering over it; a closed, restricted-access site where everyone has notice. | Scenario | UA.I.E.K1, K4, K6, K8 | Treating all flight over people as the same | 14 CFR Part 107 Subpart D |
| R9 | Report or not | Three incident clips run through a decision tree: serious injury, loss of consciousness, property damage over $500. Clock shows 10 calendar days. | Scenario | UA.I.A.K4 | Counting damage to the drone itself | 14 CFR 107.9 |
| R11 | Eight hours and 0.04 | Timeline from last drink to launch. Two gates must both be open: 8 hours elapsed and under 0.04. | Scrub | UA.I.B.K8; UA.V.E.K2 | The 0.08 driving limit; 12-hour rule | 14 CFR 107.27, 91.17 |
| R12 | Moving vehicles and cargo | Pilot in a truck bed in open country versus in town; a package for hire flips the answer. | Scenario | UA.I.B.K6b, K7, K26 | Assuming moving-vehicle flight is always banned or always fine | 14 CFR 107.25 |
| A3 | Getting authorization | Facility map grid over an airport with a ceiling in each square. Request goes out through LAANC and comes back approved up to that ceiling. | Loop | UA.I.B.K16; UA.II.B.K2 | Calling the tower by radio | 14 CFR 107.41 |
| A5 | Special-use gallery | One aircraft flies through prohibited, restricted, warning, MOA, alert, and controlled firing areas. Each reacts differently: wall, gate, or caution. | Loop | UA.II.A.K2; UA.I.B.K18 | Treating MOAs as closed, or restricted areas as advisory | AIM ch. 3 |
| A6 | TFRs and training routes | A TFR ring appears over a stadium and a wildfire, driven by a NOTAM. A military jet runs a low-level route across the map. | Loop | UA.II.A.K3; UA.I.B.K19; UA.II.B.K5 | "TFRs are only cautions"; skipping the NOTAM check | AIM (MTR numbering/altitude rule) |
| A7 | Lights at night | Aircraft position lights rotate so the student reads direction from red, green, and white. Tower lights and unlit guy wires fade in. | Scenario | UA.II.B.K7, K8, K9 | Misreading which way an aircraft is heading | AIM 4-3-23; PHAK |
| A8 | Latitude and longitude | Crosshair slides over a sectional grid while the coordinates count in degrees and minutes. | Scrub | UA.V.B.K6a | Reading minutes in the wrong direction | Chart Users' Guide |
| W1 | METAR, group by group | A METAR line lights one group at a time while a small scene builds to match: windsock, visibility, cloud layers, thermometer. Intro for the decoder tool. | Loop | UA.III.A.K2 | BR as fog; cloud heights read as MSL; local time for Z | Aviation Weather Handbook |
| O4 | Lost link, fly-away, GPS loss | Link bar drops. Programmed return-to-home climbs and returns; second clip shows GPS loss and drift in wind; third shows a fly-away. | Scenario | UA.V.C.K1, K3, K4 | Return altitude below obstacles; no plan before launch | FAA-G-8082-22 |
| O5 | Lithium battery failure | Cutaway of a damaged or over-charged cell: swelling, heat, venting, fire spreading cell to cell. Ends on inspection, charging, and transport rules. | Loop | UA.V.C.K2a to K2d | Flying or charging a swollen battery | SAFO 10017; FAA-G-8082-22 |
| O6 | Night vision | Eye cutaway: cones in the center, rods off-center. Dark adaptation timer runs; a bright phone screen resets it. Off-center viewing finds the drone. | Loop | UA.V.E.K6, K8 | Staring straight at a dim light | FAA-G-8082-22; PHAK (dark adaptation time) |
| O7 | Night illusions | First-person view: a fixed light seems to drift; a sloping row of lights passes for the horizon. | Scenario | UA.V.E.K9 | Trusting a single light for position | FAA-G-8082-22; PHAK |
| O10 | Preflight walkaround | Camera orbits the drone and controller, stopping at each check; a night variant adds lights. One cracked prop is planted to find. | Scenario | UA.V.F.K2, K6; UA.I.B.K20 | Skipping the control station and battery checks | 14 CFR 107.49 |

## Facts the plan flags for source confirmation (carry TODO(verify) until checked)

- R9: $500 threshold, what counts, 10 calendar days — 14 CFR 107.9
- R12: conditions for operating from a moving vehicle — 14 CFR 107.25
- A6: military training route numbering and altitude rule — AIM
- O6/O7: dark adaptation time; which illusions the FAA names for remote pilots — FAA-G-8082-22, PHAK

## Phase 3 (not now)

R10, R13, R14, A9, W2, W4–W9, L2–L4, O2, O3, O8, O9, O11, O12 — 20 animations, "lower test weight or simpler loops".
