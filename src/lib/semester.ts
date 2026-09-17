/* The semester as data.
 *
 * The twelve teaching weeks, their structural questions and the four
 * assessments, in one place. The homepage load path reads this; the weeks
 * index and the week pages will read the same table, so a date or a title
 * exists once rather than being restated per page.
 *
 * Dates follow the approved Semester 1 2027 calendar: twelve teaching weeks
 * from Monday 22 February, an Easter teaching break in the week of 29 March
 * (Easter Monday falls on the 29th), and a final submission week ending
 * Friday 28 May. Every date here sits inside the course record's
 * startDate..endDate window, which spec/data-integrity.test.ts enforces once
 * these become content entries.
 *
 * A week's `date` is the Monday the teaching week commences --- the page is a
 * week, not one class.
 */

export interface Phase {
  numeral: string;
  name: string;
  weeks: [number, number];
}

/** The homepage's four-phase grouping (plan.md, Section 4 --- The Semester
 *  Load Path). Note the weeks index groups the middle phases differently;
 *  that is plan.md's own distinction between the two views, not a slip. */
export const PHASES: Phase[] = [
  { numeral: "I", name: "Define", weeks: [1, 3] },
  { numeral: "II", name: "Expose the Forces", weeks: [4, 7] },
  { numeral: "III", name: "Assemble and Transport", weeks: [8, 10] },
  { numeral: "IV", name: "Diagnose and Prove", weeks: [11, 12] },
];

export interface Week {
  week: number;
  /** Slug of the session entry, and therefore the URL: /sessions/<slug>/. */
  slug: string;
  title: string;
  /** The week's structural question --- one line, no answer. */
  question: string;
  /** Monday the teaching week commences. */
  date: string;
}

export const WEEKS: Week[] = [
  { week: 1, slug: "week-01", title: "What Counts as a Sandwich?", date: "2027-02-22",
    question: "Is the boundary defined by shape, materials, function, or use?" },
  { week: 2, slug: "week-02", title: "Bread Is a Beam", date: "2027-03-01",
    question: "How does the outer layer bear, distribute and recover from load?" },
  { week: 3, slug: "week-03", title: "Grip, Friction and Slip", date: "2027-03-08",
    question: "Why do individually stable materials move once assembled?" },
  { week: 4, slug: "week-04", title: "Moisture Is a Load", date: "2027-03-15",
    question: "How does liquid progressively compromise a boundary?" },
  { week: 5, slug: "week-05", title: "Load-Bearing Fillings", date: "2027-03-22",
    question: "Which layers support the assembly, and which only add load?" },
  { week: 6, slug: "week-06", title: "Sauce at the Interface", date: "2027-04-05",
    question: "When does an interface layer change from binder to lubricant?" },
  { week: 7, slug: "week-07", title: "Thermal Conflict", date: "2027-04-12",
    question: "How does temperature change one assembly's behaviour over time?" },
  { week: 8, slug: "week-08", title: "The Order of Layers", date: "2027-04-19",
    question: "Why does the same material set behave differently when reordered?" },
  { week: 9, slug: "week-09", title: "Cutting Geometry", date: "2027-04-26",
    question: "How does a cut change support, grip and exposed boundaries?" },
  { week: 10, slug: "week-10", title: "Packaging Is Part of the Structure", date: "2027-05-03",
    question: "Does packaging protect the assembly or impose a new load?" },
  { week: 11, slug: "week-11", title: "Failure Autopsy", date: "2027-05-10",
    question: "How can a failure sequence be reconstructed from limited evidence?" },
  { week: 12, slug: "week-12", title: "The Final Stress Test", date: "2027-05-17",
    question: "Can a design remain coherent under a declared use condition?" },
];

export interface Assessment {
  slug: string;
  title: string;
  weight: number;
  capability: string;
  /** The teaching week the task falls due at the end of. */
  dueWeek: number;
  due: string;
  summary: string;
}

/** Four submissions totalling 100%. The reference images place the milestones
 *  at different stations in the desktop and mobile compositions and disagree
 *  with each other; plan.md's own timing (end of weeks 3, 6, 11 and 12) and
 *  the approved calendar are authoritative, so those are used here. */
export const ASSESSMENTS: Assessment[] = [
  { slug: "field-log", title: "Sandwich Field Log", weight: 15, capability: "Observe",
    dueWeek: 3, due: "2027-03-12",
    summary: "Record four specimens, separating what was observed from what was inferred." },
  { slug: "component-test", title: "Component Test", weight: 20, capability: "Isolate",
    dueWeek: 6, due: "2027-04-09",
    summary: "Isolate one structural variable and test it under at least three conditions." },
  { slug: "failure-autopsy", title: "Failure Autopsy", weight: 25, capability: "Diagnose",
    dueWeek: 11, due: "2027-05-14",
    summary: "Reconstruct the most defensible failure sequence from incomplete evidence." },
  { slug: "final", title: "The Sandwich Must Hold", weight: 40, capability: "Synthesise",
    dueWeek: 12, due: "2027-05-28",
    summary: "Design, test, revise and defend one system against a declared load case." },
];

/** Guards every homepage link: a route is only linked once its page exists.
 *  Pass the ids the sessions collection actually built. */
export function weekHref(week: Week, existing: ReadonlySet<string>): string | undefined {
  return existing.has(week.slug) ? `/sessions/${week.slug}/` : undefined;
}

export const TOTAL_WEIGHT = ASSESSMENTS.reduce((sum, a) => sum + a.weight, 0);

/** The weeks index groups the middle of the semester differently from the
 *  homepage --- plan.md specifies Phase II as weeks 4-6 and Phase III as 7-10
 *  in the "Weeks Index" section, against 4-7 and 8-10 in the homepage's
 *  "Semester Load Path". That is a deliberate difference of view: the homepage
 *  rail is a load path with four stages, the index is a reading structure for
 *  twelve rows. Both are stated here so neither page invents its own. */
export interface IndexPhase extends Phase {
  /** One short line: what the phase does to the specimen. */
  line: string;
  /** The phase glyph drawn beside it on the phone composition. */
  glyph: "define" | "expose" | "assemble" | "diagnose";
}

export const INDEX_PHASES: IndexPhase[] = [
  { numeral: "I", name: "Define", weeks: [1, 3], glyph: "define",
    line: "Establish the structure." },
  { numeral: "II", name: "Expose the Forces", weeks: [4, 6], glyph: "expose",
    line: "Introduce load and environment." },
  { numeral: "III", name: "Assemble and Transport", weeks: [7, 10], glyph: "assemble",
    line: "Build, move and stress the system." },
  { numeral: "IV", name: "Diagnose and Prove", weeks: [11, 12], glyph: "diagnose",
    line: "Find failure. Prove the limit." },
];

/** The phase a week belongs to in the index's grouping. */
export const indexPhaseOf = (week: number): IndexPhase =>
  INDEX_PHASES.find((p) => week >= p.weeks[0] && week <= p.weeks[1])!;

/** Every week's dominant artefact --- the thing that leaves the session, and
 *  the subject of the miniature technical glyph on the index. plan.md's
 *  curriculum table is the source; no two weeks share one. */
export const WEEK_ARTEFACTS: Record<number, { artefact: string; glyph: string; alt: string }> = {
  1: { artefact: "Classification Field Note", glyph: "classify",
       alt: "A dashed boundary drawn around a layered specimen: the criterion under dispute." },
  2: { artefact: "Compression Record", glyph: "beam",
       alt: "A specimen spanning two supports, deflected under a central load." },
  3: { artefact: "Interface Comparison", glyph: "slip",
       alt: "A hatched layer with opposed shear arrows on either face." },
  4: { artefact: "Absorption Observation", glyph: "moisture",
       alt: "A stippled moisture front advancing through a boundary." },
  5: { artefact: "Load-Path Annotation", glyph: "loadpath",
       alt: "A load path traced down through a stack to its support." },
  6: { artefact: "Interface Incident Report", glyph: "interface",
       alt: "A continuous interface layer between two outer layers, thinning to a film." },
  7: { artefact: "Thermal Comparison", glyph: "thermal",
       alt: "The same specimen condition plotted at three time points." },
  8: { artefact: "Assembly Rationale", glyph: "order",
       alt: "A four-layer stack with one layer displaced to a new position." },
  9: { artefact: "Geometry Analysis", glyph: "cut",
       alt: "A cut line through a specimen, with force lines at the new free edges." },
  10: { artefact: "Transport Test", glyph: "transport",
        alt: "A specimen inside a packaging boundary, tilted, with a route trace." },
  11: { artefact: "Failure Autopsy", glyph: "autopsy",
        alt: "Evidence fragments joined by a branching causal chain." },
  12: { artefact: "Defended Final System", glyph: "final",
        alt: "A specimen in a compression rig under a declared load, held." },
};
