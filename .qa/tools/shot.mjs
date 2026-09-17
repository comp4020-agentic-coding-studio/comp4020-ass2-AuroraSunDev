// Screenshots a URL at a real layout viewport via Emulation.setDeviceMetrics-
// Override. Headless Chrome clamps --window-size at ~490px, so the 390px
// checks in CLAUDE.md need the override to be a genuine 390px layout.
import fs from "node:fs";
import { launch, connect, goto, evaluate } from "./cdp.mjs";

const [, , url, outFile, wS, hS, ...flags] = process.argv;
const W = +wS, H = +hS;
const reduced = flags.includes("--reduced");
const full = flags.includes("--full");
const delay = Number(flags.find((f) => f.startsWith("--delay="))?.split("=")[1] ?? 1400);

const { proc, wsUrl } = await launch(9341);
const s = await connect(wsUrl);
await s.send("Emulation.setDeviceMetricsOverride", {
  width: W, height: H, deviceScaleFactor: 1, mobile: false, // see note in cdp.mjs: mobile:true now yields a 980px layout
});
if (reduced) {
  await s.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
}
await goto(s, url);
await evaluate(s, `(async () => {
  document.documentElement.style.scrollBehavior = 'auto';
  await document.fonts.ready;
  await Promise.all([...document.images].map(i => i.complete ? 1 : i.decode().catch(() => 1)));
  return 1;
})()`);
await new Promise((r) => setTimeout(r, delay));

const real = await evaluate(s, `JSON.stringify({
  layoutWidth: document.documentElement.clientWidth,
  scrollWidth: document.documentElement.scrollWidth,
})`);
console.log("viewport check:", real);

const shot = await s.send("Page.captureScreenshot", {
  format: "png",
  captureBeyondViewport: full,
  ...(full ? { clip: await evaluate(s, `(() => {
    const h = document.documentElement.scrollHeight;
    return { x: 0, y: 0, width: ${W}, height: h, scale: 1 };
  })()`) } : {}),
});
fs.writeFileSync(outFile, Buffer.from(shot.data, "base64"));
console.log("wrote", outFile);
proc.kill();
process.exit(0);
