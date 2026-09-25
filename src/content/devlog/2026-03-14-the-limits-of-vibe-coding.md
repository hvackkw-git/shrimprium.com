---
title: The limits of vibe coding, as I found them
date: 2026-03-14
summary: AI builds the structure quickly, but balancing heat and water quality until they feel right is still slow, hands-on human work.
author: Crafty Olive
---

From the outside, my game might look like something I threw together quickly with AI. Look inside, though, and that is far from the case.

The part I wrestled with longest wasn't the graphics or the UI. It was the heat balance and the water quality balance.

Working on them, I saw the limits of vibe coding far more clearly than its strengths.

That is what I want to talk about today.

## 1. AI builds the structure, but not the balance

Vibe coding still surprises me all the time. UI scaffolding, basic interactions and even simple system architecture, things that once would have required an expert, AI now proposes in moments.

It helped me a great deal, too. With AI, the early prototype of the shrimp game took shape much faster.

At a certain point, though, progress slowed dramatically.

That point was where I had to judge whether the numbers actually made sense.

For example:

- At what water temperature should shrimp survival take a real penalty, and how large should it be?
- In what ranges should pH, NH₃, NO₂, NO₃ and DO each count as dangerous?
- When algae and bacteria push pH in opposite directions, which should win for the result to feel natural?
- Should all the oxygen produced by plants go straight into DO?
- Does the system settle down over time, or does it spiral out of control?

These were a completely different kind of problem from writing code.

AI can suggest plausible formulas here. But how those formulas actually feel in the game, and whether they are both fun and convincing to play, is something a person has to check, one by one.

## 2. The hardest part wasn't implementation, it was tuning

When people talk about vibe coding, they tend to emphasize how much faster development has become.

That's true. But in actually making a game, I found that what consumed the most time was, surprisingly, not adding features but tuning them.

The water quality system is a good example.

Temperature, pH, ammonia, nitrite, nitrate and dissolved oxygen each look simple on their own. The moment you put them in the same tank, they start affecting one another.

Raise one value slightly and another collapses. Push for realism and the game becomes too punishing; push for playability and it drifts too far from real ecology.

Asking AI to "balance it sensibly" didn't solve any of this.

In the end, I had to do it myself:

- change a value slightly,
- run the simulation,
- look at the result and fix anything that seemed off,
- run it again,
- make it harder if it was too easy,
- and ease it off if it was too harsh.

I repeated that cycle over and over. Adding an in-game debug panel and adjusting the numbers one at a time was, quite literally, grinding manual labor.

## 3. AI gives good average answers, but the world I want isn't average

AI's answers are generally sound on average, which makes them genuinely useful when you're getting started.

The problem was that the game I wanted to make isn't an average example project.

I didn't want a decorative aquarium game. I wanted a tank where you can feel ecological interactions to some degree, where the player has to make judgments, and where things really can fall apart when conditions go wrong, much like cycling a real tank.

A system like that has no single fixed right answer.

Make it too close to reality and it may stop being fun; make it too game-like and it stops being convincing.

In other words, what mattered wasn't "correct code" but a sense of feel and intuition.

This is where AI's limits clearly showed.

AI is good at completing sentences, organizing structure and writing very plausible functions.

But it could not make judgments like these for me:

- Does this tank feel alive right now?
- Is this warning system unfair to the player?
- How much failure teaches something, and how much is just frustrating?

## 4. Vibe coding doesn't eliminate development; it makes its essence clearer

At first, I too thought AI would take care of more than 90 percent of the work.

In the early stages, it really does feel that way. Code arrives quickly, screens come together fast, and something takes shape with a far lower barrier to entry than before.

At some point while making the game, though, I realized something.

The truly hard part isn't making something that doesn't exist yet. It's making what you've made convincing.

In a game or a simulation, what users face in the end is not the code but the results.

Making those results believable, fun and alive was still a human job. That is why I'm still thinking hard about this part.

## Closing thoughts

I still believe vibe coding is an extremely powerful tool. For making a game on your own, experimenting quickly and building prototypes, it helps enormously.

Through this work, though, one thing became clear to me:

AI gets you started remarkably fast. But it won't carry you to the finish.

Especially in areas like heat balance and water quality balance, where many factors are intertwined and both realism and playability are required, what decided the final quality was persistent human observation and repeated adjustment.

So through this process, I came to feel that vibe coding doesn't so much replace people as show more clearly what people really need to do.

And perhaps this shrimp game, too, is slowly coming to life on top of all that grinding work.
