---
title: The Order of Layers
description:
  Assembly order treated as a structural variable — which interfaces exist,
  which face is exposed, and which layer ends up carrying the load
week: 8
date: 2027-04-19
related:
  - week-07
  - week-09
  - assessments/failure-autopsy
spec:
  - you can list every interface in your assembly and the two layers forming it
  - you have built one material set in two orders with an adjacency note per interface
  - you can name one behaviour that changed with order alone, and where it changed
---

**Structural question — why does the same material set behave differently when
reordered?**

A material set is a list. An assembly is an *ordered* list. This week tests what
the ordering does on its own.

## Order as a structural variable

Reorder a stack and nothing about the materials changes. What changes is the set
of interfaces: five layers admit four interfaces, and which four depends
entirely on sequence. Five layers can be stacked in sixty distinguishable orders
once the flip is discounted, and each order presents a different pair of
materials at every junction.

Two consequences are worth testing. The first is **exposure**. Only neighbours
interact, so a layer's effect on the outer layer depends on whether it touches
it. A wet layer placed directly against the outer layer loads that boundary;
moved one position inward, with a drier layer between, it loads a different one.
The material is identical in both cases. The assembly is not.

The second is the **load path**. A layer's contribution to bending stiffness
depends on its distance from the neutral axis, so the same stiff layer
contributes little at the centre of a bent assembly and a great deal at the
outer face. Position, not material, decides whether a layer is load-bearing. The
course models the assembly as discrete layers meeting at clean interfaces; real
layers interpenetrate, and the discrete model is accepted here because it is
what makes order testable at all.

## Investigation

In the layer-order assembly bay, fix one material set and build it in two
orders. For each order, list the interfaces and write one adjacency note per
interface, saying what the two touching materials do to each other.

Then predict which interface fails first, load both assemblies identically, and
compare the prediction against the result. A wrong prediction with a recorded
reason is the more useful record.

## Failure condition

An interface fails in one order and holds in the other, under the same
materials, the same load and the same interval. Order is then the only remaining
variable, and it is the one under test.

## What leaves the session

An **Assembly Rationale**: the fixed material set, both orders drawn as labelled
stacks, an adjacency note at every interface, the predicted first failure and
the observed one. The Failure Autopsy cannot attribute an interface failure
without knowing the order the specimen was built in. This is where that record
comes from.
