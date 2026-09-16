// Tints one horizontal band of a greyscale specimen to a saturated red,
// preserving its luminance structure so the crumb/fibre detail survives. The
// band edges use a cosine falloff so the recolour has no hard seam, and pixels
// darker than `floor` are left alone so the black background stays black.
import fs from "node:fs";
import { serve, launch, connect, goto, evaluate } from "./cdp.mjs";
const [, , inp, out, y0S, y1S, featherS = "10", floorS = "22"] = process.argv;
serve(process.cwd(), 9377);
const { proc, wsUrl } = await launch(9378);
const s = await connect(wsUrl);
await goto(s, "http://127.0.0.1:9377/");
const data = await evaluate(s, `(async () => {
  const im = new Image(); im.src = ${JSON.stringify("/" + inp)}; await im.decode();
  const c = new OffscreenCanvas(im.naturalWidth, im.naturalHeight);
  const cx = c.getContext('2d', { willReadFrequently: true });
  cx.drawImage(im, 0, 0);
  const img = cx.getImageData(0,0,c.width,c.height), d = img.data;
  const y0=${y0S}, y1=${y1S}, F=${featherS}, FLOOR=${floorS};
  let touched = 0;
  for (let y = y0 - F; y <= y1 + F; y++) {
    if (y < 0 || y >= c.height) continue;
    let t = 1;
    if (y < y0) t = 0.5 - 0.5*Math.cos(Math.PI * (y - (y0-F)) / F);
    else if (y > y1) t = 0.5 + 0.5*Math.cos(Math.PI * (y - y1) / F);
    for (let x = 0; x < c.width; x++) {
      const i = (y*c.width+x)*4;
      const g = 0.2126*d[i] + 0.7152*d[i+1] + 0.0722*d[i+2];
      if (g < FLOOR) continue;               // background and deep shadow stay put
      const v = g/255;
      const R = Math.min(255, v*1.38*255), G = v*0.16*255, B = v*0.12*255;
      d[i]   = d[i]  *(1-t) + R*t;
      d[i+1] = d[i+1]*(1-t) + G*t;
      d[i+2] = d[i+2]*(1-t) + B*t;
      touched++;
    }
  }
  cx.putImageData(img, 0, 0);
  const blob = await c.convertToBlob({ type: 'image/png' });
  const buf = new Uint8Array(await blob.arrayBuffer());
  let s2=''; for (const b of buf) s2 += String.fromCharCode(b);
  return JSON.stringify({ touched, b64: btoa(s2) });
})()`);
const { touched, b64 } = JSON.parse(data);
fs.writeFileSync(out, Buffer.from(b64, "base64"));
console.log("wrote", out, "| pixels tinted:", touched);
proc.kill(); process.exit(0);
