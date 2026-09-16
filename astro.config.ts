import { defineConfig, fontProviders } from "astro/config";
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

// Swap the theme's navigation bar for the course's own.
//
// BaseLayout imports it as `../components/Nav.astro` --- a relative specifier
// inside the package --- so a plain Vite alias on the package path never sees
// it. This resolves the import normally and then redirects it when the file it
// landed on is the theme's Nav, which is why it runs `enforce: "pre"` and
// calls `this.resolve` with `skipSelf`.
//
// If the theme ever moves that file, `count` stays 0 and the build fails here
// rather than silently shipping the wrong nav.
const courseNav = {
  name: "slop-course-nav",
  hooks: {
    "astro:config:setup": ({ updateConfig }: { updateConfig: (c: Record<string, unknown>) => void }) => {
      let count = 0;
      updateConfig({
        vite: {
          plugins: [
            {
              name: "slop-course-nav-resolver",
              enforce: "pre" as const,
              async resolveId(this: any, source: string, importer: string | undefined, options: unknown) {
                if (!source.endsWith("/Nav.astro")) return null;
                const resolved = await this.resolve(source, importer, {
                  ...(options as object),
                  skipSelf: true,
                });
                if (!resolved?.id.includes("astro-theme-university")) return null;
                count += 1;
                return new URL("./src/components/SiteNav.astro", import.meta.url).pathname;
              },
              buildEnd() {
                if (count === 0) {
                  throw new Error(
                    "slop-course-nav: the theme's Nav.astro was never imported, so the " +
                      "course nav did not replace it. Check astro-theme-university's BaseLayout.",
                  );
                }
              },
            },
          ],
        },
      });
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
  // The third typography role. Public Sans (body) and Roboto Mono (specimen
  // ids, dates, measurements) are registered by the theme; this adds the
  // condensed industrial display face plan.md calls for, through the same
  // Astro font provider rather than a separate font package.
  //
  // IBM Plex Sans Condensed is SIL Open Font License 1.1 (c) 2017 IBM Corp.,
  // reserved font name "Plex" --- verified against IBM/plex LICENSE.txt and
  // the Google Fonts METADATA.pb, which records license: "OFL".
  //
  // It is NOT a variable font: a `wght@100..700` range request to the Google
  // CSS API returns HTTP 400, and only the discrete weights 100-700 resolve
  // (800 and 900 do not exist). So the weights are listed explicitly --- two
  // of them, since the display role is titles, numbers and short capability
  // words, never running text.
  fonts: [
    {
      name: "IBM Plex Sans Condensed",
      cssVariable: "--font-ibm-plex-sans-condensed",
      provider: fontProviders.google(),
      weights: ["600", "700"],
      styles: ["normal"],
      // A condensed fallback, so a failed webfont degrades to something with
      // roughly the same width rather than reflowing every title.
      fallbacks: ["Arial Narrow", "Helvetica Neue", "sans-serif"],
    },
  ],
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
      // The display face sets page titles, so it is above the fold on every
      // page and is preloaded alongside the body font. The mono face is not:
      // it carries specimen ids and dates, which sit further down.
      preloadFonts: ["--font-public-sans", "--font-ibm-plex-sans-condensed"],
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
    courseNav,
    astromotion({
      theme: "./src/decks/theme.css",
      fontVariables: ["--font-public-sans"],
    }),
  ],
});
