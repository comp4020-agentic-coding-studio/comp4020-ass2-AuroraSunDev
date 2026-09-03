# Assignment 2 Design Plan

## Confirmed Course Direction

**Course title:** The Sandwich Must Hold  
**Working subtitle:** Structural Engineering Between Two Slices  
**Institution:** Slop University  
**Course code:** Use `SLOP2xxx`, preserving the final three digits assigned by the starter repository.

### Central Proposition

> A sandwich is a temporary structure whose failure is eaten.

This is not a cooking course. It uses the sandwich as a compact system through which students investigate structure, materials, interfaces, friction, moisture, temperature, geometry, transport, testing, and failure.

The course should feel absurd at first glance but remain coherent and credible across a full twelve-week semester. Its humour should come from applying serious engineering methods to an ordinary lunch, not from joke-filled or deliberately silly writing.

## Primary Content Constraint: This Must Not Become a Recipe Site

Use the following rule as a rejection test for generated content:

> If a passage could appear unchanged on a recipe website, remove it or rewrite it.

The course and website must follow these constraints:

- Do not publish complete recipes, shopping lists, or step-by-step cooking instructions.
- Do not evaluate work primarily through taste, healthiness, popularity, or culinary skill.
- Do not use food-blog language such as "delicious," "quick and easy," "chef's choice," or "perfect for lunch."
- Treat ingredients as materials and layers as structural interfaces.
- Evaluate student work through evidence, testing, reasoning, documentation, and structural performance.
- Every teaching week must include a structural question, a material or system principle, a failure mode, and a method of investigation.
- Use terms such as `load-bearing filling`, `interface failure`, `moisture migration`, `compression`, `slippage`, `structural collapse`, and `transport damage` only when they accurately describe the topic.
- Food safety and allergy information should appear as laboratory and participation policy, including non-consumption alternatives where appropriate.
- Any scientific or technical claim must be checked against a reliable source before publication.

## Course Voice

### Selected Direction: Deadpan Materials Engineering Institute

The course should speak with calm institutional seriousness. It should never explain the joke or constantly remind the reader that the subject is unusual.

The voice should be:

- precise rather than promotional;
- observant rather than whimsical;
- dryly confident rather than exaggerated;
- accessible to students without flattening the engineering framing;
- specific about evidence, assumptions, tests, and failure conditions.

The humour should emerge from the contrast between the rigorous language and the sandwich under examination.

## Visual Direction

The website should resemble a materials-testing laboratory, technical field manual, and failure-analysis archive rather than a cafe, restaurant, food-delivery service, or lifestyle publication.

### Visual Ingredients

- Large sandwich cross-sections used as specimens rather than glamour photography.
- Exploded layer diagrams, force arrows, measurement marks, test labels, specimen numbers, and failure annotations.
- Images of compression, leakage, slippage, deformation, uneven loading, and transport damage.
- A restrained palette based on laboratory white, toasted-bread brown, tomato red, lettuce green, and charcoal.
- Bold, practical display typography paired with highly readable body typography.
- Technical lines and annotations used sparingly so that the site remains clear at desktop and phone viewports.
- Open page layouts, diagrams, tables, rails, and full-width specimens rather than repetitive grids of rounded cards.

### Refined Design System

The laboratory direction is confirmed, but the interface must not become a wall of engineering tables. The revised system prioritises readable course content, stable visual semantics, and controlled variation between page types.

#### Colour Semantics

| Token | Intended use | Prohibited use |
| --- | --- | --- |
| Laboratory white | page and diagram background | replacing it with cream, beige, or warm grey |
| Charcoal | normal text, rules, inactive controls, structural diagrams | using a lighter grey for essential content |
| Tomato red | active page, primary action, immediate prohibition, active failure | ordinary decoration or every percentage |
| Lettuce green | stable state, accepted equivalent pathway, successful containment | acting as the only signal for success |
| Toasted brown | material condition, moisture, neutral inference, specimen metadata | generic decoration without analytical meaning |

Colour must never communicate state alone. Active, accepted, prohibited, inferred, and failed states also require text, line style, shape, or position.

#### Typography Roles

- Use the condensed industrial display face only for page titles, week or assessment numbers, the four failure-family names, and occasional capability words.
- Use the readable sans face for navigation, controls, section headings, tables, and all extended reading.
- Use the monospaced face only for dates, specimen identifiers, measurements, test conditions, and short technical annotations.
- Do not set complete paragraphs, long menu items, or dense policy text in the condensed or monospaced face.
- Target comfortable reading rather than fitting a complete long page into one viewport. Body text should remain approximately 18 px on desktop and at least 16 px on mobile, with a normal line length of roughly 55–75 characters.

#### Density and Page Rhythm

- A `1920 x 1080` reference should show the first meaningful viewport and the beginning of the next section, not compress the entire page into one screen.
- Long pages continue vertically. The first viewport should normally contain the page purpose, the dominant artefact, and no more than two or three supporting sections.
- Use fewer, larger diagrams with more explanatory space rather than many miniature diagrams.
- Retain one coherent grid and rule system, but vary composition by page role:
  - Weeks uses a semester load path;
  - Assessment Overview uses a capability progression;
  - Assessment Detail uses a large task artefact and long-form brief;
  - Field Manual uses an index and handbook chapters;
  - Policies uses an equivalence decision path;
  - Lecture Deck uses a dominant teaching stage and transcript flow.
- Do not repeat the same full-width ruled table at the top of every page.

#### Image and Diagram Rules

- Use realistic or near-realistic specimen imagery only on the homepage and evidence-based specimen cases.
- Every realistic specimen image requires analytical annotation; no food image may be purely decorative.
- Use technical line drawings for concepts, forces, test rigs, failure sequences, and lecture explanations.
- Use one consistent single-stroke icon family for navigation, policies, and small actions.
- Do not mix realistic food photography, diagrammatic line art, and policy icons inside one visual block.
- Use macro texture or material evidence sparingly to stop the site feeling sterile without creating a food-blog mood.

#### Controlled Course Humour

Humour remains secondary and deadpan. It may appear in specimen captions, empty states, failure notices, or footer annotations, but never replace instructions, safety information, assessment criteria, or page headings. Suitable examples include:

- `Specimen status: structurally coherent, socially questionable.`
- `The evidence survived. The sandwich did not.`
- `Do not confuse appetite with structural confidence.`

Use at most one such line in a major page view. Repetition would turn the course into a joke site.

#### Responsive Concept Requirement

Every approved desktop reference requires a separate `390 x 844` mobile reference. Mobile layouts are recomposed rather than scaled:

- replace the desktop navigation with a simple `Menu` control;
- preserve a clear page title, primary task, and current context in the first viewport;
- convert horizontal rails into vertical load paths;
- convert wide comparison tables into labelled records or stacked criterion rows;
- move sticky side contents into an inline jump list;
- place lecture controls below the slide and provide readable transcript content instead of shrinking a dense 16:9 desktop slide;
- maintain at least 44 px touch targets, visible focus, and no horizontal page scrolling.

### Whole-Site Experience — A Semester-Long Stress Test

The unifying visual idea is:

> **The Sandwich Must Hold — A Semester-Long Stress Test**

The complete site should feel like one specimen moving through twelve testing stations. The homepage introduces the live specimen, the Course Guide defines its specification, the week pages expose it to different conditions, the assessments increase the required load, and the final pages archive the evidence. This storyline adds energy without changing the confirmed curriculum or turning the interface into a game.

#### Playful-Element Budget

- Approximately 70% of each page remains clear teaching content and navigation.
- Approximately 20% may carry a page-specific signature visual, archive device, or high-contrast section.
- No more than approximately 10% should be microinteraction or deadpan humour.
- A playful element must reveal a relationship, state, failure, or evidence trail. Pure decoration is removed.

#### Shared Archive Layer

Use specimen identifiers, test dates, batch numbers, crop marks, scale bars, revision notes, staples, translucent acetate, handbook tabs, and restrained `TESTED`, `FAILED`, `REVISED`, or `HELD` stamps as physical evidence marks. These are not generic pills, badges, or decorative dashboard labels. They must attach to a real specimen, page state, teaching phase, or review action.

Occasional macro evidence photography may introduce crumbs, torn fibres, compression marks, displaced layers, or moisture boundaries. It must remain analytical, tightly cropped, and annotated. Attractive food styling, dining scenes, and finished-meal glamour remain prohibited.

#### Contrast and Motion Cadence

- Most teaching content stays on true laboratory white.
- One occasional full-width charcoal section may signal autopsy, destructive testing, or a conceptual transition.
- Tomato red indicates active load or failure; lettuce green indicates a held or accepted route; toasted brown indicates material or moisture condition.
- Oversized cropped numbers and status words may mark major changes of phase, but never replace normal headings.
- Scroll and hover motion should be short, local, and reversible: a compression closes a gap, a slip shifts one layer, a moisture front advances, or a test marker moves to the next station.
- Motion must not autoplay continuously, block reading, imitate a game score, or create fabricated progress.
- With reduced motion enabled, every state change becomes an immediate static before/after diagram with the same labels and information.

#### Page-Signature Map

| Page family | Signature visual role |
| --- | --- |
| Home | live specimen under load and semester-wide status trail |
| Course Guide | specimen specification sheet and participation-route drawing |
| Weeks Index | moving load track connecting twelve test stations |
| Week pages | one unique test rig or evidence artefact per week |
| Assessment Overview | four increasing declared loads: 15%, 20%, 25%, and 40% |
| Assessment Detail | `Declare → Test → Fail → Revise → Defend` evidence chain |
| Field Manual | tabbed laboratory handbook with revision marks |
| Policies | three equivalent material routes converging on one learning outcome |
| Week 4 Lecture Deck | translucent acetate and advancing moisture-front overlay |
| Optional Load Tester | interactive rule model, released only after every core page passes its completion gate |

### Explicit Visual Exclusions

- No cafe branding or chalkboard-menu aesthetic.
- No recipe-card layout.
- No food-delivery interface conventions.
- No excessive wooden-table backgrounds, decorative utensils, gingham patterns, or lifestyle photography.
- No generic dashboard full of decorative metrics.
- No repeated week-card layout that makes all twelve weeks appear interchangeable.

## Confirmed Page Map

The course plan contains 23 core pages and one optional stretch page, for a maximum of 24 conceptual pages. Final route names must follow the starter repository's content model when implementation begins.

| Group | Conceptual route | Page role |
| --- | --- | --- |
| Core | `/` | Home: establish the proposition and provide the main course entry points |
| Core | `/course` | Course Guide: description, learning outcomes, teaching approach, and participation model |
| Core | `/weeks` | Semester Schedule: all twelve dated weeks in one non-linear browsing view |
| Weeks | `/weeks/01` through `/weeks/12` | Twelve distinct teaching-week pages |
| Assessments | `/assessments` | Assessment overview, progression, weights, and timing |
| Assessments | `/assessments/field-log` | Sandwich Field Log — 15% |
| Assessments | `/assessments/component-test` | Component Test — 20% |
| Assessments | `/assessments/failure-autopsy` | Failure Autopsy — 25% |
| Assessments | `/assessments/final` | The Sandwich Must Hold — 40% |
| Resources | `/field-manual` | Test methods, terminology, evidence standards, and recording guidance |
| Optional stretch | `/lab/load-tester` | Full Sandwich Load Tester; build only after the core completion gate passes |
| Resources | `/policies` | Food safety, allergies, accessibility, photography, and alternative participation |
| Lecture | `/lectures/moisture-is-a-load` | The real Week 4 lecture deck |

### Global Navigation

The desktop header should contain:

- the fixed SlopU identity and assigned course code;
- `Course`;
- `Weeks`;
- `Assessments`;
- `Field Manual`;
- one primary action. Use `Test a Specimen` only after the optional Load Tester has passed its release gate; otherwise link to the current teaching week or semester schedule.

The phone header should collapse into a simple accessible menu. Every teaching-week page must end with `Previous Week`, `All Weeks`, and `Next Week` navigation. The schedule must expose all week dates and titles so a marker can move directly between non-adjacent pages.

## Confirmed Course Guide

The `/course` page must answer practical student questions instead of repeating the homepage. It should use the structure of a technical specification sheet rather than a promotional landing page.

### Course Level and Entry Requirements

The course is positioned at 2000-level undergraduate study under the assigned `SLOP2xxx` code. It has no disciplinary prerequisite and assumes no culinary experience. Students need only basic confidence with observation, comparison, simple tables, and written explanation.

### Course Summary

> **The Sandwich Must Hold** treats the sandwich as a temporary material system. Students investigate how layers carry load, exchange moisture, generate friction, respond to temperature, survive transport, and fail under use.
>
> This is not a cooking course. No culinary experience is expected, taste is not assessed, and no student is required to prepare or consume food. The course is concerned with observation, controlled testing, failure analysis, and the defence of structural decisions.

### Central Course Question

> What must be true for a sandwich to remain a sandwich from assembly to use?

### Learning Outcomes

On successful completion of the course, students will be able to:

1. **Classify** the structural roles of layers, boundaries, and interfaces in a sandwich assembly.
2. **Design and document** a controlled comparison that isolates one structural variable.
3. **Distinguish** direct observation, reasonable inference, and unresolved uncertainty.
4. **Diagnose** failures involving slippage, moisture, compression, geometry, temperature, and transport.
5. **Design, test, revise, and defend** a sandwich system for a declared load case.

Assessment alignment:

| Learning outcome | Primary evidence |
| --- | --- |
| Classify structural roles | Sandwich Field Log |
| Design a controlled comparison | Component Test |
| Separate evidence, inference, and uncertainty | Sandwich Field Log and Failure Autopsy |
| Diagnose failure | Failure Autopsy |
| Design, test, revise, and defend | The Sandwich Must Hold |

### Weekly Teaching Format

Each teaching week contains:

- one 60-minute lecture introducing the structural question and relevant cases;
- one 120-minute laboratory or studio for observation, testing, comparison, or failure analysis;
- one field or documentation task that generates reusable evidence;
- one distinct weekly artefact, such as a compression record, moisture diagram, or transport dossier.

The rhythm remains predictable while the weekly question, investigation method, and dominant artefact change.

### Equivalent Participation Pathways

Every practical activity must support three equivalent pathways:

1. **Physical Specimen:** use real, low-cost materials for structural testing without any requirement to consume the result.
2. **Non-Food Analogue:** use foam, sponge, cardboard, clay, textile, or another suitable material to investigate the same variable.
3. **Supplied Evidence:** use course-provided photographs, measurements, video frames, or a failure-case pack.

All three pathways assess the same learning outcome. Students must not lose marks for selecting an alternative to direct food handling.

### What This Course Is Not

> This course does not teach recipes, professional cookery, nutrition, food styling, or restaurant service. A structurally successful submission does not need to be attractive or edible. A visually appealing sandwich without evidence, testing, or a defensible load case will not receive a high mark.

### Course Guide Page Composition

- Treat the page as the specification sheet for `Specimen: SLOP2xxx`, not as a second promotional homepage.
- Present the summary, level, entry requirements, and central course question in the opening inspection block. Use an oversized course-code fragment, a scale line, and one restrained `SPECIFICATION` mark as the visual anchor.
- Pair the learning outcomes with a single course load-path drawing rather than a row of cards. Each outcome attaches to its principal evidence point along the line.
- Present the three participation pathways as parallel material routes that converge on the same assessed outcome; stack them vertically on a phone and label equivalence in text.
- Use one annotated cross-section to distinguish `material`, `interface`, `load`, `observation`, and `evidence`, avoiding a decorative finished sandwich.
- End with direct links to `Weeks`, `Assessments`, and `Policies`, followed by one small review stamp rather than a marketing call-to-action band.

## Confirmed Homepage Structure

The homepage should behave as a course entry point and the opening scene of the semester-long stress test rather than a marketing landing page. Its rhythm moves from a white live-test hero into one decisive charcoal transition, returns to white for the semester apparatus, and finishes as an experiment archive.

### Section 1 — First Viewport

The first viewport should introduce one clear visual idea: a large sandwich specimen shown in cross-section inside a vertical compression rig. The upper plate is visibly applying a small load; force arrows, a scale line, and one specimen label make the state legible without filling the hero with technical furniture.

Approved working hero copy:

> **The Sandwich Must Hold**  
> Every lunch is a temporary structure.  
> Study the forces that make it fail.

The primary action is `Enter Week 1`. A secondary text link reads `View the semester structure`.

The initial view must contain only essential course identity, navigation, the hero copy, the specimen, and a compact factual readout: specimen ID, selected load case, and status `TEST IN PROGRESS`. These labels are instrument metadata, not badges or fabricated metrics. At `1920 x 1080`, the next section heading should be visible near the bottom of the viewport. On a phone, copy should appear above a purpose-built vertical specimen composition rather than a shrunken desktop layout.

As the user begins to scroll, the compression plate may move a few pixels and the specimen may deform slightly before its layers separate into an annotated view. This is a single controlled sequence, not a looping animation. Reduced-motion mode shows the loaded specimen and labels immediately. One optional deadpan status line may read `Load accepted. Dignity not assessed.`

### Section 2 — The Structural Proposition

Working heading: `Lunch is a load case.`

This section forms the strongest visual transition on the homepage: a full-width charcoal investigation field with white type, red force lines, and a numbered failure specimen. It explains concisely that a sandwich is a temporary assembly; every layer is both a material and an interface; and failures emerge through force, moisture, temperature, ordering, handling, and transport. The specimen replaces a feature-card grid and visually converts an ordinary lunch into an abstract load model.

### Section 3 — Four Failure Families

The course will initially organise recurring failures into four working families:

1. `Slip` — layers move relative to one another;
2. `Soak` — moisture compromises a boundary;
3. `Crush` — compression destroys usable structure;
4. `Splay` — contents escape under uneven loading.

These are curriculum-design categories, not established scientific classifications. Their wording and technical accuracy must be reviewed before publication. On the homepage they should appear as four full-width failure bands connected to relevant teaching weeks, not four decorative cards. Each band has one restrained demonstration: `Slip` displaces a layer, `Soak` advances a moisture boundary, `Crush` closes a measured gap, and `Splay` expands an exposed edge. Hover, focus, and scroll reveal the same labelled before/after state; mobile uses tap or the static final state.

### Section 4 — The Semester Load Path

The homepage will group the twelve weeks into four phases:

- **Phase I — Define:** Weeks 1–3;
- **Phase II — Expose the Forces:** Weeks 4–7;
- **Phase III — Assemble and Transport:** Weeks 8–10;
- **Phase IV — Diagnose and Prove:** Weeks 11–12.

The desktop presentation uses a horizontal test rail with one specimen marker moving between twelve stations. Week 4 carries a lecture-acetate symbol and relevant assessment milestones attach to the rail at their confirmed positions. The phone version becomes a legible vertical test track. Both versions show week titles and dates without using twelve interchangeable cards and never imply completion unless reliable course data supplies it.

### Section 5 — Sandwich Load Tester Preview

This section is conditional on the optional full Load Tester being completed and verified. If released, the homepage should expose one small controlled test: change one layer, apply one tilt or compression condition, display one failure state, and link to the complete Load Tester. The homepage must not contain the entire simulation.

If the optional interaction is not built, replace this section with a static exploded layer-order specimen linking to Week 8. Its annotation may show one `REVISED` stamp to demonstrate the archive language without implying an interactive control. The core homepage must never contain a broken, disabled, or "coming soon" Load Tester.

### Section 6 — Assessment Load

Assessment progression should be presented as increasing structural responsibility:

- Sandwich Field Log — 15%;
- Component Test — 20%;
- Failure Autopsy — 25%;
- The Sandwich Must Hold — 40%.

Present the four tasks as physically increasing declared loads along one structural axis: 15%, 20%, 25%, then 40%. The final load should feel consequential through scale and spacing, not through a marketing card. A normal text list must remain available and readable.

### Section 7 — Lecture and Field Manual

Provide direct links to `Open the Week 4 lecture deck` and `Consult the Field Manual`. Treat the lecture as a translucent acetate sheet carrying a moisture-front drawing, and the manual as a compact tabbed handbook with revision marks. This gives students and markers a short route to the required real deck and the course's methods.

### Section 8 — Course Details and Footer

Include the assigned course code, semester, twelve-week duration, required SlopU information, policies, accessibility information, and any source or repository link required by the starter. Finish with an `EXPERIMENT ARCHIVED` visual stamp and one restrained footer line such as `The evidence survived. The sandwich did not.` The normal footer links remain plain text and fully readable.

## Confirmed Required Page Design

The following six page types are required for the core A2 submission. Their structural direction and the refined visual system are approved for desktop and mobile concept generation. They share the deadpan materials-engineering language, but each has a different information job and dominant composition. None should be reduced to a repeated card template.

### Weeks Index — `/weeks`

**Page job:** let students and markers understand the complete semester at a glance and move directly between non-adjacent weeks.

**Opening copy:**

> **Twelve weeks. One load path.**
>
> From definition to destructive testing, each week isolates one condition that determines whether a sandwich holds.

**Desktop composition:** the first viewport introduces the four-phase load path and approximately the first half of the semester at a comfortable reading size. The remaining weeks continue below rather than being compressed into the same screen.

1. Global header with `Weeks` visibly active.
2. Page title and one-sentence orientation.
3. A semester load path divided into the four confirmed phases.
4. Twelve full-width week rows connected by one continuous structural line.
5. Assessment milestones attached to the line at the relevant points.
6. A short legend explaining lecture deck, investigation, assessment milestone, and supplied-evidence symbols.

Every week row must contain:

- week number;
- official teaching date from the generated course data;
- confirmed week title;
- structural question in one short line;
- a unique miniature artefact symbol or cropped technical diagram;
- `Open Week` as the action;
- a visible `Lecture Deck` notation for Week 4.

The phases are:

- **Phase I — Define:** Weeks 1–3;
- **Phase II — Expose the Forces:** Weeks 4–6;
- **Phase III — Assemble and Transport:** Weeks 7–10;
- **Phase IV — Diagnose and Prove:** Weeks 11–12.

**Mobile composition:** stack the four phases vertically around a single left-hand load line. Each week becomes a compact row, not a rounded card. Preserve the date, title, and action; move the structural question below the title and reduce the artefact to one meaningful glyph.

**Interaction and state rules:**

- the entire title-and-action area may be clickable, but it must retain a visible text link;
- keyboard focus follows chronological order;
- visited weeks may receive a restrained state change without implying course completion;
- the current week may be identified only when the generated course data supplies a reliable current-week state;
- no progress percentage or fabricated completion metric is shown.

**Anti-recipe rule:** thumbnails must represent analytical artefacts—classifier, force line, moisture front, thermal timeline, autopsy evidence—not attractive finished sandwiches.

### Assessment Overview — `/assessments`

**Page job:** show that the four submissions total 100%, explain their intellectual progression, and give direct access to every assessment brief.

**Opening copy:**

> **Four submissions. One structural argument.**
>
> Observe a system, isolate a variable, diagnose a failure, then defend a design.

**Page composition:** the first viewport establishes the 100% total, capability progression, and the first assessment bands. Remaining assessment detail and evidence guidance continue below.

1. Global header with `Assessments` visibly active.
2. An explicit `Total assessment: 100%` statement near the title.
3. A horizontal assessment load path on desktop and vertical load path on mobile: `Observe → Isolate → Diagnose → Synthesise`.
4. Four full-width assessment bands rather than four promotional cards.
5. A course-level section titled `What counts as evidence`.
6. A paired section titled `What is not assessed`.
7. Links to the relevant weeks and to the policies governing equivalent participation.

Each assessment band must show:

- title and weight;
- confirmed due date from generated course data when available;
- capability word;
- one-sentence task summary;
- primary submission components;
- weeks that prepare the student for the task;
- `Read the brief` action.

The four bands must visibly add to 100%:

| Capability | Assessment | Weight | Preparation |
| --- | --- | ---: | --- |
| Observe | Sandwich Field Log | 15% | Weeks 1–3 |
| Isolate | Component Test | 20% | Weeks 4–6 |
| Diagnose | Failure Autopsy | 25% | Weeks 7–11 |
| Synthesise | The Sandwich Must Hold | 40% | Weeks 1–12 |

`What counts as evidence` should name annotated diagrams, measurements, comparison tables, observation records, failure sequences, limitations, and justified revisions. `What is not assessed` must explicitly exclude taste, ingredient expense, culinary skill, consumption, and visual attractiveness without evidence.

**Mobile composition:** preserve the 100% total at the top, rotate the progression into a vertical sequence, and keep weight, due date, and action visible without opening another control.

### Assessment Detail Template — `/assessments/[slug]`

**Page job:** give a student everything required to understand, complete, and evaluate one assessment without searching across multiple pages.

**Shared page anatomy:**

1. Assessment number, title, weight, capability, and confirmed due date.
2. A one-sentence task proposition.
3. `Task at a glance`: individual/group mode, required format, expected scale, and submission route, using only facts supplied by the course data.
4. `The brief`: the scenario, declared problem, and intended learning outcome.
5. `Required submission`: a numbered list of required evidence items.
6. `Recommended process`: an analytical workflow, not cooking instructions.
7. `Marking`: criterion names, percentages, and plain-language performance expectations.
8. `Evidence standard`: how to separate observation, inference, uncertainty, and limitations.
9. `Equivalent participation`: physical specimen, non-food analogue, and supplied-evidence routes.
10. `Safety, cost, and waste`: direct links to the relevant policy sections.
11. `Preparation`: links to the weeks that build the required capability.
12. Assessment navigation: previous assessment, all assessments, next assessment.

**Marking presentation:** use one vertical load-distribution diagram or ruled table. It must remain readable as text, expose every percentage, and never rely on colour alone. Criteria percentages must equal 100% within each assessment.

**Required differences between the four detail pages:**

| Assessment | Dominant page artefact | Page-specific emphasis |
| --- | --- | --- |
| Sandwich Field Log | Four-entry observation sheet | observed vs inferred vs unknown |
| Component Test | Three-condition comparison bench | variable, control, protocol, and limitations |
| Failure Autopsy | Forensic evidence board and causal chain | competing explanation and unresolved uncertainty |
| The Sandwich Must Hold | Load-case brief and iteration record | test, failure, revision, and final defence |

The shared anatomy provides consistency, but the opening artefact, evidence example, workflow diagram, and marking visual must change for each assessment.

**Mobile composition:** place title, weight, and due date first; move the `Task at a glance` facts into a simple ruled list; convert the marking table into five stacked criterion rows without removing percentages; use anchor links for long-page navigation.

**Anti-recipe rule:** `Recommended process` uses verbs such as `declare`, `observe`, `measure`, `compare`, `test`, `document`, `revise`, and `defend`. It must never specify a meal, ingredient quantities, flavour, or preparation sequence.

### Field Manual — `/field-manual`

**Page job:** provide a reusable reference for the methods and evidence language used across all twelve weeks and four assessments.

**Opening copy:**

> **Measure first. Explain second.**
>
> The Field Manual defines the course methods for recording a specimen, applying a load, identifying failure, and defending a claim.

**Page composition:**

1. Global header with `Field Manual` visibly active.
2. A compact table of contents with anchored sections.
3. `System vocabulary`: specimen, component, boundary, interface, load, support, failure, recovery, and load case.
4. `The four failure families`: Slip, Soak, Crush, and Splay, clearly labelled as the course's simplified analytical model.
5. `Observation protocol`: identify, condition, load, observe, record, compare, interpret.
6. `Test methods`: compression, slippage, moisture migration, thermal comparison, cutting geometry, and transport disturbance.
7. `Evidence records`: annotated image, measurement table, sequence diagram, comparison, limitation, and uncertainty statement.
8. `Observed / Inferred / Unknown`: a worked example showing how the three categories differ.
9. `Failure notation`: a small consistent symbol set reused throughout the site.
10. `Reusable recording sheets`: printable or copyable text-first templates.
11. `Method limits`: course methods support comparative reasoning and are not professional engineering or food-safety certification.

**Reference behaviour:** desktop may use a restrained sticky contents column beside a wide reading column. The first viewport shows the manual purpose, key vocabulary, and the four failure families; protocols, test methods, evidence records, notation, and recording sheets continue as later chapters. On mobile, contents becomes an inline jump list before the manual body. Important definitions and safety constraints must remain visible without opening accordions.

**Cross-linking:** every method links to the weeks and assessments that use it; week and assessment pages link back to the exact manual section rather than only to the top of the page.

**Anti-recipe rule:** method descriptions define how to observe and compare variables. They do not provide sandwich assemblies that can be followed as recipes.

### Policies — `/policies`

**Page job:** make safe, accessible, low-cost, and equivalent participation easy to understand before a student begins an activity.

**Opening copy:**

> **Safe participation. Equivalent evidence.**
>
> No student is required to prepare, purchase, handle, or consume food to meet a course learning outcome.

**Page composition:**

1. Global header and page title.
2. A prominent three-path statement: `Physical Specimen / Non-Food Analogue / Supplied Evidence`.
3. A short decision path helping a student select an equivalent route without disclosing a diagnosis.
4. Seven anchored policy sections:
   - Food Handling and Consumption;
   - Allergies and Sensory Access;
   - Cost and Materials;
   - Waste;
   - Photography, Privacy, and Consent;
   - Cultural and Dietary Respect;
   - Assessment Fairness.
5. A closing `Before you begin a test` checklist.
6. A neutral `Contact course staff` action whose actual contact details must come from the starter or generated course data.

**Decision path:**

> Can you safely and comfortably use a physical specimen?
>
> If yes, the physical route is available. If no or uncertain, choose a non-food analogue or supplied-evidence pack. All routes target the same learning outcome and are marked using the same criteria.

This path offers options; it must not request medical information or imply that one route is academically superior.

**Visual treatment:** policies use strong headings, short ruled sections, and direct language. Avoid warning-heavy red panels across the whole page. Tomato red is reserved for immediate prohibitions; lettuce green may identify accepted equivalent routes. Icons must have adjacent text labels.

**Mobile composition:** use an inline contents list and full-width policy sections. Do not hide essential policy text inside collapsed accordions. Anchor targets require sufficient top spacing beneath the sticky header.

### Week 4 Lecture Deck — `/lectures/moisture-is-a-load`

**Page job:** satisfy the real lecture-deck requirement while delivering a useful Week 4 teaching resource rather than a decorative slideshow.

The lecture page should contain:

1. course and lecture identity;
2. title `Moisture Is a Load`;
3. Week 4 context and the essential question;
4. a visible `Start lecture` action;
5. slide count and estimated duration only if supported by the final deck;
6. an accessible slide viewer;
7. a complete transcript or text outline below the viewer;
8. `Return to Week 4` and `Open Field Manual: Moisture Migration` links.

**Proposed twelve-slide sequence:**

| Slide | Title | Teaching purpose | Dominant visual |
| ---: | --- | --- | --- |
| 1 | Moisture Is a Load | Establish lecture identity and question | instrumented specimen cross-section |
| 2 | The Failure Arrives Late | Introduce time-dependent failure | before/during/after specimen sequence |
| 3 | What Is the Boundary Doing? | Identify layers, interfaces, and exposed edges | labelled boundary diagram |
| 4 | A Simplified Moisture-Front Model | Show progressive movement through a porous layer | `t=0`, `t=5`, `t=15` front diagram |
| 5 | Soften, Swell, Lubricate | Separate three possible structural effects | three comparative material sections |
| 6 | Observation Is Not Cause | Distinguish visible evidence from causal inference | observed/inferred/unknown table |
| 7 | Designing a Controlled Comparison | Define variable, control, and constants | three-condition test bench |
| 8 | Reading the Evidence | Interpret penetration depth and displacement | annotated comparison plot and specimen |
| 9 | Competing Explanations | Prevent a single-cause assumption | branching causal diagram |
| 10 | Investigation Brief | Prepare the Week 4 activity | test protocol flow with safety branch |
| 11 | Check Your Diagnosis | Ask students to classify a short case | evidence case with reveal state |
| 12 | From Week 4 to Component Test | Connect the lecture to Assessment 2 | course load-path segment |

**Deck interaction:**

- use a 16:9 stage with previous, next, slide number, and `Exit deck` controls;
- support arrow keys, visible focus, and direct access to the transcript;
- browser back must return to the Week 4 page rather than trapping the student;
- reduced-motion mode removes animated transitions;
- diagrams require meaningful alternative text in the transcript;
- the deck must remain legible at `1920 x 1080` and usable at `390 x 844`;
- phone layout may stack the slide above controls and transcript rather than shrinking all text into an unreadable 16:9 frame.

**Content integrity:** scientific claims, example values, and external readings remain provisional until checked against suitable sources. The final deck must distinguish illustrative course data from measured or sourced data. It must not present the four failure families as a recognised professional standard.

**Anti-recipe rule:** the deck explains moisture movement, comparison design, and evidence interpretation. It does not teach sauce placement, ingredient selection, or a preferred sandwich assembly.

### Shared Required-Page Rules

- All six page types preserve the fixed SlopU identity and assigned course code from the starter.
- Official dates, submission details, and staff contact information come from the starter or generated course data; placeholders must not survive into the submitted site.
- Every page has one dominant information structure rather than a collection of interchangeable cards.
- Desktop and mobile layouts preserve the same content but may change order and composition.
- Heading order, landmarks, keyboard focus, visible focus states, contrast, alternative text, and reduced-motion behaviour are designed before implementation.
- Every long page provides direct, descriptive links and does not rely on browser history as its only navigation.
- Desktop and mobile concept regeneration is authorised using the refined system above. Reference images remain design guidance rather than final UI assets.

### Whole-Site Reference Image Inventory

The regenerated concepts are stored in `design-references/`. Desktop images use a 16:9 reference ratio and mobile images use the `390 x 844` target ratio. Image-generation output dimensions may be larger than the target viewport; the ratio and composition, not the bitmap dimensions, define the intended layout.

| Page type | Desktop reference | Mobile reference |
| --- | --- | --- |
| Weeks Index | `weeks-index.png` | `weeks-index-mobile.png` |
| Assessment Overview | `assessment-overview.png` | `assessment-overview-mobile.png` |
| Assessment Detail template | `assessment-detail-template.png` | `assessment-detail-template-mobile.png` |
| Field Manual | `field-manual.png` | `field-manual-mobile.png` |
| Policies | `policies.png` | `policies-mobile.png` |
| Week 4 Lecture Deck | `week-4-lecture-deck.png` | `week-4-lecture-deck-mobile.png` |
| Home — live-test hero | `home-hero.png` | `home-hero-mobile.png` |
| Home — proposition and failure families | `home-failure-families.png` | `home-failure-families-mobile.png` |
| Home — semester and assessment load | `home-semester-assessments.png` | `home-semester-assessments-mobile.png` |
| Home — resources and archive footer | `home-resources-footer.png` | `home-resources-footer-mobile.png` |
| Course Guide | `course-guide.png` | `course-guide-mobile.png` |
| Week 8 — layer-order assembly bay | `week-08-layer-order.png` | `week-08-layer-order-mobile.png` |
| Week 11 — failure-autopsy room | `week-11-failure-autopsy.png` | `week-11-failure-autopsy-mobile.png` |

The homepage is represented by four large coordinated section concepts rather than one unreadably compressed full-page screenshot. Course Guide, Week 8, and Week 11 demonstrate three additional page signatures; the written test-station table controls the remaining week pages. These images deliberately show one meaningful viewport or section and enough surrounding context to establish continuation. They do not remove later content defined in this plan. Exact course data, dates, scientific claims, and implementation behaviour remain governed by the starter, sourced content, and the written specifications rather than by incidental text generated inside a reference image.

## Optional Stretch Interaction — Sandwich Load Tester

### Status and Priority

The full Sandwich Load Tester remains part of the design plan, but it is not an Assignment 2 requirement and must not displace required course content, evidence, checks, or responsive quality. It may be implemented only after the core completion gate below has passed.

Its purpose is to act as a transparent teaching model for comparing structural decisions. It is not a recipe builder, physics engine, scientific predictor, or source of assessment marks.

### Core Workflow

1. Select the supplied default specimen.
2. Configure its structure.
3. Choose one load test.
4. Run the test.
5. Inspect the failure trace.
6. Change one variable.
7. Compare the two runs.

The page opens with a complete `Specimen 001` rather than an empty configuration.

### Adjustable Variables

**Outer-layer stiffness:** `Compliant`, `Balanced`, or `Rigid`.

**Internal layer order:** students reorder four structural categories between fixed outer layers:

- `Support layer`;
- `Loose layer`;
- `Moist layer`;
- `Binding layer`.

Layer-adjacency rules:

- a moist layer next to an outer layer increases `Soak` risk;
- a binding layer next to a loose layer reduces `Slip` risk;
- a loose layer at an exposed edge increases `Splay` risk;
- a moist layer above a low-grip interface increases `Slip` risk.

**Interface grip:** `High`, `Moderate`, or `Low`.

**Filling distribution:** `Centred`, `Uneven`, or `Overfilled`.

**Cut geometry:** `Intact`, `Halved`, or `Quartered`. This control describes specimen state and must not provide blade-use instructions.

### Available Tests

Only one test runs at a time so that comparisons can isolate one declared condition:

- `Tilt Test`, primarily exposing Slip and Splay;
- `Compression Test`, primarily exposing Crush and Splay;
- `One-Handed Hold Test`, primarily exposing Splay and Crush;
- `Delay Test`, primarily exposing Soak and Slip.

These are course-rule labels, not calibrated engineering standards. The interface must not invent precise real-world units.

### Result States

The model has five principal results:

- `Held Under This Condition`: no failure family reaches the threshold;
- `Slip`: internal layers move relative to one another;
- `Soak`: moisture reaches and compromises an outer boundary;
- `Crush`: an outer or load-bearing layer loses usable form under compression;
- `Splay`: internal layers escape through an exposed edge or uneven load region.

The stable result must never be described as `Perfect` or `100% stable`. It applies only to the selected rule set and test. If two risks tie above the threshold, show a compound result such as `Compound Failure: Slip + Splay`. Display no more than two principal failures.

### Transparent Risk Model

Maintain four bounded risk values—`slip`, `soak`, `crush`, and `splay`—starting at zero and capped between 0 and 5. Configuration rules and the selected test adjust these values.

Initial teaching rules:

| Condition | Rule effect |
| --- | --- |
| Compliant outer layer | Crush +2 |
| Rigid outer layer with uneven filling | Splay +1 |
| Low interface grip | Slip +2 |
| High interface grip | Slip -1 |
| Moist layer next to outer layer | Soak +2 |
| Moist layer over low-grip interface | Slip +1 |
| Binding layer next to loose layer | Slip -1 |
| Loose layer at an exposed edge | Splay +1 |
| Uneven distribution | Splay +2 |
| Overfilled specimen | Splay +2 and Crush +1 |
| Halved specimen | Splay +1 |
| Quartered specimen | Splay +2 |
| Tilt Test | Slip +2 |
| Compression Test | Crush +2 |
| One-Handed Hold Test | Splay +2 |
| Delay Test with exposed moisture | Soak +2 |

Result selection:

- if the highest risk is below 3, return `Held Under This Condition`;
- if one risk is the unique highest value at 3 or above, return that failure;
- if two risks tie at 3 or above, return a compound failure;
- if more than two risks tie, show the two with the strongest visible rule contributions and disclose the remaining secondary risk.

All rules and contributions must remain visible under `How this model works`. The numbers are pedagogical rules and must not be presented as empirical measurements. Later evidence review may revise them, but every revision needs a documented reason.

### Result and Comparison Views

The result view contains:

1. the specimen state;
2. the principal failure;
3. one secondary risk where relevant;
4. the structural location that changed;
5. a complete rule trace;
6. one analysis prompt;
7. `Modify one variable`;
8. `Compare with previous run`.

Every result must display:

> This result is produced by the course rules. It is not a scientific prediction of physical performance.

The tool stores only the two most recent runs in the current local session. The comparison view shows the changed variable, previous result, current result, changed rule contributions, and an interpretation prompt. If more than one variable changes, warn that the comparison cannot isolate a single cause without blocking the result.

### Interaction State Model

`DEFAULT SPECIMEN → CONFIGURED → READY → TESTING → RESULT`

From `RESULT`, a user may modify the configuration, open `COMPARISON`, or reset to the default specimen. The testing transition must be brief and must disappear entirely when reduced motion is enabled.

### Responsive and Accessibility Rules

Desktop uses three primary regions: configuration controls, a large specimen diagram, and the selected test/result trace. Phone layouts use a four-step sequence: `Structure`, `Layer order`, `Test`, and `Result`.

- All controls must work by keyboard.
- Layer reordering must provide `Move up` and `Move down` controls; drag-and-drop alone is prohibited.
- Colour cannot be the only indicator of a failure.
- The specimen diagram needs a complete text equivalent.
- Results should be announced through a non-disruptive live region.
- Motion must respect `prefers-reduced-motion`.
- Reset must confirm before removing an uncompared result.
- Risk values must use a number, name, and plain-language explanation.

### Curriculum Links

- Week 3 may link to the Tilt Test.
- Week 4 may demonstrate the Delay Test.
- Week 5 may introduce Compression.
- Week 8 may use the layer-order controls.
- Week 9 may introduce cut geometry.
- Week 10 may connect structural configuration to transport conditions.

These links appear only if the optional page has shipped. Core week pages must remain complete without it.

### Explicitly Out of Scope

- recipe generation or shopping lists;
- taste, nutrition, or "perfect sandwich" scores;
- AI-generated recommendations;
- claims of physical accuracy;
- 3D physics;
- accounts, cloud storage, or a database;
- leaderboards;
- hidden calculations.

### Core Completion Gate

Claude must not begin implementing the Load Tester until all of the following are true:

1. the homepage, Course Guide, semester schedule, all twelve dated week pages, assessment overview, four assessment pages, Field Manual, Policies, and Week 4 lecture deck are complete;
2. assessments total 100% and all required course data passes validation;
3. every teaching week passes the anti-recipe gate and has its distinct artefact;
4. required factual claims have sources or are explicitly labelled as course-designed classifications;
5. `pnpm check` and `pnpm check:evidence` pass;
6. the core site has been reviewed at `1920 x 1080` and `390 x 844`;
7. keyboard navigation, headings, landmarks, alt text, focus states, and reduced-motion behaviour have been checked;
8. `PROCESS.md`, `CLAUDE.md`, and the incremental commit history contain enough evidence for the completed core work;
9. no unresolved high-priority content, responsive, accessibility, or deployment defect remains;
10. sufficient time remains to implement and verify the optional interaction without putting the core submission at risk.

If this gate is not satisfied, keep the page unbuilt, omit all links to it, and use the static Week 8 specimen fallback on the homepage. An unbuilt stretch feature is acceptable; a broken or distracting one is not.

## Confirmed Twelve-Week Curriculum Structure

The actual teaching dates will be taken from the starter or confirmed semester schedule. The titles, questions, and distinct page artefacts below define the approved curriculum structure.

| Week | Title | Structural question | Dominant page artefact | Student output |
| --- | --- | --- | --- | --- |
| 1 | What Counts as a Sandwich? | Is the boundary defined by shape, materials, function, or use? | Branching classifier and disputed specimens | Classification Field Note |
| 2 | Bread Is a Beam | How does the outer layer bear, distribute, and recover from load? | Horizontal compression-test bench | Compression Record |
| 3 | Grip, Friction and Slip | Why do individually stable materials move after assembly? | Adjustable slippage ramp | Interface Comparison |
| 4 | Moisture Is a Load | How does liquid progressively compromise a boundary? | Real lecture deck and moisture-front diagram | Absorption Observation |
| 5 | Load-Bearing Fillings | Which layers support the assembly, and which only add load? | Exploded specimen and load-path drawing | Load-Path Annotation |
| 6 | Sauce at the Interface | When does an interface layer change from binder to lubricant? | Sequential failure imagery | Interface Incident Report |
| 7 | Thermal Conflict | How does temperature change the behaviour of one assembly over time? | Before-and-after thermal timeline | Thermal Comparison |
| 8 | The Order of Layers | Why does the same material set behave differently when reordered? | Reorderable layer stack | Assembly Rationale |
| 9 | Cutting Geometry | How does a cut change support, grip, and exposed boundaries? | Cut-path and force-line diagram | Geometry Analysis |
| 10 | Packaging Is Part of the Structure | Does packaging protect the assembly or impose a new load? | Tilt, compression, and transport-test dossier | Transport Test |
| 11 | Failure Autopsy | How can a failure sequence be reconstructed from limited evidence? | Forensic dossier | Failure Autopsy |
| 12 | The Final Stress Test | Can a design remain coherent under a declared use condition? | Final specimen test and defence | Defended Final System |

### Distinct Weekly Test-Station Behaviour

The shared anatomy controls information order, while the following signature mechanism prevents twelve visually interchangeable pages. Every interaction has a labelled static and reduced-motion equivalent.

| Week | Test-station character | Local interaction or state change |
| ---: | --- | --- |
| 1 | Classification desk with disputed specimen branches | selecting one criterion redraws the boundary and reveals a counterexample |
| 2 | Horizontal compression bench | a load plate closes a measured gap and a recovery trace remains behind |
| 3 | Slippage ramp | angle or interface focus shifts one layer along a ruled displacement line |
| 4 | Translucent moisture laboratory | an acetate moisture front advances across `t=0`, `t=5`, and `t=15` states |
| 5 | Exploded load-path station | focusing a layer illuminates the support path and isolates unsupported load |
| 6 | Sequential incident recorder | scrubbing three frames reconstructs binder-to-lubricant failure without providing preparation steps |
| 7 | Thermal timeline | the same specimen condition is compared across three time points with no continuous animation |
| 8 | Layer-order assembly bay | structural category layers reorder and the visible adjacency notes update |
| 9 | Cutting-geometry drawing board | selecting a cut reveals changed supports, exposed boundaries, and force lines, without blade-use instruction |
| 10 | Packaging and transport dossier | a route trace connects tilt, compression, and transport evidence photographs |
| 11 | Charcoal failure-autopsy room | evidence fragments reveal a branching causal chain and unresolved uncertainty |
| 12 | Final test rig and defence bench | declared load, first failure, revision, and defended result appear as one evidence sequence |

High-contrast use is deliberately rare: Week 11 may open on charcoal as the semester's forensic low point; Week 12 returns to laboratory white with a larger final rig and one held-or-failed status. The weekly system must feel cumulative without becoming a gamified progress tracker.

### Shared Week Anatomy

Each week must preserve a predictable information order:

1. week number, confirmed date, and title;
2. one structural question;
3. concept explanation;
4. failure specimen or case;
5. investigation activity;
6. required reading or viewing;
7. assessment connection;
8. previous, all-weeks, and next navigation.

The dominant artefact and composition must change from week to week. Shared information architecture must not become a repeated visual template.

### Weekly Anti-Recipe Gate

Before publication, every week must pass these checks:

- its primary verbs are analytical, such as `classify`, `observe`, `measure`, `compare`, `test`, `diagnose`, or `defend`, rather than `prepare`, `cook`, `season`, or `serve`;
- it does not provide quantities and steps that can be reproduced as a meal;
- it identifies at least one failure condition or constraint;
- it contains evidence in the form of a measurement, annotation, observation record, comparison, or test result;
- its main visual has analytical meaning rather than functioning only as an attractive food photograph;
- its dominant artefact does not duplicate another teaching week.

## Assessment Principle

Assessment should reward students for investigating and defending structural decisions, not for producing the most appetising sandwich.

The confirmed assessment sequence is:

- **Sandwich Field Log — 15%**
- **Component Test — 20%**
- **Failure Autopsy — 25%**
- **The Sandwich Must Hold — 40%**

Total: **100%**

Together, the assessments form a deliberate progression:

> Observe → Isolate → Diagnose → Synthesise

### Assessment 1 — Sandwich Field Log

**Weight:** 15%  
**Timing:** End of Week 3; replace this with the confirmed date when the semester calendar is available.  
**Capability:** Observe.

Students investigate four sandwich specimens. They may use field observation, supplied cases, or non-edible models; purchasing or eating food is not required.

Each specimen entry must contain:

- an annotated photograph or diagram;
- a structural classification;
- one observed failure or credible failure risk;
- separate `Observed`, `Inferred`, and `Unknown` statements;
- no more than 250 words of analysis.

Marking allocation:

- quality of observation — 40%;
- structural classification — 30%;
- use of evidence — 20%;
- clarity — 10%.

This task must not record ingredient quantities or preparation steps. It records structure, interfaces, condition, and evidence.

### Assessment 2 — Component Test

**Weight:** 20%  
**Timing:** End of Week 6; replace this with the confirmed date when the semester calendar is available.  
**Capability:** Isolate.

Students select one structural variable, such as stiffness category, moisture placement, interface grip, or compression, and test it under at least three conditions. A control condition should be included where the question supports one.

The submission must contain:

- a focused research question;
- one declared variable under investigation;
- a repeatable test protocol;
- a comparison table;
- annotated evidence;
- an interpretation and limitations section.

Marking allocation:

- test design — 35%;
- evidence quality — 30%;
- interpretation — 25%;
- communication — 10%.

Students may use sponge, foam, cardboard, or other non-edible analogue materials. This supports accessibility and reduces unnecessary food waste.

### Assessment 3 — Failure Autopsy

**Weight:** 25%  
**Timing:** End of Week 11; replace this with the confirmed date when the semester calendar is available.  
**Capability:** Diagnose.

Students choose one case from a supplied failure-case pack and reconstruct the most defensible failure sequence from incomplete evidence.

The submission must contain:

- an evidence inventory;
- a proposed event sequence;
- an annotated failure diagram;
- a probable causal chain;
- at least one competing explanation;
- a record of unresolved uncertainty.

Marking allocation:

- evidence handling — 30%;
- causal reconstruction — 30%;
- treatment of uncertainty — 25%;
- clarity — 15%.

Observed facts, reasonable inferences, and unknown information must remain explicitly separated. Visual resemblance alone cannot be presented as a confirmed cause.

### Assessment 4 — The Sandwich Must Hold

**Weight:** 40%  
**Timing:** End of Week 12; replace this with the confirmed date when the semester calendar is available.  
**Capability:** Synthesise.

Students design, test, revise, and defend one sandwich system against a declared load case. Suitable load cases may include backpack transport, one-handed use, delayed service, vertical storage, or repeated handling. The final list must be checked for safety and accessibility before publication.

The submission must contain:

- a load-case brief;
- an annotated exploded diagram;
- declared design constraints;
- a test protocol;
- test evidence;
- one documented failure;
- one justified revision;
- a final structural defence.

Marking allocation:

- response to the load case — 25%;
- test quality — 30%;
- structural reasoning — 25%;
- iteration — 10%;
- communication — 10%.

Taste, visual appeal, cooking skill, ingredient expense, and whether the sandwich is consumed are explicitly excluded from marking.

### Curriculum Alignment

- Weeks 1–3 prepare students to complete the Sandwich Field Log.
- Weeks 4–6 prepare students to complete the Component Test.
- Weeks 7–11 prepare students to complete the Failure Autopsy.
- The complete twelve-week sequence prepares students for the Final Stress Test.

## Confirmed Course Policies

The `/policies` page should read as a clear laboratory standard. It should protect participation without turning the course into an unnecessarily bureaucratic experience.

### Food Handling and Consumption

- Students are never required to eat a specimen.
- Tested food must not be presented to another person for consumption.
- Shared workspaces must be cleaned before and after physical testing.
- Cutting activities must use supplied pre-cut specimens, diagrams, or supervised equipment.
- Structural success never overrides food-safety requirements.

### Allergies and Sensory Access

- Students do not need to disclose a medical diagnosis to select an alternative pathway.
- Non-food materials and supplied evidence must always be accepted.
- Activities must not depend exclusively on smell, taste, touch, colour perception, or fine motor control.
- Alternative evidence formats must assess the same learning outcome without penalty.

### Cost and Materials

- No assessment may require expensive or specialist ingredients.
- Students must not be rewarded for purchasing premium food.
- Required physical materials should be supplied or replaceable with common non-food analogues.
- Tests should use the smallest specimen capable of answering the question.

### Waste

- A test protocol must justify the amount of material used.
- Tested food must not later be represented as safe to consume.
- Non-food models are preferred when repeated destructive testing is required.
- Waste reduction is treated as a design constraint, not as a taste or sustainability bonus mark.

### Photography, Privacy, and Consent

- Students may photograph their own specimens or supplied cases.
- Identifiable people and private domestic spaces require consent.
- No assessment requires photographing workers or customers without permission.
- Supplied evidence must remain available when field photography is impractical.

### Cultural and Dietary Respect

- The course does not enforce one universal or culturally neutral definition of a sandwich.
- Classification arguments must state their criteria rather than dismissing unfamiliar food forms.
- Dietary practice must never be treated as a structural defect.
- Students are assessed on reasoning and evidence, not ingredient choice.

### Assessment Fairness

- Taste, presentation, culinary skill, and consumption are excluded from marking.
- Physical, analogue, and supplied-evidence pathways are equivalent.
- A failed physical test may receive strong marks when it is well designed, documented, and interpreted.
- Fabricated measurements and undocumented claims do not count as evidence.

## Assignment 2 Requirements to Preserve

The eventual site must:

- represent one coherent niche Slop University course;
- run across twelve dated teaching weeks;
- contain approximately twenty or more mutually consistent pages;
- include at least one real lecture deck linked from its lecture page;
- contain assessment totalling 100%;
- remain usable and visually complete at both `1920 x 1080` and `390 x 844`;
- support non-linear browsing, because markers may open non-adjacent weeks and assessments rather than reading in sequence;
- retain the starter repository's fixed SlopU identity, content model, API requirements, and assigned course-code digits;
- include course-specific checks that protect promises not covered by the standard build checks;
- preserve a legible agentic process through `PROCESS.md`, `CLAUDE.md`, the checks, and incremental commit history.

## Next Design Decisions

Before implementation begins, the following still need to be designed and approved:

1. Confirmed teaching dates and the final three digits of the assigned course code.
2. Detailed content and evidence sources for each teaching week.
3. Final sourced lecture content, example data, and transcript for the proposed Week 4 deck.
4. Course-specific content and integrity checks.
5. Review and approval of the coordinated whole-site desktop and mobile reference set.
6. Final font selection and implementation-ready colour values after checking the starter repository's constraints.

## Current Status

The course topic, `SLOP2xxx` level, central proposition, anti-recipe constraint, deadpan engineering voice, 23 core pages plus one optional stretch page, homepage structure, Course Guide, five learning outcomes, weekly teaching format, equivalent participation pathways, course policies, four-phase twelve-week curriculum, distinct weekly artefacts, four detailed assessment briefs, assessment progression, and optional Load Tester specification are confirmed. The full-site visual experience is now defined as a semester-long stress test: a live-specimen homepage, specification-sheet Course Guide, test-rail Weeks Index, twelve distinct weekly stations, increasing assessment loads, handbook and acetate resources, and an experiment-archive footer. The refined principles—lower density, restricted display typography, semantic colour, page-specific rhythm, controlled archive marks, rare high-contrast moments, purposeful motion, restrained humour, and separate mobile compositions—are confirmed. Thirteen coordinated desktop references and thirteen purpose-built mobile references are available for review in `design-references/`. The Load Tester remains explicitly deferred until the core completion gate passes. Factual weekly content, final sourced lecture content, final implementation tokens, and final reference-image approval still remain open.
