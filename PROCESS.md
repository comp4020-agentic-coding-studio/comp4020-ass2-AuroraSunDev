# Process overview

## What I built

**SLOP2895 — The Sandwich Must Hold**, a twelve-week course site that treats a
sandwich as a structural specimen: how layers carry load, exchange moisture and
come apart under handling. The joke is the subject, never the delivery. I
decided early that a good course site is one a marker can be *answered* by — it
states what the course requires, what counts as evidence, and what it cannot
establish — and that everything which makes a real course trustworthy is
structural, not decorative: an assessment total that adds up, twelve weeks that
are actually dated, and a classification the course is honest about having
invented.

## How I got here

I wrote the design first and treated it as evidence, committing the plan and its
reference set before any page existed
([`8aa6548`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AuroraSunDev/commit/8aa6548)),
then built the homepage back against those references
([`803a7e0`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AuroraSunDev/commit/803a7e0)).
The curriculum, the four briefs and the real Week 4 deck followed, and the site
grew from eight pages to thirty-one across
[`063a38c...8c79630`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AuroraSunDev/compare/063a38c...8c79630).

The decisions I cared about most I encoded rather than remembered. Four promises
about the course became executable checks in `spec/course-promises.test.ts`
([`321e349`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AuroraSunDev/commit/321e349)):
the assessment totals exactly 100%; the twelve weeks run 1–12 dated and
gapless; an *anti-recipe gate* fails the build on food-blog vocabulary, cooking
quantities or preparation instructions, and requires both entry pages to promise
that no student must handle or consume food; and the four failure families may
never be presented as a professional standard. Those checks are the record of
what I decided had to stay true — a marker can read them instead of trusting me.

The harness in `CLAUDE.md` holds what I kept getting wrong. Two rules earned
their place. *Check both graded viewports* — with the note that headless Chrome
clamps its layout viewport near 490px, so a 390px check must run in an iframe or
it silently passes. And *make a new check fail for the right reason once before
trusting it*: obeying that rule caught three error messages I had written into
my own test comments that the tests never actually printed.

The harness kept paying out. A tooling check found evidence photographs
rendering at the correct size 36px left of their own figures — invisible in a
screenshot, caused by a theme rule that bleeds images past the page margins
([`3b33093`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AuroraSunDev/commit/3b33093)).
Measuring found the header sitting in an 864px column while every section below
it ran to 1760px
([`8525404`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AuroraSunDev/commit/8525404)),
and the homepage drawing the same twelve weeks twice
([`7b65626`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AuroraSunDev/commit/7b65626)).
The pattern I would keep: when a layout looks wrong, measure it rather than
squint at it.

What I deliberately left unencoded: voice. Nothing checks whether the writing is
dry enough or the deadpan lands, because a check that graded tone would either
be trivial or wrong, and that judgement is the marker's. I also cut the optional
Load Tester rather than ship a half-built interaction, and left the Field
Manual's wide tables scrolling sideways on a phone rather than restructure them
late.
