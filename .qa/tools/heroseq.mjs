// Samples the preload layer's opacity and the marks' opacity across the first
// arrival, optionally resizing across the art-direction breakpoint mid-flight.
// A clean sequence: preload starts opaque, falls to 0, marks come up after,
// and nothing is left mid-tween.
import { launch, connect, goto, evaluate } from "./cdp.mjs";
const [, , url, ...flags] = process.argv;
const resizeAt = Number(flags.find((f) => f.startsWith("--resize="))?.split("=")[1] ?? -1);

const { proc, wsUrl } = await launch(9349);
const s = await connect(wsUrl);
const metrics = (w, h) => s.send("Emulation.setDeviceMetricsOverride",
  { width: w, height: h, deviceScaleFactor: 1, mobile: false });
await metrics(1920, 1080);
await goto(s, url);

const rows = [];
const t0 = Date.now();
for (let i = 0; i < 16; i++) {
  if (resizeAt >= 0 && Date.now() - t0 >= resizeAt && !rows.some((r) => r.resized)) {
    await metrics(390, 844);
    rows.push({ t: Date.now() - t0, resized: true });
    continue;
  }
  rows.push(JSON.parse(await evaluate(s, `(() => {
    const pre = document.querySelector('.rig-layer--preload');
    const marks = document.querySelector('.rig-marks:not([style*="none"]) .rig-load');
    return JSON.stringify({
      t: ${Date.now() - t0},
      preload: +getComputedStyle(pre).opacity,
      inline: pre.getAttribute('style'),
      arrows: marks ? +getComputedStyle(marks).opacity : null,
      w: innerWidth,
    });
  })()`)));
  await new Promise((r) => setTimeout(r, 130));
}
console.table(rows);
proc.kill(); process.exit(0);
