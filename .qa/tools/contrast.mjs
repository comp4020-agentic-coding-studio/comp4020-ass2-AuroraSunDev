// Non-text contrast for the marks drawn over the photograph. Only the ground
// actually touching a stroke counts, so the mark's pixels are located first and
// the measurement is taken in a ring dilated a few pixels out from them ---
// a dark seam elsewhere in the same rectangle is not a contrast neighbour.
import { serve, launch, connect, goto, evaluate } from "./cdp.mjs";
const [, , file, ring, ...boxes] = process.argv;
serve(process.cwd(), 9365);
const { proc, wsUrl } = await launch(9366);
const s = await connect(wsUrl);
await goto(s, "http://127.0.0.1:9365/");
const out = await evaluate(s, `(async () => {
  const im = new Image(); im.src = ${JSON.stringify("/" + file)}; await im.decode();
  const c = new OffscreenCanvas(im.naturalWidth, im.naturalHeight);
  const cx = c.getContext('2d', { willReadFrequently: true });
  cx.drawImage(im, 0, 0);
  const rel = ([r,g,b]) => { const f = v => { v/=255; return v<=0.03928?v/12.92:((v+0.055)/1.055)**2.4; };
    return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b); };
  const ratio = (a,b) => { const L=[rel(a),rel(b)].sort((x,y)=>y-x); return +((L[0]+0.05)/(L[1]+0.05)).toFixed(2); };
  const R = ${Number(ring)};
  return ${JSON.stringify(boxes)}.map(spec => {
    const [label,x0,y0,x1,y1,mr,mg,mb] = spec.split(',');
    const X0=+x0, Y0=+y0, W=+x1-X0, H=+y1-Y0, mark=[+mr,+mg,+mb];
    const d = cx.getImageData(X0,Y0,W,H).data;
    const at = (x,y) => { const i=(y*W+x)*4; return [d[i],d[i+1],d[i+2]]; };
    const isMark = p => Math.abs(p[0]-mark[0])<48 && Math.abs(p[1]-mark[1])<48 && Math.abs(p[2]-mark[2])<48;
    const marks = [];
    for (let y=0;y<H;y++) for (let x=0;x<W;x++) if (isMark(at(x,y))) marks.push([x,y]);
    if (!marks.length) return { label, error: 'no mark pixels found in box' };
    const seen = new Set(); let best=null, worst=null, n=0;
    for (const [mx,my] of marks)
      for (let dy=-R;dy<=R;dy++) for (let dx=-R;dx<=R;dx++) {
        const x=mx+dx, y=my+dy;
        if (x<0||y<0||x>=W||y>=H) continue;
        const k=y*W+x; if (seen.has(k)) continue; seen.add(k);
        const p=at(x,y); if (isMark(p)) continue;
        n++; const L=rel(p);
        if (!best || L>rel(best)) best=p;
        if (!worst || L<rel(worst)) worst=p;
      }
    return { label, markPixels: marks.length, ringPixels: n,
             lightestGround: best, vsLightest: ratio(mark,best),
             darkestGround: worst, vsDarkest: ratio(mark,worst) };
  });
})()`);
console.log(JSON.stringify(out, null, 2));
proc.kill(); process.exit(0);
