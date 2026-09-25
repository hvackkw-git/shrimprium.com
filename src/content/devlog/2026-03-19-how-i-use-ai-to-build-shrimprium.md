---
title: How I use AI to build Shrimprium
date: 2026-03-19
summary: Concept, specification, implementation, testing, then back to the physics. Breaking the work into small pieces is what makes vibe coding hold up.
author: Crafty Olive
---

Lately, when vibe coding, I've moved away from handing everything from A to Z to AI in one go, and work in a different way.

I start by thinking through what happens inside the tank: how heat enters and leaves, how food and waste affect water quality, and how bacteria, algae and plants are intertwined.

At first, I discuss it with GPT while loosely organizing my thoughts. Along the way, I sort out what I've missed and where GPT and I see things differently. Once my thinking is reasonably clear, I ask GPT to write a first draft of the conceptual design.

The narrower the scope of that conceptual design, the closer the result is to what I intend. When designing the heat balance, for example, rather than covering every piece of equipment at once, I look at the lighting on its own, or isolate a single device.

Next, I review the conceptual design myself and gradually revise anything that departs from my direction. When it is sufficiently settled, I ask GPT to write a specification to feed into Cursor or a similar tool. If the folder structure needs to change, I include that in the specification as well.

I then give the specification to Cursor to implement, and if anything is implemented incorrectly, I work through the details in conversation with Cursor's agent.

In this process, I don't look only at the code. I also ask questions like these:

- Is this physically too extreme?
- Is it too different from how a real tank feels?

Once Cursor has implemented the model to a certain point, what needs fixing becomes much easier to see. Issues that come up at this stage sometimes go back to GPT for further discussion.

A simple example is the logic by which turning on the light raises the water temperature. Make it too simple and it ends with "light on = temperature up," which quickly feels wrong. Stay too close to reality and the game becomes overly complex. In a game that runs in a web browser, overly precise calculations can also become a burden.

In the end, I believe finding the compromise and choosing appropriate values is a human job. I implemented this part with the following reasoning.

Not all of the light's electrical power heats the water directly. In reality, only part of the energy emitted by the light reaches the tank as heat, and depending on the tank's view factor and the light's placement, only part of that acts as radiant heat. Some electromagnetic radiation also passes largely through the tank and the water, so the light's output cannot be assumed to turn entirely into a rise in water temperature.

To capture these characteristics in simplified form, I borrowed the concept of fractions widely used in commercial energy modeling. EnergyPlus, for example, divides the energy from lighting into inputs such as fraction radiant, fraction visible and fraction convected, modeling a complex heat transfer process in a relatively simple form (see the *EnergyPlus Engineering Reference*, U.S. DOE, 2024).

In this way, I progressively refined the heat balance for the lighting, and this too was worked out through discussion with GPT.

I then turn what we've settled into a specification, again with GPT's help. This specification doesn't cover the overall design, only the part that needs fixing now. If the issue is likely to come up again, I also write it up in a separate .md document so AI agents can refer to it later.

Writing things down first makes later work with Cursor much easier. It is far more reliable than simply saying "just build it," and when I reread the document some time later, I can remember why I built it that way.

When the work is done, I push all the files to GitHub. That way I can check them on my phone right away and keep giving Copilot in GitHub Mobile a string of small fixes. Copilot is a little slow, but it tends to make changes conservatively and reliably.

To sum up, my process looks like this:

1. Shape the concept.
2. Write the specification.
3. Implement it with Cursor.
4. Run it for real.
5. If something is off, go back to the physics or the ecology.
6. Then fix it again.

This approach has turned out to suit me well. The main bottleneck in my project is engineering judgment. If I skip detailed instructions or reviews because they're tedious, I can end up having to tear the whole thing apart later. So the more engineering judgment a task involves, the better it is, I think, to break the work into pieces as small as possible.

My game is still changing. Recently I switched it to pixel art. It would have been easier to go with pixel art from the start, but since I didn't, the switch took quite a lot of work. I suppose that was one more piece of trial and error.
