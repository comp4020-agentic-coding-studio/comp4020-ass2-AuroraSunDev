// Renders with script execution disabled: what a reader gets when the bundle
// fails to load, GSAP 404s, or JS is switched off. The loaded state must be
// the state on screen, with the marks legible and nothing half-transitioned.
import fs from "node:fs";
import { launch, connect, goto, evaluate } from "./cdp.mjs";
const [, , url, out, wS, hS] = process.argv;
const { proc, wsUrl } = await launch(9345);
const s = await connect(wsUrl);
await s.send("Emulation.setDeviceMetricsOverride", {
  width: +wS, height: +hS, deviceScaleFactor: 1, mobile: false,
});
await s.send("Emulation.setScriptExecutionDisabled", { value: true });
await goto(s, url);
await new Promise((r) => setTimeout(r, 2000));
const shot = await s.send("Page.captureScreenshot", { format: "png" });
fs.writeFileSync(out, Buffer.from(shot.data, "base64"));
// Read the DOM without running page script: DOM.* rather than Runtime.evaluate.
const { root } = await s.send("DOM.getDocument", { depth: -1 });
const find = (n, cls, acc = []) => {
  const a = n.attributes || [];
  for (let i = 0; i < a.length; i += 2)
    if (a[i] === "class" && a[i + 1].includes(cls)) acc.push(a.slice());
  (n.children || []).forEach((c) => find(c, cls, acc));
  return acc;
};
const layers = find(root, "rig-layer").map((a) => {
  const o = {};
  for (let i = 0; i < a.length; i += 2) o[a[i]] = a[i + 1];
  return { class: o.class, style: o.style ?? null };
});
console.log(JSON.stringify({ layers, scripts: "disabled" }, null, 2));
proc.kill(); process.exit(0);
