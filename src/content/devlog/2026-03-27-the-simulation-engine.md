---
title: The simulation engine behind the game
date: 2026-03-27
summary: A tour of the engine so far, from the tick order and heat balance to the nitrogen cycle, plants and algae, genetics and the energy economy.
author: Crafty Olive
---

Hello, I'm Crafty Olive.

These days it feels as if I spend every commute and every break glued to my phone or computer, vibe coding. Thanks to that, the core engines are now roughly in place, and my focus has shifted to quests, collecting and rewards, the things that make the game feel more like a game.

Partly to organize my own thinking about what I've built so far, I'd like to give an overview of the game's engine.

## 1. The simulation engine

The current structure runs in a fixed order every tick. Heat is calculated first, then biological reactions such as algae and plants, then chemical reactions such as the nitrogen cycle and pH, and finally the oxygen pump makes its correction before each organism's state is updated.

This order matters a great deal, because it isn't just a calculation sequence; it determines cause and effect. If algae are calculated first, for example, the light reaching the plants decreases. When the diminished plants then consume nitrogen, the leftover nitrogen changes, and when nitrification proceeds from that state, the change in pH is different. In the end, what gets calculated first changes the result. (Admittedly, the difference isn't huge.)

## 2. The heat balance model

Starting with the physical model, the foundation is a simple one-zone thermal model. It treats the whole tank as a single thermal mass and calculates its temperature from the balance of heat coming in and going out.

In building energy modeling, walls have a larger thermal storage effect than the indoor air, which calls for fairly complex simulation methods. In a tank, however, the walls' thermal storage is negligible compared with that of the water inside. The model can therefore be simplified as follows:

```
T(t+Δt) = T(t) + (Δt / C) · [ Q_in − UA · ( T(t) − T_a ) ]
```

Here, T(t) is the water temperature and T_a is the ambient temperature, which comes from TMY (typical meteorological year) data. C is the heat capacity of the water, and UA is the overall heat loss coefficient of the tank. Solar gain is not included; the lighting takes its place. Q_in therefore covers the heat supplied by heating and cooling equipment, the heat from the lights and so on.

## 3. The lighting system

Lighting is where it gets interesting. Most games use lighting simply as a brightness effect, but here I took a few more factors into account. The light affects three things at once: it provides the light that drives plant and algae growth, it generates heat that raises the tank temperature, and it adds to the electricity bill.

In other words, changing a single light changes the ecosystem, the temperature and the economy all at once.

## 4. The chemistry model

The chemistry model starts with the production of NH₃ and NH₄⁺ from the shrimp's metabolism and the decay of organic matter.

My model also keeps NH₃ and NH₄⁺ separate. NH₃ is highly toxic, while NH₄⁺ is relatively safe, and the ratio between them shifts constantly with pH and temperature. So every tick, the two are redistributed based on pH. Once this is in place, a structure emerges automatically in which toxicity rises as pH rises and falls as pH falls. No separate toxicity logic is needed.

I also didn't treat the nitrogen cycle as a simple purification system. In reality, the conversion of NH₄⁺ through NO₂ to NO₃ consumes oxygen and produces acid. It cleans the water while making the environment worse at the same time.

Without this, the game becomes too easy. You never get the situation you see in real tanks, where everything seems to be running well until pH suddenly drops and the system collapses. So I made sure nitrification produces acid and consumes oxygen. As a result, pH constantly tends to fall, and photosynthesis by plants and algae, along with HCO₃⁻ buffering, pulls it back up. The tank is always caught in a tug-of-war between the force pushing it toward acidity and the force trying to restore it.

Dissolved oxygen (DO) has a saturation concentration that depends on temperature and cannot rise above it. So I structured every oxygen gain to approach the saturation value asymptotically. Without this, DO climbs to abnormally high levels and the biological logic breaks down. The oxygen pump is not a simple on/off switch either; it follows a first-order response, adding oxygen in proportion to the gap between current and saturated DO. I also added hysteresis to its control so that the pump doesn't keep switching on and off.

## 5. The plant and algae model

The biological model is essentially the heart of the system. Plants and algae compete for the same resources: both need light, both consume nitrogen and both affect oxygen. Their characteristics differ, however.

Plants need light to grow properly, prefer NH₄⁺ and are sensitive to pH. Algae, on the other hand, self-shade: as their population grows, they block their own light and take away light the plants would use. They also respire constantly, so they keep consuming oxygen.

When these two systems intertwine, a feedback loop forms. More algae means fewer plants; fewer plants leaves more nitrogen behind, which means even more algae. Once the balance breaks, it keeps collapsing in the same direction.

## 6. The genetics system

Shrimp traits come in four types: color (red, blue, yellow, black and brown), transparency, coverage and pattern (Rili, backline and speckle). Breeding different shrimp mixes these traits and passes them on to the next generation.

Without mutation, the population would eventually converge on a particular form, so small variations occur at a low probability to keep new combinations appearing. Later, I plan to add Bee shrimp as well. (Bee shrimp will breed only with other Bee shrimp.)

## 7. The game economy

The economy is essentially an energy cost game. The heater runs on gas, while the lights and the pump run on electricity. The player has to pay to keep the equipment running, and keeping the tank stable earns income through quests and rewards.

The structure is simple: investing in equipment increases stability, greater stability means more shrimp survive, and that in turn leads to income. It mirrors the way a real HVAC system is operated. I also built in the trade-off in which efficient equipment costs more up front but pays off in the long run.

## Why I enjoy it

What makes this system fun for me is that everything is connected. Changing the lights doesn't just change the temperature; it changes the ecosystem, the pH and the costs. No choice ends with a single effect.

Above all, there is no single right answer. Too much algae and the tank fails; no algae and nitrogen builds up; too few plants and oxygen becomes a problem. There is always a trade-off. The greatest joy of all is that even I don't know which way of managing the tank is best.
