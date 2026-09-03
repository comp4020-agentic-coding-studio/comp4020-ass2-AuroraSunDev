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
import type gsapNS from "gsap";
import { MOTION, isFirstLoad, mountMotion } from "./motion";

type GSAPStatic = typeof gsapNS;

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
  9,
);

/* ---------------------------------------------------------------------------
 * Homepage narrative.
 *
 * Five identities, each tied to something structural: a load being applied, a
 * failure interface resolving, four distinct failure behaviours, a load path
 * connecting twelve stations, and four declared loads. Nothing here fades a
 * section up, and nothing loops.
 *
 * Every mount goes through the same mountMotion helper, so they share the one
 * registerPlugin call, the one astro:page-load / astro:before-swap lifecycle
 * and the one matchMedia revert. `order` becomes ScrollTrigger's
 * refreshPriority, numbered down the page so triggers refresh in page order
 * even though component scripts are bundled and may initialise out of order.
 *
 * These selectors do not exist on any other page. mountMotion matches nothing
 * there and creates nothing, which is why this stays a single global entry.
 * ------------------------------------------------------------------------ */

// 1. Hero --- the rig applies a load.
//
// No ScrollTrigger: this is the first viewport, so the sequence belongs to the
// page opening rather than to a scroll position.
//
// The load is photographed, not simulated. Two frames of the same specimen sit
// stacked; the sequence cross-fades the earlier one out, so the platen closes
// the gap and the crumb yields together, in the pixels. Nothing here scales or
// squashes the photograph --- a transformed picture of bread reads as a
// transformed picture, which is the failure this replaces.
//
// It plays on first arrival at the hero only. A ClientRouter return to the
// homepage lands on the loaded frame with the marks already legible, which is
// the honest state anyway. `isFirstLoad()` is not reusable here: it is a
// one-shot latch already consumed by the nav entrance above, so the hero keeps
// its own.
let heroPlayed = false;

mountMotion(
  "[data-motion-hero]",
  ({ root, gsap }) => {
    if (heroPlayed) return;

    const preload = root.querySelector(".rig-layer--preload");
    // Both overlays are in the DOM; the one for the other breakpoint is
    // display:none, so animating it is inert.
    const arrows = root.querySelectorAll(".rig-load");
    const scale = root.querySelectorAll(".rig-scale");
    if (!preload) return;

    heroPlayed = true;
    const tl = gsap.timeline({ defaults: { ease: MOTION.ease.instrument } });

    // Raising the earlier frame is the only thing that departs from the static
    // state, and matchMedia's revert puts it back at navigation.
    tl.set(preload, { autoAlpha: 1 })
      .to(preload, { autoAlpha: 0, duration: MOTION.duration.base * 1.5 })
      // The load becomes legible only once it is being carried.
      .from(
        arrows,
        {
          autoAlpha: 0,
          duration: MOTION.duration.quick,
          stagger: MOTION.stagger.evidence,
          clearProps: "all",
        },
        ">-0.08",
      )
      // The measurement resolves last: you measure after loading.
      .from(
        scale,
        { autoAlpha: 0, duration: MOTION.duration.quick, clearProps: "all" },
        "<",
      );
  },
  1,
);

// 2. Structural proposition --- the failure interface resolves.
//
// The shear arrows arrive, the interface layer draws itself across, the
// callouts settle and the dimension resolves. ScrollTrigger sits on the
// timeline, never on a child tween, and uses `once` rather than pairing scrub
// with toggleActions.
mountMotion(
  "[data-motion-prop]",
  ({ root, gsap, refreshPriority }) => {
    const focus = root.querySelector(".sh-layer--focus");
    if (!focus) return;

    const tl = gsap.timeline({
      defaults: { ease: MOTION.ease.instrument },
      scrollTrigger: { trigger: root, start: "top 72%", once: true, refreshPriority },
    });

    tl.from(root.querySelectorAll(".sh-load path"), {
      autoAlpha: 0,
      x: (i: number) => (i === 0 ? -28 : 28),
      duration: MOTION.duration.base,
      stagger: 0.08,
      clearProps: "all",
    })
      .from(
        focus,
        {
          scaleX: 0,
          transformOrigin: "left center",
          duration: MOTION.duration.draw,
          clearProps: "all",
        },
        "-=0.25",
      )
      .from(
        root.querySelectorAll(".sh-callout > g"),
        {
          autoAlpha: 0,
          x: 10,
          duration: MOTION.duration.quick,
          stagger: MOTION.stagger.evidence,
          clearProps: "all",
        },
        "-=0.3",
      )
      .from(
        root.querySelectorAll(".sh-dim path"),
        {
          scaleY: 0,
          transformOrigin: "center center",
          duration: MOTION.duration.quick,
          clearProps: "all",
        },
        "<",
      );
  },
  2,
);

// 3. Four failure families --- each demonstrates its own behaviour.
//
// No ScrollTrigger and no armed state on scroll: these are demonstrations the
// reader asks for. Hover, keyboard focus and tap all run the same reversible
// timeline on the "after" diagram, moving it from the "before" geometry to the
// geometry it already renders. Every label, caption and week link is ordinary
// text and is unaffected --- with motion off, the two diagrams still read as
// before and after.
const FAMILY_SETUP: Record<string, (el: Element, gsap: GSAPStatic) => gsap.core.Timeline> = {
  // Layers shear past one another.
  slip: (el, g) =>
    g
      .timeline({ paused: true })
      .from(
        el.querySelectorAll(".outer"),
        { x: (i: number) => (i === 0 ? -12 : 8), duration: MOTION.duration.base, immediateRender: false },
        0,
      )
      .from(el.querySelectorAll(".core"), { x: -4, duration: MOTION.duration.base, immediateRender: false }, 0),
  // The moisture front advances through the layer.
  soak: (el, g) =>
    g
      .timeline({ paused: true })
      .from(el.querySelector(".front"), {
        scaleX: 0.3,
        transformOrigin: "left center",
        duration: MOTION.duration.draw,
        immediateRender: false,
      }),
  // Compression shortens the stack.
  crush: (el, g) =>
    g.timeline({ paused: true }).from(el, {
      scaleY: 1.3,
      transformOrigin: "center bottom",
      duration: MOTION.duration.base,
      immediateRender: false,
    }),
  // Contents escape past the outer layers.
  splay: (el, g) =>
    g.timeline({ paused: true }).from(el.querySelector(".core"), {
      scaleX: 0.79,
      transformOrigin: "center center",
      duration: MOTION.duration.base,
      immediateRender: false,
    }),
};

mountMotion("[data-motion-family]", ({ root, gsap }) => {
  const family = root.getAttribute("data-motion-family") ?? "";
  const after = root.querySelector(".fd--after");
  const build = FAMILY_SETUP[family];
  if (!after || !build) return;

  const tl = build(after, gsap);
  // Replay, never reverse. Reversing a from() tween runs back to its START
  // state --- the "before load" geometry --- which would leave the "after
  // load" diagram showing the wrong state as soon as the pointer left. The
  // diagram's resting state must always be the state its caption claims, so
  // the demonstration replays the failure and settles back on "after".
  const play = () => tl.restart();
  const settle = () => tl.play();

  root.addEventListener("mouseenter", play);
  root.addEventListener("mouseleave", settle);
  root.addEventListener("focusin", play);
  root.addEventListener("focusout", settle);
  // Touch has no hover, so a tap runs the same demonstration.
  root.addEventListener("pointerdown", play);

  // GSAP owns the timeline; these listeners are ours, so we take them back.
  return () => {
    root.removeEventListener("mouseenter", play);
    root.removeEventListener("mouseleave", settle);
    root.removeEventListener("focusin", play);
    root.removeEventListener("focusout", settle);
    root.removeEventListener("pointerdown", play);
  };
}, 3);

// 4a. Semester load path, desktop --- the line advances through the stations.
//
// A line, not a progress bar: it connects twelve stations that all exist
// already. Nothing here reports how far the reader has got, and the rail is
// aria-hidden, so no assistive technology is told a story about completion.
mountMotion(
  "[data-motion-rail]",
  ({ root, conditions, gsap, refreshPriority }) => {
    if (!conditions.desktop) return;
    const line = root.querySelector(".rail-line span");
    if (!line) return;

    gsap
      .timeline({ scrollTrigger: { trigger: root, start: "top 80%", once: true, refreshPriority } })
      .from(line, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: MOTION.duration.draw,
        ease: MOTION.ease.instrument,
        clearProps: "transform,transformOrigin",
      })
      .from(
        root.querySelectorAll(".rail-dot"),
        {
          scale: 0.4,
          transformOrigin: "center center",
          duration: MOTION.duration.quick,
          stagger: 0.035,
          clearProps: "transform,transformOrigin",
        },
        "-=0.45",
      );
  },
  4,
);

// 4b. Semester load path, phone --- the same idea as a vertical load track.
mountMotion(
  "[data-motion-track]",
  ({ root, conditions, gsap, refreshPriority }) => {
    if (!conditions.mobile) return;
    const line = root.querySelector(".track-line span");
    if (!line) return;

    gsap.from(line, {
      scaleY: 0,
      transformOrigin: "top center",
      duration: MOTION.duration.draw,
      ease: MOTION.ease.instrument,
      clearProps: "transform,transformOrigin",
      scrollTrigger: { trigger: root, start: "top 85%", once: true, refreshPriority },
    });
  },
  4,
);

// 5. Assessment load --- the four declared loads stand up.
//
// Only the stems move, and only by transform: the stem's height is set in CSS
// from the weight, so animating scaleY never touches layout. The percentages
// are ordinary text and are never animated --- they read the same before,
// during and after. No counters.
mountMotion(
  "[data-motion-loads]",
  ({ root, conditions, gsap, refreshPriority }) => {
    // The phone composition has no stems, so there is nothing structural to
    // show and nothing is invented to fill the gap.
    if (!conditions.desktop) return;
    const stems = root.querySelectorAll(".load-stem");
    if (!stems.length) return;

    gsap.from(stems, {
      scaleY: 0,
      transformOrigin: "center bottom",
      duration: MOTION.duration.draw,
      ease: MOTION.ease.instrument,
      stagger: 0.09,
      clearProps: "transform,transformOrigin",
      scrollTrigger: { trigger: root, start: "top 82%", once: true, refreshPriority },
    });
  },
  5,
);
