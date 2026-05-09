---
type: simulator
title: "Hydro Power Sketchpad"
component: "HydroPowerSimulator"
difficulty: beginner
description: "Estimate hydraulic and electric power from gross head, lumped losses, flow rate, and overall efficiency—simple 1D energy accounting for dams and stations."
tags: [fluids, hydropower, energy, civil]
order: 6
---

## What this models

Hydraulic power available from converting fluid potential energy at the **net head** is

\[
P_\text{hyd} = \rho g Q H_\text{net}.
\]

You enter **gross head** (reservoir to turbine inlet datum), a lumped **head loss** (penstock friction, trash racks, bends, draft tube, etc.), **volume flow** through the turbines, fluid **density**, and an **overall efficiency** \(\eta\) (turbine × generator and ancillary losses). The sketchpad reports **shaft/electric power** and a **daily energy** estimate at constant \(Q\) and \(\eta\).

## What it is not

Real plants have **turbine hill charts**, **variable efficiency with load**, **seasonal head and flow**, and **grid dispatch**. This tool is for **order-of-magnitude intuition** and homework-style estimates.

## Try this

- Fix **gross head** and **flow**, then sweep **losses**: when does a small loss fraction still waste a lot of power?
- Lower **density** (warmer water or a different working fluid assumption) and see the effect on power for the same \(Q\) and \(H\).
- Compare **nameplate-style** efficiency (e.g. 0.88–0.92) to a more conservative value for part-load operation.
