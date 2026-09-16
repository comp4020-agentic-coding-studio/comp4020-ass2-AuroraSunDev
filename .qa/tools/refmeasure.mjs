// Measures, in a reference PNG: the dark-ink silhouette extents of a given
// horizontal band (the hero rig), and the y of the first full-width dark row
// (the start of the next section) --- so "machine dominance" and "next-section
// peek" can be compared against the live page in the same units.
import { serve, launch, connect, goto, evaluate } from "./cdp.mjs";
const [, , file, x0f, x1f, y0f, y1f] = process.argv;
const box = [x0f, x1f, y0f, y1f].map(Number);
const srv = serve(process.cwd(), 9351);
const { proc, wsUrl } = await launch(9352);
const s = await connect(wsUrl);
await goto(s, "http://127.0.0.1:9351/");
const out = await evaluate(s, `(async () => {
  const im = new Image();
  im.src = ${JSON.stringify("/" + file)};
  await im.decode();
  const c = new OffscreenCanvas(im.naturalWidth, im.naturalHeight);
  const cx = c.getContext('2d', { willReadFrequently: true });
  cx.drawImage(im, 0, 0);
  const d = cx.getImageData(0,0,c.width,c.height).data;
  const lum = (x,y) => { const i=(y*c.width+x)*4; return 0.2126*d[i]+0.7152*d[i+1]+0.0722*d[i+2]; };
  const [x0f,x1f,y0f,y1f] = ${JSON.stringify(box)};
  const X0=Math.round(x0f*c.width), X1=Math.round(x1f*c.width);
  const Y0=Math.round(y0f*c.height), Y1=Math.round(y1f*c.height);
  let lo=X1, hi=X0, top=Y1, bot=Y0;
  for (let y=Y0; y<Y1; y+=2) for (let x=X0; x<X1; x++)
    if (lum(x,y) < 240) { if(x<lo)lo=x; if(x>hi)hi=x; if(y<top)top=y; if(y>bot)bot=y; }
  // First row that is >90% dark across the full width: the ink band below the hero.
  let bandY = -1;
  for (let y=Math.round(0.3*c.height); y<c.height && bandY<0; y++) {
    let dark=0; for (let x=0;x<c.width;x+=4) if (lum(x,y) < 90) dark++;
    if (dark > 0.9*(c.width/4)) bandY = y;
  }
  return { size:[c.width,c.height], inkX:[lo,hi], inkY:[top,bot],
           widthFrac:+((hi-lo+1)/c.width).toFixed(3),
           bandY, bandYFrac: bandY<0?null:+(bandY/c.height).toFixed(3) };
})()`);
console.log(JSON.stringify(out));
proc.kill(); srv.close(); process.exit(0);
