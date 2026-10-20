---
title: Modeling the first shrimp
date: 2026-03-12
summary: How the shrimp went from floating microbes to two small, walking shrimp, with GPT, Gemini and Cursor each playing a part.
author: Crafty Olive
---

Hello, I'm Crafty Olive.

In this post, I'd like to share the conceptual design process behind the shrimp game: how I settled on its early concept and turned it into a working prototype.

The project started simply. Over a number of conversations with GPT, I gradually worked out the basic concept and direction of a shrimp-keeping game and got a feel for how to build one.

Next, I asked GPT to create a prototype that could run on the web from a GitHub repository. GPT laid out the file structure the repository needed, the role of each file, and the complete code for every one of them.

All I actually did was create a GitHub repository with that structure and paste in what GPT had written, file by file. The result was the first prototype.

The shrimp graphics at the time were far from what most people picture as a shrimp. They looked more like microbes drifting around the tank.

I did wonder whether vibe coding alone could improve them. Still, I decided to trust in what AI could do and keep pushing.

From there, I gradually refined the shape and colors of the tank and expanded the shrimp's behavior step by step, steadily developing the model. All of this was done through vibe coding alone.

To improve the design of the tank and the shrimp, I relied heavily on Gemini. In my experience, Gemini made considerably more progress than GPT on the design side.

For instance, GPT kept suggesting microbe-like shapes, whereas Gemini produced something much closer to a shrimp. Building on that result, I asked only for small adjustments, such as the size of the head and the shape of the antennae, and that is how I arrived at the early shrimp model.

When it came to movement, on the other hand, GPT was stronger. First I applied gravity so that the shrimp moved along the bottom instead of floating in midair. Then I added a walking motion, and later a jump, improving it one step at a time.

Even after all that, the shrimp still moved quite differently from real animals. At times they even walked around upside down in a rather eerie way. Making the movement feel natural took a lot of debugging, and that was when I began working with Cursor in earnest.

I fine-tuned everything related to the shrimp's movement, little by little: gravity, jump strength, movement speed, tail flicks and antenna sway. Cursor pointed me to the relevant variables, and I adjusted them myself until the movement looked natural.

The result, by my standards, was two very cute shrimp.

What I took away from this process is that vibe coding alone can achieve a reasonable level of visual appeal and fairly detailed movement.

A higher level of polish and more refined design may eventually call for help from professionals. But for a vibe coding beginner like me who aims to make a game solo, I think this shows that vibe coding alone can produce genuinely appealing results and turn an idea into something real.
