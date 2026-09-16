/**
 * The prompts behind every generated image in src/assets/images/.
 *
 * These are kept as tracked source rather than typed into a chat window and
 * forgotten, for three reasons:
 *
 *   1. Provenance. A marker can read exactly what was asked for, and compare
 *      it against what shipped. The prompt is the evidence.
 *   2. Reproducibility. `node scripts/generate-image.mjs <id>` regenerates any
 *      image from this file alone.
 *   3. Review. The design rules in plan.md --- specimen not glamour, white
 *      ground, no dining scenes --- are enforceable here, in text, before an
 *      image exists to argue with.
 *
 * Rules carried from plan.md's "Image and Diagram Rules" into every prompt:
 * realistic specimen imagery is confined to the homepage and evidence cases;
 * no wooden tables, gingham, utensils, hands, or lifestyle framing; the
 * palette is laboratory white, charcoal, tomato red, lettuce green, toasted
 * brown; and any food present is a specimen under test, never a meal.
 *
 * Sizes are what gpt-image-1 accepts: 1024x1024, 1536x1024, 1024x1536. Where a
 * different aspect ratio is needed --- the 1.91:1 social card --- the image is
 * generated at the nearest supported ratio and cropped by the script, so the
 * prompt must keep the subject clear of the crop. See `crop` on each job.
 */

/**
 * Shared framing for the Week 11 evidence set.
 *
 * plan.md permits macro evidence photography only where it stays "analytical,
 * tightly cropped, and annotated", and lists what it may show: crumbs, torn
 * fibres, compression marks, displaced layers, moisture boundaries. These
 * three items are each one of those, photographed as a forensic record of a
 * specimen that has already failed.
 *
 * Macro crops are the one thing this model frames well --- its bias is to fill
 * the frame, which is what a tight crop wants --- so unlike the social card,
 * these are used as generated, with no compositing step.
 *
 * Each item deliberately shows ONE observation and nothing about when it
 * happened. That is the week's whole subject: three observations that do not
 * establish an order. A prompt here must never stage a sequence, show a
 * before-and-after, or make one item look like the cause of another.
 */
const EVIDENCE_RULES = [
  "An extreme macro forensic evidence photograph, shot flat-on at high",
  "magnification so the subject fills the whole frame and is cropped by the",
  "edges. Clinical, flat, even lighting of the kind used for laboratory",
  "evidence records --- no mood, no warmth, no shallow dreamy blur.",
  "The specimen has already failed and is being documented after the fact.",
  "It is dry, cold, handled and unappetising: this is a record of a failure,",
  "not a picture of food. Nothing in the frame suggests a meal.",
].join(" ");

/** Shared negative constraints, appended to every prompt. */
const HOUSE_RULES = [
  "Photographed as laboratory documentation, not food photography.",
  "Seamless pure white studio background, no table, no surface texture, no props.",
  "No hands, no people, no cutlery, no crockery, no napkins, no garnish.",
  "No wooden boards, no gingham, no baskets, no restaurant or kitchen setting.",
  "No text, no lettering, no numbers, no watermarks, no logos anywhere in the image.",
  "Even diffuse studio lighting, neutral white balance, sharp focus throughout.",
].join(" ");

export const JOBS = {
  /**
   * The specimen artwork for the social preview card.
   *
   * This job produces the specimen ONLY --- no text, no card, no framing. The
   * 1200x630 card is assembled by scripts/compose-social-card.mjs, which
   * places this cutout and sets the course code and title in the site's own
   * webfonts. Two reasons for that split:
   *
   *   - Generated lettering is unusable. The model misspells, invents glyphs
   *     and cannot be held to the type scale. Real text is composited.
   *   - The model will not respect a framing instruction. Three attempts at
   *     "leave a wide margin, do not touch the edges" all returned a rig
   *     running off the top and bottom of the frame. So framing is no longer
   *     asked for: the subject is generated square on white and the compositor
   *     trims it and places it, which is deterministic.
   */
  "social-specimen": {
    out: "src/assets/images/social/social-specimen.png",
    size: "1024x1024",
    quality: "high",
    prompt: [
      "A studio photograph of a benchtop compression test rig holding a single",
      "sandwich specimen, photographed straight on at eye level as an",
      "engineering test record.",
      "SCALE AND FRAMING: the rig stands upright in the centre of a large white",
      "studio backdrop and is seen complete from top to bottom, from the tip of",
      "its threaded load screw down to the underside of its base plate. It is",
      "photographed from far enough back that the rig spans about two thirds of",
      "the picture height, leaving a clear band of empty white space above the",
      "load screw and below the base plate. Nothing is cut off by the edge of",
      "the picture.",
      "THE RIG is machined from bright brushed stainless steel with a satin",
      "finish --- silver metal, definitely not black or dark grey. Two flat steel",
      "platens grip the sandwich from above and below, the upper platen pressed",
      "hard down into the bread so the crumb is visibly flattened and bulging at",
      "the contact line. Polished vertical steel guide posts and a threaded load",
      "screw stand above the upper platen.",
      "THE SPECIMEN is under obvious compression: one lettuce edge protrudes and",
      "curls at the left interface, and a tomato-red filling line is squeezed",
      "slightly proud of the stack. Layers read as separate structural courses:",
      "bread, a pale interface film, tomato red, a dark cured layer, bread.",
      "BACKGROUND: the rig is cut out on flat pure white, RGB 255 255 255,",
      "completely uniform to every edge, with no grey gradient, no vignette, no",
      "floor, no horizon line, no reflection and no cast shadow. The compositor",
      "trims this background away, so any shadow or gradient in it becomes a",
      "visible grey box on the finished card.",
      HOUSE_RULES,
    ].join(" "),
  },
  /* --- Week 11, the evidence set --------------------------------------- *
   *
   * Three items from one failed assembly, specimen 114. They are numbered
   * A, B and C rather than 1, 2, 3 on purpose: a number reads as a position in
   * a sequence, and the order these occurred in is exactly what the evidence
   * does not establish. The page that shows them makes that explicit.
   */

  "evidence-a-torn-edge": {
    out: "src/assets/images/evidence/evidence-a-torn-edge.png",
    size: "1024x1024",
    quality: "high",
    prompt: [
      EVIDENCE_RULES,
      "SUBJECT: the torn edge of a slice of bread where it has pulled apart.",
      "The break runs across the frame. Along it the crumb structure is ragged",
      "and fibrous: stretched strands of crumb still bridge the gap in places,",
      "torn cell walls stand open, and loose crumbs sit where they fell.",
      "The tear is irregular, not a knife cut --- no clean straight edge.",
      "Fill the frame with the tear itself at high magnification.",
      HOUSE_RULES,
    ].join(" "),
  },

  "evidence-b-wetted-boundary": {
    out: "src/assets/images/evidence/evidence-b-wetted-boundary.png",
    size: "1024x1024",
    quality: "high",
    prompt: [
      EVIDENCE_RULES,
      "SUBJECT: a cut face through a slice of bread, showing a moisture front.",
      "The lower part of the crumb is darkened, translucent and collapsed where",
      "liquid has soaked in; the upper part is pale, dry and open-celled. The",
      "boundary between wet and dry is visible but uneven and diffuse, running",
      "roughly horizontally across the frame, with fingers of darkening",
      "reaching up into the dry crumb along larger cells.",
      "CROP IN HARD on that boundary: magnify until only crumb is in the frame",
      "and the boundary spans it edge to edge. No crust, no corner, no outline",
      "of a slice and no background is visible anywhere --- the frame must not",
      "show that this is a slice of bread, only the wetted crumb itself.",
      HOUSE_RULES,
    ].join(" "),
  },

  "evidence-c-displaced-layer": {
    out: "src/assets/images/evidence/evidence-c-displaced-layer.png",
    size: "1024x1024",
    quality: "high",
    prompt: [
      EVIDENCE_RULES,
      "SUBJECT: the edge of a stack of layers that have slid out of alignment.",
      "Seen from the side at high magnification: a bread layer, then a pale",
      "smeared film, then a red-brown layer, then bread. The middle layers have",
      "slid sideways out of register so their edges no longer line up with the",
      "bread above and below, and they overhang. The pale film is smeared and",
      "drawn out in the direction of the slide, and its surface is glossy.",
      "Fill the frame with the layer edges at high magnification.",
      HOUSE_RULES,
    ].join(" "),
  },
};

/** Every job id, for the script's usage message and for `--all`. */
export const JOB_IDS = Object.keys(JOBS);
