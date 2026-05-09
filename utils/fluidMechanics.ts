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
  if (Re < 2100) return { f: fLam, regime: 'laminar' }

  const fTurbAtRe = swameeJainFrictionFactor(roughnessM, diameterM, Math.max(Re, 4000))

  if (Re < 3100) {
    const t = (Re - 2100) / (3100 - 2100)
    return { f: fLam * (1 - t) + fTurbAtRe * t, regime: 'transitional' }
  }

  return { f: fTurbAtRe, regime: Re < 4000 ? 'transitional' : 'turbulent' }
}

export function headLossDarcyWeisbach(f: number, lengthM: number, diameterM: number, velocityMs: number) {
  const D = Math.max(diameterM, 1e-12)
  return f * (lengthM / D) * (velocityMs ** 2) / (2 * GRAVITY_MS2)
}

export function pressureDropFromHead(rho: number, headLossM: number) {
  return rho * GRAVITY_MS2 * headLossM
}

export function hydraulicPowerWatts(rho: number, flowM3s: number, headM: number) {
  return rho * GRAVITY_MS2 * flowM3s * headM
}
