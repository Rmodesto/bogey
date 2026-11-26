# Progress is account-backed, access is bought, and the gate is enforced on the server

status: accepted

## Context

Bogey's locked decisions said no auth, no accounts, no server-side persistence, no payments, and no deploy configuration: `npm run dev` was the whole runtime story, and every one of its 32 routes was prerendered with zero server rendering and zero third-party calls. Progress existed nowhere, which is why `/learn` hardcodes `completedCount = 0` and the dashboard renders invented numbers.

That premise ended. Bogey is going to be sold to candidates preparing for the Unmanned Aircraft General – Small knowledge test, so a candidate's record has to follow them between devices, and the content they are paying for has to sit behind something.

A plan arrived proposing accounts and a database while keeping every content route static and anonymous, enforcing access in client components only. Interrogating it surfaced the contradiction: a prerendered page and its payload are fetchable by anyone who knows the URL, so a client-side check gates the interface and nothing else. There is no arrangement that both keeps content routes free of server invocations and actually withholds the content.

## Decision

An **Account** is required for everything except the landing page, and an **Account** reaches the material only while an **Access Grant** gives it a live **Access Window**. The gate runs on the server: request-time middleware on lesson routes, **Drill** routes, **Sitting** routes, and the dashboard. Lesson pages stay prerendered — middleware decides whether the prerendered response is served at all — so the gate costs an invocation, not a render.

**Entitlement** is a date comparison carried in the session token, not a database read: a purchase writes an **Access Grant** and mirrors its expiry into the session claims. A lifetime offer is a far-future expiry, not a second code path.

Money and identity stay outside Postgres. Stripe owns the charge, the auth provider owns the person, and the database holds a candidate identifier plus learning data. The **Access Window** opens for a year.

## Considered options

- **Client-enforced wall, content routes stay static and anonymous.** Rejected: it protects the interface, not the material. Every lesson's prose and every **Question** in a page payload stays retrievable with one HTTP request, which is indefensible once candidates are paying for exactly that material.
- **Keep everything free and unauthenticated, add accounts only to save progress.** Rejected with the decision to sell access; recorded because it was the better answer while Bogey was free, and it is what the earlier locked decisions assumed.
- **Subscription billing.** Rejected: the remote pilot certificate is earned once. A candidate studies for weeks and leaves, so recurring billing would run dunning, proration, and cancellation machinery for a lifecycle that does not recur. A one-time purchase with an expiry needs none of it.
- **The provider's built-in billing.** Rejected on capability (checked 2026-11-25): it bills subscriptions, not one-time purchases, so the chosen shape is not expressible in it.
- **Entitlement read from the database on each gated request.** Rejected: the gate fires on the highest-volume route in the product, so it would be the one query guaranteed to keep the database awake continuously — the exact cost the architecture is arranged to avoid. A date in a signed token costs nothing.
- **Organisations, seats, and rosters for flight schools.** Deferred. Learning data is never organisation-shaped — a candidate's history is theirs regardless of who paid — so the only retrofit is an optional owner on **Access Grants** and a membership table that does not exist yet. The trigger to revisit is a school asking to buy and manage seats.
- **Age gate at 13, or none at all.** Rejected: 14 CFR 107.61 requires a candidate to be 16 to hold the certificate, so the subject matter itself justifies a 16+ floor. It is attested at sign-up and stored nowhere, which keeps a minor's data out of the product entirely rather than handling it.

## Consequences

- **Content routes are no longer invocation-free, and that is the accepted price of the gate.** The budget check must stop asserting that every app route is prerendered; it keeps asserting prerendering for lesson routes and `/learn`, and it keeps every first-load JS budget. `/dashboard` is exempt: it is entirely candidate data and renders on request.
- A session claim can be up to a minute stale (the token refreshes on a ~50 s cycle), so a purchase forces a token refresh on the success page rather than waiting.
- Nothing is rationed inside an **Access Window**. Unlimited **Drills** and **Sittings** were priced before being allowed: a thousand candidates studying daily cost cents in request charges, because the database compute is shared and scales to zero rather than being billed per candidate. The limit on daily **Sittings** is the bank's depth, not the bill — which is why **Bank Coverage** is shown next to any estimate instead of a cap being imposed.
- **Entitlement has two states, study and look.** Expiry locks lessons, **Drills**, and new **Sittings** while leaving a candidate's record and past **Sittings** readable. With a year-long window, that read-only path cannot fire until a year after launch, so the states exist in the model now and the screens are deferred until there is real expiry behaviour to design against.
- An **Access Grant** is a row, not a column on the candidate. It costs a join the single-purchase case does not need, and it is what makes the organisation retrofit additive.
- The dividing line: Postgres holds learning data keyed by a candidate identifier. Identity, email, and money live in the services that own them, and deleting a candidate is one cascading statement.

## Amendment, 2026-11-25: a seven-day Trial

A candidate now gets one **Trial**: seven days of access, granted without payment and without a card. The billing model is unchanged — a single $49 charge still buys 365 days, there is no subscription, and Stripe is not involved until someone decides to pay.

A **Trial** is not a new concept in the model. It is an **Access Grant** whose source is a trial rather than a Stripe charge, with a seven-day expiry instead of a 365-day one. **Entitlement** stays exactly what it was: compare the expiry in the session claim against now. Nothing in the gate, the middleware, or any route learns the word "trial" in order to decide access — only the copy does, so a candidate can be told which kind of window they are in and how long is left.

Three consequences follow, and the third is the one that costs work.

**One Trial per Account, enforced in the schema.** A unique index over the owner, restricted to trial-sourced grants, makes a second trial impossible rather than merely discouraged. With no card at signup the only identity signal is the email address, so a determined person gets another seven days by registering another address. That is accepted: the cost of defeating it is a new mailbox, the cost of preventing it is asking for a card, and asking for a card is the thing a free trial exists to avoid.

**The Trial starts on first sign-in, automatically.** No "start your trial" screen and no second decision for the candidate to make. Someone who signs up, looks around for a minute and leaves will burn the window without using it; a start button would protect them at the price of a step, and the step is worth more than the protection.

**Read-only expiry is no longer deferrable.** ADR-0003 put the two **Entitlement** states — study and look — in the model but left the read-only screens unbuilt, on the grounds that a year-long window meant nothing could expire until a year after launch. A seven-day **Trial** collapses that: the first expiry happens in week two, and every candidate who does not convert sees it. The dashboard-and-history-only state has to ship with the gate, along with the paywall copy that follows it.

The risk worth naming: the product is small enough to be consumed inside the trial. Twenty-five lessons and 197 **Questions** is not a week's work for a motivated candidate, so a seven-day full-access **Trial** is close to giving the product away, and the people most likely to exhaust it are exactly the ones who would otherwise have paid. Two narrower shapes were considered and are available without reopening this decision, because both are expressible as a grant attribute rather than a new mechanism: a **Trial** scoped to one module, or one capped at a single **Sitting**. Neither was chosen now — a full-access trial is the clearest offer and the easiest to explain — but the trigger to revisit is a conversion rate that stays low while trial-week engagement stays high, which is the signature of a trial that finishes the job instead of starting it.

Also noted: trial candidates are real signed-in users, so they count toward the auth provider's monthly retained users in a way the earlier plan's guests did not. The free allowance is 50,000, so this is a fact to remember rather than a cost.
