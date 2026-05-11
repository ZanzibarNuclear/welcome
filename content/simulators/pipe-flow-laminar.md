---
type: simulator
title: "Laminar Pipe Flow"
component: "PipeFlowLaminarSimulator"
difficulty: beginner
description: "The simplest model of fluid flowing smoothly through a pipe."
tags: [fluids, hydraulics, pipe-flow]
series: "Pipe flow"
order: 6
---

## What This Models

We can use this model to get a sense how liquids moves through a straight pipe. Even this simple view is a bit tricky to understand. Tricky, but within reach. To keep things familiar, we model water at 40˚C. That and a bit of soap is just right for washing your hands.

Laminar means flat or smooth. So picture a clear pipe with water flowing straight through it. No swirls, no bubbles, no distruptions.

Fluids that flow with disruptions, such as swirls and eddies, are said to be turbulent. The effects of turbulence are beyond this model. In the model (above), look for the "turbulence zone". So you can get a sense of how much water flows through different size pipe that are typically found in a power plant when the flow is smooth.

## What Reynolds number measures

The **Reynolds number** $\mathrm{Re}$ is a **ratio**. That means it that has no dimensions. The Reynolds number compares a flow's **inertial** effects with its **viscous** effects.

In other words, it compares the fluid's tendency to keep moving with its tendency to slow down or stickiness.

This ratio is useful. When it gets to about 2,000, the flow switches from laminar to turbulent.

The Reynolds number combines **speed**, **pipe size**, **density**, and **viscosity** into one number so you can judge **how the flow tends to behave**.

For flow in a round pipe:

$$
\mathrm{Re} = \frac{\rho\, v\, D}{\mu}
$$

- $\rho$ — **Density** of the fluid (mass per unit volume).
- $v$ — **Average speed** of the flow along the pipe.
- $D$ — **Inner diameter** of the pipe.
- $\mu$ — **Dynamic viscosity** of the fluid (how strongly it resists shearing).

## Pressure drop ($\Delta p$)

**Pressure drop** $\Delta p$ is how much lower the fluid pressure is at the **outlet** of a pipe run than at the **inlet**, for a given steady flow. You can think of it as the extra “push” the fluid needs from pumps or headers to overcome **viscous friction** along the walls. The simulator reports $\Delta p$ in pascals (Pa), the same unit you would see on many plant instruments.

For **laminar** flow in a long, straight, round pipe, the **Hagen–Poiseuille** result relates $\Delta p$ to the volume flow rate $Q$, the pipe geometry, and the viscosity:

$$
\Delta p = \frac{128\,\mu\, L\, Q}{\pi\, D^{4}}
$$

- $\Delta p$ — **Pressure drop** along the length of the pipe.
- $\mu$ — **Dynamic viscosity** of the fluid (same as in the Reynolds number).
- $L$ — **Length** of the straight pipe segment.
- $Q$ — **Volume flow rate** (volume of fluid passing a cross-section per unit time).
- $D$ — **Inner diameter** of the pipe.

**Rough trends (still in the laminar range):** at fixed $Q$, a longer pipe or a narrower pipe raises $\Delta p$; making the pipe wider lowers $\Delta p$ very strongly because of the $D^{4}$ in the denominator. If you push the flow rate up until the motion is no longer cleanly laminar, this formula is no longer a good model—that is what the turbulence warning in the lab is about.

## Who were Reynolds, Hagen, and Poiseuille?

**Osborne Reynolds** (1842–1912) was an Irish engineer and physicist. He is best remembered here for the **Reynolds number** and for careful experiments on water flowing in pipes—work that helped clarify when smooth laminar motion gives way to turbulent motion.

**Gotthilf Hagen** (1797–1884) was a German civil engineer who studied water flow in pipes and channels. His measurements in the 1830s showed how **pressure drop** and **flow rate** relate in the slow, orderly regime we now call laminar.

**Jean Léonard Marie Poiseuille** (1797–1869) was a French physician and physicist. Interested in **blood flow** in narrow tubes, he measured how liquids move through small glass pipes and published quantitative laws for low-speed flow—work that lines up with what we call **Poiseuille flow** today.

Hagen and Poiseuille arrived at similar pipe-flow results by experiment, around the same era; the combined name **Hagen–Poiseuille** reflects that shared legacy.

### Honorable Mention

Hagen and Poiseuille worked from **experiments**. The deeper **math** came later.

**Claude-Louis Navier** (1785–1836), in France, put **viscosity** into the equations of motion in the 1820s.

**George Gabriel Stokes** (1819–1903), in Britain, finished the form we call the **Navier–Stokes** equations. In **1851** he published a **theory** of laminar flow in a round pipe that fits those early measurements.

The Navier–Stokes equations tie **pressure**, **viscosity**, and **motion** together for fluids everywhere—not just inside a pipe.
