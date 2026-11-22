# The blueprint is the single source of exam facts

status: accepted

## Context

The PSI "Unmanned Aircraft General – Small" Applicant Information Bulletin (effective 2025-09-29, read 2026-11-21 from the PDF) confirmed the test specification: 60 scored questions, 120 minutes, 70% to pass, weighted 48/20/5/2/25 across the five areas per a 2025 job task analysis. The blueprint record already matched — but the exam page hardcoded the 7200-second timer (twice) and the results page hardcoded the 70% threshold. They agreed with the blueprint by coincidence, not by wiring. Sourced numbers restated in several places stop being sourced.

## Decision

Exam facts — question count, time limit, passing score, domain weights — live in the **Exam Blueprint** record and nowhere else. Pages read them; they never restate them. Which blueprint and which seed the app runs is one module's decision, consumed by the compat layer and the pages alike.

Two scoring rules fall out of taking "70% correct" literally:

1. **The pass threshold is a count, not a rounded percentage.** A sitting passes when correct answers ≥ ⌈passingScore × questions asked⌉. The previous rule (`round(pct) >= 70`) passed 69.5–69.9% scores — invisible at 60 questions, wrong at any total where a score lands in that window. Percentages are display artifacts; nothing is decided on them.
2. **A draw that cannot fill the blueprint is a build failure, not a smaller exam.** Grading on "questions asked" is only safe if the draw always asks what the blueprint promises. Validation hard-fails when any domain's active questions cannot cover its allocated share of the draw. Previously the generator backfilled from other domains and, past that, silently shortened the exam.

## Considered options

- **Grade against the blueprint's total regardless of draw size.** Rejected: grades the candidate on questions they were never shown.
- **Shortfall as a warning.** Rejected: warnings don't fail the build here, so a thinning domain would degrade every draw until someone happened to read the build log.

## Consequences

- Sittings previously passing on a rounded-up 69.x% now fail. That is the bulletin's rule, not a regression.
- Retiring questions in a thin domain can block the build. That is the check working: restore coverage or change the blueprint, explicitly.
- Bogey models only the 60 scored questions. The real sitting adds 5 unscored validation questions inside the same 120 minutes, so a practice sitting's pacing is slightly generous. Modeling them is deferred — the trigger to revisit is wanting realistic pacing practice.
