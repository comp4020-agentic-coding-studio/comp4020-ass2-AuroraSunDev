import { defineConfig } from "astro/config";
import courseGraph from "astro-course-university";
import universityTheme from "astro-theme-university";
import { astromotion, deckRemarkPlugins } from "astromotion";
import { courseMeta } from "./src/course-config.ts";
import { courseApiCollections } from "./src/site-config.ts";
import { gitOrigin, resolveDeployment } from "./scripts/pages-base.ts";

// Derived, never hardcoded --- see scripts/pages-base.ts for why.
const { site, base } = resolveDeployment(process.env, gitOrigin);

// One global client entry for the course's motion. Astro bundles a component
// <script> per component; this keeps the shared mounts in a single module that
// every page loads, so plugin registration and the ClientRouter lifecycle are
// bound exactly once per document.
const slopMotion = {
  name: "slop-motion",
  hooks: {
    "astro:config:setup": ({ injectScript }: { injectScript: (stage: "page", code: string) => void }) => {
      injectScript("page", 'import "/src/lib/motion-boot.ts";');
    },
  },
};

export default defineConfig({
  site,
  base,
  // Pages build as directories, so every route URL ends in a slash. Saying so
  // explicitly makes Astro emit matching links, which keeps the canonical URL
  // and what a visitor clicks in agreement --- otherwise each click costs a
  // 301 on GitHub Pages.
  trailingSlash: "always",
  integrations: [
    universityTheme({
      defaultLayout: "src/layouts/PageLayout.astro",
      // The whole brand choice: three colour tokens and a set of lockups. Keep
      // institutional brand packages and assets out of this fictional site.
      // Two globals, in cascade order: the fixed Slop identity, then the
      // course's own token layer. Both are injected on every page (the theme
      // does this via `injectScript("page-ssr", ...)`), which is why the
      // course tokens live here rather than in PageLayout.astro --- that
      // layout only wraps MDX pages, so the collection detail routes, which
      // import ContentLayout directly, would never have seen them.
      // These are Vite module specifiers resolved from the project root at
      // build time, not page URLs, so the base path does not apply to them.
      brandCss: ["astro-theme-slop/slop.css", "/src/styles/course.css"],
      imageFormat: "avif",
      llmsTxt: true,
      // The theme owns the markdown plugin chain, so astromotion's slide
      // plugins (slide breaks, classes, backgrounds, notes, QR codes) are
      // handed to it rather than registered separately. Each one gates on
      // `.deck.mdx`, so ordinary pages are untouched.
      extraRemarkPlugins: deckRemarkPlugins,
    }),
    courseGraph({
      collections: courseApiCollections,
      timezone: "Australia/Canberra",
      course: courseMeta,
      canonicalUrl: `https://courses.slop.university/${courseMeta.code}/`,
    }),
    // Slide decks: every `.deck.mdx` under src/decks/ becomes a Reveal.js page
    // at /decks/<name>/. The theme's deck stylesheet reads the same brand
    // tokens the site does, so a deck arrives already wearing the Slop palette
    // --- see src/decks/theme.css. `fontVariables` makes the deck page emit the
    // @font-face for the theme's body font, which the deck styles ask for by
    // name.
    slopMotion,
    astromotion({
      theme: "./src/decks/theme.css",
      fontVariables: ["--font-public-sans"],
    }),
  ],
});
