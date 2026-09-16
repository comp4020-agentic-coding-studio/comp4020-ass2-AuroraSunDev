// Measures the specimen geometry that the loaded/preload pair must express:
// platen underside, bread top (first warm/food-coloured pixel) and the lower
// platen surface, so sandwich height can be compared between states.
import { serve, launch, connect, goto, evaluate } from "./cdp.mjs";

const files = process.argv.slice(2);
const ROOT = new URL("../hero-generation/", import.meta.url).pathname;
const PORT = 8903;
const server = await serve(ROOT, PORT);
const { proc, wsUrl } = await launch(9337);
const s = await connect(wsUrl);
await goto(s, `http://127.0.0.1:${PORT}/`);

const out = await evaluate(s, `(async () => {
  const res = {};
  for (const name of ${JSON.stringify(files)}) {
    const img = new Image(); img.src = "/" + name; await img.decode();
    const c = new OffscreenCanvas(img.width, img.height);
    const cx = c.getContext("2d", { willReadFrequently: true });
    cx.drawImage(img, 0, 0);
    const d = cx.getImageData(0, 0, img.width, img.height).data;
    const w = img.width;
    const at = (x,y) => { const i=(y*w+x)*4; return [d[i],d[i+1],d[i+2]]; };
    const lum = (x,y) => { const [r,g,b]=at(x,y); return 0.2126*r+0.7152*g+0.0722*b; };
    // Food is warm and not grey; steel is neutral.
    const warm = (x,y) => { const [r,g,b]=at(x,y); return (r-b) > 28 && r > 110; };

    const xs = [0.35, 0.5, 0.65].map((f) => Math.round(w * f));
    const cols = {};
    for (const x of xs) {
      let breadTop = null;
      for (let y = 300; y < 1000; y++) if (warm(x,y)) { breadTop = y; break; }
      let breadBottom = null;
      for (let y = 1000; y > 300; y--) if (warm(x,y)) { breadBottom = y; break; }
      // Platen underside: last non-white pixel above breadTop.
      let platen = null;
      if (breadTop) for (let y = breadTop-1; y > 300; y--) if (lum(x,y) < 235) { platen = y; break; }
      cols[x] = { platenUnderside: platen, breadTop, breadBottom,
                  gap: (breadTop!=null&&platen!=null) ? breadTop-platen-1 : null,
                  sandwichHeight: (breadTop!=null&&breadBottom!=null) ? breadBottom-breadTop+1 : null };
    }
    res[name] = cols;
  }
  return res;
})()`);

console.log(JSON.stringify(out, null, 2));
server.close(); proc.kill(); process.exit(0);
