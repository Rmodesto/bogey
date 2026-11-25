# Bogey

Bogey prepares a candidate for the FAA's Unmanned Aircraft General – Small knowledge test, the exam behind a Part 107 remote pilot certificate. It teaches through authored lessons and drills against a question bank, and its practice exams are built to mirror the real test's mix of subject matter.

## Language

### Subject matter

**Domain**:
A subject area of the knowledge test, used to tag every **Question** and every **Module**.
_Avoid_: Category, topic, subject, section

**ACS Area**:
The Airman Certification Standards' own name and roman-numeral code for a **Domain**.
_Avoid_: ACS domain, ACS category

**ACS Code**:
The Airman Certification Standards' identifier for one specific piece of required knowledge, finer-grained than an **ACS Area**. It is a label the FAA owns and can revise; Bogey shows it but does not key anything on it.
_Avoid_: ACS id, ACS ref, knowledge code

### Access

**Account**:
The identity a candidate signs in to. Bogey requires one for everything except the landing page — there is no signed-out study, drilling, or sitting.
_Avoid_: User, profile, login

**Access Window**:
The fixed period of time a single purchase grants a candidate. It is bought once, it expires on a date, and it is not renewed automatically.
_Avoid_: Subscription, plan, membership, license, seat

**Access Grant**:
One record of access: what granted it, when it starts, when it expires. An **Access Window** is the span a grant covers. A grant is either bought or given as a **Trial**.
_Avoid_: Licence, token, voucher

**Trial**:
A short **Access Grant** given once to a new **Account**, with no payment and no card. It is the same kind of grant as a purchase, differing only in what created it and how long it runs.
_Avoid_: Free tier, demo, freemium, preview

**Platform Admin**:
Whoever operates Bogey. Sees content accuracy signals across all **Accounts** and can look up one candidate's record to answer a support question. Not a candidate role.
_Avoid_: Admin (bare), superuser, owner

**Entitlement**:
Whether a given **Account**'s **Access Window** covers right now. It has two states: a candidate may *study* (lessons, **Drills**, new **Sittings**) or may only *look* (their record and past **Sittings**). Every gated screen asks which.
_Avoid_: Permission, access level, tier

### Studying

**Completed Lesson**:
A **Lesson** whose last section the candidate has reached. Nothing is locked behind it; completion is a record of what has been read, not a gate.
_Avoid_: Finished lesson, passed lesson, done

**Drill**:
A pass through **Questions** chosen for one candidate by what they have answered worst or not at all. A **Drill** is not a **Draw** — it is not blueprint-weighted and it never produces a result.
_Avoid_: Practice set, quiz, study session, slice

**Bank Coverage**:
The share of a **Domain**'s **Questions** a candidate has already been shown. High coverage means a **Sitting** is testing recall of Bogey's bank rather than knowledge of the subject, so Bogey shows it next to any estimate.
_Avoid_: Completion, exposure, saturation

**Lesson Quiz**:
The **Questions** attached to one **Lesson**. Their number varies by lesson, so a lesson quiz result is a count, never a percentage.
_Avoid_: Lesson test, check, knowledge check

### The exam

**Exam Blueprint**:
The recipe for a practice exam — how many **Scored Questions**, how they divide across **Domains**, how long the candidate gets, and what fraction they must answer correctly.
_Avoid_: Exam config, exam template, exam spec

**Draw**:
The particular set of **Questions** an **Exam Blueprint** produced on one occasion.
_Avoid_: Generated exam, exam instance, question set

**Sitting**:
One candidate's attempt at a **Draw**, from start to submission.
_Avoid_: Exam attempt, test run, session

**Scored Question**:
A **Question** whose answer counts toward the candidate's result.
_Avoid_: Real question, counted question

**Unscored Validation Question**:
A question the FAA includes in a real test to trial it for future use, which does not count toward the result and is not identified to the candidate.
_Avoid_: Pretest question, experimental question, dummy question

### Scoring

**Passing Score**:
The fraction of **Scored Questions** a candidate must answer correctly, set by the **Exam Blueprint**.
_Avoid_: Pass rate, pass mark, passing grade, cut score

**Pass Threshold**:
The whole number of correct answers a candidate needs, rounded up from the **Passing Score** applied to the number of questions actually asked.
_Avoid_: Passing score, required score, minimum score

## Relationships

- An **Account**'s learning record belongs to the candidate alone; no organisation owns it, and nothing but an **Access Grant** is ever bought on someone else's behalf
- An **Account** may open unlimited **Drills** and **Sittings** while its **Access Window** is live; nothing is rationed
- An **Account** receives at most one **Trial**, ever
- A bought **Access Grant** never shortens an **Access Window**: it runs from the later of today and the current expiry
- An **Account** holds at most one open **Access Window**; **Entitlement** is that window compared against the present moment
- A **Sitting** belongs to exactly one **Account**; Bogey records no anonymous **Sittings**
- A **Sitting** survives the candidate leaving it: the same **Draw** and the remaining time are restored when they return
- Each **Question** addresses exactly one **ACS Code**, which sits inside exactly one **ACS Area**
- An **Exam Blueprint** produces many **Draws**; each **Draw** comes from exactly one **Exam Blueprint**
- A **Draw** is a set of **Scored Questions**; Bogey does not produce **Unscored Validation Questions**
- Each **Question** belongs to exactly one **Domain**, and each **Domain** corresponds to exactly one **ACS Area**
- A **Sitting** is graded by comparing its correct answers against the **Pass Threshold**, not against a rounded percentage

## Example dialogue

> **Dev:** "The blueprint says 60 questions and a passing score of 0.7. So the user needs 70%?"
>
> **Domain expert:** "They need 42 correct — that's the **Pass Threshold**. The **Passing Score** is 0.7, but what you grade against is a count, because that's what the real test counts. The percentage is something you show them afterward."
>
> **Dev:** "And if the **Draw** only comes back with 58 questions because a **Domain** ran dry?"
>
> **Domain expert:** "Then the **Pass Threshold** is 41, because you grade on what you asked. But a short **Draw** is a content bug, not a smaller exam — the **Exam Blueprint** is supposed to be fillable."

## Flagged ambiguities

- "exam" was used to mean the **Exam Blueprint**, the **Draw**, and the **Sitting** — resolved: these are three distinct concepts and the word "exam" on its own is not used.
- "score" was used to mean a count of correct answers, a percentage, and the **Passing Score** fraction — resolved: the count and the fraction are distinct, and a percentage is a display artifact that nothing is decided on.
- The real test presents five **Unscored Validation Questions** alongside its 60 **Scored Questions**, within the same time allowance. Bogey models only the **Scored Questions** — deliberately, for now. A **Draw** is therefore shorter than a real sitting, and its timing is correspondingly more generous.
- "ACS" was used for an **ACS Area**, an **ACS Code**, and the identifier of the record holding them — resolved: the **ACS Area** maps to a **Domain**, the **ACS Code** is the fine-grained label shown to candidates, and the record's identifier is what everything is keyed on. The label is never a key.
- The Airman Certification Standards name one **ACS Area** "Airspace Classification and Operating Requirements"; Bogey calls that **Domain** "Airspace Classification". Unresolved — see open question on domain naming.
- "admin" was used for both the operator of Bogey and an owner inside a customer organisation — resolved: **Platform Admin** is the operator, and the second concept does not exist. Organisations, seats and rosters are deliberately absent.
- "progress" is used for a candidate's accumulated learning record, but what it contains and where it is kept is not yet settled. Unresolved — do not use the bare word until it is.
- "free" was used to mean both "costs the candidate nothing" and "available without signing in". Resolved: signed-out use does not exist, and the only thing costing nothing is a one-off **Trial**. There is no permanently free tier.
