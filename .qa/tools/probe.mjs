// Samples corner background colours and machine top/bottom landmarks.
import { serve, launch, connect, goto, evaluate } from "./cdp.mjs";

const files = process.argv.slice(2);
const ROOT = new URL("../hero-generation/", import.meta.url).pathname;
const PORT = 8901;
const server = await serve(ROOT, PORT);
const { proc, wsUrl } = await launch(9335);
const s = await connect(wsUrl);
await goto(s, `http://127.0.0.1:${PORT}/`);

const out = await evaluate(s, `(async () => {
  const THRESH = 240;
  const res = {};
  for (const name of ${JSON.stringify(files)}) {
    const img = new Image(); img.src = "/" + name; await img.decode();
    const c = new OffscreenCanvas(img.width, img.height);
    const cx = c.getContext("2d", { willReadFrequently: true });
    cx.drawImage(img, 0, 0);
    const d = cx.getImageData(0, 0, img.width, img.height).data;
    const w = img.width, h = img.height;
    const px = (x,y) => { const i=(y*w+x)*4; return [d[i],d[i+1],d[i+2]]; };
    const lum = (x,y) => { const [r,g,b]=px(x,y); return 0.2126*r+0.7152*g+0.0722*b; };
    // First/last row containing any ink -> machine vertical extent.
    let top=null, bot=null;
    for (let y=0;y<h && top===null;y++) for (let x=0;x<w;x++) if (lum(x,y)<THRESH){top=y;break;}
    for (let y=h-1;y>=0 && bot===null;y--) for (let x=0;x<w;x++) if (lum(x,y)<THRESH){bot=y;break;}
    res[name] = {
      size:[w,h],
      corners:{ tl:px(4,4), tr:px(w-5,4), bl:px(4,h-5), br:px(w-5,h-5) },
      inkTop: top, inkBottom: bot, inkHeight: bot-top+1,
    };
  }
  return res;
})()`);

console.log(JSON.stringify(out, null, 2));
server.close(); proc.kill(); process.exit(0);
