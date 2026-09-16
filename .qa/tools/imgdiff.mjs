// Compares two same-sized renders for structural alignment.
// Reports per-row silhouette extents and vertical ink runs, so we can tell
// "the platen moved" apart from "the whole machine moved".
import { serve, launch, connect, goto, evaluate } from "./cdp.mjs";

const [, , imgA, imgB, ...probeArgs] = process.argv;
const probes = probeArgs.length ? probeArgs.map(Number) : [];
const ROOT = new URL("../hero-generation/", import.meta.url).pathname;
const PORT = 8899;

const server = await serve(ROOT, PORT);
const { proc, wsUrl } = await launch();
const s = await connect(wsUrl);
await goto(s, `http://127.0.0.1:${PORT}/`);

const result = await evaluate(s, `(async () => {
  const THRESH = 240;            // luminance below this counts as ink
  async function load(name) {
    const img = new Image();
    img.src = "/" + name;
    await img.decode();
    const c = new OffscreenCanvas(img.width, img.height);
    const x = c.getContext("2d", { willReadFrequently: true });
    x.drawImage(img, 0, 0);
    return { w: img.width, h: img.height, d: x.getImageData(0, 0, img.width, img.height).data };
  }
  const lum = (d, i) => 0.2126*d[i] + 0.7152*d[i+1] + 0.0722*d[i+2];

  function silhouette({ w, h, d }) {
    const rows = [];
    for (let y = 0; y < h; y++) {
      let lo = -1, hi = -1;
      for (let x = 0; x < w; x++) {
        if (lum(d, (y*w + x)*4) < THRESH) { if (lo < 0) lo = x; hi = x; }
      }
      rows.push(lo < 0 ? null : [lo, hi]);
    }
    return rows;
  }
  function inkRuns({ w, h, d }, x) {
    const runs = []; let start = -1;
    for (let y = 0; y < h; y++) {
      const ink = lum(d, (y*w + x)*4) < THRESH;
      if (ink && start < 0) start = y;
      if (!ink && start >= 0) { if (y - start > 3) runs.push([start, y-1]); start = -1; }
    }
    if (start >= 0) runs.push([start, h-1]);
    return runs;
  }

  const A = await load(${JSON.stringify(imgA)});
  const B = await load(${JSON.stringify(imgB)});
  if (A.w !== B.w || A.h !== B.h) return { error: "size mismatch", A: [A.w,A.h], B: [B.w,B.h] };

  const sa = silhouette(A), sb = silhouette(B);
  const rowDev = [];
  for (let y = 0; y < A.h; y++) {
    if (!sa[y] || !sb[y]) { rowDev.push(sa[y] === sb[y] ? 0 : null); continue; }
    rowDev.push(Math.max(Math.abs(sa[y][0]-sb[y][0]), Math.abs(sa[y][1]-sb[y][1])));
  }
  // Band summary: max silhouette deviation per 10% slice of image height.
  const bands = [];
  const step = Math.floor(A.h/10);
  for (let b = 0; b < 10; b++) {
    const seg = rowDev.slice(b*step, (b+1)*step).filter(v => v !== null);
    bands.push({ band: b, yFrom: b*step, yTo: (b+1)*step-1,
                 maxDev: seg.length ? Math.max(...seg) : null });
  }
  const probes = {};
  for (const x of ${JSON.stringify(probes)}) probes[x] = { A: inkRuns(A, x), B: inkRuns(B, x) };
  return { size: [A.w, A.h], bands, probes };
})()`);

console.log(JSON.stringify(result, null, 2));
server.close();
proc.kill();
process.exit(0);
