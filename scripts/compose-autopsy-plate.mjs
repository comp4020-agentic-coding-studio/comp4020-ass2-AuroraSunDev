/**
 * Crushes the black point of the Week 11 collapse so it can sit on the ink
 * band without a frame around it.
 *
 * The band is #1f1e1c. The generated photograph's background is not black ---
 * it runs from rgb(1,1,1) at the top to about rgb(13,12,13) at the bottom,
 * where the lit floor the stack sits on catches the raking light. Placed as
 * generated it reads as a rectangle: darker than the band at the top, lighter
 * at the bottom, with a visible edge all the way round. `mix-blend-mode:
 * screen` does not fix that on its own, because screen only disappears where
 * the source is exactly zero.
 *
 * This is the mirror of the problem compose-social-card.mjs solves at the
 * other end of the range, where the model's "pure white" came back at RGB
 * 237-251 and showed as a grey panel on true white. Same fix, same direction:
 * move the point the model actually produced to the point the page needs, and
 * let the blend do the rest.
 *
 *   node scripts/compose-autopsy-plate.mjs
 *
 * The generated file is left untouched. Provenance lives there --- the prompt
 * in image-prompts.mjs describes what was asked for and that file is what came
 * back. This writes the page's copy beside it.
 */
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = resolve(ROOT, "src/assets/images/evidence/autopsy-collapse.png");
const OUT = resolve(ROOT, "src/assets/images/evidence/autopsy-collapse-plate.png");

/* Two points, not one. FLOOR is what becomes black: measured from the corners,
   where the lit floor tops out around 13, with margin. CEIL is what becomes
   white --- the generated stone sits low in the range and a plain floor crush
   left it darker than the reference, so the top of the range is pulled down to
   meet it. Everything above CEIL clips, which on weathered stone costs
   nothing and is what gives the fracture edges their bite. */
const FLOOR = 22;
const CEIL = 196;
const slope = 255 / (CEIL - FLOOR);
const intercept = -FLOOR * slope;

const { width: srcW, height: srcH } = await sharp(SRC).metadata();

/* Two passes, not one chained call. sharp applies its operations in a fixed
   pipeline order in which trim runs BEFORE linear, so `.linear().trim()` would
   trim the original --- whose background is rgb(1,1,1) to rgb(13,12,13), not
   black --- and find nothing to remove. The crush has to be rendered to a
   buffer first, and the trim then runs against a background that really is
   zero. The social card hit the same ordering at the white end. */
const crushed = await sharp(SRC).linear(slope, intercept).toBuffer();

/* The model leaves a wide black margin around the subject, and on this band
   that margin is invisible --- so it reads as the specimen being drawn small
   rather than as space. Trimming it lets the stack fill the column it is
   given, which is what the reference does. */
await sharp(crushed)
  .trim({ background: "#000000", threshold: 8 })
  .png({ compressionLevel: 9 })
  .toFile(OUT);

const { width, height } = await sharp(OUT).metadata();

/* Report the corners back, because the whole point of the step is what they
   now read, and a silent success here looks the same as a no-op. */
const corner = async (x, y) => {
  /* `.toBuffer()` without resolveWithObject hands back the Buffer itself, not
     a { data } wrapper. */
  const data = await sharp(OUT)
    .extract({ left: x, top: y, width: 4, height: 4 })
    .raw()
    .toBuffer();
  return `${data[0]},${data[1]},${data[2]}`;
};

console.log(`autopsy plate: ${srcW}x${srcH} -> ${width}x${height} (black margin trimmed)`);
console.log(`  ${OUT.replace(ROOT + "/", "")}`);
console.log(`  ${FLOOR} -> 0, ${CEIL} -> 255; corners now`);
console.log(`    top-left     ${await corner(4, 4)}`);
console.log(`    top-right    ${await corner(width - 8, 4)}`);
console.log(`    bottom-left  ${await corner(4, height - 8)}`);
console.log(`    bottom-right ${await corner(width - 8, height - 8)}`);
