import { defineSiteConfig } from "astro-theme-university/types";
import type { NavLink } from "astro-theme-university/types";
import { slopBranding } from "astro-theme-slop";
import { courseMeta } from "./course-config";

// The collection key and URL stay `sessions` --- the programs and courses page
// reads those names --- but a week page is a teaching *week*, not one class,
// so that is the language students and markers see everywhere.
export const sessionLabels = {
  singular: "Week",
  plural: "Weeks",
} as const;

export const graphCollections = ["sessions", "assessments", "lectures", "people"];

export const courseApiCollections = [
  ...graphCollections.map((key) => ({ key })),
  { key: "policies", dir: "pages/policies" },
];

/** The navigation bar's own shape: one level of grouping, which the theme's
 *  flat `NavLink` cannot express. Mirrors `NavItem` in SiteNav.astro. */
const NAV = [
  {
    text: "Course",
    children: [
      { text: "Course brief", href: "/", note: "The specimen under load" },
      { text: "Course guide", href: "/course/", note: "Outcomes and requirements" },
    ],
  },
  { text: sessionLabels.plural, href: "/sessions/" },
  { text: "Assessments", href: "/assessments/" },
  { text: "Field Manual", href: "/field-manual/" },
  { text: "Policies", href: "/policies/" },
];

export const siteConfig = defineSiteConfig({
  ...slopBranding,
  name: "Slop University",

  // The order the reference header sets: the course, then the semester, then
  // the graded work, then the methods. Policies follows, because a marker
  // reaches it from the pages that cite it rather than from the bar.
  //
  // Course is a group, not a link. The brief and the guide are two readings of
  // the same course --- what it is, and what it requires --- and the brief is
  // this site's front door, which used to be reachable only by clicking the
  // university's name. The university is not this course, so that link is gone
  // and its destination lives here instead.
  //
  // The cast widens the theme's flat NavLink, which has no notion of a group.
  // BaseLayout passes `links` straight through to the nav component, and this
  // site's nav (src/components/SiteNav.astro, swapped in by the courseNav
  // plugin in astro.config.ts) is the one that receives it.
  links: NAV as unknown as NavLink[],

  // The course's visual system is a materials-testing laboratory: true white
  // paper, charcoal ink, and a charcoal section that means autopsy. The
  // theme's dark mode inverts the page ground, which would make that charcoal
  // section read as *lighter* than the page around it and invert the meaning
  // of every specimen diagram. Pinning the scheme keeps the semantics stable
  // at both marking viewports.
  colorScheme: "light",

  licence: "CC-BY-NC-SA-4.0",

  // The starter's card was the template's artwork, not this course's, so it
  // was deleted rather than submitted as ours. This one is the course's own:
  // the specimen is generated from the prompt kept in scripts/image-prompts.mjs
  // and the card is assembled by scripts/compose-social-card.mjs, which sets
  // the title in the same IBM Plex Sans Condensed the homepage h1 uses. Both
  // steps are re-runnable from the repo.
  socialImage: "/src/assets/images/social/card.png",
  socialImageAlt:
    "SLOP2895, Semester 1 2027. The Sandwich Must Hold. Every lunch is a " +
    "temporary structure; study the forces that make it fail. Beside the " +
    "title, a sandwich specimen is held between the steel platens of a " +
    "benchtop compression press, with a lettuce edge protruding at the " +
    "interface. Marked specimen 001, scale 50 mm, test in progress.",
});
