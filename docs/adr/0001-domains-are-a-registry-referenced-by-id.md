# Domains are a registry; content references them by id

status: accepted

## Context

A **Domain** (exam content area) appeared in the content as a free-form string — on every question, every module, and every blueprint weight: 207 occurrences across seven files. Nothing enforced agreement between them; a typo'd domain silently dropped questions from exam draws, and a rename meant editing every record with no check that the pass was complete. The PSI Applicant Information Bulletin (effective 2025-09-29) also pins each content area to an ACS area code (UA.I–UA.V) and a full ACS name, and the repo had nowhere to put that mapping as data.

## Decision

Domains are a first-class authored content type: a registry file listing each **Domain** once with its id, display name, full ACS area name, and ACS area code. Questions, modules, and blueprint domain weights reference a domain **by id**, like every other cross-reference in the content (FAA references, ACS refs, figures, lessons). Validation fails the build when any record references an unknown domain id.

The build step resolves ids to display names on the way out, so the generated output — and therefore every page and test downstream — still sees the display string. The id lives alongside it in the generated records.

## Considered options

- **Registry keyed by the display string, content unchanged.** Rejected: leaves the foreign key as prose. A membership check that matches on display text still accepts the string drifting from what the registry *means*, and a future rename still costs an unverifiable 207-edit pass.
- **Display string as the id.** Rejected: satisfies the convention in name only; a human-facing label becomes a primary key, so the next rename costs exactly what this change was meant to make cheap.
- **Ids in content, resolved at build (chosen).** The 207-edit migration is mechanical and happens once, while the bank is at its smallest it will ever be.

## Consequences

- A domain's display name can change in one place, with no content edits.
- Any new record with a misspelled domain id is a build failure, not a silently thinner exam.
- The authored shape and the generated shape of `domain` differ on purpose: authored holds the id, generated holds the display name (plus `domainId`). Code reading generated output never sees ids; code validating authored content never sees names. Crossing that line is a bug, not a style choice.
- The ACS area code and full ACS name now exist as data, not prose. The dividing line: the registry's `name` is what Bogey shows; `acsArea` is what the FAA calls it.
