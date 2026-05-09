<script setup lang="ts">
import { computed, ref } from 'vue'
import { GRAVITY_MS2, hydraulicPowerWatts } from '~~/utils/fluidMechanics'

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n))
}

/** Coolant density presets (kg/m³) for quick comparison; default liquid water ~20 °C. */
const rho = ref(998.2)

const grossHeadM = ref(85)
const headLossM = ref(6)
const flowM3s = ref(45)
const overallEta = ref(0.88)

const netHeadM = computed(() => Math.max(grossHeadM.value - headLossM.value, 0))

const powerHydraulicW = computed(() =>
  hydraulicPowerWatts(rho.value, flowM3s.value, netHeadM.value)
)

const powerShaftW = computed(() => powerHydraulicW.value * overallEta.value)

const powerHydraulicMw = computed(() => powerHydraulicW.value / 1e6)
const powerShaftMw = computed(() => powerShaftW.value / 1e6)

/** Steady output: MWh per day ≈ P_MW × 24 h (P in watts). */
const energyMwhPerDay = computed(() => (powerShaftW.value * 24) / 1e6)

const headLossFraction = computed(() => {
  if (grossHeadM.value <= 0) return 0
  return headLossM.value / grossHeadM.value
})

const svgDamX = 72
const svgWaterTop = 22

/** Penstock dash animation: higher Q → faster (schematic only). */
const hydroPenstockAnimSec = computed(() => {
  const Q = Math.max(flowM3s.value, 0.25)
  return clamp(55 / Q, 0.35, 14)
})

/** Subtle pulse on the powerhouse when exporting power. */
const hydroGenPulseSec = computed(() =>
  clamp(2.8 / Math.max(powerShaftMw.value, 0.05), 0.45, 5)
)
</script>

<template>
  <div class="space-y-6">
    <div
      class="rounded-xl border border-gray-200 bg-linear-to-b from-sky-50/90 to-white p-4 dark:border-gray-800 dark:from-sky-950/35 dark:to-gray-950">
      <svg
        viewBox="0 0 420 200"
        class="h-auto w-full max-w-lg mx-auto text-gray-800 dark:text-gray-100"
        role="img"
        aria-label="Schematic dam, reservoir, penstock, and powerhouse">
        <defs>
          <linearGradient id="damFace" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="currentColor" stop-opacity="0.2" />
            <stop offset="100%" stop-color="currentColor" stop-opacity="0.38" />
          </linearGradient>
          <linearGradient id="waterFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.55" />
            <stop offset="100%" stop-color="#0284c7" stop-opacity="0.35" />
          </linearGradient>
        </defs>

        <path
          :d="`M ${svgDamX - 40} ${svgWaterTop - 8} H 200 V 170 H ${svgDamX - 40} Z`"
          fill="url(#waterFill)"
          stroke="currentColor"
          stroke-opacity="0.25"
          class="hydro-reservoir-shimmer" />

        <path
          :d="`M ${svgDamX} 40 L ${svgDamX + 58} 40 L ${svgDamX + 42} 175 L ${svgDamX - 18} 175 Z`"
          fill="url(#damFace)"
          stroke="currentColor"
          stroke-opacity="0.45" />

        <rect
          x="255"
          y="118"
          width="120"
          height="38"
          rx="6"
          class="hydro-generator-pulse fill-gray-200/90 dark:fill-gray-800/90"
          stroke="currentColor"
          stroke-opacity="0.35"
          :style="{ '--hydro-gen-dur': `${hydroGenPulseSec}s` }" />
        <text x="315" y="141" text-anchor="middle" class="fill-gray-700 text-[11px] dark:fill-gray-200">
          Generator / grid
        </text>

        <path
          d="M 132 52 L 248 118"
          fill="none"
          stroke="currentColor"
          stroke-width="5"
          stroke-opacity="0.35"
          stroke-linecap="round" />
        <path
          d="M 132 52 L 248 118"
          fill="none"
          class="hydro-penstock-flow stroke-sky-500/70 dark:stroke-sky-400/70"
          stroke-width="2.5"
          stroke-dasharray="10 8"
          stroke-linecap="round"
          :style="{ '--hydro-penstock-dur': `${hydroPenstockAnimSec}s` }" />

        <text x="175" y="98" class="fill-gray-600 text-[10px] dark:fill-gray-400">Penstock</text>
        <text x="24" y="24" class="fill-gray-600 text-[11px] dark:fill-gray-400">Reservoir</text>
        <text :x="svgDamX + 8" y="34" class="fill-gray-700 text-[11px] font-medium dark:fill-gray-200">Dam</text>

        <line
          x1="12"
          :y1="svgWaterTop"
          x2="200"
          :y2="svgWaterTop"
          stroke="currentColor"
          stroke-opacity="0.4"
          stroke-dasharray="4 4" />
        <line
          x1="12"
          :y1="svgWaterTop + grossHeadM * 0.35"
          x2="200"
          :y2="svgWaterTop + grossHeadM * 0.35"
          stroke="currentColor"
          stroke-opacity="0.25"
          stroke-dasharray="2 6" />
        <text x="205" :y="svgWaterTop + 8" class="fill-gray-600 text-[10px] dark:fill-gray-400">
          Gross head ≈ {{ grossHeadM }} m
        </text>
        <text x="205" :y="svgWaterTop + grossHeadM * 0.35 + 12" class="fill-gray-600 text-[10px] dark:fill-gray-400">
          After losses · net ≈ {{ netHeadM.toFixed(1) }} m
        </text>
      </svg>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <label class="space-y-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Fluid density ρ (kg/m³)</span>
        <input
          v-model.number="rho"
          type="range"
          min="800"
          max="1050"
          step="1"
          class="w-full">
        <div class="text-xs text-gray-500 dark:text-gray-400">
          {{ rho.toFixed(1) }} kg/m³ — use ~1000 for water, lower for warmer or other coolants.
        </div>
      </label>

      <label class="space-y-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Overall efficiency η (turbine × generator)</span>
        <input
          v-model.number="overallEta"
          type="range"
          min="0.5"
          max="0.95"
          step="0.01"
          class="w-full">
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ (overallEta * 100).toFixed(0) }} %</div>
      </label>

      <label class="space-y-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Gross head H_gross (m)</span>
        <input
          v-model.number="grossHeadM"
          type="range"
          min="5"
          max="280"
          step="1"
          class="w-full">
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ grossHeadM }} m</div>
      </label>

      <label class="space-y-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Total head loss ΣhL (m)</span>
        <input
          v-model.number="headLossM"
          type="range"
          min="0"
          max="60"
          step="0.5"
          class="w-full">
        <div class="text-xs text-gray-500 dark:text-gray-400">
          {{ headLossM }} m ({{ (headLossFraction * 100).toFixed(1) }} % of gross)
        </div>
      </label>

      <label class="space-y-2 md:col-span-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Volume flow Q through turbines (m³/s)</span>
        <input
          v-model.number="flowM3s"
          type="range"
          min="0.5"
          max="1200"
          step="0.5"
          class="w-full">
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ flowM3s.toFixed(1) }} m³/s</div>
      </label>
    </div>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Net head</div>
        <div class="mt-1 text-xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {{ netHeadM.toFixed(2) }} m
        </div>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Hydraulic power</div>
        <div class="mt-1 text-xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {{ powerHydraulicMw.toFixed(2) }} MW
        </div>
        <div class="mt-1 text-[11px] text-gray-500 dark:text-gray-400">P = ρ g Q H_net</div>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Shaft / electric (η)</div>
        <div class="mt-1 text-xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {{ powerShaftMw.toFixed(2) }} MW
        </div>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Daily output</div>
        <div class="mt-1 text-xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {{ energyMwhPerDay.toFixed(1) }} MWh/d
        </div>
        <div class="mt-1 text-[11px] text-gray-500 dark:text-gray-400">At constant η and Q</div>
      </div>
    </div>

    <p class="text-xs text-gray-500 dark:text-gray-400">
      g = {{ GRAVITY_MS2 }} m/s². This is a 1D energy accounting model: combine penstock friction, valve, and draft-tube losses into ΣhL.
      Real plants have turbine hill charts and time-varying head; Phase 2+ can link penstock loss to the pipe simulator.
      Schematic motion hints at flow and output, not a hydraulic time-domain solve.
    </p>
  </div>
</template>

<style scoped>
/* 10 + 8 = 18 dash cycle length — seamless loop */
@keyframes hydro-penstock-dash {
  to {
    stroke-dashoffset: -18;
  }
}

.hydro-penstock-flow {
  animation: hydro-penstock-dash linear infinite;
  animation-duration: var(--hydro-penstock-dur, 2s);
}

@keyframes hydro-reservoir-shimmer {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.92;
  }
}

.hydro-reservoir-shimmer {
  animation: hydro-reservoir-shimmer 5s ease-in-out infinite;
  transform-origin: center;
}

@keyframes hydro-generator-pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.72;
  }
}

.hydro-generator-pulse {
  animation: hydro-generator-pulse ease-in-out infinite;
  animation-duration: var(--hydro-gen-dur, 2s);
}

@media (prefers-reduced-motion: reduce) {
  .hydro-penstock-flow,
  .hydro-reservoir-shimmer,
  .hydro-generator-pulse {
    animation: none !important;
  }
}
</style>
