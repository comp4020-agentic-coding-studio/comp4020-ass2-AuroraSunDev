// The crossfade midpoint, constructed rather than caught: the two states at
// 50% each. Any doubled edge, ghosted bread or twinned column that the
// transition would show is at its worst here.
import fs from "node:fs";
import { serve, launch, connect, goto, evaluate } from "./cdp.mjs";
const [, , a, b, out] = process.argv;
serve(process.cwd(), 9363);
const { proc, wsUrl } = await launch(9364);
const s = await connect(wsUrl);
await goto(s, "http://127.0.0.1:9363/");
const data = await evaluate(s, `(async () => {
  const load = async (p) => { const im = new Image(); im.src = p; await im.decode(); return im; };
  const A = await load(${JSON.stringify("/" + a)}), B = await load(${JSON.stringify("/" + b)});
  const c = new OffscreenCanvas(A.naturalWidth, A.naturalHeight);
  const cx = c.getContext('2d');
  cx.drawImage(A, 0, 0);
  cx.globalAlpha = 0.5; cx.drawImage(B, 0, 0);
  const blob = await c.convertToBlob({ type: 'image/png' });
  const buf = new Uint8Array(await blob.arrayBuffer());
  let s2 = ''; for (const x of buf) s2 += String.fromCharCode(x);
  return btoa(s2);
})()`);
fs.writeFileSync(out, Buffer.from(data, "base64"));
console.log("wrote", out);
proc.kill(); process.exit(0);
