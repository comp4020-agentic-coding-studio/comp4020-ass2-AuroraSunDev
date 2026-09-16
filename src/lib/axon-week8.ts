/**
 * The one projection Week 8's layer-order drawing is built from.
 *
 * Week 8 asks why the same material set behaves differently when it is
 * reordered, and it can only answer that if a reader can see that the two
 * stacks really are the same set. That puts the projection under an unusual
 * obligation: every slab in both stacks, and every chunk, grid line and
 * droplet drawn on one, has to come out of the same four numbers. A slab
 * nudged by hand to look better would introduce a second difference between
 * the baseline and the revised order, and a second candidate explanation for
 * the change in behaviour --- which is precisely the confusion the week
 * exists to remove.
 *
 * So the projection lives here as arithmetic rather than in the component as
 * coordinates. The plan is addressed in its own two axes (`u` up-right, `v`
 * up-left) plus depth (`w`, straight down through the stack), and `project`
 * is the only place those become screen units. Textures are therefore drawn
 * in the plane of the face they belong to rather than pasted flat over it: a
 * grid ruled across a lid comes back as a projected grid, and a scattered
 * chunk is a real small slab in the same projection as the large ones.
 *
 * Nothing here knows what a sandwich is, what a layer means, or what colour
 * anything should be. It knows one angle and one thickness ratio.
 */

/**
 * Both plan axes rise from the horizontal at this angle.
 *
 * Measured off the approved reference rather than chosen: the top face of its
 * outer slab has a half-width of 158.5px and rises 41.5px from its far corner
 * to its side corners, so tan(theta) = 0.262 and theta = 14.7 degrees. The
 * obvious guess is 30, which is the isometric convention and what this file
 * first used --- but 30 gives tan = 0.577, which draws every stack more than
 * twice as steep as the reference and turns a flat exploded assembly into a
 * tower. The reference is a shallow axonometric on purpose: a flat lid leaves
 * room for the layer labels to sit beside each slab on one line.
 */
export const AXON_ANGLE_DEG = 15;

const RAD = (AXON_ANGLE_DEG * Math.PI) / 180;

/** What one plan unit contributes across, and up, the screen. */
export const AXON_COS = Math.cos(RAD);
export const AXON_SIN = Math.sin(RAD);

/**
 * A slab's reference thickness, as a fraction of its plan span. Individual
 * layers are multiples of this rather than free numbers, so that "thicker"
 * and "thinner" stay comparable between the two stacks and between drawings.
 */
export const AXON_THICKNESS_RATIO = 0.12;

export interface Point {
  x: number;
  y: number;
}

/** The three faces of a slab that this viewpoint can see. */
export interface SlabFaces {
  /** The rhombus lid. */
  top: string;
  /** The face running up-right from the near corner. */
  right: string;
  /** The face running up-left from the near corner. */
  left: string;
}

/* Coordinates are rounded before they reach the markup: three decimals is
   finer than any device pixel at these sizes, and it keeps the built HTML
   diffable when the constants above are retuned. */
const r = (n: number): number => Math.round(n * 1000) / 1000;

/** Projects a plan point. `u` runs up-right, `v` up-left, `w` straight down. */
export function project(u: number, v: number, w = 0): Point {
  return { x: r((u - v) * AXON_COS), y: r(w - (u + v) * AXON_SIN) };
}

/** The same, measured from a slab's near top corner. */
export function at(origin: Point, u: number, v: number, w = 0): Point {
  const p = project(u, v, w);
  return { x: r(origin.x + p.x), y: r(origin.y + p.y) };
}

const trace = (points: Point[]): string =>
  points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");

/** An open run of projected points --- a texture line lying on a face. */
export function polyline(points: Point[]): string {
  return trace(points);
}

/** A closed projected outline --- a face. */
export function polygon(points: Point[]): string {
  return `${trace(points)} Z`;
}

/** The three visible faces of one slab, given its near top corner. */
export function slabFaces(
  origin: Point,
  span: number,
  thickness: number,
): SlabFaces {
  const p = (u: number, v: number, w = 0) => at(origin, u, v, w);
  return {
    top: polygon([p(0, 0), p(span, 0), p(span, span), p(0, span)]),
    right: polygon([p(0, 0), p(span, 0), p(span, 0, thickness), p(0, 0, thickness)]),
    left: polygon([p(0, 0), p(0, span), p(0, span, thickness), p(0, 0, thickness)]),
  };
}

/** A rhombus lying in a lid's own plane, inset from the lid's edges. */
export function topFace(origin: Point, span: number, inset = 0): string {
  const lo = inset;
  const hi = span - inset;
  return polygon([
    at(origin, lo, lo),
    at(origin, hi, lo),
    at(origin, hi, hi),
    at(origin, lo, hi),
  ]);
}

/**
 * A grid ruled across a lid, in the lid's own plane --- so it shears with the
 * projection instead of sitting on top of it like a screen-space pattern.
 */
export function planGrid(
  origin: Point,
  span: number,
  divisions: number,
  inset = 0,
): string {
  const lo = inset;
  const hi = span - inset;
  const step = (hi - lo) / divisions;
  const lines: string[] = [];
  for (let k = 0; k <= divisions; k += 1) {
    const s = lo + k * step;
    lines.push(polyline([at(origin, lo, s), at(origin, hi, s)]));
    lines.push(polyline([at(origin, s, lo), at(origin, s, hi)]));
  }
  return lines.join(" ");
}

/** Half the screen width of a slab's lid: the stack's outermost corners. */
export function slabHalfWidth(span: number): number {
  return r(span * AXON_COS);
}

/** The screen height of a slab's lid, near corner to far corner. */
export function slabTopHeight(span: number): number {
  return r(2 * span * AXON_SIN);
}
