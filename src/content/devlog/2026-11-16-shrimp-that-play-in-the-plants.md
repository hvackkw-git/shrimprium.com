---
title: Shrimp that play in the plants
date: 2026-11-16
summary: "In my aquarium game, shrimp now climb plants, walk out onto leaves and hop from leaf to leaf, and the stems bend under their weight."
author: Crafty Olive
---

Hello, I'm Crafty Olive.

Anyone who has kept shrimp knows they spend much of the day on the plants. They climb a stem, sit on a leaf and pick at it, then let go and drift down. Until now, the shrimp in Shrimprium, my pixel-art aquarium game, swam around the plants but never touched them. This update changes that.

<img src="../../images/devlog/2026-11-16/shrimp-climbing-plants.gif" width="280" height="300" alt="Red, blue and yellow shrimp sitting on and climbing a purple branching plant in the Shrimprium aquarium game" loading="lazy" style="image-rendering: pixelated; width: 100%; max-width: 420px; height: auto;" />

## 1. Climbing

- Shrimp can now climb every plant except moss tufts: feather plants, vines, stem plants, seaweed bushes and branching plants.
- A shrimp grabs a stem as it sinks past, or walks over from the floor and climbs up. Each time it starts to sink, it decides again whether to grab a plant.
- Each plant has two climbing lanes, one on each side of the stem, like a ladder. Shrimp climb, rest and graze along them.
- At a fork, a shrimp picks a new branch. It can walk out onto a leaf, cross along a leaf to the other lane, or walk back to the stem.

## 2. Leaves and hops

- A shrimp can hop to a nearby leaf on the same plant or the next one.
- A hop is a short glide through water, not a jump. The shrimp kicks off, glides toward the leaf with its tail beating, slows down and turns to sit as it arrives. It takes half a second to a second.
- Before hopping or swimming away, a shrimp first turns to face where it's going.

## 3. Plants that feel the weight

- Stems bend toward the side the shrimp sits on. A bigger shrimp, one sitting higher, or one further out on a leaf bends the stem more.
- A hanging vine takes the weight along its length, so it sways briefly instead of leaning.
- The bend works like a slow spring, so plants lean gently and settle back like a stem in water.
- A second, quicker spring adds a small bounce when a shrimp lands, pushes off, steps or nibbles.

## 4. Getting the movement right

Most of the time went into small details:

- Turning: a full reversal happens at once, smaller turns ease in slowly, and the body stays in place while it turns.
- Seating: shrimp now sit belly to the stem, with their feet on the plant, instead of hanging beside it.
- Stutters: pixel snapping on diagonal stems made a climbing shrimp jump a few pixels sideways now and then. Stems now take their direction from a wider span.
- Performance: a shrimp on a plant was making the plant layer redraw twice as often as normal. Plant bends now update only on frames the plant layer already draws.
