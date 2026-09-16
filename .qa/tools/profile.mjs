// Row-mean luminance down an image, so layer boundaries are read off the
// picture rather than guessed from a glance.
import { serve, launch, connect, goto, evaluate } from "./cdp.mjs";
const [, , file, step = "8"] = process.argv;
serve(process.cwd(), 9375);
const { proc, wsUrl } = await launch(9376);
const s = await connect(wsUrl);
await goto(s, "http://127.0.0.1:9375/");
const out = await evaluate(s, `(async () => {
  const im = new Image(); im.src = ${JSON.stringify("/" + file)}; await im.decode();
  const c = new OffscreenCanvas(im.naturalWidth, im.naturalHeight);
  const cx = c.getContext('2d', { willReadFrequently: true });
  cx.drawImage(im, 0, 0);
  const d = cx.getImageData(0,0,c.width,c.height).data;
  const rows = [];
  for (let y = 0; y < c.height; y += ${Number(step)}) {
    let sum = 0, n = 0, sat = 0;
    for (let x = Math.round(c.width*0.15); x < c.width*0.85; x += 4) {
      const i = (y*c.width+x)*4, r=d[i], g=d[i+1], b=d[i+2];
      sum += 0.2126*r+0.7152*g+0.0722*b; n++;
      sat += Math.max(r,g,b) - Math.min(r,g,b);
    }
    rows.push([y, Math.round(sum/n), Math.round(sat/n)]);
  }
  return { size:[c.width,c.height], rows };
})()`);
console.log(`size ${out.size}`);
for (const [y, l, s2] of out.rows) console.log(String(y).padStart(5), String(l).padStart(4), "sat", String(s2).padStart(3), "#".repeat(Math.round(l/6)));
proc.kill(); process.exit(0);
