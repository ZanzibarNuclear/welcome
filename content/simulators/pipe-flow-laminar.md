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

## What Does Laminar Mean?

Laminar means that something is made of layers. Laminar flow looks like the liquid is moving in smooth layers. No swirls, no eddies, no distruptions.

We all know what tends to happen where you open a faucet. Water comes out. Behind every faucet and after every drain, you will find various lengths of pipe that carry the water or whatever liquid happens to flow through it.

Although it seems simple, what happens inside a pipe is rather complicated. Imagine a pipe that is flowing, full of moving liquid. Say there is a pump at one end that sucks up the liquid and pushes it into the pipe. The other end is open, so the liquid flows into containers or all over the floor or into the yard.

What you don't see is inside the pipe. As it happens, the liquid that is moving through the center of the pipe flows faster than the liquid along the pipe walls. In theory, a thin layer of atoms of liquid are stuck to the pipe. Their speed is 0. The next layer of atoms is moving just a bit above zero. The next layer is a bit faster than that. At the center of the pipe, the liquid is moving fastest.

![Laminar pipe-flow cross-section SVG](/images/simulators/pipe-flow-laminar-cross-section.svg)

To make the speed difference easier to see, picture five tiny submarines drifting down the pipe — one per layer. The sub in the middle rides the fastest current, while the subs riding closest to the walls are dragged back by friction and creep along.

![Animated laminar flow with five submarines](/images/simulators/pipe-flow-laminar-submarines.svg)

At slower speeds, the layers do not mix or interfere with each other. They appear smooth. That is laminar flow.

Now imagine you are in a hurry to move this liquid, so you crank up the pump. As the speed of the liquid through the pipe increases, eventually the layers start to cross over and swirl and become unsettled. That is turbulent flow, not laminar.

![Turbulent pipe-flow cross-section SVG](/images/simulators/pipe-flow-turbulent-cross-section.svg)

One key idea of this model is to see when flow transitions from laminar to turbulent. Look for the "turbulence zone" in the model. You can get a sense of how much water flows through different size pipe that are typically found in a power plant when the flow is smooth. Try different options and move the volume flow slider. Watch the numbers move.

Turbulent flow is even more complicated than laminar flow, so we tackle that in a different model.

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

For **laminar** flow in a long, straight, round pipe, the **Hagen-Poiseuille** result relates $\Delta p$ to the volume flow rate $Q$, the pipe geometry, and the viscosity:

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
