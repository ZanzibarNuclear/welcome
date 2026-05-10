<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PipeFlowMoodyChart from './PipeFlowMoodyChart.vue'
import {
  bisectPumpOperatingFlow,
  darcyFrictionFactor,
  equivalentLengthForMinorLoss,
  fluidProperties,
  fluidTemperatureRange,
  headLossDarcyWeisbach,
  headLossMinor,
  pipeCrossSectionArea,
  pressureDropFromHead,
  pumpHeadParabolic,
  reynoldsNumber,
  REYNOLDS_LAMINAR_UPPER,
  volumeFlowForReynolds,
  type FluidId,
  type PipeLossParams
} from '~~/utils/fluidMechanics'

/** Default inner diameter (m); initial flow is chosen so Re stays laminar for this size. */
const DEFAULT_PIPE_DIAMETER_M = 0.12
/** Starting Reynolds number: below `REYNOLDS_LAMINAR_UPPER` so the demo opens in laminar flow. */
const DEFAULT_INITIAL_RE = 1600

function laminarDemoFlowForPipe(
  diameterM: number,
  fluidId: FluidId,
  tempCelsius: number,
  targetRe: number
) {
  const { rho, mu } = fluidProperties(fluidId, tempCelsius)
  const Qm3s = volumeFlowForReynolds(targetRe, rho, diameterM, mu)
  const A = pipeCrossSectionArea(diameterM)
  const v = Qm3s / Math.max(A, 1e-12)
  return { flowLs: Qm3s * 1000, velocityMs: v }
}

const fluid = ref<FluidId>('water')
const tempC = ref(40)

const diameterM = ref(DEFAULT_PIPE_DIAMETER_M)
const lengthM = ref(80)
const roughnessMm = ref(0.045)
/** Fixed ΣK (elbows, fittings, entrances); typical small piping run, not user-tuned. */
const SUM_K_MINOR = 2.5

/** Drive by volume flow (L/s) or mean velocity (m/s). */
const driveBy = ref<'Q' | 'v'>('Q')

const tRange = computed(() => fluidTemperatureRange(fluid.value))

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n))
}

const rho = computed(() => fluidProperties(fluid.value, tempC.value).rho)
const mu = computed(() => fluidProperties(fluid.value, tempC.value).mu)
const area = computed(() => pipeCrossSectionArea(diameterM.value))

const initialFlow = laminarDemoFlowForPipe(
  DEFAULT_PIPE_DIAMETER_M,
  'water',
  40,
  DEFAULT_INITIAL_RE
)
const velocityMs = ref(initialFlow.velocityMs)

/** Upper end of the Q slider (L/s); at least this large so the post-transition half always has room. */
const Q_SLIDER_MAX_LS = 800
/** Reynolds number at the left end of the Q slider (laminar “slow” end). */
const RE_FOR_Q_SLIDER_MIN = 400
/** Slider is 0 … N; lower half maps Q from laminar floor to Q(Re≈2100); upper half to turbulent Q. */
const FLOW_SLIDER_STEPS = 1000

function qSliderEndpoints(rho: number, mu: number, diameterM: number) {
  const Qc =
    volumeFlowForReynolds(REYNOLDS_LAMINAR_UPPER, rho, diameterM, mu) * 1000
  const Qlo = volumeFlowForReynolds(RE_FOR_Q_SLIDER_MIN, rho, diameterM, mu) * 1000
  const QloEff = Math.min(Qlo, Qc * 0.85)
  const Qhigh = Math.max(Q_SLIDER_MAX_LS, Qc * 1.5)
  return { QloEff, Qc, Qhigh }
}

function flowLsFromSliderNorm(sNorm: number, ep: ReturnType<typeof qSliderEndpoints>) {
  const { QloEff, Qc, Qhigh } = ep
  const s = clamp(sNorm, 0, 1)
  if (s <= 0.5) return QloEff + (s / 0.5) * (Qc - QloEff)
  return Qc + ((s - 0.5) / 0.5) * (Qhigh - Qc)
}

function sliderFromFlowLs(ls: number, ep: ReturnType<typeof qSliderEndpoints>) {
  const { QloEff, Qc, Qhigh } = ep
  let s: number
  if (ls <= Qc) {
    s = 0.5 * (ls - QloEff) / Math.max(Qc - QloEff, 1e-12)
    s = clamp(s, 0, 0.5)
  } else {
    s = 0.5 + 0.5 * (ls - Qc) / Math.max(Qhigh - Qc, 1e-12)
    s = clamp(s, 0.5, 1)
  }
  return Math.round(clamp(s, 0, 1) * FLOW_SLIDER_STEPS)
}

const initEndpoints = qSliderEndpoints(
  fluidProperties('water', 40).rho,
  fluidProperties('water', 40).mu,
  DEFAULT_PIPE_DIAMETER_M
)
const flowSlider = ref(sliderFromFlowLs(initialFlow.flowLs, initEndpoints))

const flowEndpoints = computed(() =>
  qSliderEndpoints(rho.value, mu.value, diameterM.value)
)

const flowLsMapped = computed(() =>
  flowLsFromSliderNorm(flowSlider.value / FLOW_SLIDER_STEPS, flowEndpoints.value)
)

watch(fluid, () => {
  tempC.value = fluid.value === 'water' ? 40 : 400
})

watch(
  () => [tRange.value.min, tRange.value.max] as const,
  ([min, max]) => {
    tempC.value = clamp(tempC.value, min, max)
  }
)

watch(driveBy, (mode, prev) => {
  if (mode === 'Q' && prev === 'v') {
    flowSlider.value = sliderFromFlowLs(
      velocityMs.value * area.value * 1000,
      flowEndpoints.value
    )
  } else if (mode === 'v' && prev === 'Q') {
    const A = Math.max(area.value, 1e-12)
    velocityMs.value = flowLsMapped.value / 1000 / A
  }
})

/** Keep the same Q (L/s) when D changes in Q mode so Re, v, and losses respond to geometry (slider is Re-keyed). */
watch(diameterM, (newD, oldD) => {
  if (oldD === undefined || driveBy.value !== 'Q') return
  const epOld = qSliderEndpoints(rho.value, mu.value, oldD)
  const qLs = flowLsFromSliderNorm(flowSlider.value / FLOW_SLIDER_STEPS, epOld)
  const epNew = qSliderEndpoints(rho.value, mu.value, newD)
  flowSlider.value = sliderFromFlowLs(qLs, epNew)
})

const roughnessM = computed(() => roughnessMm.value / 1000)

const relativeRoughness = computed(() => roughnessM.value / Math.max(diameterM.value, 1e-12))

const pipeLossParams = computed<PipeLossParams>(() => ({
  rho: rho.value,
  mu: mu.value,
  diameterM: diameterM.value,
  lengthM: lengthM.value,
  roughnessM: roughnessM.value,
  Kminor: SUM_K_MINOR
}))

/** Simple pump H = H₀ − k Q² (Q in m³/s); k in s²/m⁵. */
const pumpShutoffHeadM = ref(38)
const pumpK = ref(3200)
const pumpHint = ref<string | null>(null)

const Qm3s = computed(() => {
  if (driveBy.value === 'Q') return flowLsMapped.value / 1000
  return velocityMs.value * area.value
})

const velocity = computed(() => {
  if (driveBy.value === 'v') return velocityMs.value
  const A = Math.max(area.value, 1e-12)
  return Qm3s.value / A
})

const Re = computed(() => reynoldsNumber(rho.value, velocity.value, diameterM.value, mu.value))

const friction = computed(() =>
  darcyFrictionFactor(diameterM.value, roughnessM.value, Re.value)
)

const headLossPipeM = computed(() =>
  headLossDarcyWeisbach(
    friction.value.f,
    lengthM.value,
    diameterM.value,
    velocity.value
  )
)

const headLossMinorM = computed(() => headLossMinor(SUM_K_MINOR, velocity.value))

const headLossTotalM = computed(() => headLossPipeM.value + headLossMinorM.value)

const deltaPa = computed(() => pressureDropFromHead(rho.value, headLossTotalM.value))

const equivalentLengthMinorM = computed(() =>
  equivalentLengthForMinorLoss(SUM_K_MINOR, diameterM.value, friction.value.f)
)

const pumpHeadAtQM = computed(() =>
  pumpHeadParabolic(pumpShutoffHeadM.value, pumpK.value, Qm3s.value)
)

function applyPumpOperatingPoint() {
  pumpHint.value = null
  const q = bisectPumpOperatingFlow(
    pumpShutoffHeadM.value,
    pumpK.value,
    pipeLossParams.value,
    1e-8,
    80
  )
  if (q === null) {
    pumpHint.value =
      'No operating point found: try higher shutoff head, lower k, shorter pipe, or smaller ΣK.'
    return
  }
  flowSlider.value = sliderFromFlowLs(q * 1000, flowEndpoints.value)
  pumpHint.value = `Set Q to ${(q * 1000).toFixed(3)} L/s where system loss ≈ pump head (${pumpHeadParabolic(pumpShutoffHeadM.value, pumpK.value, q).toFixed(2)} m).`
}

const regimeClass = computed(() => {
  const r = friction.value.regime
  if (r === 'laminar') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
  if (r === 'transitional') return 'bg-amber-100 text-amber-900 dark:bg-amber-900/35 dark:text-amber-100'
  return 'bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-100'
})

/** One repeating tile width in SVG user units (must match CSS keyframes). */
const FLOW_TILE_U = 72

/** Inner pipe width in viewBox units; extra tiles so the marquee never shows a gap. */
const PIPE_INNER_WIDTH_U = 396
const flowTileRepeats = Math.ceil(PIPE_INNER_WIDTH_U / FLOW_TILE_U) + 2

/**
 * Animation duration: faster flow → shorter period. Clamped for readability at extremes.
 * v ≈ 0.15 m/s → ~18 s; v ≈ 10 m/s → ~0.55 s.
 */
const flowAnimDurationSec = computed(() => {
  const v = Math.abs(velocity.value)
  const denom = clamp(v, 0.004, 14)
  return clamp(2.1 / denom, 0.38, 22)
})

const waveAmplitude = computed(() => {
  const r = friction.value.regime
  if (r === 'laminar') return 0
  if (r === 'transitional') return 2.1
  return 4.2
})

/** Three streamlines (upper / mid / lower) inside the pipe cross-section. */
const streamlinePaths = computed(() => {
  const W = FLOW_TILE_U
  const amp = waveAmplitude.value
  const n = 26
  const rows = [
    { y: 50, phase: 0.35 },
    { y: 54, phase: 0 },
    { y: 58, phase: -0.55 }
  ]
  return rows.map(({ y, phase }) => {
    const parts: string[] = []
    for (let i = 0; i <= n; i++) {
      const x = (i / n) * W
      const yy = y + amp * Math.sin((x / W) * Math.PI * 2 * 1.2 + phase)
      parts.push(i === 0 ? `M ${x.toFixed(2)} ${yy.toFixed(2)}` : `L ${x.toFixed(2)} ${yy.toFixed(2)}`)
    }
    return parts.join(' ')
  })
})
</script>

<template>
  <div class="space-y-6">
    <div
      class="rounded-xl border border-gray-200 bg-linear-to-b from-sky-50/80 to-white p-4 dark:border-gray-800 dark:from-sky-950/40 dark:to-gray-950">
      <svg
        viewBox="0 0 440 108"
        class="h-auto w-full max-w-xl mx-auto text-gray-800 dark:text-gray-100"
        role="img"
        aria-label="Side view of a straight pipe with flow arrows">
        <defs>
          <linearGradient id="pipeMetal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="currentColor" stop-opacity="0.14" />
            <stop offset="100%" stop-color="currentColor" stop-opacity="0.28" />
          </linearGradient>
          <marker
            id="pipeFlowArrowHead"
            markerUnits="userSpaceOnUse"
            markerWidth="7"
            markerHeight="7"
            refX="6"
            refY="3.5"
            orient="auto">
            <path d="M 0 0 L 7 3.5 L 0 7 z" fill="context-stroke" />
          </marker>
          <clipPath id="pipeFlowInnerClip">
            <rect x="22" y="40" width="396" height="28" rx="6" />
          </clipPath>
        </defs>
        <rect x="8" y="28" width="424" height="52" rx="10" fill="url(#pipeMetal)" stroke="currentColor" stroke-opacity="0.35" />
        <rect x="22" y="40" width="396" height="28" rx="6" class="fill-sky-400/25 dark:fill-sky-400/20" />
        <g clip-path="url(#pipeFlowInnerClip)">
          <g transform="translate(22, 0)">
            <g
              class="pipe-flow-drift text-sky-600 dark:text-sky-300"
              :style="{
                '--pipe-flow-dur': `${flowAnimDurationSec}s`,
                '--pipe-flow-tile': `${FLOW_TILE_U}`,
              }">
              <g
                v-for="tile in flowTileRepeats"
                :key="tile"
                :transform="`translate(${(tile - 1) * FLOW_TILE_U}, 0)`">
                <path
                  v-for="(d, si) in streamlinePaths"
                  :key="`${tile}-${si}`"
                  :d="d"
                  fill="none"
                  stroke="currentColor"
                  :stroke-width="si === 1 ? 2 : 1.35"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  :opacity="si === 1 ? 0.95 : 0.55"
                  :marker-end="si === 1 ? 'url(#pipeFlowArrowHead)' : undefined" />
              </g>
            </g>
          </g>
        </g>
        <text x="220" y="18" text-anchor="middle" class="fill-gray-600 text-[11px] dark:fill-gray-400">
          Length L = {{ lengthM.toFixed(0) }} m · D = {{ (diameterM * 1000).toFixed(0) }} mm
        </text>
        <text x="220" y="100" text-anchor="middle" class="fill-gray-600 text-[11px] dark:fill-gray-400">
          Mean speed ≈ {{ velocity.toFixed(2) }} m/s · motion hints at regime (not a CFD solve)
        </text>
      </svg>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="space-y-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Fluid</span>
        <div class="flex flex-col gap-2" role="radiogroup" aria-label="Fluid">
          <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input v-model="fluid" type="radio" value="water" class="h-4 w-4 rounded border-gray-400">
            Water (liquid)
          </label>
          <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input v-model="fluid" type="radio" value="sodium" class="h-4 w-4 rounded border-gray-400">
            Molten sodium (liquid)
          </label>
        </div>
      </div>

      <label class="space-y-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Temperature (°C)</span>
        <input
          v-model.number="tempC"
          type="range"
          :min="tRange.min"
          :max="tRange.max"
          step="5"
          class="w-full">
        <div class="text-xs text-gray-500 dark:text-gray-400">
          {{ tempC }} °C · ρ = {{ rho.toFixed(1) }} kg/m³ · μ = {{ (mu * 1000).toFixed(3) }} mPa·s
        </div>
      </label>

      <label class="space-y-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Inner diameter D (mm)</span>
        <input
          v-model.number="diameterM"
          type="range"
          min="0.02"
          max="0.6"
          step="0.005"
          class="w-full">
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ (diameterM * 1000).toFixed(0) }} mm</div>
      </label>

      <label class="space-y-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Pipe length L (m)</span>
        <input
          v-model.number="lengthM"
          type="range"
          min="1"
          max="250"
          step="1"
          class="w-full">
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ lengthM }} m</div>
      </label>

      <label class="space-y-2 md:col-span-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Wall roughness ε (mm, absolute)</span>
        <input
          v-model.number="roughnessMm"
          type="range"
          min="0.0015"
          max="3"
          step="0.0005"
          class="w-full">
        <div class="text-xs text-gray-500 dark:text-gray-400">
          {{ roughnessMm.toFixed(3) }} mm · ε/D =
          {{ ((roughnessMm / 1000) / Math.max(diameterM, 1e-9)).toExponential(2) }}
        </div>
      </label>

      <div class="space-y-2 md:col-span-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Minor losses ΣK (fixed)</span>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          ΣK = {{ SUM_K_MINOR.toFixed(1) }} (typical elbows/fittings) · extra head
          {{ headLossMinorM.toFixed(3) }} m · equivalent pipe length (at current f) ≈
          {{ equivalentLengthMinorM.toFixed(2) }} m
        </div>
        <p class="text-[11px] leading-snug text-gray-500 dark:text-gray-400">
          Total head = straight-pipe Darcy–Weisbach + ΣK v²/(2g). This lab holds ΣK constant so the readouts stay
          focused on pipe flow and roughness.
        </p>
      </div>
    </div>

    <div class="flex flex-wrap gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Specify:</span>
      <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input v-model="driveBy" type="radio" value="Q" class="h-4 w-4 rounded border-gray-400">
        Volume flow Q
      </label>
      <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input v-model="driveBy" type="radio" value="v" class="h-4 w-4 rounded border-gray-400">
        Mean velocity v
      </label>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <label v-if="driveBy === 'Q'" class="space-y-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Volume flow Q (L/s)</span>
        <input
          v-model.number="flowSlider"
          type="range"
          min="0"
          :max="FLOW_SLIDER_STEPS"
          step="1"
          class="w-full">
        <div class="text-xs text-gray-500 dark:text-gray-400">
          {{ flowLsMapped < 10 ? flowLsMapped.toFixed(2) : flowLsMapped.toFixed(1) }} L/s
          ({{ Qm3s.toFixed(5) }} m³/s) · midpoint ≈ Re {{ REYNOLDS_LAMINAR_UPPER }} for this pipe and fluid
        </div>
        <div class="text-xs text-amber-800/90 dark:text-amber-200/90">
          Left half: laminar (Re from {{ RE_FOR_Q_SLIDER_MIN }} up to the transition). Right half: transitional into
          turbulent flow up to {{ Q_SLIDER_MAX_LS }}+ L/s when needed.
        </div>
      </label>
      <label v-else class="space-y-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Mean velocity v (m/s)</span>
        <input
          v-model.number="velocityMs"
          type="range"
          min="0.001"
          max="12"
          step="0.001"
          class="w-full">
        <div class="text-xs text-gray-500 dark:text-gray-400">
          {{ velocityMs < 0.1 ? velocityMs.toFixed(3) : velocityMs.toFixed(2) }} m/s
        </div>
        <div class="text-xs text-amber-800/90 dark:text-amber-200/90">
          Low v (left) → laminar; slide right for transitional then turbulent flow.
        </div>
      </label>
    </div>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Reynolds</div>
        <div class="mt-1 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {{ Re.toLocaleString(undefined, { maximumFractionDigits: 0 }) }}
        </div>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Regime</div>
        <div class="mt-2">
          <span class="inline-flex rounded-full px-3 py-1 text-sm font-medium capitalize" :class="regimeClass">
            {{ friction.regime }}
          </span>
        </div>
        <p class="mt-2 text-[11px] leading-snug text-gray-500 dark:text-gray-400">
          Laminar if Re is below {{ REYNOLDS_LAMINAR_UPPER }} (smooth streamlines). Same pipe + higher Q or v raises Re.
        </p>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Q · mean v</div>
        <div class="mt-1 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {{ velocity < 0.1 ? velocity.toFixed(3) : velocity.toFixed(2) }} m/s
        </div>
        <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Q =
          {{
            Qm3s * 1000 < 10 ? (Qm3s * 1000).toFixed(2) : (Qm3s * 1000).toFixed(1)
          }}
          L/s · v = Q / A, Re = ρ v D / μ
        </div>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Darcy f</div>
        <div class="mt-1 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {{ friction.f.toFixed(4) }}
        </div>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Pipe hf (straight)</div>
        <div class="mt-1 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {{ headLossPipeM.toFixed(2) }} m
        </div>
        <p class="mt-2 text-[11px] leading-snug text-gray-500 dark:text-gray-400">
          Darcy–Weisbach: f × (L/D) × v²/(2g). Length and diameter both enter here; minor loss uses only v.
        </p>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Minor hf (ΣK)</div>
        <div class="mt-1 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {{ headLossMinorM.toFixed(2) }} m
        </div>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Total head loss</div>
        <div class="mt-1 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {{ headLossTotalM.toFixed(2) }} m
        </div>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white p-4 sm:col-span-2 lg:col-span-3 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Pressure drop Δp</div>
        <div class="mt-1 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {{ (deltaPa / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 }) }} kPa
        </div>
        <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Swamee–Jain / 64/Re (same as above) plus ΣK v²/(2g). Δp = ρ g h_total.
        </div>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <PipeFlowMoodyChart :reynolds="Re" :relative-roughness="relativeRoughness" :friction="friction.f" />

      <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Pump vs system (optional)</h3>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Model H_pump = H₀ − k Q². “Apply” finds Q where system head loss equals pump head (bisection). You can still
          move Q manually afterward.
        </p>
        <label class="mt-3 block space-y-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Shutoff head H₀ (m)</span>
          <input
            v-model.number="pumpShutoffHeadM"
            type="range"
            min="2"
            max="120"
            step="1"
            class="w-full">
          <div class="text-xs text-gray-500 dark:text-gray-400">{{ pumpShutoffHeadM }} m</div>
        </label>
        <label class="mt-3 block space-y-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Pump coefficient k (s²/m⁵)</span>
          <input v-model.number="pumpK" type="range" min="50" max="25000" step="50" class="w-full">
          <div class="text-xs text-gray-500 dark:text-gray-400">{{ pumpK }} · steeper k → head drops faster with Q</div>
        </label>
        <div class="mt-3 rounded-md bg-gray-50 px-3 py-2 text-sm dark:bg-gray-950/60">
          <div class="text-gray-600 dark:text-gray-400">Pump head at current Q</div>
          <div class="font-semibold tabular-nums text-gray-900 dark:text-gray-100">
            {{ pumpHeadAtQM.toFixed(2) }} m
          </div>
        </div>
        <UButton class="mt-3" color="primary" @click="applyPumpOperatingPoint">
          Set Q to operating point
        </UButton>
        <p v-if="pumpHint" class="mt-2 text-xs text-gray-600 dark:text-gray-400">{{ pumpHint }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pipe-flow-drift {
  animation: pipe-flow-drift linear infinite;
  animation-duration: var(--pipe-flow-dur, 4s);
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .pipe-flow-drift {
    animation: none !important;
  }
}

@keyframes pipe-flow-drift {
  from {
    transform: translateX(0);
  }

  to {
    /* Positive X: pattern drifts right, matching arrowheads (left → right along the pipe). */
    transform: translateX(calc(1px * var(--pipe-flow-tile, 72)));
  }
}
</style>
