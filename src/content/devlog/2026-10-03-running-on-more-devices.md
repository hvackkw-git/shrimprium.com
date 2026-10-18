---
title: Making Shrimprium run on more devices
date: 2026-10-03
summary: "A WebGL2 fallback for devices without WebGPU, batched GPU drawing, crisper shrimp and a shorter loading time."
author: Crafty Olive
---

Hello, I'm Crafty Olive.

Over the past months I've moved more and more of Shrimprium's rendering onto WebGPU. It made the tank look much better, but it left a problem: not every device and browser supports WebGPU yet. On those devices, the water, plants and light fell back to a much plainer, static version of the tank.

This week I worked on closing that gap.

## 1. A WebGL2 fallback

When WebGPU isn't available, the game now uses WebGL2, which is supported far more widely. Water refraction, swaying plants, light rays, caustics, the waterline, lighting on platform surfaces and marine snow are all drawn with WebGL2 in that case. If a device turns out to be too slow even for that, the plants drop back to a static version so the game stays playable.

The goal was simple: whatever device you play on, the tank should look like the same tank.

## 2. Drawing more with less

I also changed how many small moving things are drawn. Bubbles and other motion artwork are now batched onto the GPU and drawn together rather than one by one. The shrimp sprites are rendered at twice their previous resolution while keeping the same size in the tank, so they look crisper on high-resolution screens.

The drifting algae sprites are gone. Instead, suspended algae are blended into the marine snow that already drifts through the water, which looks more natural and costs less to draw. As a small bonus, sunlit moss now grows on the tops of platforms.

## 3. Shorter loading

Loading is shorter, too. Light textures are now prepared with their colors already applied, loading steps that used to wait for one another now run in parallel, and the blur on rear plants is baked into the pixels instead of being applied as a filter every frame.

I measured each change on a Mac in Safari, which tends to be the strictest environment, and kept only what actually helped.

None of this adds a new feature you can point to. But it means more people can see the tank the way it's meant to look, and that matters to me just as much.
