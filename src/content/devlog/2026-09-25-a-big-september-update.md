---
title: "A big September update: a tiny universe, new plants and tanks on air"
date: 2026-09-25
summary: "The microscope became a living map of the tank's chemistry, plants and rocks were redrawn, and players can now put up to four tanks on air."
author: Crafty Olive
---

Hello, I'm Crafty Olive.

After the gold prize, I said I would put resources into the graphics. Over the past few weeks, that has turned into one of the biggest rounds of changes Shrimprium has had. Looking back through the commit history, there are more than 300 commits since late August alone. Here are the main changes.

## 1. The microscope becomes a tiny universe

The microscope used to show the microorganisms in the tank. It now opens a view of the whole tank's system instead.

The idea was simple, even if building it wasn't. Physical things in the tank, such as shrimp, plants, bacteria and equipment, become nodes, and the chemical species flowing between them, such as ammonia, nitrite, oxygen and acids and bases, become lines. Everything is driven by the live simulation, so what you see is what is actually happening in the tank at that moment.

The lines are colored by what they mean for the shrimp. Lines that don't reach a shrimp stay quiet, and only the ones that are hurting it pulse red. Bacterial colonies appear as swarms of particles, their density following their concentration, and they drift in circulation driven by the air pump. The more the pump runs, the faster the water turns.

On screen, it looks like a small universe: stars linked by thin lines of light, nebulae of bacteria, and shrimp glowing among them. To keep this light enough for phones, the glowing links are drawn with WebGPU, with a Canvas fallback, and the particle circulation runs in WebAssembly.

While building this view, I also found and fixed a bug in the engine itself: a missing cubic term in the dissolved oxygen saturation formula. Drawing the system as it really is turned out to be a good way of checking it.

## 2. New plants, and plants that catch the light

Following on from the seed-based plants I wrote about last month, I've added several new species. A moss tuft spreads from tiny side sprouts as it grows. A feather plant bends toward the light. Hanging vines grow down from the surface and actually shade the water below them.

I also reworked how the plants are lit and colored. Stems are shaded in bands from each leaf node, plants take on the tint of the water depending on their height in the tank, and they catch the light of the tank lamps. I built separate preview pages for designing plants and adjusting their palettes, which made tuning much faster than trying things inside the game.

## 3. Rocks, platforms and depth

Rocks are now made in Blender and turned into pixel sprites. Shrimp can land on them and walk along their ridges, and plants and rocks are placed on three depth layers, front, middle and rear, so the tank has a sense of depth.

All 30 platform block materials have been redrawn as natural surfaces such as wood, stone and granite, with moss on top tinted to match each block. Grassy terrain and small saplings can now grow on top of platforms, and lit blocks glow in their own colors.

Not everything made it in. I tried driftwood as a background piece for several days, with many variations, but I've switched it off for now because it didn't sit well with the rest of the tank. I also built a shrimp puzzle minigame with a twelve-stage campaign, then removed its entry point from the game. It was fun, but it pulled attention away from the tank itself.

## 4. Moving shrimp between tanks

Players can now pick two tanks and move shrimp between them, and there is a new storage space for shrimp. Tank capacity has been raised to 10, and identical items in the inventory now stack up to 99. Stored shrimp are included in the hourly backup, so they are protected just like the shrimp in your tanks.

## 5. Tanks on air

The community has been redesigned around the idea of a broadcast. Each account can now put up to four tanks on air, and other tanks appear as green monitor cards showing their owner and representative shrimp. Opening one shows the whole tank along with its likes and visits, and a TV hotkey in the tank lets you put it on air directly.

## 6. Smaller things that add up

There were many smaller changes, too. The water panel now opens with a 24-hour chart, and after a water change, the game shows what it did to nitrogen, algae, carbonate and nitrifying bacteria. First-time tank setup now places a rock and a feather plant, so a new tank doesn't start out empty. On iOS, I've been preparing new App Store builds along the way.

## Closing thoughts

Most of this round was about making the tank look the way it works. The simulation has been there from the start, but it was hard to see. Now the chemistry is visible as a map of light, the plants respond visibly to their surroundings, and the rocks and platforms feel like part of a real tank.

There is still more to polish, and I'll keep sharing it here as it comes together.

As one of the benefits for GIGDC prize winners, I'll also be able to improve the game with help from game industry professionals. I'll learn as much as I can and work to make Shrimprium an even better game.
