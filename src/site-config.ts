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

  // Weeks leads: the semester schedule is the spine of the course and the
  // route a marker opening non-adjacent weeks needs first.
  // `Course` and `Field Manual` join this list in the phase that builds them
  // --- the build's link checker fails on a nav entry with no page behind it.
  links: [
    { text: sessionLabels.plural, href: "/sessions/" },
    { text: "Assessments", href: "/assessments/" },
    { text: "Lectures", href: "/lectures/" },
    { text: "Policies", href: "/policies/" },
    { text: "People", href: "/people/" },
  ],

  // The course's visual system is a materials-testing laboratory: true white
  // paper, charcoal ink, and a charcoal section that means autopsy. The
  // theme's dark mode inverts the page ground, which would make that charcoal
  // section read as *lighter* than the page around it and invert the meaning
  // of every specimen diagram. Pinning the scheme keeps the semantics stable
  // at both marking viewports.
  colorScheme: "light",

  licence: "CC-BY-NC-SA-4.0",
  socialImage: "/src/assets/images/card.png",
  socialImageAlt: `A preview card for ${courseMeta.code}: ${courseMeta.title}`,
});
