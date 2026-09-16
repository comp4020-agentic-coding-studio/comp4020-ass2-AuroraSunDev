// Live-page hero audit: rendered figure box, the machine's own width inside
// the photograph, page-vs-photo background match, overflow, and the GSAP
// instance counts after the sequence settles.
import { launch, connect, goto, evaluate } from "./cdp.mjs";

const [, , url, wS, hS, ...flags] = process.argv;
const W = +wS, H = +hS;
const reduced = flags.includes("--reduced");

const { proc, wsUrl } = await launch(9343);
const s = await connect(wsUrl);
await s.send("Emulation.setDeviceMetricsOverride", {
  width: W, height: H, deviceScaleFactor: 1, mobile: W < 700,
});
if (reduced) {
  await s.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
}
await goto(s, url);
await evaluate(s, `(async () => { await document.fonts.ready;
  await Promise.all([...document.images].map(i => i.complete ? 1 : i.decode().catch(()=>1))); })()`);
await new Promise((r) => setTimeout(r, 2200));

const out = await evaluate(s, `(async () => {
  const rig = document.querySelector('.rig');
  const img = rig.querySelector('.rig-layer:not(.rig-layer--preload) img');
  const pre = rig.querySelector('.rig-layer--preload');
  const box = rig.getBoundingClientRect();

  // Draw the rendered photo to a canvas and find the machine's silhouette,
  // so dominance is measured from the equipment, not the asset's margins.
  const c = new OffscreenCanvas(img.naturalWidth, img.naturalHeight);
  const cx = c.getContext('2d', { willReadFrequently: true });
  cx.drawImage(img, 0, 0);
  const d = cx.getImageData(0,0,c.width,c.height).data;
  const lum = (x,y) => { const i=(y*c.width+x)*4; return 0.2126*d[i]+0.7152*d[i+1]+0.0722*d[i+2]; };
  let lo = c.width, hi = 0;
  for (let y = 0; y < c.height; y += 3)
    for (let x = 0; x < c.width; x++)
      if (lum(x,y) < 240) { if (x < lo) lo = x; if (x > hi) hi = x; }
  const machineFrac = (hi - lo + 1) / c.width;

  const photoBg = (() => { const i = (4*c.width + 4)*4; return [d[i],d[i+1],d[i+2]]; })();
  const pageBg = getComputedStyle(document.querySelector('.band--hero')).backgroundColor;
  const bodyBg = getComputedStyle(document.body).backgroundColor;

  const rendered = machineFrac * box.width;
  return {
    figureBox: [Math.round(box.width), Math.round(box.height)],
    naturalAsset: [c.width, c.height],
    machineFractionOfAsset: +machineFrac.toFixed(3),
    machineRenderedPx: Math.round(rendered),
    machinePctOfViewport: +(100 * rendered / ${W}).toFixed(1),
    currentSrc: img.currentSrc.split('/').pop(),
    preloadOpacity: getComputedStyle(pre).opacity,
    preloadInlineStyle: pre.getAttribute('style'),
    photoBg, pageBg, bodyBg,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    heroBottom: Math.round(document.querySelector('.band--hero').getBoundingClientRect().bottom),
    marksVisible: [...document.querySelectorAll('.rig-marks:not([style*="display: none"])')]
      .filter(el => getComputedStyle(el).display !== 'none')
      .map(el => el.className.baseVal || el.getAttribute('class')),
    loadOpacity: [...document.querySelectorAll('.rig-load')].map(el => getComputedStyle(el).opacity),
    scaleOpacity: [...document.querySelectorAll('.rig-scale')].map(el => getComputedStyle(el).opacity),
    gsap: window.__slopMotion ? {
      matchMedias: window.__slopMotion.matchMedias(),
      scrollTriggers: window.__slopMotion.scrollTriggers(),
    } : 'prod build (dev instrumentation stripped)',
  };
})()`);

console.log(JSON.stringify(out, null, 2));
proc.kill(); process.exit(0);
