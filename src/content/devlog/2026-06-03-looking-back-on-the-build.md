---
title: "Looking back: 1,000 commits and 66,000 lines"
date: 2026-06-03
summary: "A step-by-step look back at how Shrimprium was built, from the first physics model to logic blocks, and the AI tools used at each stage."
author: Crafty Olive
---

Hello, I'm Crafty Olive.

As the game gets close to its app release, I've reached the point where only loose ends remain. That has freed up a bit more time than before, and with it the chance to focus more on writing.

I'll have even more time once the project is finished, but by then I suspect my motivation to write will have faded and my memories will have blurred. Since this is also meant as a reference for future projects, now felt like the right moment to look back on how the game was made.

Pushing ahead with vibe coding, by brute force, I've passed 1,000 commits on GitHub. The game code is about 50,000 lines and my own test code about 16,000, for a total of roughly 66,000 lines.

In the past, it would not have been easy for a solo developer to carry a project of this size.

So here is how the game was built, in order.

## 1. The physics model and a tank MVP

My coding skills are basically at a beginner level. I could force things to work with conditionals and loops, but I wouldn't have dared to attempt optimization or a complex project.

When I got into vibe coding, I asked GPT to recommend tools, and with GPT's help I also set up a way to link GitHub and check results on the web. The tool it recommended at the time was Cursor.

The first thing I started on was a tank with moving shrimp and a simulation model that calculates the tank's energy balance. Working with Cursor, it took about four to five hours. The code itself came out quickly, but verifying and debugging it took much longer. I only wrapped it up after doing the calculations myself, comparing them with the simulation results and confirming that they were reasonably consistent.

I was able to finish relatively quickly because I had already been through days of trial and error on a building energy simulation project in Roblox.

## 2. Better tank rendering, shrimp as objects, and linking the model

The earliest shrimp were simple circles drifting in the water. They had no life to them at all; they looked more like floating balloons.

Wrestling with Cursor and GPT didn't improve them much, so in the end I turned to Gemini.

Gemini gave me an early shrimp model drawn on a JavaScript canvas, split into antennae, body and tail, and I refined the movement of each part little by little with Cursor.

Meanwhile, the energy model and the shrimp were at first completely disconnected. The shrimp just wandered around at random while the energy model ran separately on its own. The game's goals required the shrimp to be affected by things like water temperature, so I started linking the two.

I gave each shrimp an ID and HP, and made their health drain gradually when the temperature was too low or too high. I added feeding at the same time, so that health would drop when fullness fell below a certain level.

## 3. Adjusting the simulation tick

In the early prototype, both the simulation and rendering ticked 60 times per second. That's good for smooth shrimp movement, but it was obviously going to be a problem the moment I added a server.

A game where hit detection precision matters, like an FPS, might justify that cost, but my game had no reason to spend that much on servers.

So on the client side I separated the simulation tick, at five times per second, from rendering, at 60 times per second. I limited the data sent to the server to the simulation state and set the upload interval to once every 60 seconds.

## 4. Water quality modeling and plants as objects

I had some experience with energy modeling, but water quality was different. So many factors are intertwined that even planning it took a great deal of care.

The first thing I considered was ammonia produced by the shrimp and their food. Fortunately, there were relevant papers and regression equations, which let me take the first step in modeling water quality.

Ammonia ionizes depending on pH, setting its ratio with ammonium, and ammonium is consumed by plants, microalgae and nitrifying bacteria. Alongside the water quality model, I also implemented plants and microalgae in the game.

Plants became objects like the shrimp, growing according to how much ammonium they absorb, while microalgae and nitrifying bacteria are represented by concentration. I also built into the simulation the structure in which nitrifying bacteria convert ammonium to nitrite, and nitrite in turn feeds another group of nitrifying bacteria.

Along the way, oxygen consumption became part of the picture, and I also had to account for dissolved oxygen rising from photosynthesis by plants and microalgae. The result was a model in which temperature, ammonia, ammonium, pH, nitrite, nitrate, oxygen, nitrifying bacteria, microalgae and lighting all influence one another.

For scientific rigor, I selected nine of the papers GPT recommended and extracted what I needed from them. I tuned the game balance through the number of shrimp and the size of the tank, so that water quality management would be neither too easy nor too hard.

## 5. Equipment modeling

I added a heater, a cooler, lighting and an air pump, each controllable on and off. Applying the market prices for electricity and gas at the time, I built a structure in which energy costs are deducted according to each device's efficiency.

At that point I was positioning the game as an educational game for experiencing energy modeling, so I put a lot of effort into temperature control for the heater and cooler and into graph visualization. Using offset control, I wanted to show the equipment cycling on the graph and let players see for themselves the energy savings that come from temperature control.

I found this fun, but I suspected it wouldn't click for someone new to the game. So from this point on, I began shifting toward something more like a game.

## 6. Graphics for a game

The basic engine was in place, but it still didn't feel like a game. I considered using a commercial game development platform, but learning a new tool was a burden, so I decided to put sprites on top of what I had already built.

I tried several automated pixel art tools, but while they made human sprites well, they struggled with shrimp. In the end, I drew the shrimp and plants pixel by pixel myself.

Since I couldn't make every sprite in the game myself, I used Twemoji emoji assets for hotkeys and shrimp emotions.

What I focused on in particular was automating asset production. For example, I wrote a Python program that creates new assets by recoloring the shrimp assets I had made, and another that pixelates drawings of equipment to generate thumbnails.

## 7. Quests and levels

Someone who knew the game well might find their own kind of fun in it, but that was hard to expect from new players. Hand a long wall of instructions to someone who came to play casually, and they'll leave right away.

So I designed a structure of instant rewards and gradual learning through quests. GPT implemented this part fairly smoothly, so it went ahead without much difficulty.

## 8. Refactoring and a testing structure

By this point the game had become quite complex, and the code was a real mess. With more than 10,000 lines in a single file, efficiency dropped and maintenance grew difficult.

The AI tools were spending far too many tokens just grasping the context of a file, and every time I touched the code, the game would fail to boot or strange bugs would appear.

At this point I brought in Claude Code to split the files by feature, and built a structure that runs tests for each separated feature to verify that no errors creep in.

Refactoring consumed an enormous number of tokens. Had I structured things well from the start, it wouldn't have come to this, but I paid the full price for pushing ahead with vibe coding blindly. Still, errors dropped noticeably afterward, and token usage clearly went down too.

## 9. Adding gameplay

I enjoyed both making the game and playing it myself, but there was no guarantee other players would feel the same.

So I started adding all sorts of features on top of the existing engine. Watching the shrimp alone felt a little dull, so I tried putting famous paintings in the background and taught the shrimp to perform tricks. I also added platform blocks the shrimp can climb onto and sit on, adding elements of interaction.

The game felt a bit more like a game, and I thought that once I added a server, it would be finished in no time. That, of course, was a miscalculation.

## 10. Connecting to the cloud

Adding a server to a game built for local play raised countless questions. Thanks to Roblox, I understood local and server concepts to some extent, but attaching a server to a web game myself was a whole different level of difficulty.

Things that had worked perfectly locally all caused problems at once. Which parts the client should handle and which the server should, cheat prevention and security, and how and how often to save all emerged as new challenges. They were areas I couldn't easily check by eye, which made them even harder.

For this stage, I used Claude to plan and Codex to write the game code and SQL. Because Supabase shows the data structure as tables, I could overcome some of the vagueness of backend development. I also added a step of checking server-related issues on a Cloudflare dev page after every change.

## 11. Community features

With the Supabase-based server in place, building the community was relatively smooth. There was some early confusion, though: I first planned for players to meet each other, then switched to visiting each other's tanks.

To minimize security issues, I avoided having guests connect directly to the host's live tank. Instead, the host uploads a snapshot of the tank to the server and guests visit that, which prevents hacking and forgery. Most of the time after that went into settling the rendering rules, screen rules and shrimp movement rules for community tanks.

My top priority was also to prevent people from planting malicious code in community tanks, overloading other players' devices with abnormal values, or stealing other players' data.

## 12. Logic blocks

Once the community features were done, I wanted even more from the gameplay. Extending the existing platform feature, I implemented logic blocks that switch on and off when a shrimp steps on them, and perform various functions based on that signal.

With Minecraft as an excellent precedent, Claude quickly came up with a good plan, and I extended my existing sprite production program to create the related assets as well.

Players can now build contraptions such as self-holding circuits and interlock circuits, which I find a lot of fun. I also plan to extend this into automation devices for tank management.

## 13. The tools used to make the game

| Task | Tool |
|---|---|
| Initial game planning | ChatGPT |
| Early prototype | Cursor |
| Image prototypes | Gemini |
| Energy model | Cursor |
| Water quality model | Cursor |
| Refactoring | Claude |
| Automated sprite generation | Claude |
| Server connection | Supabase |
| Sign-in and authentication | Supabase |
| Server planning | Claude |
| Server features | Codex |
| Server feature testing | Cloudflare |
| Quick hotfixes | GitHub Copilot |
