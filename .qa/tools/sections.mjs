import { launch, connect, goto, evaluate } from "./cdp.mjs";
const [, , url, wS] = process.argv;
const { proc, wsUrl } = await launch(9371);
const s = await connect(wsUrl);
await s.send("Emulation.setDeviceMetricsOverride", { width: +wS, height: 1080, deviceScaleFactor: 1, mobile: false });
await goto(s, url);
await evaluate(s, `(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.complete?1:i.decode().catch(()=>1)))})()`);
const out = await evaluate(s, `JSON.stringify([...document.querySelectorAll('.band')].map((b,i)=>{
  const r=b.getBoundingClientRect();
  const h=b.querySelector('h1,h2,.xl,.display');
  return { i, cls:b.className, top:Math.round(r.top+scrollY), h:Math.round(r.height),
           heading:(h?h.textContent:'').trim().slice(0,60) };
}), null, 1)`);
console.log(out);
proc.kill(); process.exit(0);
