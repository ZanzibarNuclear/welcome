/** SI units throughout unless noted. */

export const GRAVITY_MS2 = 9.80665

export type FluidId = 'water' | 'sodium'

export type FlowRegime = 'laminar' | 'transitional' | 'turbulent'

type PropertyKnot = { T: number; rho: number; mu: number }

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n))
}

function interpProps(knots: PropertyKnot[], T: number): { rho: number; mu: number } {
  if (T <= knots[0]!.T) return { rho: knots[0]!.rho, mu: knots[0]!.mu }
  const last = knots[knots.length - 1]!
  if (T >= last.T) return { rho: last.rho, mu: last.mu }
  for (let i = 0; i < knots.length - 1; i++) {
    const a = knots[i]!
    const b = knots[i + 1]!
    if (T >= a.T && T <= b.T) {
      const t = (T - a.T) / (b.T - a.T)
      return {
        rho: a.rho + t * (b.rho - a.rho),
        mu: a.mu + t * (b.mu - a.mu)
      }
    }
  }
  return { rho: knots[0]!.rho, mu: knots[0]!.mu }
}

/** Liquid water, 10–100 °C (approximate properties for teaching). */
const WATER_KNOTS: PropertyKnot[] = [
  { T: 10, rho: 999.7, mu: 1.307e-3 },
  { T: 20, rho: 998.2, mu: 1.002e-3 },
  { T: 40, rho: 992.2, mu: 0.653e-3 },
  { T: 60, rho: 983.2, mu: 0.467e-3 },
  { T: 80, rho: 971.8, mu: 0.355e-3 },
  { T: 100, rho: 958.4, mu: 0.282e-3 }
]

/** Liquid sodium, 200–600 °C (order-of-magnitude bulk values for teaching). */
const SODIUM_KNOTS: PropertyKnot[] = [
  { T: 200, rho: 927, mu: 7.0e-4 },
  { T: 300, rho: 902, mu: 3.8e-4 },
  { T: 400, rho: 875, mu: 2.3e-4 },
  { T: 500, rho: 849, mu: 1.9e-4 },
  { T: 600, rho: 820, mu: 1.7e-4 }
]

export function fluidProperties(fluid: FluidId, Tcelsius: number) {
  if (fluid === 'water') {
    return interpProps(WATER_KNOTS, clamp(Tcelsius, 10, 100))
  }
  return interpProps(SODIUM_KNOTS, clamp(Tcelsius, 200, 600))
}

export function fluidTemperatureRange(fluid: FluidId): { min: number; max: number } {
  if (fluid === 'water') return { min: 10, max: 100 }
  return { min: 200, max: 600 }
}

export function pipeCrossSectionArea(diameterM: number) {
  const r = diameterM / 2
  return Math.PI * r * r
}

/** Upper end of the laminar band in `darcyFrictionFactor` (engineering convention ~2300; we use 2100). */
export const REYNOLDS_LAMINAR_UPPER = 2100

/**
 * Mean velocity (m/s) that yields the requested Reynolds number: Re = ρ v D / μ.
 */
export function meanVelocityForReynolds(
  targetRe: number,
  rho: number,
  diameterM: number,
  muPas: number
) {
  return (targetRe * muPas) / Math.max(rho * diameterM, 1e-12)
}

/** Volume flow (m³/s) for target Re in a circular pipe. */
export function volumeFlowForReynolds(
  targetRe: number,
  rho: number,
  diameterM: number,
  muPas: number
) {
  const v = meanVelocityForReynolds(targetRe, rho, diameterM, muPas)
  return v * pipeCrossSectionArea(diameterM)
}

export function reynoldsNumber(rho: number, velocityMs: number, diameterM: number, muPas: number) {
  return (rho * Math.abs(velocityMs) * diameterM) / Math.max(muPas, 1e-12)
}

/**
 * Swamee–Jain explicit approximation to the Colebrook–White relation.
 * `roughnessM` and `diameterM` in meters; `Re` Reynolds number (dimensionless).
 */
export function swameeJainFrictionFactor(roughnessM: number, diameterM: number, Re: number) {
  const ReEff = Math.max(Re, 4000)
  const rel = roughnessM / Math.max(diameterM, 1e-12)
  const inner = rel / 3.7 + 5.74 / ReEff ** 0.9
  const logTerm = Math.log10(Math.max(inner, 1e-12))
  return 0.25 / logTerm ** 2
}

export function darcyFrictionFactor(
  diameterM: number,
  roughnessM: number,
  Re: number
): { f: number; regime: FlowRegime } {
  const ReSafe = Math.max(Re, 1e-6)
  const fLam = 64 / ReSafe
  if (Re < REYNOLDS_LAMINAR_UPPER) return { f: fLam, regime: 'laminar' }

  const fTurbAtRe = swameeJainFrictionFactor(roughnessM, diameterM, Math.max(Re, 4000))

  if (Re < 3100) {
    const t = (Re - REYNOLDS_LAMINAR_UPPER) / (3100 - REYNOLDS_LAMINAR_UPPER)
    return { f: fLam * (1 - t) + fTurbAtRe * t, regime: 'transitional' }
  }

  return { f: fTurbAtRe, regime: Re < 4000 ? 'transitional' : 'turbulent' }
}

export function headLossDarcyWeisbach(f: number, lengthM: number, diameterM: number, velocityMs: number) {
  const D = Math.max(diameterM, 1e-12)
  return f * (lengthM / D) * (velocityMs ** 2) / (2 * GRAVITY_MS2)
}

/**
 * Sum of minor losses ΣK expressed as head: h = (ΣK) v² / (2g).
 * K is dimensionless (elbows, entrances, valves, etc.).
 */
export function headLossMinor(Ksum: number, velocityMs: number) {
  return (Ksum * velocityMs ** 2) / (2 * GRAVITY_MS2)
}

/** Equivalent pipe length that would give the same head as minor loss K at friction factor f: L_e = K D / f. */
export function equivalentLengthForMinorLoss(K: number, diameterM: number, f: number) {
  return (K * diameterM) / Math.max(f, 1e-9)
}

/** Pump head (m) for a simple parabolic characteristic H = H₀ − k Q² (Q in m³/s). */
export function pumpHeadParabolic(shutoffHeadM: number, kPumpS2m5: number, flowM3s: number) {
  return Math.max(0, shutoffHeadM - kPumpS2m5 * flowM3s ** 2)
}

export type PipeLossParams = {
  rho: number
  mu: number
  diameterM: number
  lengthM: number
  roughnessM: number
  Kminor: number
}

/** Total head loss (m): straight-pipe Darcy–Weisbach + ΣK minor losses. */
export function totalHeadLossPipeMinor(params: PipeLossParams, velocityMs: number) {
  const Re = reynoldsNumber(params.rho, velocityMs, params.diameterM, params.mu)
  const { f } = darcyFrictionFactor(params.diameterM, params.roughnessM, Re)
  const hPipe = headLossDarcyWeisbach(f, params.lengthM, params.diameterM, velocityMs)
  const hMinor = headLossMinor(params.Kminor, velocityMs)
  return { hPipe, hMinor, hTotal: hPipe + hMinor, f, Re }
}

/**
 * Find Q (m³/s) where system head loss equals pump head, H₀ − k Q².
 * Residual = h_loss − H_pump is negative at low Q and typically positive at high Q.
 */
export function bisectPumpOperatingFlow(
  H0: number,
  kPump: number,
  params: PipeLossParams,
  qMin: number,
  qMax: number
): number | null {
  const A = pipeCrossSectionArea(params.diameterM)
  const residual = (q: number) => {
    const v = q / Math.max(A, 1e-12)
    const { hTotal } = totalHeadLossPipeMinor(params, v)
    const hp = pumpHeadParabolic(H0, kPump, q)
    return hTotal - hp
  }

  let lo = Math.max(qMin, 1e-9)
  let hi = Math.max(qMax, lo * 10)
  let fLo = residual(lo)
  let fHi = residual(hi)

  let expand = 0
  while (fHi < 0 && hi < 6000 && expand < 32) {
    hi *= 1.6
    fHi = residual(hi)
    expand++
  }
  if (fLo * fHi > 0 || !Number.isFinite(fLo) || !Number.isFinite(fHi)) return null

  for (let i = 0; i < 85; i++) {
    const mid = 0.5 * (lo + hi)
    const fm = residual(mid)
    if (Math.abs(fm) < 1e-7) return mid
    if (fLo * fm <= 0) {
      hi = mid
      fHi = fm
    } else {
      lo = mid
      fLo = fm
    }
  }
  return 0.5 * (lo + hi)
}

/** Moody chart: Darcy f vs Re for a fixed relative roughness ε/D (uses same Swamee–Jain + laminar blend as the simulator). */
export function frictionFactorForMoodyCurve(relativeRoughness: number, Re: number) {
  const D = 1
  const eps = Math.max(relativeRoughness, 1e-8)
  return darcyFrictionFactor(D, eps, Math.max(Re, 1)).f
}

export function pressureDropFromHead(rho: number, headLossM: number) {
  return rho * GRAVITY_MS2 * headLossM
}

export function hydraulicPowerWatts(rho: number, flowM3s: number, headM: number) {
  return rho * GRAVITY_MS2 * flowM3s * headM
}
