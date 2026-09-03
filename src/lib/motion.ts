/* SLOP2895 --- the course's one motion module.
 *
 * Everything GSAP touches on this site goes through here: the single
 * registerPlugin call, the shared duration/ease tokens, and the mount helper
 * that owns the lifecycle. Components never import gsap directly and never
 * register a plugin themselves.
 *
 * Two facts about this repository shape the whole design.
 *
 * 1. The theme enables Astro's <ClientRouter> (astro-theme-university's
 *    BaseLayout defaults clientRouter to true), so navigation is a DOM swap,
 *    not a document load. A module script executes ONCE per document and is
 *    not re-run on navigation, so animation set up at module scope would run
 *    on the first page and never again --- while its ScrollTriggers survived
 *    into pages whose targets no longer exist. Setup therefore hangs off
 *    `astro:page-load` and teardown off `astro:before-swap`, which is the
 *    same pattern the theme's own Nav.astro uses.
 *
 * 2. The official GSAP guidance is explicit that gsap.context() must not be
 *    nested inside gsap.matchMedia() --- matchMedia creates a context
 *    internally. So matchMedia is the single primitive here: it takes the
 *    component root as its scope argument, which gives selector scoping AND
 *    automatic revert (killing tweens, killing ScrollTriggers, and restoring
 *    inline styles) both when a media condition stops matching and when we
 *    call revert() on navigation.
 *
 * The reduced-motion contract is inverted from the usual pattern: markup
 * always renders its FINAL state, and motion only ever moves an element from
 * a final state to a final state. Nothing starts at opacity 0 in CSS waiting
 * for JavaScript to reveal it. That means the reduced-motion branch has
 * nothing to undo, and it also means the site is complete and readable when
 * JavaScript fails or is disabled.
 */
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

/** Shared motion tokens. Short, local and reversible, per the design plan:
 *  a compression closes a gap, a layer slips, a moisture front advances. */
export const MOTION = {
  duration: {
    /** A state marker moving, a label settling. */
    quick: 0.24,
    /** The default: one structural change. */
    base: 0.42,
    /** A measured rule drawing across a page. */
    draw: 0.66,
  },
  ease: {
    /** Instrument movement: decisive, no overshoot. Nothing on this site
     *  bounces --- a test rig that oscillated would be lying about the
     *  measurement. */
    instrument: "power2.out",
    /** Linear, for anything tied to a scrubbed position. */
    linear: "none",
  },
  stagger: {
    /** Reading order down a list of evidence. */
    evidence: 0.06,
  },
} as const;

/** The three branches every animated component must account for. Desktop and
 *  mobile are separated at the theme's own 640px breakpoint so motion and
 *  layout agree about which composition is on screen. */
export const MOTION_MEDIA = {
  desktop: "(width >= 640px) and (prefers-reduced-motion: no-preference)",
  mobile: "(width < 640px) and (prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;

export interface MotionContext {
  /** The mounted element. Selector strings inside setup are scoped to it. */
  root: HTMLElement;
  /** Which branch matched. Exactly one of desktop/mobile is true. */
  conditions: { desktop: boolean; mobile: boolean; reduced: boolean };
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
  /** Pass to a ScrollTrigger config so triggers refresh in page order even
   *  though component scripts are bundled and may initialise out of order. */
  refreshPriority: number;
}

type Setup = (context: MotionContext) => void | (() => void);

let registered = false;
function registerOnce(): void {
  if (registered) return;
  registered = true;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ duration: MOTION.duration.base, ease: MOTION.ease.instrument });
  // Trigger positions are measured from laid-out text. The theme loads Public
  // Sans and Roboto Mono as webfonts, so measuring before they settle pins
  // every start/end to the fallback metrics.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

/** Every matchMedia instance currently alive, so navigation can revert them
 *  all without each call site having to remember its own. */
const live = new Set<ReturnType<typeof gsap.matchMedia>>();

function revertAll(): void {
  for (const mm of live) mm.revert();
  live.clear();
}

let lifecycleBound = false;
function bindLifecycleOnce(): void {
  if (lifecycleBound) return;
  lifecycleBound = true;
  // revert() kills tweens and ScrollTriggers and restores inline styles, so a
  // swapped-away page leaves nothing behind for the next one to trip over.
  document.addEventListener("astro:before-swap", revertAll);
}

/**
 * Mount an animation against every element matching `selector`, for the
 * lifetime of the current page.
 *
 * @param selector  Scopes the animation. Setup receives the matched element
 *                  and matchMedia scopes selector text inside it to that root.
 * @param setup     Runs once per matching branch. Return a cleanup function
 *                  for anything GSAP does not own (a listener, an observer).
 * @param order     Page order of this section, lowest at the top. Passed
 *                  through as ScrollTrigger `refreshPriority`.
 */
export function mountMotion(selector: string, setup: Setup, order = 0): void {
  registerOnce();
  bindLifecycleOnce();

  const mount = (): void => {
    for (const root of document.querySelectorAll<HTMLElement>(selector)) {
      // A swap gives us fresh DOM, so this only guards against the same page
      // mounting twice (two components asking for the same selector).
      if (root.dataset.slopMotion === "on") continue;
      root.dataset.slopMotion = "on";

      const mm = gsap.matchMedia();
      live.add(mm);
      mm.add(
        MOTION_MEDIA,
        (self) => {
          const conditions = self.conditions as MotionContext["conditions"];
          // Reduced motion: the markup is already in its final state, so the
          // correct behaviour is to do nothing at all.
          if (conditions.reduced) return;
          return setup({
            root,
            conditions,
            gsap,
            ScrollTrigger,
            refreshPriority: order,
          });
        },
        root,
      );
    }
  };

  // Fires on the initial load and after every client-side swap.
  document.addEventListener("astro:page-load", mount);
}

// Dev-only instrumentation. `import.meta.env.DEV` is replaced at build time,
// so this whole block is removed from the production bundle --- it exists so
// the ClientRouter teardown can be verified in a browser rather than assumed.
if (import.meta.env.DEV) {
  (globalThis as unknown as { __slopMotion?: unknown }).__slopMotion = {
    matchMedias: () => live.size,
    scrollTriggers: () => ScrollTrigger.getAll().length,
    tweens: () => gsap.globalTimeline.getChildren(true, true, false).length,
  };
}

/** True only for the first page of a session, so an entrance can play once on
 *  arrival rather than on every navigation. */
let firstLoadDone = false;
export function isFirstLoad(): boolean {
  if (firstLoadDone) return false;
  firstLoadDone = true;
  return true;
}
