# The server owns the bank, the Draw, the grade, and the Sitting

status: accepted

## Context

Every **Question** reached the browser. The study screen received the whole active bank with `isCorrect` on each choice and the full authored explanation; a lesson page's payload carried that lesson's **Questions** the same way; the exam screen drew its own **Draw** client-side, timed itself, graded itself, and handed the result to `/results` through the URL as `score`, `total`, `time`, and a JSON array of answers.

While Bogey was a free local study aid this was merely honest about itself. Two decisions ended it: candidates pay for exactly that material (ADR-0003), and a **Sitting** has to produce a record worth keeping. A self-reported score cannot be a record, and a two-hour **Sitting** that a browser refresh destroys — the seed is chosen in a component initialiser, so a reload silently starts a different **Draw** — cannot be sold.

A plan arrived proposing server-side grading while still sending pre-graded **Drill** answers up from the client, and explicitly avoiding any write when a **Sitting** starts. Both halves were incoherent: a client cannot pre-grade without the answer key, and a **Sitting** the server never recorded cannot be resumed.

## Decision

The authored bank is served to a browser only by a route that has checked **Entitlement**, and only in the amount needed:

- A **Drill** is a slice of about twenty **Questions**, chosen for that candidate by what they have answered worst or not at all. Keys and explanations come with the slice, because instant feedback is the point of a **Drill** and the alternative is a round trip per tap. The slice request carries the answers from the previous slice, so one call both records and selects, and selection always sees the answers just given.
- A **Draw** is assembled on the server and sent without keys or explanations. A **Sitting** row is written when the candidate starts, holding the **Draw**, the blueprint, the content version, and the start time. Answers reach that row periodically; the remaining time is computed from the start time, not reported by the client. Grading happens on the server from a module the client cannot import, and the result and explanations come back in the response.
- **Lesson Quizzes** are fetched the same way as a **Drill** slice rather than embedded in a prerendered lesson payload.

A candidate's chosen answer is stored as the choice's identifier, never as its position. Per-**Question** statistics carry the **Question**'s own version, and reset when that version moves.

## Considered options

- **Keep the full bank in the client and accept the exposure.** Rejected, though it survives on the merits for a free product: it is the best experience, the least code, and the only option with no new requests. One **Account** could export the product.
- **Grade every **Drill** answer on the server.** Rejected: it multiplies requests on the hottest path by twenty, puts the network between a tap and its feedback, and does not even achieve the goal — a determined scraper replays the fetch and brute-forces three choices per **Question**, reconstructing the key in a few hundred requests. The slice bounds bulk exposure; it was never going to make the key secret.
- **A signed token instead of a Sitting row, to avoid the write at start.** Rejected: the token lives in the tab, so it dies with the tab, which is the failure it was meant to prevent. One insert per **Sitting** is three writes a month against the eight the **Drills** already make.
- **Saving a Sitting's answers on every answer.** Rejected on cost: sixty writes per **Sitting** would exceed every other write in the product combined and hold the database awake through every **Sitting**. Periodic autosave costs the last few answers in a crash, which is the right trade against losing two hours.
- **Storing answers as option positions, with choice order frozen by convention.** Rejected: nothing in validation enforces choice order, so the first well-intentioned reorder rewrites history silently, and it would corrupt the one signal the operator screen exists to produce.
- **Snapshotting each Question's full text onto the Sitting row.** Rejected: around 35 KB per **Sitting** blows the storage budget on its own and copies content into a database deliberately kept free of it. Retiring instead of deleting achieves the same permanence for free.
- **Rate limiting at the network edge.** Deferred in favour of a counter on the row the slice endpoint already writes: the edge limits by address, which rotates freely, while the counter limits by **Account**, which now costs money. The trigger to revisit is wanting bot protection on sign-up and checkout, which a counter cannot give.

## Consequences

- **A Question id, once shipped, is never deleted — only retired.** Draws exclude retired **Questions**; lookups by id return them, so every stored **Sitting** stays reviewable and a deploy mid-**Sitting** cannot strand a candidate. Validation fails the build when a previously shipped id disappears. The authored files only grow.
- `manifest.contentVersion` becomes a hash of the authored content. It was the literal `"1.0.0"`, so as a stored field it recorded a constant.
- A **Lesson Quiz** result is a count, not a percentage. Quiz length runs from 1 to 32 **Questions** depending on the lesson, so percentages are not comparable between lessons — the same rule ADR-0002 set for a **Sitting**.
- **The estimate on the dashboard comes from Sittings alone.** A **Drill** serves a candidate their worst and unseen **Questions** by construction, so **Drill** accuracy is an adversarial sample, and pooling it with **Draws** would make the estimate fall as a candidate studies harder. **Drills** drive focus areas and selection, where the bias is the feature.
- Per-**Question** statistics reset when a **Question**'s version moves. A candidate loses history on precisely the **Questions** that changed, and a miskeyed **Question** fixed last week stops reporting last month's failure rate — without which the operator's content-accuracy signal would be permanently poisoned by its own past.
- The lesson lock is gone. A sequential lock made 20 of 25 lessons unreachable while nothing could mark a lesson complete; a **Completed Lesson** is now a record of what was read, not a gate on what comes next.
- The principle: the client may hold what a candidate is answering right now, and never the set they have not reached.
