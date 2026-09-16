// Translates an image vertically inside its own canvas, filling the vacated
// strip with the image's own background colour. Used to remove a uniform
// generative drift so a state pair registers exactly.
import fs from "node:fs";
import { serve, launch, connect, goto, evaluate } from "./cdp.mjs";

const [, , inName, outName, dyS] = process.argv;
const dy = +dyS; // positive = move content up
const ROOT = new URL("../hero-generation/", import.meta.url).pathname;
const PORT = 8905;
const server = await serve(ROOT, PORT);
const { proc, wsUrl } = await launch(9339);
const s = await connect(wsUrl);
await goto(s, `http://127.0.0.1:${PORT}/`);

const b64 = await evaluate(s, `(async () => {
  const img = new Image(); img.src = ${JSON.stringify("/" + inName)}; await img.decode();
  const w = img.width, h = img.height;
  const probe = new OffscreenCanvas(w, h);
  const pc = probe.getContext("2d", { willReadFrequently: true });
  pc.drawImage(img, 0, 0);
  // Background sampled from the corner the vacated strip will border.
  const sy = ${dy} > 0 ? h - 3 : 2;
  const p = pc.getImageData(2, sy, 1, 1).data;

  const c = new OffscreenCanvas(w, h);
  const x = c.getContext("2d");
  x.fillStyle = 'rgb(' + p[0] + ',' + p[1] + ',' + p[2] + ')';
  x.fillRect(0, 0, w, h);
  x.drawImage(img, 0, -${dy});

  const blob = await c.convertToBlob({ type: "image/png" });
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let out = "";
  for (let i = 0; i < bytes.length; i += 0x8000)
    out += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(out);
})()`);

fs.writeFileSync(ROOT + outName, Buffer.from(b64, "base64"));
console.log(`wrote ${outName} (shifted up ${dy}px)`);
server.close(); proc.kill(); process.exit(0);
