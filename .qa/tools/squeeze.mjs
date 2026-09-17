// Finds text that has been squeezed between breakpoints: columns so narrow the
// words stack one to a line, and line boxes that land on top of each other.
//
// The site is checked at 390 and 1920, and both look right. The failures live
// in between: a grid told to hold N columns keeps holding them while the
// viewport shrinks, and the text inside goes from a measure, to two words a
// line, to one character a line. Nothing overflows, nothing fails axe, and a
// screenshot at either graded width shows none of it.
//
//   QA_URL=... QA_WIDTHS=420,700,1100,1450 node .qa/tools/squeeze.mjs
//
// Two things it has to get right to be worth running, both learned by being
// wrong first:
//
//   - Visibility means the ancestors too. A closed <details>, an inert nav
//     wrapper, a clipped panel: all report themselves visible. Without
//     checkVisibility plus an [inert] test, the collapsed mobile nav is
//     reported lying across the hero on every page.
//   - Overlap means line boxes, not bounding boxes. An inline <a> wrapped
//     over two lines returns one rect spanning both, so two links on adjacent
//     lines of the same paragraph always "overlap" --- which reported dozens
//     of collisions on prose pages at 1900px, where nothing is wrong.
//
// It still over-reports one shape: a label written with its own <br>, where
// the intended breaks count as squeezing. The homepage's lecture handout reads
// as 5.1 characters a line and is perfectly legible. Read the screenshot
// before believing the number.
import {launch,connect,goto,evaluate} from "./cdp.mjs";
const {proc,wsUrl}=await launch(+(process.env.QA_PORT ?? 9359));
const s=await connect(wsUrl);
const url=process.env.QA_URL;
/* Default sweep: the two graded viewports plus the widths between them where
   a fixed column count outlives the content. Without a default this read
   `[NaN]`, which Chrome takes as "no override" --- the tool then measured one
   arbitrary width and printed an empty finding list that looked like a pass
   across the whole range. */
const DEFAULT_WIDTHS = [390, 480, 560, 620, 700, 768, 860, 960, 1024, 1100, 1250, 1440, 1680, 1920];
const widths=(process.env.QA_WIDTHS ? process.env.QA_WIDTHS.split(",").map(Number) : DEFAULT_WIDTHS);
const out=[];
for (const W of widths){
  await s.send("Emulation.setDeviceMetricsOverride",{width:W,height:900,deviceScaleFactor:1,mobile:false});
  await goto(s,url);
  await evaluate(s,'document.fonts.ready.then(()=>1)');
  await evaluate(s,'new Promise(r=>setTimeout(r,700))');
  const js = `(() => {
    const texty = [...document.querySelectorAll("p,li,h1,h2,h3,h4,td,th,dt,dd,span,a,figcaption")]
      .filter(el => {
        const t = el.textContent.trim();
        if (t.length < 12) return false;
        // only leaf-ish nodes, so a container is not blamed for its child
        return ![...el.children].some(c => c.textContent.trim().length > t.length * 0.8);
      });
    const cramped = [];
    const overlap = [];
    const seen = [];
    for (const el of texty) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      /* checkVisibility walks the ancestors: a closed <details>, an inert nav
         wrapper or a collapsed panel all hide their contents without the
         element's own computed style saying so. Without this the nav's
         dropdown items are reported as lying across the hero. */
      if (!el.checkVisibility || !el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) continue;
      /* checkVisibility does not account for a clipping ancestor, so the
         collapsed mobile nav --- laid out, inert, and clipped to nothing ---
         still reports as visible and was flagged lying across the hero.
         Nor does it help with the visually-hidden pattern, which is a real
         1px box on purpose. */
      if (el.closest("[inert]") || el.closest('[aria-hidden="true"]')) continue;
      if (r.width <= 2 || r.height <= 2) continue;
      const cs = getComputedStyle(el);
      /* Count the lines the TEXT occupies, not the lines the BOX could hold.
         A <td> is as tall as the tallest cell in its row, so "Annotated
         image" --- two comfortable lines --- was measured against a 182px
         box and reported as seven lines of 2.1 characters. The same is true
         of any stretched flex or grid item. A range over the element's own
         contents gives one rect per rendered line. */
      const range = document.createRange();
      range.selectNodeContents(el);
      const lineTops = new Set();
      let textW = 0;
      for (const b of range.getClientRects()) {
        if (b.width < 1 || b.height < 1) continue;
        lineTops.add(Math.round(b.top));
        textW = Math.max(textW, b.width);
      }
      range.detach?.();
      const lines = Math.max(1, lineTops.size);
      const chars = el.textContent.trim().length;
      // a column so narrow the text stacks: many lines for few characters
      const perLine = chars / Math.max(1, lines);
      /* "Narrow" in absolute terms, not relative to the type size: a display
         heading breaking over three lines in a 500px column is a design, and
         measuring against its own font size flagged every one of them. */
      if (lines >= 3 && perLine < 9 && r.width < 140) {
        cramped.push({ tag: el.tagName.toLowerCase(), cls: (el.className||"").toString().slice(0,34),
          w: Math.round(r.width), textW: Math.round(textW), lines, perLine: +perLine.toFixed(1),
          txt: el.textContent.trim().slice(0, 34) });
      }
      /* Line boxes, not the union box. An inline <a> wrapped over two lines
         returns one rect spanning both, and two such links on adjacent lines
         of the same paragraph always intersect --- which is why prose pages
         reported dozens of "overlaps" at 1900px where nothing is wrong. */
      for (const lineBox of el.getClientRects()) {
        if (lineBox.width > 1 && lineBox.height > 1) seen.push([el, lineBox]);
      }
    }
    for (let i = 0; i < seen.length; i++) {
      for (let j = i + 1; j < seen.length; j++) {
        const [ea, a] = seen[i], [eb, b] = seen[j];
        if (ea === eb || ea.contains(eb) || eb.contains(ea)) continue;
        const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        /* Real text collision, not a rounding kiss: require a third of the
           smaller line box to be covered in both directions. */
        if (ox > 6 && oy > 6 &&
            ox > Math.min(a.width, b.width) / 3 && oy > Math.min(a.height, b.height) / 3) {
          overlap.push({ a: ea.tagName.toLowerCase()+"."+(ea.className||"").toString().slice(0,22),
            b: eb.tagName.toLowerCase()+"."+(eb.className||"").toString().slice(0,22),
            ox: Math.round(ox), oy: Math.round(oy),
            ra: [Math.round(a.left),Math.round(a.top+scrollY),Math.round(a.width),Math.round(a.height)],
            rb: [Math.round(b.left),Math.round(b.top+scrollY),Math.round(b.width),Math.round(b.height)],
            posA: getComputedStyle(ea).position, posB: getComputedStyle(eb).position,
            ta: ea.textContent.trim().slice(0,24), tb: eb.textContent.trim().slice(0,24) });
        }
      }
    }
    return JSON.stringify({ cramped: cramped.slice(0,6), overlap: overlap.slice(0,6) });
  })()`;
  const r = JSON.parse(await evaluate(s, js));
  if (r.cramped.length || r.overlap.length) out.push({ W, ...r });
}
console.log(JSON.stringify(out, null, 1));
proc.kill(); process.exit(0);
