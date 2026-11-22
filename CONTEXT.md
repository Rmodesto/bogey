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
- The Airman Certification Standards name one **ACS Area** "Airspace Classification and Operating Requirements"; Bogey calls that **Domain** "Airspace Classification". Unresolved — see open question on domain naming.
