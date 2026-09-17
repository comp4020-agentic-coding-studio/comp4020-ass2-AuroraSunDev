// Lists every element whose border box crosses the layout viewport's right
// edge, innermost first, so the actual overflowing node is named rather than
// guessed at from a screenshot.
import { launch, connect, goto, evaluate } from "./cdp.mjs";

const URL_ = process.env.QA_URL ?? "http://localhost:4321/comp4020-ass2-AuroraSunDev/";
const W = Number(process.env.QA_W ?? 390);
const H = Number(process.env.QA_H ?? 844);

const { proc, wsUrl } = await launch(9353);
const s = await connect(wsUrl);
await s.send("Emulation.setDeviceMetricsOverride", {
  width: W, height: H, deviceScaleFactor: 1, mobile: false, // see note in cdp.mjs: mobile:true now yields a 980px layout
});
await goto(s, URL_);
await evaluate(s, `new Promise(r => setTimeout(r, 800))`);

const out = await evaluate(s, `(() => {
  const vw = document.documentElement.clientWidth;
  const hits = [];
  for (const el of document.querySelectorAll("*")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.right <= vw + 0.5 && r.left >= -0.5) continue;
    hits.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.getAttribute("class") ?? "").slice(0, 70),
      left: +r.left.toFixed(1),
      right: +r.right.toFixed(1),
      depth: (() => { let d = 0, n = el; while ((n = n.parentElement)) d++; return d; })(),
    });
  }
  hits.sort((a, b) => b.depth - a.depth);
  return { viewport: vw, scrollWidth: document.documentElement.scrollWidth, hits: hits.slice(0, 25) };
})()`);

console.log(JSON.stringify(out, null, 2));
proc.kill();
process.exit(0);
