---
title: Growing plants that feel alive
date: 2026-08-23
summary: "Plants now grow from seeds, bending toward light and responding to nutrients, which meant moving Shrimprium's rendering from the DOM to WebGPU."
author: Crafty Olive
---

Lately in Shrimprium, I've been working on making the plants feel more like living things. The original implementation did little more than place a few rough plant images in the tank, but I'm reworking it so that growing plants can be as enjoyable as raising shrimp.

The approach is to give each plant several seeds, and have those seeds determine the direction its stems grow and where its branches form. The light and nutrient conditions in the tank also affect growth. Plants that get plenty of light extend their stems more vigorously, and when conditions are poor, they grow into different shapes. I also combined phototropism, gravity and buoyancy, so that plants bend slightly depending on the environment in the tank.

In other words, even plants of the same species grow a little differently depending on their surroundings.

This could only be done by completely changing the existing graphics rendering approach, so I put quite a lot of effort into reworking the foundations.

For example, Shrimprium was drawing much of what you see on screen in the browser's basic way, through the DOM. On the web pages we view, every piece of text, every button and every image exists as a separate element, and the browser takes care of each one and draws it on the screen.

The problem was that as the plants multiplied and shrimp moved around everywhere, all those elements had to be recalculated and redrawn every moment, dozens of times a second. The side effects were stuttering gameplay and smartphones heating up. Building the new plants with the DOM in particular would have meant linking every stem and leaf node by node, producing hundreds of elements, which I judged would be too much for mobile devices to handle.

Thanks to advances in browser technology, however, I've been able to use WebGPU. Instead of the browser calculating each element one by one, it hands the whole job to the GPU at once: "Draw all these plants and all these shrimp together."

WebGPU can also deliver richer animation effects with a lighter rendering load than the previous approach, so I expect it to let me improve the visuals considerably from here on.

There's still plenty left to polish, but I'll keep working so that you can start seeing it, bit by bit, in upcoming updates.
