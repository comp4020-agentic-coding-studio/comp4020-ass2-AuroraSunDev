import type { CourseMetaInput } from "astro-course-university";
import { z } from "astro/zod";

// The level digits ANU uses: 1000--4000 undergraduate, 6000 and 8000
// postgraduate. Both the code pattern and the level field derive from this.
const LEVELS = [1, 2, 3, 4, 6, 8] as const;
const allowedCode = new RegExp(`^SLOP[${LEVELS.join("")}]\\d{3}$`);

export const slopCourseMetaSchema = z
  .strictObject({
    code: z.string().regex(allowedCode, {
      message: "use SLOP plus a 1000–4000, 6000 or 8000 level code",
    }),
    title: z.string().trim().min(1).max(100),
    session: z.string().trim().min(1).max(40),
    year: z.number().int().min(2026).max(2200),
    level: z.literal(LEVELS),
    startDate: z.iso.date(),
    endDate: z.iso.date(),
    description: z.string().trim().min(80).max(300),
    tags: z.array(z.string().trim().min(2).max(24)).min(1).max(3),
  })
  .superRefine((course, ctx) => {
    const codeLevel = Number(course.code.at(4));
    if (course.level !== codeLevel) {
      ctx.addIssue({
        code: "custom",
        path: ["level"],
        message: `must match ${course.code}'s first digit (${codeLevel})`,
      });
    }
    if (course.startDate > course.endDate) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "must not be after endDate",
      });
    }
  });

// The single source of truth for the course record. The generated homepage,
// navigation label and /api/index.json all read this object.
//
// The last three digits (895) were assigned to this repo at provisioning and
// are kept; the leading 2 is the ANU level this course sits at.
//
// The dates describe Semester 1 2027 as twelve teaching weeks (commencing
// 22 February) with an Easter teaching break in the week of 29 March, and a
// final submission week ending 28 May. Every dated session, lecture and
// assessment falls inside this window --- spec/data-integrity.test.ts fails
// the build if one drifts outside it.
export const courseMeta = slopCourseMetaSchema.parse({
  code: "SLOP2895",
  title: "The Sandwich Must Hold",
  session: "Semester 1",
  year: 2027,
  level: 2,
  startDate: "2027-02-22",
  endDate: "2027-05-28",
  description:
    "A sandwich is a temporary structure whose failure is eaten. This course " +
    "treats lunch as a material system: how layers carry load, exchange " +
    "moisture, and come apart under compression, handling and transport. No " +
    "culinary experience is expected and taste is not assessed.",
  tags: ["structures", "materials", "failure analysis"],
}) satisfies CourseMetaInput;
