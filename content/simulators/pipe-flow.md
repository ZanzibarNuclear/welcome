---
type: simulator
title: "Pipe Flow Lab"
component: "PipeFlowSimulator"
difficulty: intermediate
description: "Explore steady flow in a straight pipe: Reynolds number, laminar vs turbulent friction, and pressure drop from the Darcy–Weisbach model."
tags: [fluids, hydraulics, pressure-drop, reactor-coolant]
order: 5
---

## What this models

This simulator uses **one-dimensional, steady, incompressible** pipe flow. You set the pipe size, length, wall roughness, fluid (water or molten sodium), temperature, and either a volume flow rate or a mean velocity.

It computes the **Reynolds number**, a **Darcy friction factor** (laminar \(64/Re\), turbulent **Swamee–Jain** approximation to Colebrook–White, with a blend in the transition band), and the **head loss** and **pressure drop** from **Darcy–Weisbach**.

## What it is not

It does not simulate **pumps**, **bends**, **valves**, **free surfaces**, or **temperature transport** along the pipe. Those are natural extensions for a later phase.

## Try this

- Compare **water at 40 °C** and **molten sodium at 400 °C** for the same geometry and flow: notice how density and viscosity move the Reynolds number.
- Increase **roughness** at high Reynolds number and watch the friction factor rise.
- Switch between specifying **Q** and **v** and confirm \(Q = A v\).
