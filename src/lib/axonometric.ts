/**
 * The one projection every Field Manual figure is drawn in.
 *
 * The manual's figures are a vocabulary, not a set of illustrations: a reader
 * has to be able to see that the cube called SPECIMEN, the two slabs called
 * INTERFACE and the four failure families are the same object under different
 * treatments. That only holds if every drawing is projected identically, so
 * the projection lives here as constants rather than in each component's path
 * data --- a figure hand-tuned to look right on its own is the exact failure
 * this module exists to prevent.
 *
 * Specimen space is right-handed and measured in slab spans: +x runs to the
 * viewer's right, +y towards the viewer, +z up. One slab is one unit square in
 * plan and `SLAB` units thick, in every figure, so thickness is a fact about
 * the specimen and not a drawing decision.
 *
 * Both horizontal axes rise at the same angle, so neither plan direction reads
 * as the "real" one. The cost is that a slab's two visible side faces are
 * mirror images, which is why the figures distinguish front from side by tone
 * and never by shape.
 */

/** A point in specimen space, in slab spans. */
export type P3 = readonly [x: number, y: number, z: number];
/** A point in SVG user space, after projection. */
export type P2 = readonly [x: number, y: number];

const RAD = Math.PI / 180;

/**
 * Both horizontal axes rise at this angle from the screen horizontal: +x down
 * to the right, +y down to the left. Change it here and the whole manual moves.
 *
 * Measured, not chosen: on the approved reference for the Week 08 layer-order
 * stack the outer slab's top face is 158.5px half-width and rises 41.5px from
 * its far corner to its side corners, so tan(theta) = 0.262 and theta = 14.7,
 * rounded here to 15.
 *
 * The tempting value is 30 --- true isometric, the default in every drawing
 * tool --- and it is wrong for this site. At 30 degrees tan is 0.577, so every
 * rhombus is more than twice as deep: a stack of slabs becomes a tower, and a
 * slab is no longer short enough for its label to sit beside it on one line.
 */
export const AXO_ANGLE = 15;

const COS = Math.cos(AXO_ANGLE * RAD);
const SIN = Math.sin(AXO_ANGLE * RAD);

/** SVG user units per slab span. Sets the drawing's internal resolution. */
export const UNIT = 54;

/** The plan dimension of a standard slab: one span square. */
export const SPAN = 1;
/** Every outer slab in the manual is this thick. */
export const SLAB = 0.26;
/** A filling layer is thinner than what contains it, but equally invariant. */
export const FILL = 0.16;

/**
 * Applied to every stroked element. The figures are printed anywhere from a
 * 40px step marker to a 340px failure figure, and a line weight that scaled
 * with them would read as four different drawing instruments.
 */
export const HAIRLINE = { "vector-effect": "non-scaling-stroke" } as const;

/** Two decimals is under a thousandth of a slab: below what any output shows. */
const f = (n: number): string => (Math.round(n * 100) / 100).toString();

/** Specimen space to user space. The only place the projection is applied. */
export function project([x, y, z]: P3): P2 {
  return [(x - y) * COS * UNIT, ((x + y) * SIN - z) * UNIT];
}

/** One projected point, as the coordinate pair inside a path command. */
export function pt(p: P3): string {
  const [x, y] = project(p);
  return `${f(x)} ${f(y)}`;
}

/** A polyline through the given points, optionally closed. */
export function poly(points: readonly P3[], close = false): string {
  if (points.length === 0) throw new Error("axonometric: poly() needs at least one point");
  const [first, ...rest] = points;
  return `M${pt(first)}${rest.map((p) => ` L${pt(p)}`).join("")}${close ? " Z" : ""}`;
}

/** A single segment between two points. */
export function seg(a: P3, b: P3): string {
  return poly([a, b]);
}

/** The drawable parts of one rectangular body. */
export interface Box {
  /** The upward face: a rhombus, and the only face whose shape is the plan. */
  top: string;
  /** The face at maximum y --- towards the viewer, falling to the left. */
  front: string;
  /** The face at maximum x --- away to the right, falling to the right. */
  side: string;
  /** The six-sided silhouette, for a tone wash, a texture or a ghost. */
  outline: string;
  /** The three edges meeting at the near vertical corner: seen, so solid. */
  seams: string;
  /** The three edges meeting at the far bottom corner: behind the body. */
  hidden: string;
  /** The centre of the top face, where a load arrives. */
  crown: P3;
}

/**
 * One rectangular body from its minimum corner and its size.
 *
 * A zero-height body is legal and useful: `box([0, 0, z], [w, d, 0]).top` is
 * the bare plane at that height, which is how an interface is drawn.
 */
export function box(origin: P3, size: P3): Box {
  const [x0, y0, z0] = origin;
  const [w, d, t] = size;
  const x1 = x0 + w;
  const y1 = y0 + d;
  const z1 = z0 + t;
  return {
    top: poly([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], true),
    front: poly([[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]], true),
    side: poly([[x1, y0, z1], [x1, y1, z1], [x1, y1, z0], [x1, y0, z0]], true),
    outline: poly(
      [
        [x0, y0, z1],
        [x1, y0, z1],
        [x1, y0, z0],
        [x1, y1, z0],
        [x0, y1, z0],
        [x0, y1, z1],
      ],
      true,
    ),
    seams:
      `${seg([x1, y0, z1], [x1, y1, z1])} ${seg([x0, y1, z1], [x1, y1, z1])} ` +
      seg([x1, y1, z1], [x1, y1, z0]),
    hidden:
      `${seg([x0, y0, z0], [x1, y0, z0])} ${seg([x0, y0, z0], [x0, y1, z0])} ` +
      seg([x0, y0, z0], [x0, y0, z1]),
    crown: [x0 + w / 2, y0 + d / 2, z1],
  };
}

/** The eight corners of one body, for handing a figure's extent to `frame()`. */
export function corners(origin: P3, size: P3): P3[] {
  const [x0, y0, z0] = origin;
  const [w, d, t] = size;
  const out: P3[] = [];
  for (const x of [x0, x0 + w]) {
    for (const y of [y0, y0 + d]) {
      for (const z of [z0, z0 + t]) out.push([x, y, z]);
    }
  }
  return out;
}

/** The screen-space unit direction from one point to another. */
function heading(from: P3, to: P3): { a: P2; b: P2; ux: number; uy: number } {
  const [ax, ay] = project(from);
  const [bx, by] = project(to);
  const len = Math.hypot(bx - ax, by - ay) || 1;
  return { a: [ax, ay], b: [bx, by], ux: (bx - ax) / len, uy: (by - ay) / len };
}

/**
 * The two barbs of an open arrow, on their own.
 *
 * Separate from the shaft because a shaft is often dashed or dash-dotted to say
 * what kind of quantity it is, and a dash pattern that also ran through the
 * barbs would eat the arrowhead --- the one part of an arrow that has to stay
 * whole. The barbs are struck in screen space, so an arrow along +x and an
 * arrow straight down read as the same instrument.
 */
export function barbs(from: P3, to: P3, size = 10): string {
  const { b, ux, uy } = heading(from, to);
  const back = Math.atan2(-uy, -ux);
  const barb = (sign: number) => {
    const t = back + sign * 24 * RAD;
    return `M${f(b[0])} ${f(b[1])} L${f(b[0] + Math.cos(t) * size)} ${f(b[1] + Math.sin(t) * size)}`;
  };
  return `${barb(1)} ${barb(-1)}`;
}

/** An open arrow: shaft and barbs in one path, for a plain solid arrow. */
export function arrow(from: P3, to: P3, size = 10): string {
  return `${seg(from, to)} ${barbs(from, to, size)}`;
}

/**
 * A filled arrowhead at `to`, for the one arrow in a figure that has to read as
 * a declared magnitude rather than a direction.
 */
export function head(from: P3, to: P3, length = 14, width = 0.62): string {
  const { b, ux, uy } = heading(from, to);
  const bx = b[0] - ux * length;
  const by = b[1] - uy * length;
  const hw = length * width;
  return (
    `M${f(b[0])} ${f(b[1])} L${f(bx - uy * hw)} ${f(by + ux * hw)} ` +
    `L${f(bx + uy * hw)} ${f(by - ux * hw)} Z`
  );
}

/** The shaft of a filled arrow: stops short of the head so it is not doubled. */
export function shaft(from: P3, to: P3, length = 14): string {
  const { a, b, ux, uy } = heading(from, to);
  return `M${f(a[0])} ${f(a[1])} L${f(b[0] - ux * length * 0.9)} ${f(b[1] - uy * length * 0.9)}`;
}

/** A figure's drawing frame, in user units. */
export interface Frame {
  viewBox: string;
  width: number;
  height: number;
}

/**
 * The frame that exactly contains the given specimen-space points, padded for
 * the stroke and for barbs struck outside them.
 *
 * Computed rather than guessed, for two reasons: no figure is silently cropped
 * when its geometry is adjusted, and because the width comes back in user
 * units, a whole set of figures can be sized from one scale factor. That is
 * what keeps a cube and a press rig at the same magnification instead of each
 * being fitted to the same box and so drawn at a different size.
 */
export function frame(points: readonly P3[], pad = 12): Frame {
  if (points.length === 0) throw new Error("axonometric: frame() needs points");
  const xs = points.map((p) => project(p)[0]);
  const ys = points.map((p) => project(p)[1]);
  const x0 = Math.min(...xs) - pad;
  const y0 = Math.min(...ys) - pad;
  const width = Math.max(...xs) + pad - x0;
  const height = Math.max(...ys) + pad - y0;
  return { viewBox: `${f(x0)} ${f(y0)} ${f(width)} ${f(height)}`, width, height };
}
