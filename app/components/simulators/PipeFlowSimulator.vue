<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  darcyFrictionFactor,
  fluidProperties,
  fluidTemperatureRange,
  headLossDarcyWeisbach,
  pipeCrossSectionArea,
  pressureDropFromHead,
  reynoldsNumber,
  type FluidId
} from '~~/utils/fluidMechanics'

const fluid = ref<FluidId>('water')
const tempC = ref(40)

const diameterM = ref(0.12)
const lengthM = ref(80)
const roughnessMm = ref(0.045)

/** Drive by volume flow (L/s) or mean velocity (m/s). */
const driveBy = ref<'Q' | 'v'>('Q')
const flowLs = ref(25)
const velocityMs = ref(2.2)

const tRange = computed(() => fluidTemperatureRange(fluid.value))

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n))
}

watch(fluid, () => {
  tempC.value = fluid.value === 'water' ? 40 : 400
})

watch(
  () => [tRange.value.min, tRange.value.max] as const,
  ([min, max]) => {
    tempC.value = clamp(tempC.value, min, max)
  }
)

const rho = computed(() => fluidProperties(fluid.value, tempC.value).rho)
const mu = computed(() => fluidProperties(fluid.value, tempC.value).mu)

const roughnessM = computed(() => roughnessMm.value / 1000)

const area = computed(() => pipeCrossSectionArea(diameterM.value))

const Qm3s = computed(() => {
  if (driveBy.value === 'Q') return flowLs.value / 1000
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

const headLossM = computed(() =>
  headLossDarcyWeisbach(
    friction.value.f,
    lengthM.value,
    diameterM.value,
    velocity.value
  )
)

const deltaPa = computed(() => pressureDropFromHead(rho.value, headLossM.value))

const regimeClass = computed(() => {
  const r = friction.value.regime
  if (r === 'laminar') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
  if (r === 'transitional') return 'bg-amber-100 text-amber-900 dark:bg-amber-900/35 dark:text-amber-100'
  return 'bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-100'
})

const arrowCount = computed(() => {
  const v = Math.abs(velocity.value)
  return clamp(Math.round(3 + v * 4), 3, 14)
})

const arrowSpacing = computed(() => 360 / Math.max(arrowCount.value, 1))
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
        </defs>
        <rect x="8" y="28" width="424" height="52" rx="10" fill="url(#pipeMetal)" stroke="currentColor" stroke-opacity="0.35" />
        <rect x="22" y="40" width="396" height="28" rx="6" class="fill-sky-400/25 dark:fill-sky-400/20" />
        <g class="text-sky-600 dark:text-sky-300" opacity="0.9">
          <path
            v-for="i in arrowCount"
            :key="i"
            :transform="`translate(${18 + (i - 1) * arrowSpacing}, 54)`"
            d="M-6 0 L6 0 M2 -4 L6 0 L2 4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round" />
        </g>
        <text x="220" y="18" text-anchor="middle" class="fill-gray-600 text-[11px] dark:fill-gray-400">
          Length L = {{ lengthM.toFixed(0) }} m · D = {{ (diameterM * 1000).toFixed(0) }} mm
        </text>
        <text x="220" y="100" text-anchor="middle" class="fill-gray-600 text-[11px] dark:fill-gray-400">
          Mean speed ≈ {{ velocity.toFixed(2) }} m/s
        </text>
      </svg>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <label class="space-y-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Fluid</span>
        <select
          v-model="fluid"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
          <option value="water">Water (liquid)</option>
          <option value="sodium">Molten sodium (liquid)</option>
        </select>
      </label>

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
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Inner diameter D (m)</span>
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
          v-model.number="flowLs"
          type="range"
          min="0.5"
          max="800"
          step="0.5"
          class="w-full">
        <div class="text-xs text-gray-500 dark:text-gray-400">
          {{ flowLs.toFixed(1) }} L/s ({{ Qm3s.toFixed(4) }} m³/s)
        </div>
      </label>
      <label v-else class="space-y-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Mean velocity v (m/s)</span>
        <input
          v-model.number="velocityMs"
          type="range"
          min="0.05"
          max="12"
          step="0.05"
          class="w-full">
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ velocityMs.toFixed(2) }} m/s</div>
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
      </div>
      <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Darcy f</div>
        <div class="mt-1 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {{ friction.f.toFixed(4) }}
        </div>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Head loss hf</div>
        <div class="mt-1 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {{ headLossM.toFixed(2) }} m
        </div>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white p-4 sm:col-span-2 lg:col-span-2 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Pressure drop Δp</div>
        <div class="mt-1 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {{ (deltaPa / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 }) }} kPa
        </div>
        <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Darcy–Weisbach with Swamee–Jain f (turbulent) and 64/Re (laminar), blended in transition.
        </div>
      </div>
    </div>
  </div>
</template>
