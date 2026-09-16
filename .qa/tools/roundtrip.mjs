// Eight home -> away -> home round trips through the ClientRouter, sampling
// after every swap: GSAP instance counts (a leak shows as a monotonic climb),
// the preload layer's inline state (a stale `visibility: visible` would leave
// the earlier frame on screen), and whether the hero replays.
import { launch, connect, goto, evaluate } from "./cdp.mjs";
const [, , base] = process.argv;
const HOME = base;
const AWAY = base.replace(/\/$/, "") + "/weeks/";

const { proc, wsUrl } = await launch(9347);
const s = await connect(wsUrl);
await s.send("Emulation.setDeviceMetricsOverride", {
  width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false,
});
await goto(s, HOME);

const nav = async (href) => {
  await evaluate(s, `(async () => {
    const done = new Promise(r => document.addEventListener('astro:page-load', r, { once: true }));
    const a = document.createElement('a'); a.href = ${JSON.stringify(href)};
    document.body.appendChild(a); a.click();
    await done; await new Promise(r => setTimeout(r, 1600));
  })()`);
};

const sample = async (label) => JSON.parse(await evaluate(s, `(() => {
  const m = window.__slopMotion;
  const pre = document.querySelector('.rig-layer--preload');
  return JSON.stringify({
    at: ${JSON.stringify(label)},
    path: location.pathname.replace(/^.*AuroraSunDev/, ''),
    matchMedias: m ? m.matchMedias() : null,
    scrollTriggers: m ? m.scrollTriggers() : null,
    preloadInline: pre ? pre.getAttribute('style') : 'no hero',
    preloadOpacity: pre ? getComputedStyle(pre).opacity : 'no hero',
    preloadVisibility: pre ? getComputedStyle(pre).visibility : 'no hero',
  });
})()`));

const rows = [await sample("first arrival")];
for (let i = 1; i <= 8; i++) {
  await nav(AWAY);
  rows.push(await sample(`trip ${i} away`));
  await nav(HOME);
  rows.push(await sample(`trip ${i} home`));
}
console.table(rows);
proc.kill(); process.exit(0);
