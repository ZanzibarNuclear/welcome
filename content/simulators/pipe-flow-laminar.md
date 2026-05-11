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

## What this models

**Hagen–Poiseuille** for **steady, incompressible, fully developed** flow in a **straight circular** pipe, with **no fittings** and **no entry-length correction**. This lab fixes **liquid water at 40 °C** (\(\rho\) and \(\mu\) from the site tables). You choose **D** from a short list of **nominal plant-style sizes**, pick **L** from **order-of-magnitude pipe lengths** (5–80 m), and set **Q**.

The **Q** slider spends most of its travel on the laminar range: the first **75%** maps **0 → Q** at \(\mathrm{Re} \approx 2100\); the last **25%** stretches into **transition** up to \(\mathrm{Re} \approx 4000\) so you can see the warning without losing resolution in the accurate region.

Pressure drop is

\[
\Delta p = \frac{128\,\mu L Q}{\pi D^4}
\]

with \(Q\) the volume flow rate, \(\mu\) the dynamic viscosity, and \(D\) the inner diameter. Mean speed is \(v = Q/A\) and \(\mathrm{Re} = \rho v D/\mu\).

## What Reynolds number measures

The **Reynolds number** \(\mathrm{Re}\) is a **dimensionless ratio**: it compares **inertial** effects in the flow (how strongly the fluid “carries” its motion) to **viscous** effects (how strongly the fluid resists shearing). It is **not** “speed” by itself—it combines **speed**, **pipe size**, **density**, and **viscosity** into one number so you can judge **how the flow tends to behave**.

For round pipe flow the lab uses

\[
\mathrm{Re} = \frac{\rho\, v\, D}{\mu}.
\]

**Rough intuition:**

- **Lower \(\mathrm{Re}\)** — Viscosity dominates; smooth, layered **laminar** motion is typical (what Hagen–Poiseuille describes).
- **Higher \(\mathrm{Re}\)** — Inertia matters more; the flow more readily forms **eddies** and **turbulence** once \(\mathrm{Re}\) is well past the laminar range.

Same fluid and pipe can land at very different \(\mathrm{Re}\) if you change \(v\) (via \(Q\)) or \(D\); that is why \(\mathrm{Re}\) is more informative than \(v\) alone for deciding whether the laminar model is believable.

## What it is not

It is **not valid** once \(\mathrm{Re}\) is well into the transitional / turbulent regime (the lab warns above about 2100). It ignores **rough walls**, **minor losses**, **pumps**, **heat transfer**, and **developing** flow near the inlet. Later simulators in this series add those pieces.

## Try this

- Switch **D** among the presets (e.g. SG tube vs main steam vs CW) and watch \(\Delta p\) move roughly as \(1/D^4\) at fixed **Q** (stay in the laminar portion of the **Q** bar—left of the marker—for a trustworthy read).
- Change **L** among the length options and confirm \(\Delta p\) scales about linearly with length at fixed **Q** and **D**.
- Use the **turbulence zone** (right of the marker on the **Q** bar) to cross the laminar limit, then open the **Pipe Flow Lab** for friction-factor-based loss.
