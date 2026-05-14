---
type: simulator
title: "Pipe Flow Lab"
component: "PipeFlowSimulator"
difficulty: intermediate
description: "Explore steady pipe flow: Reynolds number, Darcy–Weisbach and minor losses, Moody-style friction chart, and an optional pump operating-point finder."
tags: [fluids, hydraulics, pressure-drop, reactor-coolant, pipe-flow-series]
series: "Pipe flow"
order: 7
hidden: true
---

## What this models

This is the **second** lab in the **Pipe flow** series. Start with [Laminar pipe flow (Hagen–Poiseuille)](/simulators/pipe-flow-laminar) if you want the algebraic \(\Delta p \propto \mu L Q / D^4\) model only.

This simulator uses **one-dimensional, steady, incompressible** pipe flow. You set the pipe size, length, wall roughness, fluid (water or molten sodium), temperature, and either a volume flow rate or a mean velocity.

It computes the **Reynolds number**, a **Darcy friction factor** (laminar \(64/Re\), turbulent **Swamee–Jain** approximation to Colebrook–White, with a blend in the transition band), **straight-pipe head loss**, and **minor losses** \(\sum K\,v^2/(2g)\). Total head drives **Δp = ρ g h**. A **Moody-style** plot shows where your \((Re, f)\) sits relative to \(\varepsilon/D\) curves (same correlations as the numbers). **Pump vs system** uses a simple parabolic pump \(H = H_0 - k Q^2\) and bisection to match system loss—pedagogical, not a vendor pump curve.

## What it is not

It does not simulate **3D bends**, **water hammer**, **free surfaces**, **heat transfer** along the pipe, or **exact** tabulated \(K\) catalogs (the lab uses a fixed representative \(\sum K\) for typical fittings). Temperature affects fluid properties only through the built-in \(\rho(T)\), \(\mu(T)\) tables.

## Try this

- Compare **water at 40 °C** and **molten sodium at 400 °C** for the same geometry and flow: notice how density and viscosity move the Reynolds number.
- Increase **roughness** at high Reynolds number and watch the friction factor rise on both the readout and the **Moody** plot.
- Compare **pipe** vs **minor** head with the fixed **ΣK**; watch the **equivalent length** line as you change \(Q\) or geometry.
- Switch between specifying **Q** and **v** and confirm \(Q = A v\).
- Adjust **H₀** and **k**, then **Set Q to operating point** to see a matched pump flow.
