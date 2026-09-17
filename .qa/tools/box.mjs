// Prints the layout box of every selector given on the command line, at a
// chosen viewport, so a suspicion about sizing is settled by measurement.
import { launch, connect, goto, evaluate } from "./cdp.mjs";

const URL_ = process.env.QA_URL ?? "http://localhost:4321/comp4020-ass2-AuroraSunDev/";
const W = Number(process.env.QA_W ?? 1920);
const H = Number(process.env.QA_H ?? 1080);
const sels = process.argv.slice(2);

const { proc, wsUrl } = await launch(9351, [`--window-size=${W},${H}`]);
const s = await connect(wsUrl);
await s.send("Emulation.setDeviceMetricsOverride", {
  width: W, height: H, deviceScaleFactor: 1, mobile: false, // see note in cdp.mjs: mobile:true now yields a 980px layout
});
await goto(s, URL_);
await evaluate(s, `new Promise(r => setTimeout(r, 700))`);

const out = await evaluate(s, `(() => {
  const res = {};
  for (const sel of ${JSON.stringify(sels)}) {
    res[sel] = [...document.querySelectorAll(sel)].map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        x: +r.x.toFixed(1), y: +(r.y + scrollY).toFixed(1),
        w: +r.width.toFixed(1), h: +r.height.toFixed(1),
        width: cs.width, maxWidth: cs.maxWidth, display: cs.display,
        gridColumn: cs.gridColumnStart + " / " + cs.gridColumnEnd,
        gridRow: cs.gridRowStart + " / " + cs.gridRowEnd,
      };
    });
  }
  return res;
})()`);

console.log(JSON.stringify(out, null, 2));
proc.kill();
process.exit(0);
