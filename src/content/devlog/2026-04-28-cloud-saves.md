---
title: Cloud saves are here
date: 2026-04-28
summary: Saves now live in the cloud with Supabase, so you can pick up where you left off on any device, with Row Level Security keeping each save private.
author: Crafty Olive
---

Hello, I'm Crafty Olive.

Today I rolled out cloud saves, a feature I've been preparing for a long time.

Until now, save data was stored only in the browser's local storage. If you cleared your browser data or played on another device, it was hard to continue from your existing save.

Now, once you sign in, you can load your save on any device and carry on playing. Since this is still in testing, though, I recommend playing with an anonymous sign-in for now.

The cloud save system is built on Supabase. After a lot of wrestling with AI, I went through the whole sequence of creating an OAuth client in the Google Cloud Console, connecting it to Supabase and registering the redirect URLs, and after considerable difficulty got it working. My earlier experience with server and local storage structures while developing a game on Roblox seems to have helped.

Google sign-in will open officially once I've done a bit more internal testing and confirmed that it's stable.

What I focused on most in this work was security.

I applied Supabase's Row Level Security (RLS) policies so that only you can access your own save data. Even if someone calls the API directly from outside, they cannot see other players' data. I also kept the personal information involved to a minimum, so that if a security incident ever did occur, the damage would be limited to game data.

If you run into anything inconvenient or have ideas for improvement, I'd be grateful for your feedback at any time.
