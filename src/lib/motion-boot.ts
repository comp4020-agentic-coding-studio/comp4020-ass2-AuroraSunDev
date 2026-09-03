/* Global motion mounts for SLOP2895.
 *
 * Injected on every page by the `slop-motion` integration in astro.config.ts.
 * Phase 1 deliberately carries only two moments; the structural motion for
 * the homepage, the weeks and the assessments arrives with those pages.
 *
 * Both moments below animate from a final state to a final state. Remove
 * JavaScript and the navigation is still a navigation and the archive rule is
 * still a full-width rule with its label beside it.
 */
import { MOTION, isFirstLoad, mountMotion } from "./motion";

// 1. Navigation entrance --- on arrival only.
//
// A page swap is not an arrival, so replaying this on every navigation would
// turn the site's own chrome into a recurring animation, which is exactly the
// "animate to prove GSAP is installed" failure. The nav settles once.
mountMotion(".at-nav", ({ root, gsap }) => {
  if (!isFirstLoad()) return;
  gsap.from(root, {
    y: -8,
    opacity: 0,
    duration: MOTION.duration.base,
    // The nav is the skip-link target's neighbour and holds the site's only
    // persistent controls; clearing the inline styles hands it straight back
    // to the stylesheet once it has settled.
    clearProps: "transform,opacity",
  });
});

// 2. Archive rule --- a measured line drawing to its recorded length.
//
// This is the site's one shared "a measurement was taken here" mark. It reads
// as a rule being struck across the page rather than content fading in, which
// is why it scales on one axis from a fixed origin instead of rising.
mountMotion(
  "[data-slop-archive-rule]",
  ({ root, gsap, refreshPriority }) => {
    const line = root.querySelector(".slop-archive-rule__line");
    if (!line) return;
    gsap.from(line, {
      scaleX: 0,
      duration: MOTION.duration.draw,
      transformOrigin: "left center",
      // Hand the rule back to the stylesheet once it has been struck, so no
      // inline transform survives the tween.
      clearProps: "transform,transformOrigin",
      scrollTrigger: {
        trigger: root,
        start: "top 85%",
        // Discrete, not scrubbed: the rule is either struck or it is not.
        // scrub and toggleActions are mutually exclusive, so this sets neither
        // and lets `once` retire the trigger after it fires.
        once: true,
        refreshPriority,
      },
    });
  },
  1,
);
