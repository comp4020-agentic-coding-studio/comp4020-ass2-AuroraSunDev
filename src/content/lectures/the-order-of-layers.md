---
title: The Order of Layers
description:
  The Week 8 lecture — assembly order as a structural variable, and how to
  build one material set twice so that the ordering is the only thing under
  test
week: 8
date: 2027-04-19
slides: /decks/the-order-of-layers/
related:
  - sessions/week-08
  - assessments/failure-autopsy
---

Thirty slides on one claim: reordering an assembly changes none of its
materials and all of its interfaces.

The lecture builds the claim in two halves. The first is the mechanism — five
layers admit four interfaces, sixty distinguishable orders are available to
them, and only neighbouring layers interact, so moving one layer changes which
boundary is loaded and which layer sits far enough from the neutral axis to
carry anything. The second half is the method: fix a material set, build it in
two orders, write an adjacency note at every interface, predict the first
failure in writing, then load both identically and compare.

It also states where the model stops. The course treats an assembly as discrete
layers meeting at clean interfaces. Real layers interpenetrate, and once one
layer has soaked into its neighbour there is no interface left to attribute a
failure to. The discrete model is accepted here because it is what makes order
testable at all, not because it is what a specimen is.

The [week page](/sessions/week-08/) carries the same argument as prose, with the
exploded pair at full size. It is the readable equivalent of the deck and needs
no presenter.
