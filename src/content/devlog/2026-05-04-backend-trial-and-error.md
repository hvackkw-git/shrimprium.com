---
title: Trial and error in building the backend
date: 2026-05-04
summary: What a non-developer learned from cloud saves and sign-in: think in analogies, split the flow into gated steps, and never stop testing.
author: Crafty Olive
---

Hello, I'm Crafty Olive.

While implementing cloud saves, server integration and sign-in, I've been battling countless bugs. I'm not a developer in this field to begin with, so I'm learning by running into walls and breaking things, again and again.

Still, it occurred to me that if there are others like me, people from non-developer backgrounds who are vibe coding, it might be worthwhile to share the trial and error I've been through and the way I work.

## 1. Working through analogies

If I had to use an analogy, the relationship between local and server is like that between a personal ledger and a central vault.

Local is the personal ledger you hold in your hands. The server is closer to a central vault that stores copies of that ledger, or gathers and keeps many ledgers together.

Many things can go wrong in this arrangement.

For example, someone could tamper with a personal ledger and then deposit the false information in the vault. Or a ledger could be stolen or peeked at, or an old ledger could overwrite the latest one.

So you need various safeguards to prevent this.

This is where terms such as snapshots, CRC32, server authority, synchronization, rollback, sessions and tokens come in. I learned these concepts one at a time as I worked.

But having never done backend development, I found approaching everything through this jargon from the start overwhelming. So I tried to understand every task by translating it into an analogy wherever possible.

For example, I understood:

- "Save to IndexedDB" as "put the ledger in a personal safe inside the browser."
- "Server sync" as "check my ledger against the one in the central vault."
- "CRC32 check" as "compare the seal values to confirm the ledger hasn't been torn or tampered with."

(Of course, AI helped me a lot in coming up with these definitions, too.)

Learning and using the technical terms properly would be ideal, but there was a limit to how much I could study while also doing the work. So I asked AI to explain things through analogies as much as possible, and the work itself proceeded on that basis. For me, this approach was quite effective.

## 2. Splitting the steps and adding gates

For a non-developer, what makes the backend especially hard is that its features are intricately interlocked and the processes behind them are invisible.

On the surface, "sign in," "save" and "load" look like simple steps, but inside the code a great many processes flash by in an instant.

Signing in alone, for example, involves a chain of steps like this:

User check → session check → local data check → server data check → merge decision → storage access → screen transition → exception handling

The problem is that whichever of these steps fails, all you see on the surface is that sign-in doesn't work. In some cases, things go wrong yet pass as if they'd succeeded; in others, the problem turns out not to be in my code at all but in the browser or the environment.

I spent an enormous amount of time on this.

In the end, I concluded that you shouldn't try to solve a complex algorithm all at once.

So I split the flow where a bug occurred into several steps and created a gate for each one.

For example:

1. Was the sign-in button pressed?
2. Was a Supabase session created?
3. Did IndexedDB open correctly?
4. Does local data exist?
5. Does server data exist?
6. Was a decision made about which data takes priority?
7. Did the final save succeed?
8. Did the screen transition correctly?

Each step has to succeed before the flow moves on to the next. (When I asked GPT, it told me that professional developers use a similar approach.)

That way, if a problem occurs midway, I can see immediately which step it stopped at.

I didn't write this gate structure myself, of course; I had AI build it.

This approach worked remarkably well.

Through it, I found and worked around a problem in iOS Safari/WebKit in which `indexedDB.open()` hangs in a pending state right after an OAuth redirect. (It was a persistent iOS bug and didn't occur in Chrome or other browsers.)

At first I assumed my code was at fault. But once I had gates checking each step, I could see that the code reached a certain step normally and then stalled when accessing browser storage.

If I had simply thought, without gates, that the whole codebase was acting strangely, I don't think I would ever have found the problem.

AI is undeniably powerful in vibe coding, but as the project grew more complex, there were many moments when the AI lost the context and became, frankly, useless.

When solving problems like this, what mattered was not leaving everything to AI, but breaking the problem into small pieces so that the AI wouldn't make mistakes. I had felt the same thing when implementing the simulation in Roblox.

## 3. Endless QA

As Shrimprium changed from a local game to a server-based one, the number of cases to test grew exponentially.

Google sign-in alone, for example, creates branches like these:

1. Signing in from the sign-in screen with a new Google account
2. Signing in from the sign-in screen with an existing Google account
3. Switching from anonymous play to a new Google account
4. Switching from anonymous play to a Google account that already has data
5. Signing out after signing in with a Google account
6. Accessing the same Google account from different devices
7. Saving on an unstable network
8. Closing or refreshing the browser during a save

And each of these splits further into its own sub-branches.

At first I thought of it as just adding a sign-in feature, but in practice it meant fitting together a complex logical structure.

So these days, when I build a feature, I don't move straight on to the next one. I keep repeating QA.

The process is truly tedious, and at times it feels like being ground down. But I've come to feel that in a server-based game, this work is essential.

Until the game is officially released, I expect this kind of QA to continue for at least another month.

## 4. Closing thoughts

I used to feel that with vibe coding, a game would come together quickly as long as you had an idea.

And thanks to AI, I really have been able to implement features I could never have built on my own. If I had learned development the traditional way, I doubt Shrimprium would have come this far.

At the same time, Shrimprium hasn't been built by AI alone.

Defining the problem and deciding how to solve it was still a human role. That was true not only in the domain I know well, but also in areas of development I know little about.

Judging from how I've used AI so far, it is less a replacement for people, developers or not, and more a tool that amplifies the abilities people already have.

I fight bugs with AI every day, and when I hit a really hard one, I feel at a loss.

Even so, as I break the problems down, understand them and fix them one by one, I feel I'm making progress, little by little. If you're also learning by running into walls, as I am, I hope this post helps, even a little.
