---
title: "Inside the Simulation Core (1) - Energy"
date: 2026-04-20
series: simulation-core
summary: "Why I chose a demanding 1 L tank, and how I want heat, equipment and weather to connect to the life inside it."
author: Crafty Olive
---

Hello, I'm Crafty Olive.

The tank can look quiet while quite a lot is happening inside it. A heater, a light and a change in the air outside all belong to the same question: what happens to the water?

That is the part of Shrimprium I want to write about here. I want temperature to connect the equipment to the living things in the tank, so that choosing a device means thinking about more than one number.

## A deliberately small tank

I chose a water volume of 1 L. That is very small for ten shrimp, and the difficulty is intentional. I wanted a little tension in keeping the tank stable, especially for players who keep many shrimp.

This is a choice about the game. It is not a recommendation for the size or stocking density of a real aquarium.

For the calculation, a litre can be represented by a water volume 12.5 cm long, 10 cm wide and 8 cm deep. Those dimensions give a surface area of 0.0125 square metres. The dimensions on the screen are a separate matter; the picture does not have to be a scale drawing of that small box.

<figure class="energy-figure" aria-labelledby="geometry-caption">
<p class="energy-figure-label">01 / Calculation geometry</p>
<img src="../../images/devlog/2026-04-20/tank-dimensions.svg" width="640" height="410" alt="A rectangular 1 L water volume: 12.5 cm long, 10 cm wide and 8 cm deep; water surface area 0.0125 square metres." loading="lazy" />
<figcaption id="geometry-caption">One litre of water. Schematic, not to scale; these are calculation dimensions, not screen dimensions.</figcaption>
</figure>

The useful thing about giving the water a volume is that heat has something to act on. The same amount of heat makes a smaller body of water change temperature more quickly. That gives the small tank a reason to be demanding beyond simply displaying a smaller number.

## Following the heat

I am treating the water as one body with one temperature. That leaves out the warmer and cooler pockets a real tank might have, but it gives the different systems a common place to meet.

The idea is to collect the heat entering and leaving the water: a heater adds it, a cooler removes it, and a light contributes part of its energy. The surroundings can push the temperature in either direction. Evaporation carries heat away.

<figure class="energy-figure" aria-labelledby="heat-caption">
<p class="energy-figure-label">02 / Heat flows</p>
<div class="energy-water-node"><strong>One water temperature: Tw</strong><span>Effective heat capacity C = 5023.2 J/K at default settings</span></div>
<ul class="energy-heat-grid">
<li><span class="energy-term energy-in">+ Qheater</span><strong>Heater &rarr; water</strong><span>Heat added from the active heating device.</span></li>
<li><span class="energy-term energy-out">&minus; Qcooler</span><strong>Water &rarr; cooler</strong><span>Heat removed; heat rejection to a room is not modelled.</span></li>
<li><span class="energy-term energy-in">+ Qlight</span><strong>Light &rarr; water</strong><span>Only the modelled water-transfer share becomes a thermal input.</span></li>
<li><span class="energy-term energy-out">&minus; Qevap</span><strong>Water &rarr; evaporation</strong><span>Latent heat loss; water volume and depth stay unchanged.</span></li>
<li class="energy-wide"><span class="energy-term">&minus; UA &times; (Tw &minus; Ta)</span><strong>Surroundings &harr; water</strong><span>Heat enters when Ta &gt; Tw, and leaves when Tw &gt; Ta.</span></li>
</ul>
<figcaption id="heat-caption">All Q terms are rates in W. The surroundings use weather-file temperature directly. Solar heating, pump heat and a separate room model are not connected.</figcaption>
</figure>

I keep the boundary fairly simple: the weather temperature acts directly on the tank. There is no separate room calculation between the two. Even when the artwork places the tank inside a house, the model leaves out the house's insulation, thermal mass and air conditioning.

For evaporation, I am focusing on the heat carried away from the water. The calculation uses the difference in vapour pressure between the water surface and the surrounding air. It cools the tank, but the water level stays the same. Letting evaporation lower the water level would also change the heat capacity and the concentration of dissolved substances; those effects are outside this model.

## Giving the surroundings a rhythm

For the weather input, the model uses a stored Seoul TMY file. A Typical Meteorological Year is a representative year of hourly weather, rather than today's conditions or a forecast. I can use that as a changing background for the tank without making the game depend on live weather.

The file has 8760 hourly records: 365 days multiplied by 24 hours. Game time selects a position in that year, and linear interpolation fills in the space between hours. At half past the hour, the input is halfway between the adjacent samples.

<figure class="energy-figure" aria-labelledby="weather-caption">
<p class="energy-figure-label">03 / Weather to thermal input</p>
<ol class="energy-steps">
<li><span class="energy-step-number">1</span><strong>Stored TMY file</strong><span>8760 hourly records<br />365 days &times; 24 hours<br />Typical-year data, not a live forecast.</span></li>
<li><span class="energy-step-number">2</span><strong>Map game time</strong><span>Use tank 1&rsquo;s calendar and clock to obtain a minute of the year. Discard seconds; no time-zone conversion.</span></li>
<li><span class="energy-step-number">3</span><strong>Interpolate samples</strong><span>Linear interpolation between adjacent hours. At 00:30, take their midpoint.</span></li>
<li><span class="energy-step-number">4</span><strong>Use Ta and RH</strong><span>T_dry (&deg;C) &rarr; boundary heat exchange.<br />rh01 (0&ndash;1), Ta and Tw &rarr; evaporation.</span></li>
</ol>
<div class="energy-figure-note">T_wet and GHI are returned but unused by the thermal calculation. DNI and DHI are not returned. No solar heat input is connected.</div>
<figcaption id="weather-caption">Normal gameplay clamps days above 365 to December 31; the analysis runner wraps yearly. The final sample is held.</figcaption>
</figure>

Temperature and humidity have different jobs. Air temperature sets the direction of heat exchange with the surroundings. Humidity helps determine how readily water can evaporate. Together, they give the tank something more varied to respond to than a single fixed ambient temperature.

## Equipment is more than its power rating

A device's energy use and its effect on the water need to be separate. For a heater or cooler, the useful quantity is how much heat is added or removed for the energy it consumes. For a heat pump, a ratio above one represents heat moved from somewhere else, not energy created from nothing.

Lighting makes the distinction especially clear. Electrical power, the brightness used by plants and algae, and heat entering the water are three different quantities. A more power-hungry light does not automatically have to be the best choice for the tank.

For example, I represent the basic fluorescent light with a 9 W input, assign 22% to optical energy, and transfer 20% of the remaining heat to the water. That gives 1.404 W of thermal input. The plant model receives a separate brightness factor; it is not deriving photosynthesis from a measured photon flux.

I keep some of these connections deliberately separate. Air pumps affect oxygen and electricity use, but pump heat is not part of the water's heat balance. The cooler's rejected heat does not warm a simulated room. The remaining lighting energy is not fully traced to its final destination.

## Bringing temperature back to the shrimp

Temperature is interesting to me because it reaches beyond temperature. Oxygen saturation, the balance of ammonia species, nitrification and algae growth all depend on it. That is where the equipment choices begin to touch the rest of the tank.

<figure class="energy-figure" aria-labelledby="update-caption">
<p class="energy-figure-label">04 / Temperature to water quality</p>
<ol class="energy-steps">
<li><span class="energy-step-number">1</span><strong>Assemble heat rates</strong><span>Heater, cooler, light, UA and evaporation.<br />Normal step: dt = 450 s.</span></li>
<li><span class="energy-step-number">2</span><strong>Calculate raw temperature</strong><span>Semi-implicit UA update. Evaluate evaporation using the temperature at the start of the step.</span></li>
<li><span class="energy-step-number">3</span><strong>Apply temperature limits</strong><span>4&deg;C/game hour, or 0.5&deg;C per normal tick; absolute range 0&ndash;40&deg;C. Heater/cooler setpoint guards: 22&deg;C / 24&deg;C.</span></li>
<li><span class="energy-step-number">4</span><strong>Feed the water-quality model</strong><span>Oxygen saturation, ammonia partitioning, nitrification rates and algae growth depend on the resulting temperature.</span></li>
</ol>
<div class="energy-figure-note">Energy clipped by the limits is not reassigned. Biological and chemical reaction heat does not feed back into the thermal balance.</div>
<figcaption id="update-caption">Heat changes the water temperature; that temperature then affects the living systems. Temperature limits mean the update does not conserve every joule.</figcaption>
</figure>

There is a game-design compromise here, too. Temperature limits and device setpoints keep the numerical update within bounds, but clipping a temperature change does not preserve every joule of the original heat input. The model should not be presented as a strict energy-conservation calculation or used to choose equipment for a real aquarium.

What I want is a tank whose parts make sense together: a small volume, changing surroundings, equipment with different costs and effects, and living things that respond to the resulting water conditions. Keeping those connections understandable matters as much as adding another variable.

---

<details class="energy-technical">
<summary>A closer look at the numbers</summary>

### Turning a litre into a tank

Here is how I connect that small volume to the rest of the calculation. These dimensions and equipment values are settings for the game, rather than measurements of a physical aquarium.

I use the same default water volume and calculation dimensions for tanks 1 through 4.

<div class="energy-table-scroll" role="region" aria-label="Data table 1; scroll horizontally if needed" tabindex="0">

| Property | Default for each tank |
|---|---:|
| Water volume | 1 L = 0.001 m³ |
| Length | 12.5 cm |
| Width | 10 cm |
| Water depth | 8 cm |
| Water surface area | 0.0125 m² |
| Bottom area | 0.0125 m² |
| Front and rear wall areas | 0.010 m² each |
| Left and right wall areas | 0.008 m² each |
| Combined area of the four walls | 0.036 m² |

</div>

I describe the tank using its water volume, height and length-to-width ratio. Dividing volume by height gives the base area; a ratio of 1.25:1 then gives the two horizontal dimensions.

In SI units, the calculation is:

```
V = volume in litres / 1000
Base area = V / H
Width = √(Base area / 1.25)
Length = 1.25 × Width
```

The tank's on-screen pixel dimensions are separate from these calculation dimensions. Adding rocks or substrate does not displace water in the model or change its heat-transfer area.

### How much heat changes the water temperature?

I calculate heat capacity from water mass and specific heat capacity, using a density of 1000 kg/m³ and a specific heat capacity of 4186 J/(kg·K). For 1 L of water alone, a temperature change of 1°C therefore corresponds to 4186 J.

I also use a heat-capacity multiplier as a game stat. Its default value is 1.2, giving an effective heat capacity of **5023.2 J/K**. Increasing the heat-capacity stat makes temperature change more slowly for the same heat input. It does not increase the water volume.

Putting the heat inputs and losses together gives this balance. Each Q term is a heat-transfer rate in watts:

```
C × dTw/dt = Qheater − Qcooler + Qlight
             − UA × (Tw − Ta) − Qevap
```

Here, C is effective heat capacity in J/K, Tw is water temperature, Ta is the surrounding air temperature, and UA is the combined heat-transfer conductance in W/K. The environmental term can either remove heat or add it, depending on the temperature difference.

At normal speed, the game requests one update every real second. Each update, or tick, advances game time by 7.5 minutes. The thermal calculation converts that interval to **450 seconds**, keeping watts, joules, and heat capacity consistent.

For the temperature update, I treat the exchange with the surroundings semi-implicitly:

```
Qin = Qheater − Qcooler + Qlight

T1raw = [T0 + (dt/C) × (Qin + UA × Ta − Qevap)]
        / [1 + (dt/C) × UA]
```

Evaporation is evaluated using the temperature at the start of the step. Temperature limits are applied after this calculation.

### Weather input: the Seoul TMY file

The external temperature and humidity come from a stored Seoul TMY weather file. TMY stands for **Typical Meteorological Year**: a year of hourly weather data assembled to represent longer-term climatic conditions. It is distinct from live weather observations or a forecast.

The stored weather data contains **8760 records: 365 days × 24 hours**. Each record contains six numeric fields.

<div class="energy-table-scroll" role="region" aria-label="Data table 2; scroll horizontally if needed" tabindex="0">

| Field | Meaning and current use |
|---|---|
| `T_dry` | Dry-bulb temperature, used as the surrounding air temperature in °C |
| `rh01` | Relative humidity as a fraction from 0 to 1, used in evaporation |
| `T_wet` | Wet-bulb temperature field; interpolated and returned by the loader, but not used by the thermal calculation |
| `GHI` | Solar-radiation field; interpolated and returned, but not connected to solar heat gain |
| `DNI` | Solar-radiation field stored in the file but omitted from the loader's returned result |
| `DHI` | Solar-radiation field stored in the file but omitted from the loader's returned result |

</div>

The stored dry-bulb temperatures range from −12.7 to 34.3°C, and relative humidity ranges from 0.13 to 0.99. The radiation-field units are not specified in the file.

Only **dry-bulb temperature and relative humidity** feed the tank's thermal model. Temperature determines heat exchange with the surroundings. Temperature and humidity together determine the vapour-pressure difference used for evaporation. Solar heat gain is not included.

The loader treats the first record as January 1 at 00:00. It converts the first tank's game date and time into a minute of the year, then linearly interpolates between adjacent hourly samples. At 00:30, for example, it uses the midpoint between the 00:00 and 01:00 values. Weather lookup operates at whole-minute resolution, so the seconds component is discarded after conversion to minutes.

The initial state includes an `Asia/Seoul` label, but the weather loader does not perform a time-zone conversion.

The regular game and the fast-forward analysis handle the end of the year differently. In normal gameplay, the day value is clamped to 365. From day 366 onward, the game therefore reuses **December 31's hourly profile**, rather than returning to January 1. The separate fast-forward analysis runner wraps the minute-of-year value across a 365-day cycle. Within the loader, the final hour holds the last sample rather than interpolating across to the first sample of the next year.

Before weather data is available, the normal tick uses the existing environment temperature, or 24°C if that value is invalid, with relative humidity set to 0.55. The weather lookup and the fast-forward analysis fall back to 24°C and 0.55. The game does not replay missed weather and temperature changes after the app has been closed.

### The boundary around the tank

There is no separate room-temperature calculation. The weather file's dry-bulb temperature becomes the temperature directly outside the tank. Although the tank may appear inside a house on screen, the model does not simulate the room's insulation, thermal mass, heating, or air conditioning.

Heat exchange is divided into the front face and the remaining five faces. For the front face, the model combines water-side and air-side heat-transfer coefficients of 100 and 8 W/(m²·K):

```
Ufront = 1 / (1/100 + 1/8)
       ≈ 7.407 W/(m²·K)
```

The remaining faces use an equivalent coefficient of 0.5 W/(m²·K). Their combined area is 0.051 m², including the top and bottom. With the default insulation multiplier of 1.0:

```
UA = 7.407407 × 0.010 + 0.5 × 0.051
   ≈ 0.09957 W/K
```

A 10°C difference between the water and its surroundings therefore corresponds to approximately 1 W of heat exchange through this term. If the surroundings are warmer, heat enters the water.

Glass thickness, glass thermal conductivity, and heat stored in the tank walls are not calculated separately. The water surface is included among the equivalent insulated faces, while evaporation is calculated independently. This is an equivalent boundary used to produce temperature behaviour, rather than a detailed reconstruction of a physical aquarium enclosure. This boundary leaves out long-wave radiative losses and solar heating.

### Heaters and coolers

I use six heating devices and six cooling devices, with different ratios between energy input and useful heating or cooling. Their default energy input rate is **10000 J/min, or approximately 166.67 W**. For electric equipment this is electrical input; for gas equipment it is fuel-energy input. Device type changes the ratio used to convert that input into heat added to or removed from the tank.

<div class="energy-table-scroll" role="region" aria-label="Data table 3; scroll horizontally if needed" tabindex="0">

| Heating device | Energy source | Heat output/input ratio | Default heating output, W |
|---|---|---:|---:|
| Aquarium electric heater | Electricity | 0.98 | 163.33 |
| Aquarium gas heater | Gas | 0.80 | 133.33 |
| Air-source heat pump | Electricity | 3.00 | 500.00 |
| Water-cooled heat pump | Electricity | 3.50 | 583.33 |
| Gas heat pump | Gas | 1.30 | 216.67 |
| Absorption heat pump | Gas | 1.60 | 266.67 |

</div>

<div class="energy-table-scroll" role="region" aria-label="Data table 4; scroll horizontally if needed" tabindex="0">

| Cooling device | Energy source | Heat removed/input ratio | Default heat removal, W |
|---|---|---:|---:|
| Basic aquarium Peltier cooler | Electricity | 0.20 | 33.33 |
| Advanced aquarium Peltier cooler | Electricity | 0.40 | 66.67 |
| Absorption heat pump | Gas | 0.70 | 116.67 |
| Gas heat pump | Gas | 1.20 | 200.00 |
| Air-source heat pump | Electricity | 4.00 | 666.67 |
| Water-cooled heat pump | Electricity | 4.50 | 750.00 |

</div>

Heat-pump values displayed as 300% or 400% correspond to performance ratios that include heat transferred from elsewhere. They do not mean that energy is being created. Physical heat pumps extract heat from a source and move it to where it is needed. The table above contains game settings, not measured COP values for real products. Ratios based on gas input must also be distinguished from COP based on electrical input. [The IEA describes the heat-pump principle here.](https://www.iea.org/reports/the-future-of-heat-pumps/how-a-heat-pump-works)

The game does not calculate a COP curve that varies with outdoor temperature, water temperature, or part-load operation. It also does not simulate the cooler's heat-rejection side or the effect of that rejected heat on room temperature.

With the default control offset, the heater switches on at **21.5°C or below** and switches off at **22°C**. The cooler switches on at **24.5°C or above** and switches off at **24°C**. These different switching thresholds form a hysteresis control. The temperature calculation uses fixed setpoints of 22°C and 24°C; changing the stored equipment temperature setting does not change these thresholds.

Electricity and gas costs are calculated from the input energy for each operating tick. The default prices are 60 and 20 units of game currency per MJ, respectively, before discount stats. These are game-economy values, not real utility tariffs. The calculation charges for the full operating tick rather than finding the exact moment when a setpoint is reached and shortening the operating time.

### Lighting separates power, brightness, and heat

For lighting, I keep three values separate: electrical consumption, brightness for the living systems, and heat transferred to the water. The model removes the fraction assigned to optical energy, then sends part of the remaining heat into the tank:

```
Heat transferred to water
  = Electrical power × (1 − Optical efficiency) × Water-transfer factor
```

<div class="energy-table-scroll" role="region" aria-label="Data table 5; scroll horizontally if needed" tabindex="0">

| Light | Power, W | Optical efficiency, % | Brightness factor, 0–1 | Water-transfer factor | Heat to water, W |
|---|---:|---:|---:|---:|---:|
| Basic fluorescent light | 9 | 22 | 0.55 | 0.20 | 1.404 |
| Standard LED bar | 7 | 50 | 0.72 | 0.15 | 0.525 |
| Full-spectrum plant LED | 11 | 45 | 0.85 | 0.15 | 0.9075 |
| Premium plant light | 12 | 67 | 1.00 | 0.15 | 0.594 |
| Metal-halide lamp | 20 | 30 | 1.00 | 0.30 | 4.200 |
| RGB LED system | 13 | 58 | 0.90 | 0.15 | 0.819 |

</div>

For the basic fluorescent light, 1.98 W of its 9 W input is assigned to optical energy, leaving 7.02 W of non-optical heat. The model transfers 20% of that heat, or 1.404 W, to the water. Electricity cost is calculated from the full 9 W input.

The remaining 5.616 W of non-optical heat is not divided into air heating and radiation. Nor does the model track light being absorbed by water or the tank bottom and subsequently becoming heat. The table therefore does not account for the final destination of all lighting energy.

Plants and algae receive a separate brightness factor. Plant oxygen production, nitrate uptake, and growth depend on this value; their light factors become zero when the light is off. Ammonium uptake retains a residual dark factor. Algae can also reduce the effective light available to plants through shading. This is not a calculation that converts watts into photon flux or PAR and then derives photosynthesis from that energy.

### Pumps and evaporation

Air-pump power is set to **1 W for the basic model, 0.7 W for the advanced model, and 0.5 W for the premium model**. The oxygenation coefficient also increases with grade. In automatic mode, the pump switches on when dissolved oxygen is at or below 5 mg/L and switches off when it reaches 6.5 mg/L or above.

The air pump affects dissolved oxygen and electricity cost, but it does not add heat to the water. I do not model a separate filter with its own flow rate, power consumption and efficiency. The equipment defaults also include a 1 W water-circulation pump, but its power is not included in the heat balance.

For evaporation, I calculate a mass flow from the difference between saturation vapour pressure at the water temperature and water-vapour pressure in the surrounding air. Multiplying that flow by latent heat gives the energy carried away from the water:

```
Evaporation mass flow
  = Lid factor × Evaporation coefficient × Surface area
    × max(0, Saturation pressure at Tw − RH × Saturation pressure at Ta)

Evaporative heat loss = Evaporation mass flow × Latent heat
```

The default evaporation coefficient is **2 × 10⁻⁷ kg/(s·m²·kPa)**, and latent heat is **2.43 × 10⁶ J/kg**. Relative humidity is a fraction, and vapour pressure is in kPa. The lid factor used in the game is 1.0. Negative vapour-pressure differences are set to zero, so condensation is not simulated. The coefficient does not vary with wind speed.

Here I am calculating heat loss. Evaporation lowers temperature, but **does not reduce water volume or depth**. It therefore does not reduce heat capacity or concentrate dissolved substances. The bubbles and ripples shown on screen are not a display of this calculated evaporation mass flow.

### Keeping temperature changes manageable

The water-temperature calculation has a default rate-of-change limit of **4°C per game hour** and an absolute range of **0–40°C**. At normal speed, that rate limit allows a change of at most 0.5°C per tick. Additional limits prevent the heater and cooler from crossing their respective setpoints. Energy left over after these limits is not reassigned elsewhere.

For example, consider the basic heater operating for one tick with water initially at 21°C, surrounding air at 24°C, and relative humidity at 55%. Electrical input is **75 kJ**, but the final water temperature is limited to **21.5°C**. With the effective heat capacity, that temperature rise stores approximately **2.51 kJ**. In this calculated example, the temperature limit allows much less heat to remain in the water than the heater consumes. That is the compromise in the limit: it keeps the change manageable, but the unused energy is not carried elsewhere. This is not a model for sizing real aquarium equipment.

The temperature calculation also limits its time step to 0.01–2 hours. Normal gameplay multiplies the 7.5-minute step by the speed setting, so settings above 16× can advance the clock and energy charges farther than the thermal integration advances. The separate fast-forward analysis runner instead repeats normal-sized steps, but uses fixed default insulation and heat-capacity multipliers rather than the player's upgraded values.

Heaters and coolers contribute no operating heat or energy charge when disabled. Removing a light turns it off, making its modelled power and heat contribution zero. Other owned, inactive tanks continue to receive thermal and water-quality updates while a different tank is being viewed. Locked tanks only have their clocks synchronised.

While the page is hidden, the game still requests updates, but browsers can delay or suspend them. The simulation does not make up all of that elapsed time. Returning after the app has been closed triggers separate rewards and shrimp growth; it does not reconstruct the temperature changes during that absence.

The water temperature produced here becomes an input to the water-quality model. Oxygen saturation, ammonia partitioning, nitrification rates, and algae growth depend on it. Biological and chemical reaction heat does not feed back into the thermal balance, and water changes do not mix the thermal energy of incoming water.

This is the connection I want to keep building around: temperature influences the same water that feeding, waste, bacteria, plants and water changes are already affecting.

</details>
