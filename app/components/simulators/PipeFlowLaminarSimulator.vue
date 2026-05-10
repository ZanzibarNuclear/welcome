<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  fluidProperties,
  pipeCrossSectionArea,
  pressureDropHagenPoiseuille,
  reynoldsNumber,
  REYNOLDS_LAMINAR_UPPER,
  volumeFlowForReynolds
} from '~~/utils/fluidMechanics'

/** Fixed teaching values: liquid water at 40 °C (site ρ, μ tables). */
const WATER_TEMP_C = 40

/**
 * Nominal inner diameters for teaching (real plants use schedule / drawing values).
 * Ordered small → large: instrumentation, SG tubes, process, steam/feed, primary loop, CW.
 */
const DIAMETER_PRESETS = [
  { id: 'instrument', mm: 12, label: 'Sampling / instrument line' },
  { id: 'sg-tube', mm: 15, label: 'Steam generator heat-exchanger tube (typ. ID scale)' },
  { id: 'service', mm: 40, label: 'Small process branch / drain line' },
  { id: 'aux-steam', mm: 100, label: 'Auxiliary steam or chemical-feed header' },
  { id: 'feedwater', mm: 250, label: 'Main feedwater (compact unit scale)' },
  { id: 'main-steam', mm: 400, label: 'Main steam header (secondary side, size varies)' },
  { id: 'primary-loop', mm: 700, label: 'Primary loop hot / cold leg (PWR scale model)' },
  { id: 'cw', mm: 1200, label: 'Condenser circulating-water / large CW riser' }
] as const

type DiameterPresetId = (typeof DIAMETER_PRESETS)[number]['id']

const diameterPresetId = ref<DiameterPresetId>('sg-tube')

const diameterM = computed(() => {
  const p = DIAMETER_PRESETS.find((x) => x.id === diameterPresetId.value)
  return (p?.mm ?? 15) / 1000
})

const lengthM = ref(20)

const Q_SLIDER_STEPS = 1000
/** 0 … this fraction of the bar: Q from 0 up to laminar-cap flow; remainder: up to `RE_SLIDER_EXTEND`. */
const Q_SLIDER_LAMINAR_FRACTION = 0.9
/** Top of the last slider segment: transitional / early turbulent onset (formula still shown, with warning). */
const RE_SLIDER_EXTEND = 4000

const flowSlider = ref(450)

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n))
}

const rho = computed(() => fluidProperties('water', WATER_TEMP_C).rho)
const mu = computed(() => fluidProperties('water', WATER_TEMP_C).mu)
const area = computed(() => pipeCrossSectionArea(diameterM.value))

/** Q (L/s) at Re = REYNOLDS_LAMINAR_UPPER for current water properties and D. */
const qAtLaminarCapLs = computed(
  () => volumeFlowForReynolds(REYNOLDS_LAMINAR_UPPER, rho.value, diameterM.value, mu.value) * 1000
)

const qAtExtendLs = computed(
  () => volumeFlowForReynolds(RE_SLIDER_EXTEND, rho.value, diameterM.value, mu.value) * 1000
)

const flowLs = computed(() => {
  const s = clamp(flowSlider.value / Q_SLIDER_STEPS, 0, 1)
  const qLam = qAtLaminarCapLs.value
  const qHi = qAtExtendLs.value
  if (s <= Q_SLIDER_LAMINAR_FRACTION) {
    return (s / Q_SLIDER_LAMINAR_FRACTION) * qLam
  }
  const t = (s - Q_SLIDER_LAMINAR_FRACTION) / (1 - Q_SLIDER_LAMINAR_FRACTION)
  return qLam + t * (qHi - qLam)
})

const Qm3s = computed(() => flowLs.value / 1000)

const velocity = computed(() => Qm3s.value / Math.max(area.value, 1e-12))

const Re = computed(() => reynoldsNumber(rho.value, velocity.value, diameterM.value, mu.value))

const deltaPa = computed(() =>
  pressureDropHagenPoiseuille(Qm3s.value, mu.value, lengthM.value, diameterM.value)
)

const laminarAssumptionOk = computed(() => Re.value <= REYNOLDS_LAMINAR_UPPER)

</script>

<template>
  <div class="space-y-6">
    <figure
      class="rounded-xl border border-gray-200 bg-linear-to-b from-sky-50/80 to-white p-4 dark:border-gray-800 dark:from-sky-950/40 dark:to-gray-950">
      <svg
        viewBox="0 0 220 100"
        class="mx-auto block h-auto w-full max-w-md text-gray-800 dark:text-gray-100"
        role="img"
        aria-label="End view of a round pipe: circle is the bore, dashed line is a diameter, blue curve is laminar speed u(r) from zero at the walls to maximum on the axis">
        <circle
          cx="110"
          cy="52"
          r="44"
          fill="currentColor"
          fill-opacity="0.04"
          stroke="currentColor"
          stroke-opacity="0.4"
          stroke-width="1.5" />
        <line
          x1="66"
          y1="52"
          x2="154"
          y2="52"
          stroke="currentColor"
          stroke-opacity="0.35"
          stroke-dasharray="5 4"
          stroke-width="1" />
        <path
          d="M 66 52 Q 110 6 154 52"
          fill="none"
          stroke="currentColor"
          class="text-sky-600 dark:text-sky-400"
          stroke-width="2.2"
          stroke-linecap="round" />
        <text x="58" y="68" text-anchor="middle" class="fill-gray-600 text-[8px] dark:fill-gray-400">wall</text>
        <text x="162" y="68" text-anchor="middle" class="fill-gray-600 text-[8px] dark:fill-gray-400">wall</text>
      </svg>
      <figcaption class="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        <span class="font-medium text-gray-800 dark:text-gray-200">End view</span>
        (look along the pipe): the circle is the bore; the dashed line is a diameter. The blue curve sketches laminar
        speed <em>u</em>(<em>r</em>) — zero at the walls, largest on the centerline, with
        <em>u</em> ∝ 1 − (<em>r</em>/<em>R</em>)² (Hagen–Poiseuille). Assumes fully developed flow in a smooth straight
        pipe with no fittings.
      </figcaption>
    </figure>

    <p class="text-sm text-gray-600 dark:text-gray-400">
      Liquid water at {{ WATER_TEMP_C }} °C — ρ = {{ rho.toFixed(1) }} kg/m³, μ = {{ (mu * 1000).toFixed(3) }} mPa·s
      (from the site property tables).
    </p>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="space-y-2 md:col-span-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Typical inner diameter D</span>
        <div class="flex flex-col gap-2" role="radiogroup" aria-label="Pipe inner diameter preset">
          <label
            v-for="p in DIAMETER_PRESETS"
            :key="p.id"
            class="flex cursor-pointer items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              v-model="diameterPresetId"
              type="radio"
              :value="p.id"
              class="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-400">
            <span>
              <span class="font-medium tabular-nums">{{ p.mm }} mm</span>
              <span class="text-gray-600 dark:text-gray-400"> — {{ p.label }}</span>
            </span>
          </label>
        </div>
        <p class="text-[11px] leading-snug text-gray-500 dark:text-gray-400">
          Nominal sizes for context only—real systems use piping schedules and vendor drawings.
        </p>
      </div>

      <label class="space-y-2 md:col-span-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Pipe length L (m)</span>
        <input
          v-model.number="lengthM"
          type="range"
          min="0.5"
          max="80"
          step="0.5"
          class="w-full">
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ lengthM }} m</div>
      </label>

      <label class="space-y-2 md:col-span-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Volume flow Q (L/s)</span>
        <input
          v-model.number="flowSlider"
          type="range"
          min="0"
          :max="Q_SLIDER_STEPS"
          step="1"
          class="w-full">
        <div class="text-xs text-gray-500 dark:text-gray-400">
          {{ flowLs < 0.1 ? flowLs.toFixed(3) : flowLs.toFixed(2) }} L/s ({{ Qm3s.toExponential(2) }} m³/s) · Re ≈
          {{ Re.toLocaleString(undefined, { maximumFractionDigits: 0 }) }}
        </div>
        <p class="text-[11px] leading-snug text-gray-500 dark:text-gray-400">
          First {{ (Q_SLIDER_LAMINAR_FRACTION * 100).toFixed(0) }}% of the bar: Q from 0 to the value that gives Re ≈
          {{ REYNOLDS_LAMINAR_UPPER }} (Hagen–Poiseuille range). Last {{ ((1 - Q_SLIDER_LAMINAR_FRACTION) * 100).toFixed(0) }}%:
          up to Re ≈ {{ RE_SLIDER_EXTEND }} (transition — same formula is shown but read the warning).
        </p>
      </label>
    </div>

    <div
      v-if="!laminarAssumptionOk"
      class="rounded-lg border border-amber-300 bg-amber-50/90 px-4 py-3 text-sm text-amber-950 dark:border-amber-700 dark:bg-amber-950/35 dark:text-amber-100">
      Re ≈ {{ Re.toFixed(0) }} is above the usual laminar limit (~{{ REYNOLDS_LAMINAR_UPPER }}). Hagen–Poiseuille
      under-predicts losses; use the
      <NuxtLink to="/simulators/pipe-flow" class="font-medium underline underline-offset-2">Pipe Flow Lab</NuxtLink>
      for friction-factor-based pipe loss.
    </div>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Reynolds</div>
        <div class="mt-1 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {{ Re.toLocaleString(undefined, { maximumFractionDigits: 0 }) }}
        </div>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Mean velocity v</div>
        <div class="mt-1 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {{ velocity < 0.1 ? velocity.toFixed(3) : velocity.toFixed(2) }} m/s
        </div>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Δp (Hagen–Poiseuille)</div>
        <div class="mt-1 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {{ (deltaPa / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 }) }} kPa
        </div>
        <p class="mt-2 text-[11px] leading-snug text-gray-500 dark:text-gray-400">
          Δp = 128 μ L Q / (π D⁴). Strongest dependence is on D (fourth power).
        </p>
      </div>
    </div>

    <p class="text-xs text-gray-500 dark:text-gray-400">
      Next in this series:
      <NuxtLink to="/simulators/pipe-flow" class="font-medium text-primary-600 underline-offset-2 hover:underline dark:text-primary-400">
        Pipe Flow Lab
      </NuxtLink>
      (roughness, transition / turbulence, minor losses, Moody chart).
    </p>
  </div>
</template>
