import { defineSiteConfig } from "astro-theme-university/types";
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

export const siteConfig = defineSiteConfig({
  ...slopBranding,
  name: "Slop University",

  // The order plan.md sets for the desktop header: the course specification,
  // then the semester, then the graded work, then the methods. Lectures,
  // policies and people follow, because a marker reaches those from the pages
  // that cite them rather than from the bar.
  links: [
    { text: "Course", href: "/course/" },
    { text: sessionLabels.plural, href: "/sessions/" },
    { text: "Assessments", href: "/assessments/" },
    { text: "Field Manual", href: "/field-manual/" },
    { text: "Policies", href: "/policies/" },
  ],

  // The course's visual system is a materials-testing laboratory: true white
  // paper, charcoal ink, and a charcoal section that means autopsy. The
  // theme's dark mode inverts the page ground, which would make that charcoal
  // section read as *lighter* than the page around it and invert the meaning
  // of every specimen diagram. Pinning the scheme keeps the semantics stable
  // at both marking viewports.
  colorScheme: "light",

  licence: "CC-BY-NC-SA-4.0",
  // No socialImage. The starter shipped one, and it was the template's
  // artwork rather than this course's --- so it has been removed rather than
  // submitted as ours. With the field absent the theme emits no `og:image`,
  // which is the honest state: a link preview with no picture, instead of a
  // picture of a different course. A card drawn in this course's own system is
  // outstanding work, not a decision against having one.
});
