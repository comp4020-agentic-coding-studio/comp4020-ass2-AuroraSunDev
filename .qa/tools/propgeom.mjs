// Locates the flat areas an HTML overlay has to land on. Background is the pure
// white studio sweep (bright AND unsaturated); everything else is the object.
// Reported in percentages of the asset, so the overlay positions survive any
// render size.
import { serve, launch, connect, goto, evaluate } from "./cdp.mjs";
const [, , file, mode] = process.argv;
serve(process.cwd(), 9379);
const { proc, wsUrl } = await launch(9380);
const s = await connect(wsUrl);
await goto(s, "http://127.0.0.1:9379/");
const out = await evaluate(s, `(async () => {
  const im = new Image(); im.src = ${JSON.stringify("/" + file)}; await im.decode();
  const W = im.naturalWidth, H = im.naturalHeight;
  const c = new OffscreenCanvas(W, H);
  const cx = c.getContext('2d', { willReadFrequently: true });
  cx.drawImage(im, 0, 0);
  const d = cx.getImageData(0,0,W,H).data;
  const px = (x,y) => { const i=(y*W+x)*4; return [d[i],d[i+1],d[i+2]]; };
  const lum = p => 0.2126*p[0]+0.7152*p[1]+0.0722*p[2];
  const sat = p => Math.max(...p) - Math.min(...p);
  const bg  = p => lum(p) > 250 && sat(p) < 5;      // the studio sweep
  const obj = (x,y) => !bg(px(x,y));
  const pct = (v, of) => +(100*v/of).toFixed(2);
  const scanX = (y, from, to, want) => { const st = to > from ? 1 : -1;
    for (let x = from; st > 0 ? x < to : x > to; x += st) if (obj(x,y) === want) return x; return -1; };
  const scanY = (x, from, to, want) => { const st = to > from ? 1 : -1;
    for (let y = from; st > 0 ? y < to : y > to; y += st) if (obj(x,y) === want) return y; return -1; };

  // Object bounding box, ignoring the soft drop shadow (require a real run).
  let L=W,R=0,T=H,B=0;
  for (let y=0;y<H;y+=2) for (let x=0;x<W;x++) {
    const p = px(x,y); if (bg(p) || lum(p) > 246) continue;
    if(x<L)L=x; if(x>R)R=x; if(y<T)T=y; if(y>B)B=y;
  }
  const box = { left:pct(L,W), right:pct(R,W), top:pct(T,H), bottom:pct(B,H) };

  if (${JSON.stringify(mode)} === 'manual') {
    // Cover right edge: sampled at a y between tabs is unreliable, so take the
    // x where the object is continuous for most rows -- the cover's own edge.
    const counts = new Array(W).fill(0);
    for (let y=T;y<=B;y+=2) for (let x=0;x<W;x++) if (obj(x,y)) counts[x]++;
    const rows = Math.round((B-T)/2);
    let coverR = R; for (let x=R;x>0;x--) if (counts[x] > rows*0.85) { coverR = x; break; }
    // Tabs live to the right of the cover edge; split them on background gaps.
    const probe = Math.min(W-2, coverR + Math.round((R-coverR)*0.55));
    const tabs = []; let run = null;
    for (let y=0;y<H;y++) {
      if (obj(probe,y)) { if (!run) run=[y,y]; else run[1]=y; }
      else if (run) { if (run[1]-run[0] > 20) tabs.push(run); run = null; }
    }
    if (run && run[1]-run[0] > 20) tabs.push(run);
    return { size:[W,H], box, coverRight: pct(coverR,W), tabProbeX: pct(probe,W),
      tabs: tabs.map(([a,b]) => ({ top:pct(a,H), bottom:pct(b,H),
        colour: px(probe, Math.round((a+b)/2)) })) };
  }

  // Sleeve: the sheet inside is a large area that is *slightly* off-white,
  // darker than the sweep but lighter than the plastic's seams.
  const midY = Math.round((T+B)/2), midX = Math.round((L+R)/2);
  const sheet = p => { const l = lum(p); return l > 235 && l <= 250 && sat(p) < 8; };
  const runX = (from, to) => { const st = to>from?1:-1;
    for (let x=from; st>0?x<to:x>to; x+=st) {
      let ok = true; for (let k=0;k<10;k++) if (!sheet(px(x+st*k, midY))) { ok=false; break; }
      if (ok) return x; } return -1; };
  const runY = (from, to) => { const st = to>from?1:-1;
    for (let y=from; st>0?y<to:y>to; y+=st) {
      let ok = true; for (let k=0;k<10;k++) if (!sheet(px(midX, y+st*k))) { ok=false; break; }
      if (ok) return y; } return -1; };
  return { size:[W,H], box, paper: {
    left: pct(runX(L, R), W), right: pct(runX(R, L), W),
    top: pct(runY(T, B), H), bottom: pct(runY(B, T), H) } };
})()`);
console.log(JSON.stringify(out));
proc.kill(); process.exit(0);
