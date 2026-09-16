// Lists every <text> in an inline SVG that crosses its own viewBox, which is
// the one kind of clipping the other tools here cannot see.
//
// overflow.mjs measures elements against the layout viewport. A label that
// runs past the edge of its viewBox never reaches the viewport: the SVG clips
// it, the page does not scroll, and the result looks in a screenshot exactly
// like a label that was meant to end there. Four labels in the Week 4 figures
// were cut for months this way --- one had lost its first word off the left.
//
// Measured in user units against the viewBox, so the reading does not depend
// on the width the SVG happens to be drawn at, and one run covers every
// viewport. Reveal decks are handled too: every slide is forced visible for
// the measurement and put back afterwards, because an off-screen slide has no
// layout and would report nothing.
import { launch, connect, goto, evaluate } from "./cdp.mjs";

const URL_ = process.env.QA_URL ?? "http://localhost:4321/comp4020-ass2-AuroraSunDev/";
const W = Number(process.env.QA_W ?? 1440);

const { proc, wsUrl } = await launch(9357);
const s = await connect(wsUrl);
await s.send("Emulation.setDeviceMetricsOverride", {
  width: W, height: 900, deviceScaleFactor: 1, mobile: false,
});
await goto(s, URL_);
await evaluate(s, `document.fonts.ready.then(() => 1)`);
await evaluate(s, `new Promise(r => setTimeout(r, 1500))`);

// A deck opens behind a "this is a slide deck" overlay that suppresses layout
// work until it is dismissed.
await evaluate(s, `(() => { if (document.querySelector(".slides")) document.body.click(); return 1 })()`);
await evaluate(s, `new Promise(r => setTimeout(r, 500))`);

const out = await evaluate(s, `(() => {
  const hits = [];
  const restore = [];
  for (const sec of document.querySelectorAll(".slides section")) {
    restore.push([sec, sec.style.cssText]);
    sec.style.display = "block";
    sec.style.visibility = "visible";
    sec.style.opacity = "1";
  }

  for (const svg of document.querySelectorAll("svg[viewBox]")) {
    const vb = svg.getAttribute("viewBox").trim().split(/[\\s,]+/).map(Number);
    const box = svg.getBoundingClientRect();
    if (vb.length < 4 || !box.width || !vb[2]) continue;
    const perPx = vb[2] / box.width;

    for (const t of svg.querySelectorAll("text")) {
      const r = t.getBoundingClientRect();
      if (!r.width) continue;
      const startU = (r.left - box.left) * perPx + vb[0];
      const endU = (r.right - box.left) * perPx + vb[0];
      const over = +(endU - (vb[0] + vb[2])).toFixed(1);
      const under = +(vb[0] - startU).toFixed(1);
      if (over > 0.5 || under > 0.5) {
        hits.push({
          text: t.textContent.trim().slice(0, 60),
          viewBox: vb.join(" "),
          startU: Math.round(startU),
          endU: Math.round(endU),
          past: over > 0.5 ? \`right by \${over}\` : \`left by \${under}\`,
        });
      }
    }
  }

  for (const [sec, css] of restore) sec.style.cssText = css;
  return { url: location.pathname, svgs: document.querySelectorAll("svg[viewBox]").length, hits };
})()`);

console.log(JSON.stringify(out, null, 2));
proc.kill();
// Non-zero on findings, so a sweep over many pages can be driven by exit code.
process.exit(out.hits.length ? 1 : 0);
