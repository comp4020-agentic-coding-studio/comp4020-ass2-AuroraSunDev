---
title: Sauce at the Interface
description:
  The layer between two others read as a bond or a bearing, and the thickness
  at which it stops being the first
week: 6
date: 2027-04-05
related:
  - week-05
  - week-07
  - assessments/component-test
spec:
  - you can name the failure mode as adhesive at a stated face or cohesive within the film
  - you have three sequential frames covering one event, with the interval between them
  - you can state one alternative reading of the same frames and why you rejected it
---

**Structural question — when does an interface layer change from binder to
lubricant?**

The same material can hold an assembly together and take it apart. Which one
it does is largely a question of how much of it is present.

## Bond, film, bearing

An interface layer does structural work only while it is in contact with both
faces it joins. Thin enough, it fills the surface irregularities of each and
resists shear by adhering to both, and the two layers then move as one. This is
the useful regime, and it is narrower than it appears.

Add material and the layer stops transmitting force between the faces and
begins carrying it internally. The limit becomes cohesion within the layer
rather than adhesion to the faces, and cohesion in these materials is low. Add
more again and the film exceeds the roughness of the surfaces: the faces no
longer touch anywhere, and the only resistance to sliding is viscous drag,
which rises with the speed the layers are already moving at and falls as the
film thickens. A resistance that appears only once motion has begun is not a
bond. It is a bearing.

Tribology calls this progression the move from boundary to hydrodynamic
lubrication. The course borrows the term deliberately and approximately — the
pressures, speeds and materials here are not those of a journal bearing — but
the shape of the behaviour transfers, and borrowing it lets you predict the
transition instead of merely reporting it afterwards. The transition is
continuous in the film and abrupt in the assembly: nothing visible changes
until applied shear exceeds what the film can carry, and then the whole
displacement happens at once, because a film that has started to slide resists
less than one that has not. Interface failures are therefore recorded as
events, with a time, rather than as trends.

## Investigation

At the sequential incident recorder, reconstruct one shear event from three
frames and diagnose where it occurred. The diagnostic is residue. Material left
distributed across both faces indicates the film failed within itself —
cohesive failure. Material clinging almost entirely to one face indicates the
bond to the *other* face failed first — adhesive failure, at a face you can
name. Scrub between the frames and fix the frame in which movement begins.

## Failure condition

The upper layer displaces as a single event, with no measurable movement in the
preceding frame. Record which face retained the film.

## What leaves the session

An **Interface Incident Report**: three sequential frames of one shear event
with their interval, a stated failure mode — adhesive at a named face, or
cohesive within the film — the evidence in the frames supporting it, and one
alternative reading you considered and rejected. The Component Test falls due
at the end of this week, and a rejected alternative is exactly the form its
interpretation and limitations section takes.
