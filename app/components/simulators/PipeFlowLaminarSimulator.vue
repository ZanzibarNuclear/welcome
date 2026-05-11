<script setup lang="ts">
import { computed, ref } from "vue";
import {
  fluidProperties,
  pipeCrossSectionArea,
  pressureDropHagenPoiseuille,
  reynoldsNumber,
  REYNOLDS_LAMINAR_UPPER,
  volumeFlowForReynolds,
} from "~~/utils/fluidMechanics";

/**
 * Select options only—order-of-magnitude labels (not as-built routing).
 * 5–80 m in 5 m steps.
 */
const PIPE_LENGTH_OPTIONS: { m: number; note: string }[] = [
  {
    m: 5,
    note: "Short rack straight: a few supports; tie-in between nearby valves",
  },
  {
    m: 10,
    note: "One wide structural bay; short run inside a turbine or auxiliary hall",
  },
  {
    m: 20,
    note: "Typical run between two major skids (e.g. pump to nearby heat exchanger)",
  },
  {
    m: 30,
    note: "Long in-building header; several pipe-rack modules end-to-end",
  },
  {
    m: 40,
    note: "Multi-turn routing in one large building before heading outdoors",
  },
  {
    m: 50,
    note: "Long tunnel / trench straight; half a football-field scale on the ground",
  },
  {
    m: 60,
    note: "Extended yard routing on one rack before a major elevation or turn",
  },
  {
    m: 70,
    note: "Large outdoor pipe-bridge or rack section across part of a site",
  },
  {
    m: 80,
    note: "Upper end of this lab—very long buried or yard run",
  },
];

/** Always show Δp in Pa with enough digits that small changes stay visible. */
function formatPressureDropPa(pa: number): string {
  if (!Number.isFinite(pa)) return "—";
  const a = Math.abs(pa);
  if (a >= 1000)
    return `${Math.round(pa).toLocaleString(undefined, { maximumFractionDigits: 0 })} Pa`;
  if (a >= 100)
    return `${pa.toLocaleString(undefined, { maximumFractionDigits: 1 })} Pa`;
  if (a >= 10)
    return `${pa.toLocaleString(undefined, { maximumFractionDigits: 2 })} Pa`;
  if (a >= 1)
    return `${pa.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 })} Pa`;
  if (a >= 0.01)
    return `${pa.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} Pa`;
  return `${pa.toLocaleString(undefined, { maximumFractionDigits: 6 })} Pa`;
}

/** Fixed teaching values: liquid water at 40 °C (site ρ, μ tables). */
const WATER_TEMP_C = 40;

/**
 * Nominal inner diameters for teaching (real plants use schedule / drawing values).
 * Ordered small → large: instrumentation, SG tubes, process, steam/feed, primary loop, CW.
 */
const DIAMETER_PRESETS = [
  { id: "sg-tube", mm: 15, label: "Steam generator heat-exchanger tube" },
  { id: "service", mm: 40, label: "Small process branch / drain line" },
  { id: "aux-steam", mm: 100, label: "Chemical feed header" },
  { id: "feedwater", mm: 250, label: "Main feedwater" },
  { id: "main-steam", mm: 400, label: "Main steam header" },
  { id: "primary-loop", mm: 700, label: "Primary loop hot / cold leg" },
  { id: "cw", mm: 1200, label: "Condenser circulating water" },
] as const;

type DiameterPresetId = (typeof DIAMETER_PRESETS)[number]["id"];

const diameterPresetId = ref<DiameterPresetId>("feedwater");

const diameterM = computed(() => {
  const p = DIAMETER_PRESETS.find((x) => x.id === diameterPresetId.value);
  return (p?.mm ?? 250) / 1000;
});

const lengthM = ref(20);

const Q_SLIDER_STEPS = 1000;
/** 0 … this fraction of the bar: Q from 0 up to laminar-cap flow; remainder: up to `RE_SLIDER_EXTEND`. */
const Q_SLIDER_LAMINAR_FRACTION = 0.75;
/** Top of the last slider segment: transitional / early turbulent onset (formula still shown, with warning). */
const RE_SLIDER_EXTEND = 4000;

const flowSlider = ref(450);

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

const rho = computed(() => fluidProperties("water", WATER_TEMP_C).rho);
const mu = computed(() => fluidProperties("water", WATER_TEMP_C).mu);
const area = computed(() => pipeCrossSectionArea(diameterM.value));

/** Q (L/s) at Re = REYNOLDS_LAMINAR_UPPER for current water properties and D. */
const qAtLaminarCapLs = computed(
  () =>
    volumeFlowForReynolds(
      REYNOLDS_LAMINAR_UPPER,
      rho.value,
      diameterM.value,
      mu.value,
    ) * 1000,
);

const qAtExtendLs = computed(
  () =>
    volumeFlowForReynolds(
      RE_SLIDER_EXTEND,
      rho.value,
      diameterM.value,
      mu.value,
    ) * 1000,
);

const flowLs = computed(() => {
  const s = clamp(flowSlider.value / Q_SLIDER_STEPS, 0, 1);
  const qLam = qAtLaminarCapLs.value;
  const qHi = qAtExtendLs.value;
  if (s <= Q_SLIDER_LAMINAR_FRACTION) {
    return (s / Q_SLIDER_LAMINAR_FRACTION) * qLam;
  }
  const t = (s - Q_SLIDER_LAMINAR_FRACTION) / (1 - Q_SLIDER_LAMINAR_FRACTION);
  return qLam + t * (qHi - qLam);
});

const Qm3s = computed(() => flowLs.value / 1000);

const velocity = computed(() => Qm3s.value / Math.max(area.value, 1e-12));

const Re = computed(() =>
  reynoldsNumber(rho.value, velocity.value, diameterM.value, mu.value),
);

const deltaPa = computed(() =>
  pressureDropHagenPoiseuille(
    Qm3s.value,
    mu.value,
    lengthM.value,
    diameterM.value,
  ),
);
</script>

<template>
  <div class="space-y-6">
    <figure
      class="rounded-xl border border-gray-200 bg-linear-to-b from-sky-50/80 to-white p-4 dark:border-gray-800 dark:from-sky-950/40 dark:to-gray-950">
      <svg
        viewBox="0 0 220 100"
        class="mx-auto block h-auto w-full max-w-md text-gray-800 dark:text-gray-100"
        role="img"
        aria-label="End view of a round pipe. The circle is the pipe wall. The dashed line is the diameter. The blue curve shows the relative speed of fluid: 0 m/s at the pipe wall, fastest at the center.">
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
        <text
          x="58"
          y="68"
          text-anchor="middle"
          class="fill-gray-600 text-[8px] dark:fill-gray-400">
          wall
        </text>
        <text
          x="162"
          y="68"
          text-anchor="middle"
          class="fill-gray-600 text-[8px] dark:fill-gray-400">
          wall
        </text>
      </svg>
      <figcaption
        class="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        <p class="font-medium text-gray-800 dark:text-gray-200">
          End view of a round pipe.
        </p>
        The circle is the pipe wall. The dashed line is the diameter. The blue
        curve shows the relative speed of fluid: 0 m/s at the pipe wall, fastest
        at the center. Smooth flow is called laminar flow.
      </figcaption>
    </figure>

    <div class="grid gap-4 md:grid-cols-2">
      <label class="space-y-2 md:col-span-2 mt-4">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
          >Pipe inner diameter</span
        >
        <select
          v-model="diameterPresetId"
          class="w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
          <option v-for="p in DIAMETER_PRESETS" :key="p.id" :value="p.id">
            {{ p.mm }} mm — {{ p.label }}
          </option>
        </select>
        <div class="text-[11px] leading-snug text-gray-500 dark:text-gray-400">
          Choose among typical water pipe sizes.
        </div>
      </label>

      <label class="space-y-2 md:col-span-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
          >Pipe length L</span
        >
        <select
          v-model.number="lengthM"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
          <option
            v-for="row in PIPE_LENGTH_OPTIONS"
            :key="row.m"
            :value="row.m">
            {{ row.m }} m — {{ row.note }}
          </option>
        </select>
      </label>

      <label class="space-y-2 md:col-span-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
          >Volume flow Q (L/s)</span
        >
        <div class="flex flex-col gap-0">
          <div class="relative">
            <input
              v-model.number="flowSlider"
              type="range"
              min="0"
              :max="Q_SLIDER_STEPS"
              step="1"
              class="relative z-0 w-full" >
            <div
              class="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-10 -translate-y-1/2"
              aria-hidden="true">
              <div
                class="absolute bottom-1 top-1 w-0.5 -translate-x-1/2 bg-orange-500 dark:bg-orange-400"
                :style="{ left: `${Q_SLIDER_LAMINAR_FRACTION * 100}%` }" />
            </div>
          </div>
          <div class="relative -mt-3.5 flex min-h-5 items-center">
            <p class="text-sm tabular-nums text-gray-700 dark:text-gray-300">
              {{ flowLs < 0.1 ? flowLs.toFixed(3) : flowLs.toFixed(2) }} L/s
            </p>
            <span
              class="pointer-events-none absolute top-1/3 -translate-y-1/2 text-xs font-medium whitespace-nowrap text-orange-600 dark:text-orange-400"
              :style="{
                left: `calc(${Q_SLIDER_LAMINAR_FRACTION * 100}% + 6px)`,
              }"
              >turbulence zone</span
            >
          </div>
        </div>
      </label>
    </div>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
      <div
        class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div
          class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Reynolds Number
        </div>
        <div
          class="mt-2 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {{ Re.toLocaleString(undefined, { maximumFractionDigits: 0 }) }}
        </div>
      </div>
      <div
        class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div
          class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Pressure drop (Δp)
        </div>
        <div
          class="mt-2 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {{ formatPressureDropPa(deltaPa) }}
        </div>
      </div>
    </div>
  </div>
</template>
