/* The Week 4 lecture, as data.
 *
 * Twelve slides: a title, the teaching purpose, the key of the figure drawn on
 * the slide, a description of that figure, and the transcript. One source, read
 * by three consumers --- the lecture page's slide stage, the lecture page's
 * transcript, and the outline --- so a slide cannot say one thing on the stage
 * and another in the transcript.
 *
 * ON THE NUMBERS. Every measurement quoted in this deck is an illustrative
 * course value, not a measured or published result, and each slide that shows
 * one says so. The one piece of established physics the deck leans on is the
 * Lucas--Washburn relation for capillary rise in a porous medium, which gives
 * penetration depth proportional to the square root of elapsed time under a
 * set of idealising assumptions (a rigid, uniform, non-swelling pore network
 * and a constant contact angle). A real outer layer satisfies none of those
 * assumptions, which is exactly why slide 8 asks students to read the shape of
 * the curve rather than to fit it.
 *
 * The four failure families this course uses --- Slip, Soak, Crush, Splay ---
 * are a teaching classification designed for SLOP2895. They are not a
 * recognised professional standard, and the deck says so where it names them.
 */

export interface Slide {
  n: number;
  title: string;
  /** What the slide is for, in one line. Shown in the outline on hover/focus. */
  purpose: string;
  /** Which figure SlideFigure draws. */
  figure: string;
  /** What the figure shows, for anyone who cannot see it. */
  figureAlt: string;
  /** The spoken content, as paragraphs. This is the transcript, not notes. */
  transcript: string[];
  /** Marks a slide whose quoted values are illustrative rather than measured. */
  illustrative?: boolean;
}

export const LECTURE = {
  week: 4,
  slug: "moisture-is-a-load",
  title: "Moisture Is a Load",
  question: "How does liquid progressively compromise a boundary?",
  deck: "/decks/moisture-is-a-load/",
  /** Read from the slide list rather than asserted, so the two cannot drift. */
  get slideCount() {
    return SLIDES.length;
  },
  /** Six minutes of speaking per slide is the course's planning figure. */
  minutes: 60,
} as const;

export const SLIDES: Slide[] = [
  {
    n: 1,
    title: "Moisture Is a Load",
    purpose: "Establish the lecture's identity and its question",
    figure: "instrumented",
    figureAlt:
      "A specimen in cross-section on a test bench, instrumented with a penetration-depth scale at its left edge and a moisture source arriving at its lower boundary.",
    transcript: [
      "Week 2 treated the outer layer as a beam and loaded it mechanically. This week the load is not mechanical. Nothing is pressed, nothing is lifted, and the specimen is left alone on the bench. It still fails.",
      "The claim in the title is that moisture behaves like a load: it enters the structure, it changes what the material can carry, and it does so progressively. Calling it a load is a modelling decision, not a metaphor — it means we will treat it the way we treat any other load, by declaring it, applying it under a stated condition, and measuring what it does.",
      "The question for the session: how does liquid progressively compromise a boundary?",
    ],
  },
  {
    n: 2,
    title: "The Failure Arrives Late",
    purpose: "Introduce failure that develops over time rather than at an instant",
    figure: "late",
    figureAlt:
      "The same specimen at three times: intact at assembly, a darkened lower region after a delay, and separated at the boundary at the end of the delay.",
    transcript: [
      "A compression failure happens while you are watching. A moisture failure does not. The specimen is assembled, it is sound, and it is put down. What fails is the specimen thirty minutes later, and by then nobody is looking at it.",
      "This has a practical consequence for how the week is assessed. An observation recorded at one moment cannot describe a time-dependent failure, so every record this week carries the elapsed time it was taken at. A measurement without its time is not evidence here; it is an anecdote with a number in it.",
      "It also means the specimen that fails is not the specimen you tested. It is the specimen you tested, plus a delay.",
    ],
  },
  {
    n: 3,
    title: "What Is the Boundary Doing?",
    purpose: "Separate layer, interface and exposed edge",
    figure: "boundary",
    figureAlt:
      "A labelled diagram distinguishing three things: the layer itself, the interface between two layers, and the exposed edge where the assembly meets the air.",
    transcript: [
      "Three things get called the boundary, and they behave differently, so it is worth separating them before we measure anything.",
      "The layer is the material itself: porous, with a pore structure that can hold liquid. The interface is the surface between two layers, where liquid can travel along rather than through. The exposed edge is where the assembly meets the outside, and it is the shortest route in — it has no layer above it to cross first.",
      "When a record says the boundary failed, ask which of the three. A layer that has wetted through, an interface that has stopped gripping, and an edge that has admitted liquid are three different findings with three different remedies.",
    ],
  },
  {
    n: 4,
    title: "A Simplified Moisture-Front Model",
    purpose: "Show progressive movement through a porous layer as one measurable quantity",
    figure: "front",
    figureAlt:
      "One specimen drawn at three elapsed times. A darkened wetted region advances upward from the lower boundary, with the penetration depth dimensioned at each time: zero, then eight millimetres, then eighteen millimetres.",
    illustrative: true,
    transcript: [
      "Here is the model the week uses. A visible front advances from the boundary into the porous layer, and its distance from the boundary is the penetration depth. One number, measurable with a rule, taken at a stated time.",
      "The values on the slide are illustrative course values, not measurements. What matters is their shape: the front moves quickly at first and then more slowly. That is the behaviour the standard capillary model predicts — penetration proportional to the square root of elapsed time — and it is why doubling the delay does not double the damage.",
      "The model is deliberately thin. It records what changes and where. It says nothing yet about why, or about what the wetted material can still carry. Those are the next two slides, and keeping them separate is the point.",
    ],
  },
  {
    n: 5,
    title: "Soften, Swell, Lubricate",
    purpose: "Separate three distinct structural effects of the same wetting",
    figure: "three-effects",
    figureAlt:
      "Three comparative material sections. In the first the wetted region has lost stiffness. In the second it has increased in thickness. In the third a liquid film has formed at the interface between two layers.",
    transcript: [
      "One moisture front can produce three different structural effects, and a diagnosis that names the wrong one leads to the wrong revision.",
      "Softening: the wetted material loses stiffness, so the layer deflects further under the same load. Swelling: the wetted material takes up liquid and increases in volume, which changes the geometry and can put the layer into tension against its own dry region. Lubrication: liquid collects at an interface and reduces the grip between two layers, which is a slip problem rather than a strength problem.",
      "The same specimen can show all three. The useful question is which one accounts for the failure you observed — and whether your evidence can distinguish them at all.",
    ],
  },
  {
    n: 6,
    title: "Observation Is Not Cause",
    purpose: "Hold observation, inference and unknown apart",
    figure: "oiu",
    figureAlt:
      "A three-column record. The first column lists what was seen, the second what it is inferred to mean, the third what remains unknown. Each row keeps the three separate.",
    transcript: [
      "This is the discipline the course is built on, and the moisture week is where it is easiest to break.",
      "Observed: the lower eighteen millimetres of the layer changed colour, and the specimen separated at the interface. Inferred: liquid reached the interface and reduced its grip. Unknown: whether the separation was caused by lost grip or by the layer above deflecting under its own softened weight — nothing that was recorded distinguishes them.",
      "The failure mode here is not a wrong answer. It is a confident answer: a record that writes the inference into the observation column and so removes the reader's ability to disagree with it.",
    ],
  },
  {
    n: 7,
    title: "Designing a Controlled Comparison",
    purpose: "Define variable, control and constants for the week's investigation",
    figure: "bench",
    figureAlt:
      "A three-condition test bench. Three otherwise identical specimens differ in one declared variable; a fourth position holds the dry control. The constants held across all four are listed beneath.",
    transcript: [
      "To say anything about moisture you have to compare, and to compare you have to hold things still.",
      "Declare one variable: the delay before observation, say, or the position of the moist layer in the stack, or the presence of a barrier layer at the interface. Test it under at least three conditions, and include a condition with no moisture at all — the dry control — so you know what the specimen does on its own.",
      "Then list what you held constant: specimen dimensions, the layer order, the ambient temperature, the elapsed time at which you read the front, and who read it. A constant you did not name is a variable you did not control, and the marker will find it before you do.",
    ],
  },
  {
    n: 8,
    title: "Reading the Evidence",
    purpose: "Interpret penetration depth and displacement without over-reading them",
    figure: "plot",
    figureAlt:
      "Penetration depth plotted against elapsed time for three conditions, with the measured points marked and the intervals between them left undrawn. A dry control runs flat along the axis.",
    illustrative: true,
    transcript: [
      "Three things to read off a comparison like this, and one thing not to.",
      "Read the order: which condition admitted liquid furthest. Read the shape: whether the advance is slowing, which tells you the mechanism is diffusive rather than a leak. Read the control: if the dry specimen also deformed, part of what you attributed to moisture belongs to something else.",
      "What not to read: the points you did not measure. The curve between two readings is a drawing convention, not data. This plot leaves those intervals undrawn on purpose, and your own plots should too.",
      "The values here are illustrative course values. The interpretation method is the transferable part, not the numbers.",
    ],
  },
  {
    n: 9,
    title: "Competing Explanations",
    purpose: "Prevent a single-cause assumption",
    figure: "branch",
    figureAlt:
      "A branching causal diagram. One observed failure at the right traces back to three candidate causes on the left, two of which remain live because no recorded evidence separates them.",
    transcript: [
      "An interface separated. Work backwards, and there is more than one route to that observation.",
      "The interface may have been lubricated by liquid that reached it. Or the layer above it may have softened and deflected, loading the interface in shear it was never loaded in before. Or the specimen may have been handled, and the separation predates the wetting entirely.",
      "A good autopsy does not pick the most familiar of these. It states all three, says which recorded evidence rules any of them out, and leaves the rest live. In this example nothing recorded distinguishes the first two, so an honest diagnosis names both — and Week 11 is built entirely on doing this well.",
    ],
  },
  {
    n: 10,
    title: "Investigation Brief",
    purpose: "Prepare the Week 4 activity, with its participation routes",
    figure: "protocol",
    figureAlt:
      "A test-protocol flow: declare the variable, set the conditions, apply the moisture, read the front at stated times, record, compare. A branch at the start routes to a physical specimen, a non-food analogue, or the supplied evidence pack.",
    transcript: [
      "This week's activity is an absorption observation. Declare one variable, set up at least three conditions and a dry control, and read the penetration depth at three stated elapsed times.",
      "Three routes, and they are equivalent. A physical specimen, tested and never eaten. A non-food analogue — sponge and card behave well here, and their pore structure is more uniform than the real thing, which makes the front easier to read. Or the supplied evidence pack, which contains timed photographs and measurements from a prepared comparison.",
      "Whichever route you take, what leaves the session is the same artefact: an absorption observation with its conditions, its times, its measurements and its limitations attached.",
    ],
  },
  {
    n: 11,
    title: "Check Your Diagnosis",
    purpose: "Ask students to classify a short case against the week's model",
    figure: "case",
    figureAlt:
      "A short evidence case: one specimen photographed after a delay, with three recorded facts and a concealed diagnosis that the lecturer reveals after discussion.",
    transcript: [
      "A case to classify. A specimen was assembled, packaged, and opened forty minutes later. The record contains three facts: the lower outer layer had darkened across most of its width; the two inner layers had moved about six millimetres relative to one another; and the upper outer layer was dry throughout.",
      "Which of the four families does this fit, and what would you need to have recorded to be sure? Take a minute.",
      "The defensible reading is Soak reaching an interface and producing Slip — the darkening places liquid at the lower boundary, and the relative movement places the consequence at an interface. It is not Crush: nothing has lost height. The evidence does not establish the order of events, because no intermediate observation was taken. That last sentence is the part worth marks.",
      "One note on the families themselves: Slip, Soak, Crush and Splay are this course's own analytical categories, designed to make failures comparable across twelve weeks. They are not a recognised professional classification, and you should not cite them as one.",
    ],
  },
  {
    n: 12,
    title: "From Week 4 to Component Test",
    purpose: "Connect the lecture to the second assessment",
    figure: "path",
    figureAlt:
      "A segment of the course load path, with Week 4 marked and a line running forward through Weeks 5 and 6 to the Component Test milestone.",
    transcript: [
      "Everything in this lecture is machinery for the Component Test. That task asks for one declared variable under at least three conditions, with a protocol, a comparison, an interpretation and a limitations section — which is the structure of slides 7 and 8.",
      "Moisture is the most tractable variable to isolate, because the front is visible and the measurement is a length. It is not the only one: interface grip and stiffness category are equally legitimate, and Weeks 5 and 6 supply both.",
      "Before next week: bring your absorption observation, including the readings you are unsure of, marked as uncertain. An uncertain reading recorded as uncertain is evidence. An uncertain reading recorded as fact is not.",
    ],
  },
];
