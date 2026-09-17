/* The promises this course makes that no standard build check can see.
 *
 * `pnpm build` already checks accessibility, base-relative links, broken
 * links, deck structure, and that every scheduled date sits inside the
 * teaching period (spec/data-integrity.test.ts). None of that can tell whether
 * the course still means what it said it meant.
 *
 * These are the five promises in plan.md that are specific to SLOP2895, in the
 * order they would do the most damage if they quietly stopped being true:
 *
 *   1. assessment totals exactly 100%, and each brief's criteria total 100%;
 *   2. twelve dated teaching weeks, numbered 1 to 12 with no gaps;
 *   3. the anti-recipe gate --- nothing in the course reads as a recipe;
 *   4. twelve distinct dominant artefacts, no two weeks alike;
 *   5. the four failure families are never presented as a professional
 *      standard, and every week page ends with previous / all / next.
 *
 * Every check below was fed something it should reject before being trusted,
 * and the note above each one quotes the message it actually printed. A check
 * nobody has watched fail is a check nobody knows the meaning of.
 */
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
  body?: string;
}

interface CourseApi {
  course: { code: string; title: string };
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;
/* The API prefixes a node id with its collection ("sessions/week-01"); the
   route and the directory in dist are the bare slug. */
const slugOf = (node: ApiNode) => node.id.split("/").pop()!;
const nodesOf = (type: string) => api.nodes.filter((node) => node.type === type);
const sessions = nodesOf("sessions");
const assessments = nodesOf("assessments");

const html = (path: string) => readFileSync(resolve("dist", path, "index.html"), "utf8");
/** Rendered text, with tags and entities out of the way. */
const textOf = (path: string) =>
  html(path)
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ");

const builtWeekPages = readdirSync(resolve("dist/sessions"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  /* A stale dist can hold copies named "week-01 2"; those are not routes. */
  .filter((entry) => /^week-\d{2}$/.test(entry.name))
  .map((entry) => entry.name);

describe("1. the assessment adds up", () => {
  /* Fed a 20% field log, it printed:
       weights are 20 + 25 + 20 + 40: expected 105 to be 100 */
  it("totals exactly 100% across the four submissions", () => {
    const total = assessments.reduce((sum, a) => sum + Number(a.meta?.weight ?? 0), 0);
    expect(assessments, "four submissions are declared").toHaveLength(4);
    expect(total, `weights are ${assessments.map((a) => a.meta?.weight).join(" + ")}`).toBe(100);
  });

  /* The content schema already rejects a criterion set that misses 100, but it
     cannot see the rendered page. This reads the marking table the marker
     actually looks at.
     Fed a field-log page whose 40% criterion had been edited to 44%, it
     printed:
       field-log's page shows the 40% criterion: expected ' Sandwich Field
       Log ...' to contain '40%' */
  it("shows criterion percentages that total 100 on every brief", () => {
    for (const a of assessments) {
      const marking = a.meta?.marking as { mode?: string; criteria?: { weight: number }[] };
      if (marking?.mode !== "weighted") continue;

      const declared = marking.criteria!.reduce((sum, c) => sum + c.weight, 0);
      expect(declared, `${slugOf(a)}'s declared criteria`).toBe(100);

      const text = textOf(`assessments/${slugOf(a)}`);
      for (const criterion of marking.criteria!) {
        expect(text, `${slugOf(a)}'s page shows the ${criterion.weight}% criterion`).toContain(
          `${criterion.weight}%`,
        );
      }
    }
  });
});

describe("2. twelve dated teaching weeks", () => {
  /* Fed an API with week 7 removed, it printed:
       missing teaching weeks: 7: expected [ 7 ] to have a length of +0 */
  it("runs 1 to 12 with no gaps and no duplicates", () => {
    const numbers = sessions.map((s) => Number(s.meta?.week)).sort((a, b) => a - b);
    const expected = Array.from({ length: 12 }, (_, i) => i + 1);
    const missing = expected.filter((n) => !numbers.includes(n));
    expect(missing, `missing teaching weeks: ${missing.join(", ")}`).toHaveLength(0);
    expect(new Set(numbers).size, "one entry per week").toBe(12);
  });

  it("gives every week a date and a page that builds", () => {
    for (const s of sessions) {
      expect(String(s.meta?.date), `${slugOf(s)} has a date`).toMatch(/^\d{4}-\d{2}-\d{2}/);
      expect(builtWeekPages, `${slugOf(s)} built a page`).toContain(slugOf(s));
    }
  });
});

describe("3. the anti-recipe gate", () => {
  /* plan.md's rejection test: "if a passage could appear unchanged on a recipe
     website, remove it or rewrite it". These are the two shapes that test
     catches mechanically --- food-blog vocabulary, and a quantity in a cooking
     unit. Structural measurements (mm, N, degrees, minutes) are the whole
     point of the course and are deliberately not matched. */
  const FOOD_BLOG = [
    "delicious",
    "quick and easy",
    "chef's choice",
    "perfect for lunch",
    "mouthwatering",
    "tasty",
    "yummy",
    "flavour profile",
    "crowd-pleaser",
  ];

  /* A quantity in a cooking unit, e.g. "2 tbsp", "350 g", "1/2 cup". */
  const COOKING_QUANTITY =
    /\b\d+(?:[.,/]\d+)?\s?(?:tbsp|tsp|tablespoons?|teaspoons?|cups?|grams?|g|kg|oz|ounces?|lbs?|pounds?)\b/i;

  /* Instructions that would make a meal rather than a measurement. */
  const COOKING_VERB =
    /\b(?:preheat|bake for|fry|saut[eé]|season to taste|serve (?:immediately|warm|hot|chilled)|garnish|drizzle over|spread evenly over)\b/i;

  const bodies = [...sessions, ...assessments, ...nodesOf("lectures")];

  /* Fed "This specimen is delicious." in week 5's body, it printed:
       sessions/week-05 uses food-blog language: "delicious" */
  it("uses no food-blog language anywhere in the course content", () => {
    for (const node of bodies) {
      const body = (node.body ?? "").toLowerCase();
      const hit = FOOD_BLOG.find((phrase) => body.includes(phrase));
      expect(hit, `${node.id} uses food-blog language: "${hit}"`).toBeUndefined();
    }
  });

  /* Fed "Add 2 tbsp of sauce." in week 6's body, it printed:
       sessions/week-06 states a cooking quantity: "2 tbsp" */
  it("states no quantity in a cooking unit", () => {
    for (const node of bodies) {
      const hit = COOKING_QUANTITY.exec(node.body ?? "");
      expect(hit?.[0], `${node.id} states a cooking quantity: "${hit?.[0]}"`).toBeUndefined();
    }
  });

  it("gives no preparation instructions", () => {
    for (const node of bodies) {
      const hit = COOKING_VERB.exec(node.body ?? "");
      expect(hit?.[0], `${node.id} gives a preparation instruction: "${hit?.[0]}"`).toBeUndefined();
    }
  });

  /* The course's own promise, on the pages a student reads before choosing a
     route. Fed a /policies/ whose "No student is ..." sentences had been
     replaced with "Bring lunch.", it printed:
       /policies/ does not say food is never required */
  it("says on both entry pages that no student must handle or consume food", () => {
    for (const page of ["policies", "course"]) {
      const text = textOf(page).toLowerCase();
      expect(
        /no student is (?:ever )?required to (?:prepare|purchase|handle|consume)/.test(text) ||
          /no student is required to prepare or consume food/.test(text),
        `/${page}/ does not say food is never required`,
      ).toBe(true);
    }
  });
});

describe("4. twelve distinct artefacts", () => {
  /* The promise that stops twelve weeks reading as one template with the nouns
     swapped. The artefact names live in src/lib/semester.ts; this asserts each
     week's page actually names its own, and that no two share one.
     Fed a semester table with week 9's artefact renamed to week 7's, it
     printed:
       two weeks claim the same artefact: thermal comparison */
  it("names a different dominant artefact on every week page", async () => {
    const { WEEK_ARTEFACTS } = await import("../src/lib/semester.ts");
    const seen = new Map<string, number>();

    for (let week = 1; week <= 12; week += 1) {
      const { artefact } = WEEK_ARTEFACTS[week];
      const key = artefact.toLowerCase();
      expect(seen.has(key), `two weeks claim the same artefact: ${key}`).toBe(false);
      seen.set(key, week);

      const slug = `week-${String(week).padStart(2, "0")}`;
      expect(textOf(`sessions/${slug}`), `${slug} names its artefact`).toContain(artefact);
    }
    expect(seen.size).toBe(12);
  });
});

describe("5. claims, classifications and navigation", () => {
  /* plan.md is explicit that Slip / Soak / Crush / Splay are curriculum-design
     categories and "their wording and technical accuracy must be reviewed
     before publication" --- so any page that presents all four as a set has to
     say what they are.
     Fed a homepage with its "Course working model" caveat deleted, it
     printed:
       the homepage presents the four failure families with no course-model
       disclaimer */
  it("never presents the four failure families as a professional standard", () => {
    const pages = [
      { path: "", name: "the homepage" },
      { path: "field-manual", name: "/field-manual/" },
      { path: "lectures/moisture-is-a-load", name: "/lectures/moisture-is-a-load/" },
    ];
    for (const page of pages) {
      const text = textOf(page.path);
      const namesAll = ["Slip", "Soak", "Crush", "Splay"].every((family) =>
        new RegExp(`\\b${family}\\b`).test(text),
      );
      if (!namesAll) continue;

      const disclaimed =
        /course(?:'s own| working| design)?[- ]?(?:model|categories|classification)/i.test(text) ||
        /not a (?:recognised )?professional (?:standard|classification)/i.test(text) ||
        /Course working model/i.test(text);
      expect(
        disclaimed,
        `${page.name} presents the four failure families with no course-model disclaimer`,
      ).toBe(true);
    }
  });

  /* A marker opens non-adjacent weeks, so every week has to offer the other
     two directions and the index without the back button.
     Fed a week 4 page whose week-05 links had been repointed at itself, it
     printed:
       week-04 offers no route to week 5 */
  it("ends every week page with previous, all weeks and next", () => {
    for (let week = 1; week <= 12; week += 1) {
      const slug = `week-${String(week).padStart(2, "0")}`;
      const markup = html(`sessions/${slug}`);
      const text = textOf(`sessions/${slug}`);

      expect(text, `${slug} offers no route to all weeks`).toContain("The semester load path");

      if (week > 1) {
        expect(markup, `${slug} offers no route to week ${week - 1}`).toContain(
          `/sessions/week-${String(week - 1).padStart(2, "0")}/`,
        );
      } else {
        expect(text, "week-01 should say it is the first week").toContain("first week");
      }

      if (week < 12) {
        expect(markup, `${slug} offers no route to week ${week + 1}`).toContain(
          `/sessions/week-${String(week + 1).padStart(2, "0")}/`,
        );
      } else {
        expect(text, "week-12 should say it is the final week").toContain("final week");
      }
    }
  });

  /* The assignment requires at least one real lecture deck, linked from its
     lecture page. Fed a build with the deck directory moved aside, it printed:
       the lecture deck at /decks/moisture-is-a-load/ did not build */
  it("ships a real lecture deck, linked from its lecture page", () => {
    const lecture = nodesOf("lectures").find((l) => typeof l.meta?.slides === "string");
    expect(lecture, "no lecture declares a deck").toBeDefined();

    const deck = String(lecture!.meta!.slides).replace(/^\/|\/$/g, "");
    expect(
      () => html(deck),
      `the lecture deck at /${deck}/ did not build`,
    ).not.toThrow();

    const page = html(`lectures/${slugOf(lecture!)}`);
    expect(page, `/lectures/${slugOf(lecture!)}/ does not link its deck`).toContain(deck);
  });

  /* The weeks index badges the weeks that carry a deck and prints how many
     there are. Both were hand-maintained, and both went stale the moment Week
     8 gained one: the badge stayed on Week 4 alone and the legend went on
     saying Week 4 was the only week with a deck. They are derived from the
     lectures collection now, and this is what holds them there. Fed the build
     from before that change, it printed:
       week 8 declares a deck but the weeks index does not badge it */
  it("badges every week that has a deck, and counts them correctly", () => {
    const withDecks = nodesOf("lectures").filter((l) => typeof l.meta?.slides === "string");
    expect(withDecks.length, "no lecture declares a deck").toBeGreaterThan(0);

    const index = html("sessions");
    /* Each row opens with its zero-padded number and closes at the heading the
       badge sits in, so a badge is only credited to the week it is inside. */
    const rows = [...index.matchAll(/wk-n display">(\d+)<\/p>([\s\S]*?)<\/h3>/g)];
    const badged = new Set(
      rows.filter(([, , block]) => block.includes("wk-deck")).map(([, n]) => Number(n)),
    );

    for (const lecture of withDecks) {
      const week = Number(lecture.meta!.week);
      expect(
        badged.has(week),
        `week ${week} declares a deck but the weeks index does not badge it`,
      ).toBe(true);
    }
    expect(
      badged.size,
      `the weeks index badges ${badged.size} weeks but ${withDecks.length} declare a deck`,
    ).toBe(withDecks.length);

    /* Whitespace-insensitive: the sentence is wrapped across source lines and
       the count is interpolated, so the built markup collapses differently
       from the template. */
    const legend = index.replace(/\s+/g, " ");
    expect(
      legend,
      `the weeks index legend does not say ${withDecks.length} weeks carry a deck`,
    ).toContain(`${withDecks.length} of the twelve do.`);
  });
});
