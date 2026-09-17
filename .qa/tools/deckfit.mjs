// Checks that every slide in a reveal deck fits the slide box it is drawn in.
//
//   QA_URL=http://localhost:4321/<base>/decks/<slug>/ node .qa/tools/deckfit.mjs
//
// A reveal slide is a fixed logical box (1280x720 here) that reveal scales to
// the window. Nothing about overflowing it is loud: the slide does not scroll,
// nothing fails axe, and the page reports no horizontal overflow. A figure
// sized on width alone simply grows down past the bottom edge, and on screen
// the caption under it ends up printed across the drawing.
//
// It measures the overflow and not that overlap, which was tried first and
// dropped: laid out, the two are sequential --- the figure's box grows and the
// caption sits below it --- and they only cross on screen because reveal
// shifts the content of a slide that does not fit. That shift is not applied
// to the off-screen slides a sweep has to force visible, so an overlap test
// measures a state no presenter sees and silently finds nothing. The overflow
// is the condition itself and it reads the same on every slide.
//
// Two things it has to get right to be worth running:
//
//   - Off-screen slides have no layout. Every slide but the current one
//     reports zero-sized children, so a naive sweep finds nothing wrong
//     anywhere. They are forced visible for the measurement and restored
//     after.
//   - Rects come back post-transform, in screen pixels, because reveal scales
//     .slides. The scale is recovered per slide from its own rect against its
//     offsetHeight, so the budget is compared in the slide's own logical units
//     and the result does not move with the window size.
//   - There are two edges, and only one of them is a failure. The slide's
//     border box is the projected frame: past it, content is off the slide and
//     nobody in the room can read it. The padding box inside it is the
//     designed margin. Measuring everything against the margin was the first
//     version of this tool, and it called a uniform 51px on nine slides of the
//     Week 4 deck a fault --- captions sitting 13px from the frame edge, tight
//     but on the slide and deliberate. So the margin is reported and does not
//     fail; the frame fails.
import { launch, connect, goto, evaluate } from "./cdp.mjs";

const URL_ = process.env.QA_URL;
const W = Number(process.env.QA_W ?? 1920);
const H = Number(process.env.QA_H ?? 1080);
/* Slack, in logical px, before a finding is called. Antialiasing and
   fractional line boxes put a clean slide a fraction over its own edge. */
const TOL = Number(process.env.QA_TOL ?? 2);

if (!URL_) {
  console.error("deckfit: set QA_URL to the deck URL (including the base path).");
  process.exit(2);
}

const { proc, wsUrl } = await launch(9365);
const s = await connect(wsUrl);
await s.send("Emulation.setDeviceMetricsOverride", {
  width: W, height: H, deviceScaleFactor: 1, mobile: false,
});
await goto(s, URL_);
await evaluate(s, `new Promise(r => setTimeout(r, 2200))`);

const raw = await evaluate(s, `(() => {
  const sections = [...document.querySelectorAll('.slides section')];
  const saved = sections.map((e) => e.getAttribute('style') || '');
  sections.forEach((e) => {
    e.style.cssText += ';display:block!important;visibility:visible!important;opacity:1!important;';
  });

  const findings = [];
  /* getAttribute, not .className: on an SVG element className is an
     SVGAnimatedString and stringifies to [object SVGAnimatedString], which is
     how the first run of this tool named every figure it found. */
  const name = (el) => {
    const c = el.getAttribute('class');
    return el.tagName.toLowerCase() + (c ? '.' + c.trim().split(/\s+/).join('.') : '');
  };

  const label = (sec, i) => {
    const h = sec.querySelector('h1,h2,h3');
    return (h ? h.textContent.replace(/#$/, '').trim() : '(no heading)') + ' [slide ' + i + ']';
  };

  sections.forEach((sec, i) => {
    const secRect = sec.getBoundingClientRect();
    if (!secRect.height || !sec.offsetHeight) return;
    /* Recover reveal's scale from the slide itself, then work in logical px. */
    const k = secRect.height / sec.offsetHeight;
    const cs = getComputedStyle(sec);
    const padTop = parseFloat(cs.paddingTop) || 0;
    const padBottom = parseFloat(cs.paddingBottom) || 0;
    /* The frame, and the margin inside it. */
    const frameTop = secRect.top;
    const frameBottom = secRect.bottom;
    const marginTop = secRect.top + padTop * k;
    const marginBottom = secRect.bottom - padBottom * k;

    const kids = [...sec.children].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });

    for (const el of kids) {
      const r = el.getBoundingClientRect();
      /* Off the slide entirely: the failure. */
      const offBottom = (r.bottom - frameBottom) / k;
      const offTop = (frameTop - r.top) / k;
      /* Only into the designed margin: reported, not failed. */
      const intoBottom = (r.bottom - marginBottom) / k;
      const intoTop = (marginTop - r.top) / k;

      if (offBottom > ${TOL}) {
        findings.push({ slide: label(sec, i), kind: 'off the slide (bottom)',
          node: name(el), byPx: Math.round(offBottom), fail: true });
      } else if (intoBottom > ${TOL}) {
        findings.push({ slide: label(sec, i), kind: 'into the bottom margin',
          node: name(el), byPx: Math.round(intoBottom), fail: false });
      }

      if (offTop > ${TOL}) {
        findings.push({ slide: label(sec, i), kind: 'off the slide (top)',
          node: name(el), byPx: Math.round(offTop), fail: true });
      } else if (intoTop > ${TOL}) {
        findings.push({ slide: label(sec, i), kind: 'into the top margin',
          node: name(el), byPx: Math.round(intoTop), fail: false });
      }
    }

  });

  sections.forEach((e, i) => e.setAttribute('style', saved[i]));
  return JSON.stringify({ slides: sections.length, findings });
})()`);

const { slides, findings } = JSON.parse(raw);
const fails = findings.filter((f) => f.fail);
const warns = findings.filter((f) => !f.fail);
console.log(`deckfit: ${URL_}`);
console.log(`viewport ${W}x${H}, ${slides} slides, tolerance ${TOL}px (logical)`);

const show = (list) => {
  for (const f of list) {
    console.log(`  ${f.kind.padEnd(23)} ${String(f.byPx).padStart(5)}px  ${f.slide}`);
    console.log(`  ${" ".repeat(23)}        ${f.node}`);
  }
};

if (fails.length) {
  console.log(`\n${fails.length} off the slide:`);
  show(fails);
} else {
  console.log("on the slide: nothing runs past a slide's frame.");
}
if (warns.length) {
  console.log(`\n${warns.length} inside the frame but into its margin (reported, not failed):`);
  show(warns);
}
proc.kill();
process.exit(fails.length ? 1 : 0);
